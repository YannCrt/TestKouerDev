// C:\MesProjets\TestKouerDev\my-app\src\app\components\ui\NavBar\SideBar\Label.tsx
'use client';

type Label = {
    id_label: number;
    name_label: string;
    product_count?: number;
};

interface LabelProps {
    labels: Label[];
    loading: boolean;
    open: boolean;
    activeFilters: string[];
    onToggle: () => void;
    onLabelToggle: (label: Label, checked: boolean) => void;
}

export default function Label({ labels, loading, open, activeFilters, onToggle, onLabelToggle }: LabelProps) {
    const totalSelectedProducts = labels
        .filter((l) => activeFilters.includes(l.name_label))
        .reduce((sum, l) => sum + (l.product_count || 0), 0);

    return (
        <>
            <div
                className="flex items-center justify-between cursor-pointer mt-6"
                onClick={onToggle}
            >
                <div className="flex items-center gap-2">

                    <p className="font-poppins text-[20px] text-green font-semibold">Labels</p>
                </div>
                <div className="flex items-center gap-2">
                    {/* 🔹 Badge +9 */}
                    {totalSelectedProducts > 9 && (
                        <div className="bg-gray-400 text-white text-xs py-0.5 px-0.5 mr-3 rounded-4xl">
                            +9
                        </div>
                    )}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        className={`transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`}
                    >
                        <path d="M1 10H19" stroke="#858585" strokeWidth="2" strokeLinecap="round"></path>
                    </svg>
                </div>
            </div>
            <p className="border-b-1 border-gray pt-2" />

            {open && (
                <ul className="ml-4 mt-6 space-y-2">
                    {loading ? (
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
                                            checked={activeFilters.includes(label.name_label)} // ✅ Synchronise avec les filtres actifs
                                            onChange={(e) => onLabelToggle(label, e.target.checked)}
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
        </>
    );
}