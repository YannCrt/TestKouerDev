'use client';

import { useState, useEffect } from 'react';
import { Supabase } from '../../../../lib/supabase/supabaseClient';
import Filters from './SideBar/Filters';
import Category from './SideBar/Category';
import Label from './SideBar/Label';

type CategoryType = {
    id_Category: number;
    name_Category: string;
    product_count?: number;
};

type LabelType = {
    id_label: number;
    name_label: string;
    product_count?: number;
};

interface FilterBarProps {
    count: number;
    onSortChange?: (sort: string) => void;
    onFiltersChange?: (filters: {
        categories: number[];
        labels: number[];
    }) => void;
}

export default function FilterBar({ count, onSortChange, onFiltersChange }: FilterBarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSort, setSelectedSort] = useState('Pertinence');
    const [showFilterOverlay, setShowFilterOverlay] = useState(false);

    // États pour les filtres
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [labels, setLabels] = useState<LabelType[]>([]);
    const [openCategories, setOpenCategories] = useState(true);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [openLabels, setOpenLabels] = useState(true);
    const [loadingCat, setLoadingCat] = useState(true);
    const [loadingLabel, setLoadingLabel] = useState(true);
    const [activeFilters, setActiveFilters] = useState<string[]>([]);

    const sortOptions = [
        'Pertinence',
        'Nouveauté',
        'Prix croissant',
        'Prix décroissant'
    ];

    // Fetch categories depuis Supabase
    useEffect(() => {
        async function fetchCategories() {
            const { data: cats, error } = await Supabase.from("Category").select("*");
            if (error) {
                console.error("❌ Erreur Category:", error);
                setLoadingCat(false);
                return;
            }

            const { data: products, error: prodError } = await Supabase.from("Product").select("id_Category");
            if (prodError) {
                console.error("❌ Erreur produits:", prodError);
                setLoadingCat(false);
                return;
            }

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

    // Fetch labels depuis Supabase
    useEffect(() => {
        async function fetchLabels() {
            // ✅ Récupère tous les labels
            const { data: labelsData, error: labelError } = await Supabase
                .from("Label")
                .select("id_label, name_label");

            if (labelError) {
                console.error("❌ Erreur Label:", labelError);
                setLoadingLabel(false);
                return;
            }

            // ✅ Récupère la table de liaison Product_Label
            const { data: productLabels, error: linkError } = await Supabase
                .from("Product_Label")
                .select("id, id_Product, id_Label");

            if (linkError) {
                console.error("❌ Erreur Product_Label:", linkError);
                setLoadingLabel(false);
                return;
            }

            // ✅ Compte combien de produits ont chaque label
            const labelCount: Record<number, number> = {};
            productLabels?.forEach((pl: any) => {
                if (pl.id_Label) {
                    labelCount[pl.id_Label] = (labelCount[pl.id_Label] || 0) + 1;
                }
            });

            // ✅ Map les labels avec leur count
            const labelsWithCount = labelsData?.map((l: any) => ({
                id_label: l.id_label,
                name_label: l.name_label,
                product_count: labelCount[l.id_label] || 0,
            })) || [];

            console.log("🏷️ Labels chargés:", labelsWithCount);
            setLabels(labelsWithCount);
            setLoadingLabel(false);
        }

        fetchLabels();
    }, []);

    // ✅ Synchroniser les filtres à CHAQUE changement
    useEffect(() => {
        const selectedLabelIds = labels
            .filter((l) => activeFilters.includes(l.name_label))
            .map((l) => l.id_label);

        console.log("🔍 Filtres actifs:", {
            categories: selectedCategories,
            labels: selectedLabelIds,
        });

        if (onFiltersChange) {
            onFiltersChange({
                categories: selectedCategories,
                labels: selectedLabelIds,
            });
        }
    }, [activeFilters, selectedCategories]); // ✅ Retiré labels et onFiltersChange

    const handleSelect = (option: string) => {
        setSelectedSort(option);
        setIsOpen(false);
        if (onSortChange) onSortChange(option);
    };

    const handleLabelToggle = (label: LabelType, checked: boolean) => {
        console.log("🏷️ Toggle label:", label.name_label, checked);
        setActiveFilters((prev) =>
            checked ? [...prev, label.name_label] : prev.filter((f) => f !== label.name_label)
        );
    };

    const handleCategorySelect = (cat: CategoryType) => {
        console.log("📁 Toggle category:", cat.name_Category);
        setSelectedCategories((prev) =>
            prev.includes(cat.id_Category)
                ? prev.filter((id) => id !== cat.id_Category)
                : [...prev, cat.id_Category]
        );
    };

    // ✅ clearFilters réinitialise TOUT
    const clearFilters = () => {
        console.log("🧹 Effacement de tous les filtres");
        setActiveFilters([]);
        setSelectedCategories([]);
    };

    const removeFilter = (filter: string) => {
        console.log("❌ Suppression du filtre:", filter);
        setActiveFilters((prev) => prev.filter((f) => f !== filter));
    };

    // ✅ Calculer le nombre de filtres actifs
    const filterCount = activeFilters.length + selectedCategories.length;

    // ✅ Calculer le nombre de produits filtrés (estimation)
    const getFilteredProductCount = () => {
        let count = 0;

        // Ajouter les produits des catégories sélectionnées
        selectedCategories.forEach(catId => {
            const cat = categories.find(c => c.id_Category === catId);
            if (cat) count += cat.product_count || 0;
        });

        // Ajouter les produits des labels sélectionnés
        activeFilters.forEach(filterName => {
            const label = labels.find(l => l.name_label === filterName);
            if (label) count += label.product_count || 0;
        });

        return count;
    };

    return (
        <>
            <div className="min-[900px]:flex justify-between items-center gap-4 p-4 border-gray border-b-1">
                {/* Compteur de résultats - Masqué en dessous de 900px */}
                <div className="hidden min-[900px]:flex gap-1">
                    <p className="text-base sm:text-lg">
                        {count.toLocaleString()}
                    </p>
                    <p className="text-base sm:text-lg text-gray">
                        {count > 1 ? "résultats" : "résultat"}
                    </p>
                </div>

                {/* Spacer pour mobile quand le compteur est caché */}
                <div className="min-[900px]:hidden"></div>

                {/* Container pour tri et filtres */}
                <div className="flex items-center justify-between gap-4">
                    {/* Dropdown de tri */}
                    <div className="relative">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="flex items-center gap-2 text-base"
                        >
                            <span className="text-base sm:text-lg">Trier par</span>
                            <span className="font-medium text-gray text-base sm:text-lg">{selectedSort}</span>
                            <svg
                                className={`w-[18px] h-[18px] sm:w-[22.5px] sm:h-[22.5px] text-gray-800 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                                    }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>

                        {isOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-10">
                                {sortOptions.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => handleSelect(option)}
                                        className={`w-full text-left px-3 py-1 text-sm sm:text-base transition-colors ${selectedSort === option
                                            ? 'bg-green text-white'
                                            : 'hover:bg-gray-50'
                                            }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Bouton filtres mobile & tablette */}
                    {/* Bouton filtres mobile & tablette */}
                    <button
                        onClick={() => setShowFilterOverlay(true)}
                        className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-green text-white rounded-3xl  max-[900px]:p-3 hover:bg-green-600 transition-colors min-[360px]:flex min-[1100px]:hidden"
                    >
                        {/* 🟢 Texte visible uniquement entre 900px et 1099px */}
                        <span className=" max-[900px]:hidden inline-block max-[1099px]:inline-block text-base">
                            Filtres ({getFilteredProductCount()})
                        </span>

                        {/* 🔵 SVG visible tout le temps (mais seul sous 900px) */}
                        <svg
                            width="16"
                            height="14"
                            viewBox="0 0 16 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="block "
                        >
                            <path
                                d="M6 4.12473e-07C5.37935 -0.00032496 4.77387 0.191856 4.26702 0.550057C3.76016 0.908257 3.37688 1.41484 3.17 2H0V4H3.17C3.3766 4.58553 3.75974 5.09257 4.2666 5.45121C4.77346 5.80985 5.37909 6.00245 6 6.00245C6.62091 6.00245 7.22654 5.80985 7.7334 5.45121C8.24026 5.09257 8.6234 4.58553 8.83 4H16V2H8.83C8.62312 1.41484 8.23984 0.908257 7.73298 0.550057C7.22613 0.191856 6.62065 -0.00032496 6 4.12473e-07ZM5 3C5 2.73478 5.10536 2.48043 5.29289 2.29289C5.48043 2.10536 5.73478 2 6 2C6.26522 2 6.51957 2.10536 6.70711 2.29289C6.89464 2.48043 7 2.73478 7 3C7 3.26522 6.89464 3.51957 6.70711 3.70711C6.51957 3.89464 6.26522 4 6 4C5.73478 4 5.48043 3.89464 5.29289 3.70711C5.10536 3.51957 5 3.26522 5 3ZM10 8C9.37935 7.99967 8.77387 8.19186 8.26702 8.55006C7.76016 8.90826 7.37688 9.41484 7.17 10H0V12H7.17C7.3766 12.5855 7.75974 13.0926 8.2666 13.4512C8.77346 13.8099 9.37909 14.0025 10 14.0025C10.6209 14.0025 11.2265 13.8099 11.7334 13.4512C12.2403 13.0926 12.6234 12.5855 12.83 12H16V10H12.83C12.6231 9.41484 12.2398 8.90826 11.733 8.55006C11.2261 8.19186 10.6207 7.99967 10 8ZM9 11C9 10.7348 9.10536 10.4804 9.29289 10.2929C9.48043 10.1054 9.73478 10 10 10C10.2652 10 10.5196 10.1054 10.7071 10.2929C10.8946 10.4804 11 10.7348 11 11C11 11.2652 10.8946 11.5196 10.7071 11.7071C10.5196 11.8946 10.2652 12 10 12C9.73478 12 9.48043 11.8946 9.29289 11.7071C9.10536 11.5196 9 11.2652 9 11Z"
                                fill="white"
                            />
                        </svg>
                    </button>

                </div>
            </div>

            {/* ✅ Overlay mobile & tablette des filtres */}
            {showFilterOverlay && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 min-[1100px]:hidden">
                    <div className="absolute right-0 top-0 h-full w-full bg-white shadow-xl overflow-y-auto">
                        {/* Header de l'overlay */}
                        <div className="sticky top-0 bg-white border-b-1 p-4 flex right-0 items-center z-10">
                            <button
                                onClick={() => setShowFilterOverlay(false)}
                                className="text-gray hover:text-gray-600"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div>

                        {/* Contenu des filtres */}
                        <div className="p-10">
                            <Filters
                                activeFilters={activeFilters}
                                onRemoveFilter={removeFilter}
                                onClearAll={clearFilters}
                                mobile={true}
                                productCount={getFilteredProductCount()}
                            />
                            <Category
                                categories={categories}
                                loading={loadingCat}
                                open={openCategories}
                                onToggle={() => setOpenCategories(!openCategories)}
                                onCategorySelect={handleCategorySelect}
                                activeCategoryIds={selectedCategories}
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

                        {/* Footer avec bouton Appliquer */}
                        <div className="sticky bottom-0 bg-white border-t-1 border-gray p-4">
                            <button
                                onClick={() => setShowFilterOverlay(false)}
                                className="w-full bg-green text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                            >
                                Appliquer les filtres {filterCount > 0 && `(${filterCount})`}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}