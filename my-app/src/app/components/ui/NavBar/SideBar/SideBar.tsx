// C:\MesProjets\TestKouerDev\my-app\src\app\components\ui\NavBar\SideBar\SideBar.tsx
'use client';

import { useEffect, useState } from "react";
import { Supabase } from "../../../../../lib/supabase/supabaseClient";
import Filters from "./Filters";
import Category from "./Category";
import Label from "./Label";

type Category = {
    id_Category: number;
    name_Category: string;
    product_count?: number;
};

type Label = {
    id_label: number;
    name_label: string;
    product_count?: number;
};

interface SidebarProps {
    onFiltersChange: (filters: {
        categories: number[];
        labels: number[];
    }) => void;
}

export default function Sidebar({ onFiltersChange }: SidebarProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [labels, setLabels] = useState<Label[]>([]);
    const [openCategories, setOpenCategories] = useState(true);
    const [openLabels, setOpenLabels] = useState(true);
    const [loadingCat, setLoadingCat] = useState(true);
    const [loadingLabel, setLoadingLabel] = useState(true);
    const [activeFilters, setActiveFilters] = useState<string[]>(["0€ - 600€"]);


    useEffect(() => {
        async function fetchCategories() {
            const { data: cats, error } = await Supabase.from("Category").select("*");
            if (error) console.error("❌ Erreur Category:", error);

            const { data: products, error: prodError } = await Supabase.from("Product").select("id_Category");
            if (prodError) console.error("❌ Erreur produits:", prodError);

            const countsByCat = products?.reduce((acc, p) => {
                if (p.id_Category) acc[p.id_Category] = (acc[p.id_Category] || 0) + 1;
                return acc;
            }, {} as Record<number, number>);

            const withCounts =
                cats?.map((c) => ({
                    ...c,
                    product_count: countsByCat?.[c.id_Category] || 0,
                })) || [];

            setCategories(withCounts);
            setLoadingCat(false);
        }

        fetchCategories();
    }, []);

    useEffect(() => {
        async function fetchLabels() {
            const { data: labelsData, error: labelError } = await Supabase.from("Label").select("*");
            if (labelError) {
                console.error("❌ Erreur Label:", labelError);
                setLoadingLabel(false);
                return;
            }

            const { data: productLabels, error: linkError } = await Supabase.from("Product_Label").select("*");
            if (linkError) {
                console.error("❌ Erreur Product_Label:", linkError);
                setLoadingLabel(false);
                return;
            }

            const labelCount: Record<number, number> = {};
            productLabels?.forEach((p: any) => {
                const labelId = p["#id_Label"] || p.id_Label || p.id_label;
                if (labelId) labelCount[labelId] = (labelCount[labelId] || 0) + 1;
            });

            const labelsWithCount =
                labelsData?.map((l: any) => ({
                    id_label: l.id_Label || l.id_label,
                    name_label: l.name_label || l.name_label,
                    product_count: labelCount[l.id_Label || l.id_label] || 0,
                })) || [];

            setLabels(labelsWithCount);
            setLoadingLabel(false);
        }

        fetchLabels();
    }, []);

    useEffect(() => {
        const selectedLabelIds = labels
            .filter((l) => activeFilters.includes(l.name_label))
            .map((l) => l.id_label);

        onFiltersChange({
            categories: [],
            labels: selectedLabelIds,
        });
    }, [activeFilters, labels]);

    const handleLabelToggle = (label: Label, checked: boolean) => {
        setActiveFilters((prev) =>
            checked ? [...prev, label.name_label] : prev.filter((f) => f !== label.name_label)
        );
    };

    const clearFilters = () => {
        setActiveFilters([]);
        const checkboxes = document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
        checkboxes.forEach((cb) => (cb.checked = false));
    };

    const removeFilter = (filter: string) => {
        setActiveFilters((prev) => prev.filter((f) => f !== filter));
        const checkbox = document.querySelector<HTMLInputElement>(`input[id*="${filter}"]`);
        if (checkbox) checkbox.checked = false;
    };

    return (
        <div className="w-[297px] min-w-[250px] bg-white h-screen p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 pr-2">
            <Filters
                activeFilters={activeFilters}
                onRemoveFilter={removeFilter}
                onClearAll={clearFilters}
            />

            <Category
                categories={categories}
                loading={loadingCat}
                open={openCategories}
                onToggle={() => setOpenCategories(!openCategories)}
            />

            <Label
                labels={labels}
                loading={loadingLabel}
                open={openLabels}
                activeFilters={activeFilters}
                onToggle={() => setOpenLabels(!openLabels)}
                onLabelToggle={handleLabelToggle}
            />
        </div>
    );
}