import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import Stripe from "stripe"
import { prisma } from "@/lib/prisma"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = headers().get("stripe-signature")

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature!, webhookSecret)
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session

        const bookingId = session.metadata?.bookingId
        if (!bookingId) {
          console.error("No booking ID in session metadata")
          break
        }

        // Atualizar status do booking para CONFIRMED
        await prisma.booking.update({
          where: {
            id: bookingId,
          },
          data: {
            status: "CONFIRMED",
          },
        })

        // Criar registro de pagamento
        await prisma.payment.create({
          data: {
            bookingId: bookingId,
            amount: session.amount_total ? session.amount_total / 100 : 0, // Converter de centavos
            status: "COMPLETED",
            stripePaymentId: session.payment_intent as string,
            stripeSessionId: session.id,
          },
        })

        console.log(`Payment successful for booking ${bookingId}`)
        break
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session
        const bookingId = session.metadata?.bookingId

        if (bookingId) {
          await prisma.booking.update({
            where: {
              id: bookingId,
            },
            data: {
              status: "CANCELLED",
            },
          })

          console.log(`Booking ${bookingId} cancelled due to expired session`)
        }
        break
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        // Buscar booking pelo metadata ou stripeSessionId
        const booking = await prisma.booking.findFirst({
          where: {
            OR: [
              { stripeSessionId: paymentIntent.metadata?.sessionId },
            ],
          },
        })

        if (booking) {
          await prisma.booking.update({
            where: {
              id: booking.id,
            },
            data: {
              status: "CANCELLED",
            },
          })

          await prisma.payment.create({
            data: {
              bookingId: booking.id,
              amount: booking.price,
              status: "FAILED",
              stripePaymentId: paymentIntent.id,
            },
          })

          console.log(`Payment failed for booking ${booking.id}`)
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}
