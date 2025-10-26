import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const classRequestSchema = z.object({
  studentId: z.string(),
  modality: z.enum(["YOGA", "MEDITATION", "PILATES", "FITNESS", "DANCE", "OTHER"]),
  preferredDate: z.coerce.date().optional(),
  preferredTime: z.string().optional(),
  duration: z.number().min(30).max(240),
  maxPrice: z.number().positive().optional(),
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

    if (session.user.role !== "STUDENT") {
      return NextResponse.json({ error: "Apenas alunos podem criar solicitações" }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = classRequestSchema.parse(body)

    // Verificar se o aluno é o usuário atual
    if (validatedData.studentId !== session.user.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 })
    }

    // Criar a class request
    const classRequest = await prisma.classRequest.create({
      data: validatedData,
    })

    return NextResponse.json({ 
      classRequest,
      message: "Solicitação criada com sucesso"
    })

  } catch (error) {
    console.error("Erro ao criar class request:", error)
    
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
    const studentId = searchParams.get("studentId")
    const modality = searchParams.get("modality")
    const onlyActive = searchParams.get("onlyActive")

    let whereClause: any = {}

    // Alunos só veem suas próprias solicitações
    if (session.user.role === "STUDENT") {
      whereClause.studentId = session.user.id
    }
    
    // Professores podem ver todas as solicitações
    if (studentId) whereClause.studentId = studentId
    if (modality) whereClause.modality = modality
    if (onlyActive === "true") whereClause.isActive = true

    const classRequests = await prisma.classRequest.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            name: true,
            image: true,
            phone: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(classRequests)

  } catch (error) {
    console.error("Erro ao buscar class requests:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const body = await request.json()

    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 })
    }

    // Verificar se a class request pertence ao usuário
    const classRequest = await prisma.classRequest.findUnique({
      where: { id },
    })

    if (!classRequest) {
      return NextResponse.json({ error: "Solicitação não encontrada" }, { status: 404 })
    }

    if (classRequest.studentId !== session.user.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 })
    }

    const updatedRequest = await prisma.classRequest.update({
      where: { id },
      data: body,
    })

    return NextResponse.json({ 
      classRequest: updatedRequest,
      message: "Solicitação atualizada com sucesso"
    })

  } catch (error) {
    console.error("Erro ao atualizar class request:", error)
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

    // Verificar se a class request pertence ao usuário
    const classRequest = await prisma.classRequest.findUnique({
      where: { id },
    })

    if (!classRequest) {
      return NextResponse.json({ error: "Solicitação não encontrada" }, { status: 404 })
    }

    if (classRequest.studentId !== session.user.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 })
    }

    await prisma.classRequest.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Solicitação removida com sucesso" })

  } catch (error) {
    console.error("Erro ao deletar class request:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

