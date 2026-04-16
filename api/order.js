export default async function handler(req, res) {
  console.log("Incoming request:", req.body);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    if (!process.env.GSHEET_WEBHOOK_URL) {
      return res.status(500).json({
        error: "Missing GSHEET_WEBHOOK_URL"
      });
    }

    const response = await fetch(process.env.GSHEET_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const text = await response.text();

    return res.status(200).send(text);
  } catch (error) {
    return res.status(500).json({
      error: String(error),
    });
  }
}