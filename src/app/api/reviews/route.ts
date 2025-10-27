import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const reviewSchema = z.object({
  bookingId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    if (session.user.role !== "STUDENT") {
      return NextResponse.json({ error: "Apenas alunos podem avaliar" }, { status: 403 })
    }

    const body = await request.json()
    const { bookingId, rating, comment } = reviewSchema.parse(body)

    // Verificar se o booking existe e pertence ao aluno
    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
      include: {
        reviews: true,
      },
    })

    if (!booking) {
      return NextResponse.json({ error: "Agendamento não encontrado" }, { status: 404 })
    }

    if (booking.studentId !== session.user.id) {
      return NextResponse.json({ error: "Você só pode avaliar suas próprias aulas" }, { status: 403 })
    }

    if (booking.status !== "COMPLETED") {
      return NextResponse.json({ error: "Só é possível avaliar aulas já concluídas" }, { status: 400 })
    }

    // Verificar se já existe uma avaliação para este booking
    const existingReview = await prisma.review.findUnique({
      where: {
        bookingId: bookingId,
      },
    })

    if (existingReview) {
      return NextResponse.json({ error: "Você já avaliou esta aula" }, { status: 400 })
    }

    // Criar a avaliação
    const review = await prisma.review.create({
      data: {
        bookingId: bookingId,
        studentId: session.user.id,
        teacherId: booking.teacherId,
        rating: rating,
        comment: comment,
      },
    })

    // Recalcular rating médio do professor
    const reviews = await prisma.review.findMany({
      where: {
        teacherId: booking.teacherId,
      },
    })

    const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    const totalReviews = reviews.length

    // Atualizar teacher profile
    await prisma.teacherProfile.update({
      where: {
        userId: booking.teacherId,
      },
      data: {
        rating: averageRating,
        totalReviews: totalReviews,
      },
    })

    return NextResponse.json({
      review,
      message: "Avaliação criada com sucesso"
    })

  } catch (error) {
    console.error("Erro ao criar review:", error)
    
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
    const { searchParams } = new URL(request.url)
    const teacherId = searchParams.get("teacherId")
    const bookingId = searchParams.get("bookingId")

    if (!teacherId && !bookingId) {
      return NextResponse.json({ error: "ID do professor ou booking é obrigatório" }, { status: 400 })
    }

    const whereClause: {
      teacherId?: string
      bookingId?: string
    } = {}
    if (teacherId) whereClause.teacherId = teacherId
    if (bookingId) whereClause.bookingId = bookingId

    const reviews = await prisma.review.findMany({
      where: whereClause,
      include: {
        student: {
          select: {
            name: true,
            image: true,
          },
        },
        booking: {
          select: {
            date: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(reviews)

  } catch (error) {
    console.error("Erro ao buscar reviews:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
