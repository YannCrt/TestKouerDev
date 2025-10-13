// src/lib/products.js
import { Supabase } from "../app/supabase/supabaseClient";

export async function getProductCount() {
  const { count, error } = await Supabase.from("Product").select("*", {
    count: "exact",
  });
  if (error) {
    console.error(error);
    return 0;
  }
  return count ?? 0;
}
