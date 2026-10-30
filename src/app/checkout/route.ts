import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia' as any,
});

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'MyApp Pro',
              description: 'Unlock unlimited AI features and premium support.',
            },
            unit_amount: 900,
            recurring: { interval: 'month' },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.get('origin')}/en/dashboard?success=true`,
      cancel_url: `${req.headers.get('origin')}/en/dashboard?canceled=true`,
      customer_email: user.email,
      client_reference_id: user.id,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe Error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}