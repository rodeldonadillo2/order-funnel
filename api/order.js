import { createClient } from "@supabase/supabase-js";

// create the supabase connection using our secret keys
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  console.log("Incoming request:", req.body);

  // bouncer — POST only
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // pull the order details out of req.body
    const {
      name,
      office,
      date,
      payment,
      items,
      total,
      orderNumber
    } = req.body;

    // save the order to supabase
    const { error } = await supabase
      .from("orders")
      .insert([{
        customer_name: name,
        office:        office,
        pickup_date:   date,
        payment:       payment,
        items:         items,
        total:         total,
        order_number:  orderNumber,
        status:        "pending"
      }]);

    // if supabase returned an error, throw it
    if (error) throw error;

    // success — tell the browser it worked
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("Order save failed:", error);
    return res.status(500).json({ error: String(error) });
  }
}