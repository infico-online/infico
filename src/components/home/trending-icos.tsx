'use client';

import {  useState  } from "react";
import {  Filter  } from "lucide-react";
import {  Button  } from "@/components/ui/button";
import {  Select, SelectContent, SelectItem, SelectTrigger, SelectValue  } from "@/components/ui/select";
import {  motion, AnimatePresence  } from "framer-motion";
import {  Sheet, SheetTrigger  } from "@/components/ui/sheet";
import {  FilterSheet  } from "@/components/shared/filter-sheet";
import {  ICOCard  } from "@/components/features/ICOCard";
import {  useSorting  } from "@/hooks/use-sorting";
import {  useFilters  } from "@/hooks/use-filters";
import {  ICO, FilterSection  } from "@/types";

const mockIcos: ICO[] = [
  {
    id: "1",
    channelName: "@cryptonews",
    rate: 13,
    term: 6,
    raised: 45000,
    goal: 100000,
    progress: 45,
    language: "EN",
    category: "Crypto",
    investors: 152,
    isPremium: true
  },
  {
    id: "2",
    channelName: "@techworld",
    rate: 12,
    term: 3,
    raised: 25000,
    goal: 50000,
    progress: 50,
    language: "EN",
    category: "Tech",
    investors: 89,
    isAngel: true
  },
  {
    id: "3",
    channelName: "@financehub",
    rate: 15,
    term: 12,
    raised: 100000,
    goal: 200000,
    progress: 50,
    language: "RU",
    category: "Finance",
    investors: 234
  }
];

const filterSections: FilterSection[] = [
  {
    title: "APY Rate",
    options: [
      { label: "All", value: "all" },
      { label: "High", value: "high" },
      { label: "Mid", value: "mid" },
      { label: "Low", value: "low" }
    ],
    columns: 4
  },
  {
    title: "Duration",
    options: [
      { label: "All", value: "all" },
      { label: "3M", value: "3m" },
      { label: "6M", value: "6m" },
      { label: "12M", value: "12m" }
    ],
    columns: 4
  },
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

export default function TrendingICOs() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  import {  sortedData, updateSort, sortConfig  } from useSorting<ICO>(mockIcos, {
    key: 'raised',
    direction: 'desc'
  });

  import {  filteredData, addFilter, filters  } from useFilters<ICO>(sortedData;

  return (
    <div className="content-wrapper">
      <div className="flex gap-2 items-center mb-4 sticky top-0 bg-background z-10 py-2">
        <Select 
          defaultValue={sortConfig.key as string} 
          onValueChange={key => updateSort(key as keyof ICO)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="raised">By Raised</SelectItem>
            <SelectItem value="rate">By APY</SelectItem>
            <SelectItem value="investors">By Investors</SelectItem>
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
          {filteredData.map((ico) => (
            <ICOCard key={ico.id} ico={ico} />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
