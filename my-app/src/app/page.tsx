'use client';

import { useState, useEffect } from 'react';
import { getProductCount } from "../lib/products";
import FilterBar from "./components/ui/NavBar/FilterBar";
import Sidebar from './components/ui/NavBar/SideBar/SideBar';
import ProductCard from './components/ui/Product/ProductCard';

export default function Home() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    async function fetchCount() {
      const total = await getProductCount();
      setCount(total);
    }
    fetchCount();
  }, []);

  const handleSortChange = (sort: string) => {
    console.log('Tri sélectionné:', sort);
  };

  return (
    <div className="">
      <FilterBar count={count} onSortChange={handleSortChange} />
      <Sidebar />
    </div>
  );
}