import { createAPIFileRoute } from "@tanstack/react-start/api";
import { processMayarWebhookFn } from "@/lib/services/mayarService";

export const APIRoute = createAPIFileRoute("/api/mayar-webhook")({
  POST: async ({ request }) => {
    try {
      const authHeader = request.headers.get("x-mayar-secret") || request.headers.get("authorization");
      const secretToken = authHeader ? authHeader.replace("Bearer ", "").trim() : undefined;
      const payload = await request.json();

      const res = await processMayarWebhookFn({
        data: {
          secretToken,
          payload,
        },
      });

      return new Response(JSON.stringify(res), {
        status: res.success ? 200 : 400,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err: any) {
      return new Response(JSON.stringify({ error: err.message || "Webhook processing failed" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
});
