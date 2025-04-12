'use client';

import {  useState  } from "react";
import {  Filter  } from "lucide-react";
import {  Button  } from "@/components/ui/button";
import {  Select, SelectContent, SelectItem, SelectTrigger, SelectValue  } from "@/components/ui/select";
import {  motion, AnimatePresence  } from "framer-motion";
import {  Sheet, SheetTrigger  } from "@/components/ui/sheet";
import {  FilterSheet  } from "@/components/shared/filter-sheet";
import {  PageCard  } from "@/components/features/PageCard";
import {  useSorting  } from "@/hooks/use-sorting";
import {  useFilters  } from "@/hooks/use-filters";
import {  Page, FilterSection  } from "@/types";

const mockPages: Page[] = [
  {
    id: "1",
    name: "@crypto_advice",
    category: "Crypto",
    language: "English",
    views: "2.5M",
    viewsCount: 2500000,
    growth: 25,
    subscribers: "156K",
    hasIco: true,
    isPremium: true
  },
  {
    id: "2",
    name: "@tech_insights",
    category: "Tech",
    language: "English",
    views: "1.8M",
    viewsCount: 1800000,
    growth: 18,
    subscribers: "98K",
    hasIco: true,
    isAngel: true
  },
  {
    id: "3",
    name: "@finance_daily",
    category: "Finance",
    language: "English",
    views: "3.1M",
    viewsCount: 3100000,
    growth: 32,
    subscribers: "220K",
    hasIco: true
  }
];

const filterSections: FilterSection[] = [
  {
    title: "Topic",
    options: [
      { label: "All", value: "all" },
      { label: "Crypto", value: "crypto" },
      { label: "Tech", value: "tech" },
      { label: "Finance", value: "finance" }
    ],
    columns: 2
  },
  {
    title: "Language",
    options: [
      { label: "All", value: "all" },
      { label: "English", value: "english" },
      { label: "Russian", value: "russian" }
    ],
    columns: 2
  }
];

export default function TrendingPages() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  import {  sortedData, updateSort, sortConfig  } from useSorting<Page>(mockPages, {
    key: 'viewsCount',
    direction: 'desc'
  });

  import {  filteredData, addFilter, filters  } from useFilters<Page>(sortedData;

  return (
    <div className="content-wrapper">
      <div className="flex gap-2 items-center mb-4 sticky top-0 bg-background z-10 py-2">
        <Select 
          defaultValue={sortConfig.key as string} 
          onValueChange={key => updateSort(key as keyof Page)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="viewsCount">By Views</SelectItem>
            <SelectItem value="growth">By Growth</SelectItem>
          </SelectContent>
        </Select>

        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <Filter className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <FilterSheet
            open={isFilterOpen}
            onOpenChange={setIsFilterOpen}
            sections={filterSections}
            activeFilters={Object.fromEntries(filters.map(f => [f.field, f.value]))}
            onFilterChange={addFilter}
          />
        </Sheet>
      </div>

      <motion.div className="space-y-4" layout>
        <AnimatePresence>
          {filteredData.map((page) => (
            <PageCard key={page.id} page={page} />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
