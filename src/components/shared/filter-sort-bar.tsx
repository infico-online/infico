import {  Filter  } from "lucide-react";
import {  Button  } from "@/components/ui/button";
import {  Select, SelectContent, SelectItem, SelectTrigger, SelectValue  } from "@/components/ui/select";
import {  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger  } from "@/components/ui/sheet";

interface FilterSortBarProps {
  sortBy: string;
  onSortChange: (value: string) => void;
  sortOptions: { value: string; label: string; }[];
  isFilterOpen: boolean;
  onFilterOpenChange: (open: boolean) => void;
  filterContent: React.ReactNode;
}

function FilterSortBar({
  sortBy,
  onSortChange,
  sortOptions,
  isFilterOpen,
  onFilterOpenChange,
  filterContent
}: FilterSortBarProps) {
  return (
    <div className="flex w-full gap-2">
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-[calc(100%-48px)]">
          <SelectValue placeholder="Sort by..." />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Sheet open={isFilterOpen} onOpenChange={onFilterOpenChange}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="h-10 w-10">
            <Filter className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          {filterContent}
        </SheetContent>
      </Sheet>
    </div>
  );
}
