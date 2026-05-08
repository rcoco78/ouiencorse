const WEBHOOK_URL = process.env.GOOGLE_SHEET_WEBHOOK_URL;

export async function appendRow(sheet: "Présence" | "Menu", values: (string | number)[]) {
  if (!WEBHOOK_URL) {
    console.warn("[google-sheets] GOOGLE_SHEET_WEBHOOK_URL non configuré");
    return;
  }

  const res = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sheet, values }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "(no body)");
    console.error(`[google-sheets] Webhook ${sheet} KO ${res.status}: ${body}`);
  }
}
