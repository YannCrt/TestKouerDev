import { useEffect, useState } from "react";
import { Supabase } from "../../../../../lib/supabase/supabaseClient";
import Category, { CategoryType } from "./Category";
import Label, { LabelType } from "./Label";
import Filters from "./Filters";

export default function Sidebar() {
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [labels, setLabels] = useState<LabelType[]>([]);
    const [openCategories, setOpenCategories] = useState(true);
    const [openLabels, setOpenLabels] = useState(true);
    const [loadingCat, setLoadingCat] = useState(true);
    const [loadingLabel, setLoadingLabel] = useState(true);
    const [activeFilters, setActiveFilters] = useState<string[]>(["0€ - 600€"]);

    useEffect(() => {
        async function fetchCategories() {
            const { data: cats, error } = await Supabase.from("Category").select("*");
            if (error) console.error(error);

            const { data: products } = await Supabase.from("Product").select("id_Category");
            const countsByCat = products?.reduce((acc, p) => {
                if (p.id_Category) acc[p.id_Category] = (acc[p.id_Category] || 0) + 1;
                return acc;
            }, {} as Record<number, number>);

            const withCounts = cats?.map((c) => ({
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
            const { data: labelsData } = await Supabase.from("Label").select("*");
            const { data: productLabels } = await Supabase.from("Product_Label").select("*");

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

    const handleLabelToggle = (label: LabelType, checked: boolean) => {
        setActiveFilters((prev) =>
            checked ? [...prev, label.name_label] : prev.filter((f) => f !== label.name_label)
        );
    };

    const clearFilters = () => setActiveFilters([]);

    return (
        <div className="w-72 bg-white h-screen p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 pr-2">
            <Filters activeFilters={activeFilters} clearFilters={clearFilters} />
            <Category
                categories={categories}
                loading={loadingCat}
                open={openCategories}
                toggleOpen={() => setOpenCategories(!openCategories)}
            />
            <Label
                labels={labels}
                loading={loadingLabel}
                open={openLabels}
                toggleOpen={() => setOpenLabels(!openLabels)}
                activeFilters={activeFilters}
                handleLabelToggle={handleLabelToggle}
            />
        </div>
    );
}
