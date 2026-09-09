import { createFileRoute } from "@tanstack/react-router";
import { processMayarWebhookFn } from "@/lib/services/mayarService";

export const Route = createFileRoute("/api/mayar-webhook")({
  loader: async () => {
    return { status: "ok", message: "Mayar webhook endpoint active" };
  },
});

