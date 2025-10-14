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
}

export default function Home() {
  const [count, setCount] = useState(0);
  const [sortBy, setSortBy] = useState('pertinence');
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    labels: []
  });

  useEffect(() => {
    async function fetchCount() {
      const total = await getProductCount();
      setCount(total);
    }
    fetchCount();
  }, []);

  const handleSortChange = (sort: string) => {
    console.log("Tri sélectionné:", sort);

    let sortValue = "pertinence";

    switch (sort) {
      case "Prix croissant":
        sortValue = "price-asc";
        break;
      case "Prix décroissant":
        sortValue = "price-desc";
        break;
      case "Nouveauté":
        sortValue = "newest"; // si tu veux gérer ça par created_at desc
        break;
      case "Pertinence":
      default:
        sortValue = "pertinence";
    }

    setSortBy(sortValue);
  };


  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  return (
    <div className="">
      <FilterBar count={count} onSortChange={handleSortChange} />
      <div className='flex'>
        <Sidebar onFiltersChange={handleFiltersChange} />
        <ProductList filters={filters} sortBy={sortBy} />
      </div>
    </div>
  );
}