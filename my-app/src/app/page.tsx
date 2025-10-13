import Image from "next/image";
import { getProductCount } from "../lib/products";

export default async function Home() {
  const count = await getProductCount();

  return (
    <div className="font-sans grid ...">
      <div className="flex gap-1">
        <p className="text-lg font-medium">
          {count.toLocaleString()}
        </p>
        <p className="text-lg color-[#858585]">{count > 1 ? "résultats" : "résultat"}</p>
      </div>
    </div >
  );
}