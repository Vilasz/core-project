import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { bookingId } = await request.json()

    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID é obrigatório" }, { status: 400 })
    }

    // Buscar o booking
    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
      include: {
        student: true,
        teacher: {
          include: {
            teacherProfile: true,
          },
        },
      },
    })

    if (!booking) {
      return NextResponse.json({ error: "Agendamento não encontrado" }, { status: 404 })
    }

    if (booking.studentId !== session.user.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 })
    }

    // Criar sessão de checkout do Stripe
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: `Aula com ${booking.teacher.name}`,
              description: `Aula de ${booking.duration} minutos em ${new Date(booking.date).toLocaleDateString("pt-BR")}`,
            },
            unit_amount: Math.round(booking.price * 100), // Stripe usa centavos
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/dashboard/aluno?success=true&booking_id=${booking.id}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/agendar/${booking.teacherId}?cancelled=true`,
      metadata: {
        bookingId: booking.id,
        studentId: booking.studentId,
        teacherId: booking.teacherId,
      },
    })

    // Atualizar booking com stripe session ID
    await prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        stripeSessionId: checkoutSession.id,
      },
    })

    return NextResponse.json({ 
      checkoutUrl: checkoutSession.url,
      sessionId: checkoutSession.id 
    })

  } catch (error) {
    console.error("Erro ao criar checkout session:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
