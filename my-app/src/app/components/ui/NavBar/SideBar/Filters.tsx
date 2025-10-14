import React from "react";

interface FiltersProps {
    activeFilters: string[];
    clearFilters: () => void;
}

const Filters: React.FC<FiltersProps> = ({ activeFilters, clearFilters }) => {
    return (
        <div className="flex-col mb-4 pt-3.5">
            <p className="font-poppins text-[20px] text-green font-semibold">Filtres</p>
            <p className="border-b-1 border-gray pt-1" />
            <div className="flex flex-wrap gap-2 mt-4">
                {activeFilters.map((filter) => (
                    <div
                        key={filter}
                        className="flex items-center gap-1 bg-white text-gray rounded-[60px] text-[14px]"
                    >
                        <button onClick={() => clearFilters()}>
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
    );
};

export default Filters;
