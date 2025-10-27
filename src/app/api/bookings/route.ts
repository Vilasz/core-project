import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const bookingSchema = z.object({
  teacherId: z.string(),
  studentId: z.string(),
  date: z.coerce.date(),
  duration: z.number().min(30).max(240), // 30min to 4h
  price: z.number().positive(),
  notes: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    if (session.user.role !== "STUDENT") {
      return NextResponse.json({ error: "Apenas alunos podem agendar aulas" }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = bookingSchema.parse(body)

    // Verificar se o professor existe e tem perfil
    const teacher = await prisma.user.findUnique({
      where: {
        id: validatedData.teacherId,
        role: "TEACHER",
      },
      include: {
        teacherProfile: true,
      },
    })

    if (!teacher || !teacher.teacherProfile) {
      return NextResponse.json({ error: "Professor não encontrado" }, { status: 404 })
    }

    // Verificar se há conflitos de horário
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        teacherId: validatedData.teacherId,
        date: {
          gte: new Date(validatedData.date.getTime() - 60 * 60 * 1000), // 1h antes
          lte: new Date(validatedData.date.getTime() + validatedData.duration * 60 * 1000 + 60 * 60 * 1000), // duração + 1h depois
        },
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
      },
    })

    if (conflictingBooking) {
      return NextResponse.json({ 
        error: "Já existe uma aula agendada neste horário" 
      }, { status: 400 })
    }

    // Criar o booking
    const booking = await prisma.booking.create({
      data: {
        studentId: validatedData.studentId,
        teacherId: validatedData.teacherId,
        date: validatedData.date,
        duration: validatedData.duration,
        price: validatedData.price,
        notes: validatedData.notes,
        status: "PENDING",
      },
    })

    // Criar checkout session do Stripe diretamente
    try {
      const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "brl",
              product_data: {
                name: `Aula com ${teacher.name}`,
                description: `Aula de ${validatedData.duration} minutos em ${validatedData.date.toLocaleDateString("pt-BR")}`,
              },
              unit_amount: Math.round(validatedData.price * 100), // Stripe usa centavos
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.NEXTAUTH_URL}/dashboard/aluno?success=true&booking_id=${booking.id}`,
        cancel_url: `${process.env.NEXTAUTH_URL}/agendar/${validatedData.teacherId}?cancelled=true`,
        metadata: {
          bookingId: booking.id,
          studentId: validatedData.studentId,
          teacherId: validatedData.teacherId,
        },
      })

      // Atualizar booking com stripe session ID
      await prisma.booking.update({
        where: { id: booking.id },
        data: { stripeSessionId: checkoutSession.id },
      })

      return NextResponse.json({ 
        booking,
        checkoutUrl: checkoutSession.url,
        message: "Agendamento criado com sucesso. Redirecionando para pagamento."
      })

    } catch (stripeError) {
      // Se falhou ao criar checkout, remover o booking
      await prisma.booking.delete({ where: { id: booking.id } })
      console.error("Stripe error:", stripeError)
      return NextResponse.json(
        { error: "Erro ao processar pagamento" },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error("Erro ao criar booking:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const teacherId = searchParams.get("teacherId")
    const studentId = searchParams.get("studentId")
    const status = searchParams.get("status")

    const whereClause: {
      teacherId?: string
      studentId?: string
      status?: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED"
    } = {}

    if (session.user.role === "TEACHER") {
      whereClause.teacherId = session.user.id
    } else if (session.user.role === "STUDENT") {
      whereClause.studentId = session.user.id
    }

    if (teacherId) whereClause.teacherId = teacherId
    if (studentId) whereClause.studentId = studentId
    if (status && ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].includes(status)) {
      whereClause.status = status as "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED"
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        student: {
          select: {
            name: true,
            image: true,
          },
        },
        teacher: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    })

    return NextResponse.json(bookings)

  } catch (error) {
    console.error("Erro ao buscar bookings:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
