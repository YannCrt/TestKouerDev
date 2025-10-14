// C:\MesProjets\TestKouerDev\my-app\src\app\page.tsx
'use client';

import { useState, useEffect } from 'react';
import { getProductCount } from "../lib/products";
import FilterBar from "./components/ui/NavBar/FilterBar";
import Sidebar from './components/ui/NavBar/SideBar/SideBar';
import ProductList from './components/ui/Product/ProductList';

interface Filters {
  categories: number[];
  labels: number[];
  priceRange: [number, number];
}

export default function Home() {
  const [count, setCount] = useState(0);
  const [sortBy, setSortBy] = useState('pertinence');
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    labels: [],
    priceRange: [0, 600]
  });

  useEffect(() => {
    async function fetchCount() {
      const total = await getProductCount();
      setCount(total);
    }
    fetchCount();
  }, []);

  const handleSortChange = (sort: string) => {
    console.log('Tri sélectionné:', sort);
    setSortBy(sort);
  };

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <FilterBar count={count} onSortChange={handleSortChange} />

      <div className="flex">
        {/* Sidebar avec filtres */}
        <Sidebar onFiltersChange={handleFiltersChange} />

        {/* Zone principale avec la liste des produits */}
        <main className="flex-1">
          <ProductList filters={filters} sortBy={sortBy} />
        </main>
      </div>
    </div>
  );
}