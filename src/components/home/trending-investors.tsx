'use client';

import {  useState  } from "react";
import {  Filter  } from "lucide-react";
import {  Button  } from "@/components/ui/button";
import {  Select, SelectContent, SelectItem, SelectTrigger, SelectValue  } from "@/components/ui/select";
import {  motion, AnimatePresence  } from "framer-motion";
import {  Sheet, SheetTrigger  } from "@/components/ui/sheet";
import {  FilterSheet  } from "@/components/shared/filter-sheet";
import {  InvestorCard  } from "@/components/features/InvestorCard";
import {  useSorting  } from "@/hooks/use-sorting";
import {  useFilters  } from "@/hooks/use-filters";
import {  Investor, FilterSection  } from "@/types";

const mockInvestors: Investor[] = [
  {
    id: "1",
    name: "@crypto_whale",
    invested: "500K",
    investedAmount: 500000,
    activeIcos: 12,
    profit: "125K",
    isWhale: true,
    interests: ["Crypto", "Finance"],
    language: "English"
  },
  // ... другие инвесторы
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
    title: "Type",
    options: [
      { label: "All", value: "all" },
      { label: "Whale", value: "whale" },
      { label: "Angel", value: "angel" }
    ],
    columns: 2
  }
];

export default function TrendingInvestors() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  import {  sortedData, updateSort, sortConfig  } from useSorting<Investor>(mockInvestors, {
    key: 'investedAmount',
    direction: 'desc'
  });

  import {  filteredData, addFilter, filters  } from useFilters<Investor>(sortedData;

  return (
    <div className="content-wrapper">
      <div className="flex gap-2 items-center mb-4 sticky top-0 bg-background z-10 py-2">
        <Select 
          defaultValue={sortConfig.key as string} 
          onValueChange={key => updateSort(key as keyof Investor)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="investedAmount">By Amount</SelectItem>
            <SelectItem value="activeIcos">By Activity</SelectItem>
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
          {filteredData.map((investor) => (
            <InvestorCard key={investor.id} investor={investor} />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
