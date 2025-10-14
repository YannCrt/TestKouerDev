import { useEffect, useState } from "react";
import { Supabase } from "../../../../lib/supabase/supabaseClient";
import ProductCard from "./ProductCard";

export type Product = {
    Id_Product: number;
    name_Product: string;
    Img_Product: string;
    price?: number;
    "#Id_Category"?: number;
    labels?: string[];
};

interface ProductListProps {
    activeFilters?: string[];        // labels
    activeCategories?: number[];     // categories
    sort?: string;
}

export default function ProductList({
    activeFilters = [],
    activeCategories = [],
    sort = "Pertinence",
}: ProductListProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            try {
                // Produits
                const { data: productsData, error: prodError } = await Supabase.from("Product").select("*");
                if (prodError) throw prodError;

                // Labels
                const { data: labelsData } = await Supabase.from("Label").select("*");
                const { data: productLabels } = await Supabase.from("Product_Label").select("*");

                const formattedProducts = (productsData || []).map((p: any) => {
                    const labelsForProduct = (productLabels
                        ?.filter(pl => pl["#id_Product"] === p.Id_Product)
                        .map(pl => {
                            const label = labelsData?.find(l => l.id_Label === pl["#id_Label"]);
                            return label?.name_label || "";
                        })
                        .filter(Boolean)) || [];

                    return {
                        Id_Product: p.Id_Product,
                        name_Product: p.name_Product,
                        Img_Product: p.Img_Product,
                        price: p.price,
                        "#Id_Category": p["#Id_Category"],
                        labels: labelsForProduct,
                    };
                });

                setProducts(formattedProducts);
                setLoading(false);
            } catch (e) {
                console.error("Erreur fetch produits :", e);
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);

    if (loading) return <p>Chargement des produits...</p>;

    // Filtre catégories
    let filtered = products.filter(p =>
        activeCategories.length === 0 ? true : activeCategories.includes(p["#Id_Category"] || 0)
    );

    // Filtre labels
    filtered = filtered.filter(p =>
        activeFilters.length === 0 ? true : p.labels?.some(l => activeFilters.includes(l))
    );

    // Tri
    if (sort === "Prix croissant") filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
    else if (sort === "Prix décroissant") filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
    else if (sort === "Nouveauté") filtered.sort((a, b) => b.Id_Product - a.Id_Product);

    return (
        <div className="flex flex-wrap gap-3 mt-4 ml-0 justify-start">
            {filtered.map(p => (
                <ProductCard key={p.Id_Product} name={p.name_Product} imageUrl={p.Img_Product} />
            ))}
        </div>
    );
}
