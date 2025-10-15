// C:\MesProjets\TestKouerDev\my-app\src\app\components\ui\Product\ProductList.tsx
'use client';

import { useEffect, useState } from "react";
import { Supabase } from "../../../../lib/supabase/supabaseClient";
import ProductCard from "./ProductCard";

type Product = {
    id: number;
    name: string;
    Img_Product: string;
    price: number;
    description?: string;
    category?: string;
    labels?: string[];
};

interface ProductListProps {
    filters?: {
        categories?: number[];
        labels?: number[];
        priceRange?: [number, number];
    };
    sortBy?: string;
}

export default function ProductList({ filters, sortBy = 'pertinence' }: ProductListProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const PRODUCTS_PER_PAGE = 30;

    useEffect(() => {
        fetchProducts();
        setCurrentPage(1);
    }, [filters, sortBy]);

    async function fetchProducts() {
        setLoading(true);
        setError(null);

        try {
            let query = Supabase
                .from("Product")
                .select(`
                    *,
                    Category:id_Category(id_Category, name_Category),
                    Product_Label(
                        Label:id_Label(id_label, name_label)
                    )
                `);

            if (filters?.categories && filters.categories.length > 0) {
                query = query.in('id_Category', filters.categories);
            }

            if (filters?.priceRange) {
                query = query
                    .gte('price', filters.priceRange[0])
                    .lte('price', filters.priceRange[1]);
            }

            switch (sortBy) {
                case "price-asc":
                    query = query.order("price", { ascending: true });
                    break;
                case "price-desc":
                    query = query.order("price", { ascending: false });
                    break;
                case "newest":
                    query = query.order("created_at", { ascending: false });
                    break;
                default:
                    query = query.order("created_at", { ascending: false });
            }

            const { data, error: fetchError } = await query;

            if (fetchError) {
                console.error("Erreur fetch produits :", fetchError);
                setError("Impossible de charger les produits");
                setLoading(false);
                return;
            }

            let filteredData = data || [];
            if (filters?.labels && filters.labels.length > 0) {
                filteredData = filteredData.filter(product =>
                    product.Product_Label?.some((pl: any) =>
                        filters.labels!.includes(pl.Label?.id_label)
                    )
                );
            }

            const formattedProducts = filteredData.map((p: any) => ({
                id: p.id_Product,
                name: p.name_Product,
                Img_Product: p.Img_Product || '/placeholder-product.jpg', // Fallback si pas d'image
                price: p.price || 0,
                description: p.description,
                category: p.Category?.name_Category,
                labels: p.Product_Label?.map((pl: any) => pl.Label?.name_label).filter(Boolean) || []
            }));

            setProducts(formattedProducts);
        } catch (err) {
            console.error("Erreur lors du chargement:", err);
            setError("Une erreur est survenue");
        } finally {
            setLoading(false);
        }
    }

    const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    const currentProducts = products.slice(startIndex, endIndex);

    const getPageNumbers = () => {
        const pages = [];

        if (totalPages <= 5) {

            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {

            if (currentPage <= 3) {
                pages.push(1, 2, 3, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage, '...', totalPages);
            }
        }

        return pages;
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div className="grid grid-cols-2 min-[600px]:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3 p-3 sm:p-6 justify-items-center">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="w-full max-w-[292.8px] h-[348px] bg-white rounded-[10px] overflow-hidden shadow-sm animate-pulse"
                    >
                        <div className="w-full h-[260px] bg-gray-200" />
                        <div className="w-full h-[88px] flex items-center justify-center p-4">
                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <p className="text-red-600 mb-3">{error}</p>
                    <button
                        onClick={fetchProducts}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="flex justify-center items-center w-full min-h-[300px]">
                <div className="bg-gray-50 rounded-lg p-12 text-center">
                    <p className="text-gray-500 text-lg mb-2">Aucun produit trouvé</p>
                    <p className="text-gray-400 text-sm">Essayez de modifier vos filtres</p>
                </div>
            </div>
        );
    }



    return (
        <div className="w-full">

            <div className="grid grid-cols-2 max-[410px]:grid-cols-1 min-[600px]:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3 p-3 sm:p-6 justify-items-center">

                {currentProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        name_Product={product.name}
                        Img_Product={product.Img_Product}
                        price={product.price}
                        description={product.description}
                        Category={product.category}
                        Labels={product.labels}
                    />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 py-8 px-6">
                    {/* Bouton Précédent */}
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`w-[30px] h-[30px] cursor-pointer text-3xl rounded-[37.5px] flex items-center justify-center border border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${currentPage === 1
                            ? 'bg-[#F4F4F4] text-[#D9D9D9]'
                            : 'bg-[#F4F4F4] text-green hover:bg-gray-50'
                            }`}
                        aria-label="Page précédente"
                    >
                        ‹
                    </button>

                    {/* Numéros de pages */}
                    {getPageNumbers().map((page, index) => (
                        <div key={index} className="flex flex-col items-center gap-1">
                            <button
                                onClick={() => typeof page === 'number' && handlePageChange(page)}
                                disabled={page === '...'}
                                className={`min-w-[40px] px-3 py-2 rounded-lg transition-colors cursor-pointer ${page === currentPage
                                    ? 'bg-white text-green'
                                    : page === '...'
                                        ? 'border-transparent text-gray-400 cursor-default'
                                        : 'border-gray-300 bg-white text-gray-700'
                                    }`}
                            >
                                {page}
                            </button>
                            {/* Point vert sous la page active */}
                            {page === currentPage && (
                                <div className="w-1.5 h-1.5 rounded-full bg-green"></div>
                            )}
                        </div>
                    ))}

                    {/* Bouton Suivant */}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`w-[30px] h-[30px] cursor-pointer text-3xl rounded-[37.5px] flex items-center justify-center border border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${currentPage === totalPages
                            ? 'bg-[#F4F4F4] text-[#D9D9D9]'
                            : 'bg-[#F4F4F4] text-green hover:bg-gray-50'
                            }`}
                        aria-label="Page suivante"
                    >
                        ›
                    </button>
                </div>
            )}

        </div>
    );
}