import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// WhatsApp API endpoint
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { phoneNumber, message } = body

    if (!phoneNumber || !message) {
      return NextResponse.json(
        { error: "Telefone e mensagem são obrigatórios" },
        { status: 400 }
      )
    }

    // Formatar o número de telefone (remover caracteres não numéricos)
    const formattedPhone = phoneNumber.replace(/\D/g, '')
    
    // Validar formato brasileiro
    if (!/^55\d{2}9?\d{8}$/.test(formattedPhone)) {
      return NextResponse.json(
        { error: "Formato de telefone inválido. Use o formato brasileiro (ex: +55 11 99999-9999)" },
        { status: 400 }
      )
    }

    // Criar link do WhatsApp Web
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`
    
    return NextResponse.json({ 
      success: true,
      whatsappUrl,
      message: "Link do WhatsApp gerado com sucesso"
    })

  } catch (error) {
    console.error("Erro ao gerar link WhatsApp:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// Opcional: Integração real com WhatsApp Business API
// Para isso, você precisaria configurar:
// 1. WhatsApp Business API (Meta)
// 2. ou usar serviços como Twilio, Vonage
// 3. ou usar bibliotecas como whatsapp-web.js para WhatsApp Web

