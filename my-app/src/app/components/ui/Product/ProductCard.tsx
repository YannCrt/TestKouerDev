import React from "react";

type ProductCardProps = {
    name: string;
    imageUrl: string;
};

export default function ProductCard({ name, imageUrl }: ProductCardProps) {
    return (
        <div className="w-[292.8px] min-w-[280px] h-[348px] bg-white rounded-[10px] m-0 overflow-hidden shadow-sm flex flex-col cursor-pointer">
            {/* Image */}
            <div className="w-full h-[260px]">
                <img
                    src={imageUrl}
                    alt={name}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Nom du produit */}
            <div className="w-full h-[88px] flex p-2 pl-3 pt-4">
                <p className="text-gray-800 font-medium truncate">{name}</p>
            </div>
        </div>

    );
}
