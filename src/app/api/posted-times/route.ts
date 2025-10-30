import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

export const runtime = 'nodejs'

const postedTimeSchema = z.object({
  teacherId: z.string(),
  date: z.coerce.date(),
  startTime: z.string(),
  endTime: z.string(),
  modality: z.enum(["YOGA", "MEDITATION", "PILATES", "FITNESS", "DANCE", "OTHER"]),
  price: z.number().positive(),
  description: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    if (session.user.role !== "TEACHER") {
      return NextResponse.json({ error: "Apenas professores podem postar horários" }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = postedTimeSchema.parse(body)

    // Verificar se o professor é o usuário atual
    if (validatedData.teacherId !== session.user.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 })
    }

    // Criar o posted time
    const postedTime = await prisma.postedTime.create({
      data: validatedData,
    })

    return NextResponse.json({ 
      postedTime,
      message: "Horário postado com sucesso"
    })

  } catch (error) {
    console.error("Erro ao criar posted time:", error)
    
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
    const modality = searchParams.get("modality")
    const onlyAvailable = searchParams.get("onlyAvailable")

    const whereClause: {
      teacherId?: string
      modality?: "YOGA" | "MEDITATION" | "PILATES" | "FITNESS" | "DANCE" | "OTHER"
      isAvailable?: boolean
    } = {}

    // Professores só veem seus próprios posted times
    if (session.user.role === "TEACHER") {
      whereClause.teacherId = session.user.id
    }
    
    // Alunos podem ver todos os posted times
    if (teacherId) whereClause.teacherId = teacherId
    if (modality && ["YOGA", "MEDITATION", "PILATES", "FITNESS", "DANCE", "OTHER"].includes(modality)) {
      whereClause.modality = modality as "YOGA" | "MEDITATION" | "PILATES" | "FITNESS" | "DANCE" | "OTHER"
    }
    if (onlyAvailable === "true") whereClause.isAvailable = true

    const postedTimes = await prisma.postedTime.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            name: true,
            image: true,
            phone: true,
            email: true,
            teacherProfile: {
              select: {
                specialties: true,
                rating: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    })

    return NextResponse.json(postedTimes)

  } catch (error) {
    console.error("Erro ao buscar posted times:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 })
    }

    // Verificar se o posted time pertence ao usuário
    const postedTime = await prisma.postedTime.findUnique({
      where: { id },
    })

    if (!postedTime) {
      return NextResponse.json({ error: "Horário não encontrado" }, { status: 404 })
    }

    if (postedTime.teacherId !== session.user.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 })
    }

    await prisma.postedTime.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Horário removido com sucesso" })

  } catch (error) {
    console.error("Erro ao deletar posted time:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

