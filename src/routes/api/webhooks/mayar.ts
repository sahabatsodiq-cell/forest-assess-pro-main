import { defineEventHandler, readBody, getHeader } from "h3";
import { processMayarWebhookFn } from "../../../lib/services/mayarService";

export default defineEventHandler(async (event) => {
  try {
    const authHeader = getHeader(event, "authorization") || "";
    const signatureHeader = getHeader(event, "x-mayar-signature") || "";
    const secretHeader = getHeader(event, "x-mayar-secret") || "";

    let secretToken = "";
    if (authHeader.startsWith("Bearer ")) {
      secretToken = authHeader.substring(7).trim();
    } else if (signatureHeader) {
      secretToken = signatureHeader.trim();
    } else if (secretHeader) {
      secretToken = secretHeader.trim();
    }

    const body = await readBody(event);

    const result = await processMayarWebhookFn({
      data: {
        secretToken,
        payload: body,
      },
    });

    return result;
  } catch (error: any) {
    console.error("[Mayar Webhook Error]:", error);
    return {
      success: false,
      error: error.message || "Gagal memproses webhook Mayar.id",
    };
  }
});
