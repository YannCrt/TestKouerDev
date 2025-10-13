'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/supabase/supabaseClient';

export default function ProduitsPage() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        async function fetchProducts() {
            const { data, error } = await supabase
                .from('Product')
                .select(`
          *,
          Category(name_Category),
          Product_Label(Label(name_Label))
        `);

            if (!error) setProducts(data);
        }

        fetchProducts();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-8">Tous nos produits</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {products.map((product) => (
                    <div key={product.id_Product} className="border rounded-lg overflow-hidden">
                        {/* Image du produit */}
                        <img
                            src={product.img_Product}
                            alt={product.name_Product}
                            className="w-full h-48 object-cover"
                        />

                        <div className="p-4">
                            {/* Labels (BIO, etc.) */}
                            <div className="flex gap-2 mb-2">
                                {product.Product_Label?.map((pl, i) => (
                                    <span
                                        key={i}
                                        className="bg-green-500 text-white text-xs px-2 py-1 rounded"
                                    >
                                        {pl.Label.name_Label}
                                    </span>
                                ))}
                            </div>

                            {/* Nom du produit */}
                            <h3 className="font-semibold">{product.name_Product}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}