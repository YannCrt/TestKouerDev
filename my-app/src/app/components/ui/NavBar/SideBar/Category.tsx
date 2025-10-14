import React from "react";

export type CategoryType = {
    id_Category: number;
    name_Category: string;
    product_count?: number;
};

interface CategoryProps {
    categories: CategoryType[];
    loading: boolean;
    open: boolean;
    toggleOpen: () => void;
}

const Category: React.FC<CategoryProps> = ({ categories, loading, open, toggleOpen }) => {
    return (
        <div>
            <div className="flex items-center justify-between cursor-pointer" onClick={toggleOpen}>
                <p className="font-poppins text-[20px] text-green font-semibold">Catégories</p>
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
            <p className="border-b-1 border-gray pt-2" />
            {open && (
                <ul className="ml-4 mt-6 space-y-2">
                    {loading ? (
                        <li>Chargement...</li>
                    ) : categories.length > 0 ? (
                        categories.map((cat) => (
                            <li key={cat.id_Category} className="text-gray hover:text-gray-600">
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
        </div>
    );
};

export default Category;
