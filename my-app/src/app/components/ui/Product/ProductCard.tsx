import React from "react";
import Image from "next/image";
import { Product } from "../../../../app/type/type";


export default function ProductCard({
    name_Product,
    Img_Product,
    Labels
}: Product) {
    const labelConfig: Record<string, { display: string; image?: string; variant?: 'default' | 'season' }> = {
        'bio': { display: 'BIO', image: '/images/labels/bio.png', variant: 'default' },
        'spécialité traditionnelle garantie': { display: 'STG', image: '/images/labels/stg.png', variant: 'default' },
        'produit de saison': { display: 'Produit de saison', variant: 'season' }
    };

    const processedLabels = Labels
        ?.map(label => {
            const labelLower = label.toLowerCase();
            const config = Object.entries(labelConfig).find(([key]) =>
                labelLower.includes(key)
            );
            return config ? config[1] : null;
        })
        .filter((label): label is { display: string; image?: string; variant?: 'default' | 'season' } => label !== null)
        .sort((a, b) => {
            const getPriority = (label: { display: string; image?: string; variant?: 'default' | 'season' }) => {
                if (label.variant === 'season') return 0;
                if (label.image && label.image.includes('bio')) return 1;
                return 2;
            };
            return getPriority(a) - getPriority(b);
        });

    return (
        <div className="w-full max-w-[292.8px] min-w-[160px] h-[240px] min-[450px]:h-[280px] min-[600px]:h-[348px] bg-white rounded-[10px] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col group cursor-pointer relative">
            {/* Image avec labels - Hauteur fixe */}
            <div className="w-full h-[180px] min-[450px]:h-[210px] min-[600px]:h-[260px] relative overflow-hidden bg-gray-100 flex-shrink-0">
                <Image
                    src={Img_Product}
                    alt={name_Product}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 292px"
                />

                {/* Labels en haut à GAUCHE - Taille originale */}
                {processedLabels && processedLabels.length > 0 && (
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                        {processedLabels.map((label, index) => (
                            <div
                                key={index}
                                className={`rounded-[20px] shadow-md flex items-center ml-2 mt-1 ${label.variant === 'season'
                                    ? 'bg-white p-1.5 px-3 gap-1'
                                    : 'bg-white p-1 pr-2 gap-1'
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
                                <span className={`text-xs tracking-wide ${label.variant === 'season'
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

            {/* Informations du produit - Prend l'espace restant */}
            <div className="w-full flex-1 flex flex-col justify-center px-4 py-2">
                <h3 className="text-lightblack font-semibold text-sm leading-tight line-clamp-2 group-hover:text-green-600 transition-colors">
                    {name_Product}
                </h3>
            </div>
        </div>
    );
}