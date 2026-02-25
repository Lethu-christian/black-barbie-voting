import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const ok = (body) => new Response(JSON.stringify(body), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })

  try {
    const YOCO_SECRET_KEY = Deno.env.get('YOCO_SECRET_KEY') ?? ''
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    const body = await req.json()
    const mode = body.mode

    // ── CREATE CHECKOUT ────────────────────────────────────────────────────
    if (mode === 'create') {
      const { amountInCents, metadata, successUrl, cancelUrl } = body


      const yocoRes = await fetch('https://payments.yoco.com/api/checkouts', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + YOCO_SECRET_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amountInCents,
          currency: 'ZAR',
          successUrl: successUrl,
          cancelUrl: cancelUrl,
          metadata: metadata,
        }),
      })

      const yocoBody = await yocoRes.json()

      if (!yocoRes.ok || !yocoBody.redirectUrl) {
        return ok({ success: false, error: yocoBody.message || yocoBody.error || 'Yoco error ' + yocoRes.status, raw: yocoBody })
      }

      return ok({ success: true, redirectUrl: yocoBody.redirectUrl, id: yocoBody.id })
    }

    // ── VERIFY CHECKOUT ────────────────────────────────────────────────────
    if (mode === 'verify') {
      const { checkoutId, voteCount, contestantId, voterEmail } = body
      console.log(`Verifying payment for checkout ${checkoutId}, contestant ${contestantId}`);

      const verifyRes = await fetch('https://payments.yoco.com/api/checkouts/' + checkoutId, {
        headers: { 'Authorization': 'Bearer ' + YOCO_SECRET_KEY },
      })

      const verifyBody = await verifyRes.json()
      console.log(`Yoco response status: ${verifyBody.status}`);

      if (verifyBody.status !== 'successful') {
        return ok({ success: false, error: 'Payment status: ' + verifyBody.status })
      }

      // Idempotency check
      const { data: existing } = await supabase
        .from('transactions').select('id')
        .eq('yoco_transaction_id', verifyBody.id).single()

      if (existing) {
        console.log(`Transaction ${verifyBody.id} already processed.`);
        return ok({ success: true, message: 'Already counted' })
      }

      const amountInRands = verifyBody.amount / 100;

      // Record transaction with fields matching the Admin UI expectations
      const { error: transError } = await supabase.from('transactions').insert({
        yoco_transaction_id: verifyBody.id,
        reference: verifyBody.id, // Using Yoco ID as reference
        contestant_id: contestantId,
        email: voterEmail || 'guest@example.com',
        amount: amountInRands,
        amount_in_cents: verifyBody.amount,
        votes_purchased: voteCount,
        status: 'successful',
      })

      if (transError) {
        console.error('Error inserting transaction:', transError);
        throw new Error('Database error recording transaction');
      }

      // Fetch current votes
      const { data: contestant, error: fetchError } = await supabase
        .from('contestants').select('votes').eq('id', contestantId).single()

      if (fetchError) {
        console.error('Error fetching contestant for vote update:', fetchError);
        throw new Error('Database error fetching contestant');
      }

      // Update contestant votes
      const { error: updateError } = await supabase.from('contestants')
        .update({ votes: (contestant?.votes || 0) + voteCount })
        .eq('id', contestantId)

      if (updateError) {
        console.error('Error updating votes:', updateError);
        throw new Error('Database error updating votes');
      }

      console.log(`Successfully added ${voteCount} votes to contestant ${contestantId}`);
      return ok({ success: true })
    }

    return ok({ success: false, error: 'Invalid mode: ' + mode })

  } catch (err) {
    console.error('Function crashed:', err.message)
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})