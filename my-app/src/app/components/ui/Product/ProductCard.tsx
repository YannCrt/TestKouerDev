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
    // Configuration des labels avec mapping et images optionnelles
    const labelConfig: Record<string, { display: string; image?: string; variant?: 'default' | 'season' }> = {
        'bio': { display: 'BIO', image: '/images/labels/bio.png', variant: 'default' },
        'spécialité traditionnelle garantie': { display: 'STG', image: '/images/labels/stg.png', variant: 'default' },
        'produit de saison': { display: 'Produit de saison', variant: 'season' }
    };

    // Filtrer et mapper les labels
    const processedLabels = labels
        ?.map(label => {
            const labelLower = label.toLowerCase();
            const config = Object.entries(labelConfig).find(([key]) =>
                labelLower.includes(key)
            );
            return config ? config[1] : null;
        })
        .filter((label): label is { display: string; image?: string; variant?: 'default' | 'season' } => label !== null);

    return (
        <div className="w-[292.8px] min-w-[280px] h-[348px] bg-white rounded-[10px] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col group cursor-pointer relative">
            {/* Image avec labels */}
            <div className="w-full h-[260px] relative overflow-hidden bg-gray-100">
                <Image
                    src={Img_Product}
                    alt={name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                    sizes="292px"
                />

                {/* Labels en haut à GAUCHE */}
                {processedLabels && processedLabels.length > 0 && (
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                        {processedLabels.map((label, index) => (
                            <div
                                key={index}
                                className={`rounded-[20px] shadow-md flex items-center ${label.variant === 'season'
                                    ? 'bg-white p-1 pr-1 gap-1'
                                    : 'bg-white p-0.5 pr-1 gap-1'
                                    }`}
                            >
                                {label.image && (
                                    <div className="relative w-5 h-5">
                                        <Image
                                            src={label.image}
                                            alt={label.display}
                                            fill
                                            className="object-contain p-0.5 rounded-2xl"
                                        />
                                    </div>
                                )}
                                <span className={`text-xs  tracking-wide ${label.variant === 'season'
                                    ? 'text-green font-semibold'
                                    : 'text-lightblack'
                                    }`}>
                                    {label.display}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Informations du produit */}
            <div className="w-full flex flex-col p-4 pt-3">
                {/* Nom du produit */}
                <h3 className="text-lightblack font-semibold mt-2 text-sm leading-relaxed group-hover:text-green-600 transition-colors">
                    {name}
                </h3>
            </div>
        </div>
    );
}