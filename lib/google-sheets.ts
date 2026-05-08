const WEBHOOK_URL = process.env.GOOGLE_SHEET_WEBHOOK_URL;

export async function appendRow(sheet: "Présence" | "Menu", values: (string | number)[]) {
  if (!WEBHOOK_URL) return; // Silencieux si non configuré

  await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sheet, values }),
  });
}
