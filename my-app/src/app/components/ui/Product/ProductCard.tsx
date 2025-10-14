// C:\MesProjets\TestKouerDev\my-app\src\app\components\ui\Product\ProductCard.tsx
import React from "react";
import Image from "next/image";

type ProductCardProps = {
    name: string;
    Img_Product: string;
    price?: number;
    description?: string;
    category?: string;
    labels?: string[];
};

export default function ProductCard({
    name,
    Img_Product,
    description,
    labels
}: ProductCardProps) {
    return (
        <div className="w-[292.8px] min-w-[280px] h-[420px] bg-white rounded-[10px] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col group cursor-pointer">
            {/* Image avec labels */}
            <div className="w-full h-[260px] relative overflow-hidden bg-gray-100">
                <Image
                    src={Img_Product}
                    alt={name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                    sizes="292px"
                />

                {/* Labels en haut à droite */}
                {labels && labels.length > 0 && (
                    <div className="absolute top-2 right-2 flex flex-col gap-1">
                        {labels.map((label, index) => (
                            <span
                                key={index}
                                className="bg-green-600 text-white text-xs font-medium px-2 py-1 rounded shadow-sm"
                            >
                                {label}
                            </span>
                        ))}
                    </div>
                )}

                {/* Badge "Produit de saison" si dans la description */}
                {description?.toLowerCase().includes('saison') && (
                    <div className="absolute top-2 left-2">
                        <span className="bg-white text-green radius- text-xs font-medium px-2 py-1 rounded shadow-sm">
                            Produit de saison
                        </span>
                    </div>
                )}
            </div>

            {/* Informations du produit */}
            <div className="w-full flex-1 flex flex-col p-4">
                {/* Nom du produit */}
                <h3 className="text-gray-800 font-medium text-base mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                    {name}
                </h3>
            </div>
        </div >
    );
}