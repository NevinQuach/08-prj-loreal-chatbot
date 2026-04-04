// Copy this code into your Cloudflare Worker script.
// The API key stays hidden in Worker secrets, never in frontend code.

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  // Handle browser preflight request
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({ error: { message: "Only POST is allowed." } }),
      { status: 405, headers: corsHeaders },
    );
  }

  try {
    const body = await request.json();

    const openAiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // OPENAI_API_KEY must be set as a Cloudflare Worker secret
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: body.messages,
        }),
      },
    );

    const data = await openAiResponse.json();

    return new Response(JSON.stringify(data), {
      status: openAiResponse.status,
      headers: corsHeaders,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: { message: "Worker error while processing request." },
      }),
      { status: 500, headers: corsHeaders },
    );
  }
}
