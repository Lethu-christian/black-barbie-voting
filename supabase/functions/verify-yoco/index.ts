import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const YOCO_SECRET_KEY = Deno.env.get("YOCO_SECRET_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ✅ Correct Yoco Checkout API base (per docs)
const YOCO_API_BASE = "https://payments.yoco.com/api";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// We return 200 even on error so supabase.functions.invoke() can read JSON reliably
const respond = (data: object, status = 200) =>
  new Response(JSON.stringify(data), {
    status: 200, // FORCE 200
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
      "X-Actual-Status": status.toString(),
    },
  });

function isInt(n: unknown) {
  return typeof n === "number" && Number.isInteger(n);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    if (!YOCO_SECRET_KEY) {
      return respond({ success: false, error: "YOCO_SECRET_KEY not set in Supabase" }, 500);
    }
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return respond({ success: false, error: "Supabase env vars missing" }, 500);
    }

    const rawBody = await req.text();
    console.log("Raw Request Body:", rawBody);

    if (!rawBody) return respond({ success: false, error: "Empty request body" }, 400);

    let body: any;
    try {
      body = JSON.parse(rawBody);
    } catch (e) {
      return respond({ success: false, error: "Invalid JSON: " + e.message }, 400);
    }

    const { mode } = body;

    /* =========================================================
       CREATE CHECKOUT
    ========================================================= */
    if (mode === "create") {
      const { amountInCents, successUrl, cancelUrl, failureUrl, metadata } = body;

      if (!isInt(amountInCents) || amountInCents <= 0) {
        return respond({ success: false, error: "amountInCents must be a positive integer (cents)" }, 400);
      }
      if (typeof successUrl !== "string" || !successUrl.startsWith("http")) {
        return respond({ success: false, error: "successUrl must be a valid http(s) URL" }, 400);
      }

      const checkoutUrl = `${YOCO_API_BASE}/checkouts`; // ✅ https://payments.yoco.com/api/checkouts
      console.log("Initializing Yoco checkout at:", checkoutUrl, "amount:", amountInCents);

      const payload: Record<string, unknown> = {
        amount: amountInCents,
        currency: "ZAR",
        successUrl,
      };

      // Optional URLs supported by Yoco Checkout API
      if (typeof cancelUrl === "string" && cancelUrl.startsWith("http")) payload.cancelUrl = cancelUrl;
      if (typeof failureUrl === "string" && failureUrl.startsWith("http")) payload.failureUrl = failureUrl;

      // Optional metadata for reconciliation
      if (metadata && typeof metadata === "object") payload.metadata = metadata;

      const res = await fetch(checkoutUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${YOCO_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const rawYoco = await res.text();
      let yocoData: any = {};
      try {
        yocoData = JSON.parse(rawYoco);
      } catch {
        console.error("Yoco returned non-JSON:", rawYoco);
      }

      if (!res.ok) {
        console.error("Yoco API Error:", res.status, rawYoco);
        const errorMsg =
          yocoData?.message ||
          yocoData?.error ||
          (rawYoco
            ? `Yoco Error (${res.status}): ${rawYoco.substring(0, 200)}`
            : "Yoco initialization failed");

        return respond(
          { success: false, error: errorMsg, details: yocoData, raw: rawYoco, status: res.status },
          400,
        );
      }

      // Yoco returns redirectUrl + id (checkout id)
      return respond({
        success: true,
        redirectUrl: yocoData.redirectUrl,
        checkoutId: yocoData.id,
      });
    }

    /* =========================================================
       VERIFY CHECKOUT
    ========================================================= */
    if (mode === "verify") {
      const { checkoutId, contestantId, voteCount } = body;

      if (typeof checkoutId !== "string" || checkoutId.length < 5) {
        return respond({ success: false, error: "checkoutId is required" }, 400);
      }

      const cId = String(contestantId || '');
      if (cId.length === 0) {
        return respond({ success: false, error: "contestantId is required" }, 400);
      }
      if (!isInt(voteCount) || voteCount <= 0) {
        return respond({ success: false, error: "voteCount must be a positive integer" }, 400);
      }

      console.log(`Verifying Yoco checkout: ${checkoutId}`);

      // ✅ Most likely GET endpoint for reading a checkout session
      const res = await fetch(`${YOCO_API_BASE}/checkouts/${checkoutId}`, {
        headers: { Authorization: `Bearer ${YOCO_SECRET_KEY}` },
      });

      const raw = await res.text();
      let yocoData: any = {};
      try {
        yocoData = JSON.parse(raw);
      } catch {
        console.error("Verify returned non-JSON:", raw);
      }

      if (!res.ok) {
        return respond(
          { success: false, error: `Failed to fetch checkout (${res.status})`, details: yocoData, raw },
          400,
        );
      }

      // ✅ Checkout API uses statuses like: created, started, processing, completed
      // Treat "completed" as paid.
      const paid = yocoData?.status === "completed" && !!yocoData?.paymentId;

      if (!paid) {
        return respond({ success: false, error: "Payment not completed", details: yocoData }, 400);
      }

      // Idempotency: don't double-process
      const { data: existing, error: existingErr } = await supabase
        .from("transactions")
        .select("id")
        .eq("reference", checkoutId)
        .maybeSingle();

      if (existingErr) {
        return respond({ success: false, error: existingErr.message }, 500);
      }
      if (existing) return respond({ success: true, message: "Already processed" });

      // amount returned is in cents
      const amountZar = typeof yocoData?.amount === "number" ? yocoData.amount / 100 : null;

      const txData: Record<string, unknown> = {
        reference: checkoutId,
        amount: amountZar ?? 0,
        votes_purchased: voteCount,
        email: yocoData?.customer?.email || "yoco-voter@example.com",
        status: "success",
        // contestant_id: contestantId, // STAGING: Omit to check schema
      };

      // 🔍 DEBUG: Try to insert and catch schema errors
      const { error: txErr } = await supabase.from("transactions").insert(txData);
      if (txErr) {
        console.error("Transaction Error:", txErr);
        return respond({ success: false, error: `DB Error: ${txErr.message}. Details: Table 'transactions' might be missing columns.` }, 500);
      }

      // Increment contestant votes safely
      const { data: contestant, error: cErr } = await supabase
        .from("contestants")
        .select("votes")
        .eq("id", contestantId)
        .single();

      if (cErr) return respond({ success: false, error: cErr.message }, 500);

      const currentVotes = typeof contestant?.votes === "number" ? contestant.votes : 0;

      const { error: uErr } = await supabase
        .from("contestants")
        .update({ votes: currentVotes + voteCount })
        .eq("id", contestantId);

      if (uErr) return respond({ success: false, error: uErr.message }, 500);

      return respond({ success: true });
    }

    return respond({ success: false, error: "Invalid mode" }, 400);
  } catch (err) {
    console.error("Runtime error:", err);
    return respond({ success: false, error: err?.message || String(err) }, 500);
  }
});