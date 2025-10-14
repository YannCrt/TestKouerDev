import { useEffect, useState } from "react";
import { Supabase } from "../../../supabase/supabaseClient";

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

type ProductLabel = {
    "#id_Label": number;
    "#id_Product": number;
};

export default function Sidebar() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [labels, setLabels] = useState<Label[]>([]);
    const [openCategories, setOpenCategories] = useState(true);
    const [openLabels, setOpenLabels] = useState(true);
    const [loadingCat, setLoadingCat] = useState(true);
    const [loadingLabel, setLoadingLabel] = useState(true);

    // 🔹 Filtres actifs
    const [activeFilters, setActiveFilters] = useState<string[]>(["0€ - 600€"]);

    // Charger les catégories + nombre de produits
    useEffect(() => {
        async function fetchCategories() {
            const { data: cats, error } = await Supabase.from("Category").select("*");
            if (error) console.error("❌ Erreur Category:", error);

            const { data: products, error: prodError } = await Supabase.from("Product").select("id_Category");
            if (prodError) console.error("❌ Erreur produits:", prodError);
            else if (!products) console.warn("⚠️ Aucun produit trouvé dans la table Product");
            console.log("🧩 Produits récupérés:", products);

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

    // Charger les labels + nombre de produits
    // Charger les labels + nombre de produits
    // Charger les labels + nombre de produits
    useEffect(() => {
        async function fetchLabels() {
            try {
                // 1️⃣ Récupère tous les labels (quelle que soit la casse)
                const { data: labelsData, error: labelError } = await Supabase
                    .from("Label")
                    .select("*");

                if (labelError) {
                    console.error("❌ Erreur Label:", labelError);
                    setLoadingLabel(false);
                    return;
                }

                console.log("✅ Labels récupérés:", labelsData);

                // 2️⃣ Récupère la table de liaison
                const { data: productLabels, error: linkError } = await Supabase
                    .from("Product_Label")
                    .select("*");

                if (linkError) {
                    console.error("❌ Erreur Product_Label:", linkError);
                    setLoadingLabel(false);
                    return;
                }

                console.log("✅ Liaison Product_Label récupérée:", productLabels);

                // 3️⃣ Compter le nombre de produits par label
                const labelCount: Record<number, number> = {};
                productLabels?.forEach((p: any) => {
                    const labelId = p["#id_Label"] || p.id_Label || p.id_label;
                    if (labelId) labelCount[labelId] = (labelCount[labelId] || 0) + 1;
                });

                console.log("📊 Nombre de produits par label:", labelCount);

                // 4️⃣ Reformater les labels avec les bons noms
                const labelsWithCount =
                    labelsData?.map((l: any) => ({
                        id_label: l.id_Label || l.id_label,
                        name_label: l.name_label || l.name_label,
                        product_count: labelCount[l.id_Label || l.id_label] || 0,
                    })) || [];

                console.log("🏷️ Labels finaux:", labelsWithCount);

                setLabels(labelsWithCount);
                setLoadingLabel(false);
            } catch (err) {
                console.error("💥 Erreur inattendue:", err);
                setLoadingLabel(false);
            }
        }

        fetchLabels();
    }, []);




    // 🔹 Gérer les filtres cochés / décochés
    const handleLabelToggle = (label: Label, checked: boolean) => {
        setActiveFilters((prev) =>
            checked ? [...prev, label.name_label] : prev.filter((f) => f !== label.name_label)
        );
    };

    // 🔹 Effacer tous les filtres
    const clearFilters = () => {
        setActiveFilters([]);
        const checkboxes = document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
        checkboxes.forEach((cb) => (cb.checked = false));
    };

    // 🔹 Calcul du total produits sélectionnés
    const totalSelectedProducts = labels
        .filter((l) => activeFilters.includes(l.name_label))
        .reduce((sum, l) => sum + (l.product_count || 0), 0);

    return (
        <div className="w-72 bg-white h-screen p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 pr-2">
            {/* --- Filtres actifs --- */}
            <div className="flex-col mb-4 pt-3.5">
                <p className="font-poppins text-[20px] text-green font-semibold">Filtres</p>
                <p className="border-b-1 border-gray pt-1" />

                {/* 🔹 Liste des filtres actifs */}
                <div className="flex flex-wrap gap-2 mt-4">
                    {activeFilters.map((filter) => (
                        <div
                            key={filter}
                            className="flex items-center gap-1 bg-white text-gray rounded-[60px] text-[14px]"
                        >
                            <button
                                onClick={() => setActiveFilters((prev) => prev.filter((f) => f !== filter))}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 14 14"
                                    fill="none"
                                >
                                    <path d="M3.46875 10.5356L10.5398 3.46458" stroke="#4EA04C" strokeWidth="2" strokeLinecap="round"></path>
                                    <path d="M10.5391 10.5356L3.46799 3.46458" stroke="#4EA04C" strokeWidth="2" strokeLinecap="round"></path>
                                </svg>
                            </button>
                            <span>{filter}</span>
                        </div>
                    ))}
                </div>

                <button
                    onClick={clearFilters}
                    className="bg-[#4EA04C1A] text-green rounded-[60px] h-[34px] px-[20px] text-[16px] font-normal mb-[30px] mt-5 cursor-pointer"
                >
                    Effacer tous les filtres
                </button>
            </div>

            {/* --- Catégories --- */}
            <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setOpenCategories(!openCategories)}
            >
                <p className="font-poppins text-[20px] text-green font-semibold">Catégories</p>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className={`transition-transform duration-200 ${openCategories ? "rotate-180" : "rotate-0"
                        }`}
                >
                    <path d="M1 10H19" stroke="#858585" strokeWidth="2" strokeLinecap="round"></path>
                </svg>
            </div>
            <p className="border-b-1 border-gray pt-2" />

            {openCategories && (
                <ul className="ml-4 mt-6 space-y-2">
                    {loadingCat ? (
                        <li>Chargement...</li>
                    ) : categories.length > 0 ? (
                        categories.map((cat) => (
                            <li
                                key={cat.id_Category ?? cat.name_Category}
                                className="text-gray hover:text-gray-600"
                            >
                                <div className="flex items-center justify-between w-full">
                                    <p className="truncate">{cat.name_Category}</p>
                                    <span className="ml-2 text-gray text-sm flex-shrink-0 w-[35px] h-6 flex items-center justify-center">
                                        {cat.product_count}
                                    </span>
                                </div>
                            </li>
                        ))
                    ) : (
                        <li>Aucune catégorie</li>
                    )}
                </ul>
            )}
            {/* --- Labels --- */}
            <div
                className="flex items-center justify-between cursor-pointer mt-6"
                onClick={() => setOpenLabels(!openLabels)}
            >
                <div className="flex items-center gap-2">
                    {/* 🔹 Badge +9 */}
                    {totalSelectedProducts > 9 && (
                        <div className="bg-gray-400 text-white text-xs px-2 py-[2px] rounded-full">
                            +9
                        </div>
                    )}
                    <p className="font-poppins text-[20px] text-green font-semibold">Labels</p>
                </div>

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className={`transition-transform duration-200 ${openLabels ? "rotate-180" : "rotate-0"
                        }`}
                >
                    <path d="M1 10H19" stroke="#858585" strokeWidth="2" strokeLinecap="round"></path>
                </svg>
            </div>
            <p className="border-b-1 border-gray pt-2" />

            {/* --- Labels --- */}
            {openLabels && (
                <ul className="ml-4 mt-6 space-y-2">
                    {loadingLabel ? (
                        <li>Chargement...</li>
                    ) : labels.length > 0 ? (
                        labels.map((label) => (
                            <li
                                key={label.id_label ?? label.name_label}
                                className="text-gray hover:text-gray-600"
                            >
                                <label
                                    htmlFor={`label-${label.id_label}`}
                                    className="flex items-center justify-between cursor-pointer select-none w-full"
                                >
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <input
                                            type="checkbox"
                                            id={`label-${label.id_label}`}
                                            onChange={(e) => handleLabelToggle(label, e.target.checked)}
                                            className="
                  appearance-none
                  w-[16px] h-[16px]
                  border border-gray-400 rounded-sm
                  bg-white
                  checked:bg-white
                  checked:border-green
                  relative
                  after:content-['']
                  after:absolute
                  after:top-[2px] after:left-[2px]
                  after:w-[10px] after:h-[10px]
                  after:bg-green
                  after:rounded-[2px]
                  after:opacity-0
                  checked:after:opacity-100
                  flex-shrink-0
                "
                                        />
                                        <p className="truncate">{label.name_label}</p>
                                    </div>
                                    <span className="pl-3 text-gray text-sm flex-shrink-0 w-[35px] h-6 flex items-center justify-center">
                                        {label.product_count}
                                    </span>
                                </label>
                            </li>
                        ))
                    ) : (
                        <li>Aucun label</li>
                    )}
                </ul>
            )}
        </div>

    );
}
