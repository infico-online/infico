'use client';

import {  useState  } from "react";
import {  Filter  } from "lucide-react";
import {  Button  } from "@/components/ui/button";
import {  Select, SelectContent, SelectItem, SelectTrigger, SelectValue  } from "@/components/ui/select";
import {  motion, AnimatePresence  } from "framer-motion";
import {  Sheet, SheetTrigger  } from "@/components/ui/sheet";
import {  FilterSheet  } from "@/components/shared/filter-sheet";
import {  ChannelCard  } from "@/components/features/ChannelCard";
import {  useSorting  } from "@/hooks/use-sorting";
import {  useFilters  } from "@/hooks/use-filters";
import {  Channel, FilterSection  } from "@/types";

const mockChannels: Channel[] = [
  {
    id: "1",
    name: "@crypto_news",
    category: "Crypto",
    language: "English",
    followers: "1.2M",
    followersCount: 1200000,
    growth: 25,
    postsPerDay: 42,
    hasIco: true,
    isPremium: true
  },
  {
    id: "2",
    name: "@tech_world",
    category: "Tech",
    language: "English",
    followers: "850K",
    followersCount: 850000,
    growth: 18,
    postsPerDay: 35,
    hasIco: true,
    isAngel: true
  },
  {
    id: "3",
    name: "@finance_hub",
    category: "Finance",
    language: "English",
    followers: "2.1M",
    followersCount: 2100000,
    growth: 32,
    postsPerDay: 28,
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
      { label: "Finance", value: "finance" },
      { label: "Art", value: "art" },
      { label: "Travel", value: "travel" }
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
  },
  {
    title: "Type",
    options: [
      { label: "All", value: "all" },
      { label: "Premium", value: "premium" },
      { label: "Free", value: "free" }
    ],
    columns: 2
  }
];

export default function TrendingChannels() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  import {  sortedData, updateSort, sortConfig  } from useSorting<Channel>(mockChannels, {
    key: 'followersCount',
    direction: 'desc'
  });

  import {  filteredData, addFilter, filters  } from useFilters<Channel>(sortedData;

  return (
    <div className="content-wrapper">
      <div className="flex gap-2 items-center mb-4 sticky top-0 bg-background z-10 py-2">
        <Select 
          defaultValue={sortConfig.key as string} 
          onValueChange={key => updateSort(key as keyof Channel)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="followersCount">By Followers</SelectItem>
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
          {filteredData.map((channel) => (
            <ChannelCard key={channel.id} channel={channel} />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
