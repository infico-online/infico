import {  Filter  } from "lucide-react";
import {  Button  } from "@/components/ui/button";
import {  Select, SelectContent, SelectItem, SelectTrigger, SelectValue  } from "@/components/ui/select";

interface SortFilterHeaderProps {
  sortBy: string;
  onSortChange: (value: string) => void;
  sortOptions: Array<{value: string; label: string}>;
  onFilterClick: () => void;
}

function SortFilterHeader({
  sortBy,
  onSortChange,
  sortOptions,
  onFilterClick
}: SortFilterHeaderProps) {
  return (
    <div className="flex gap-2 w-full px-4">
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-full bg-white rounded-lg border">
          <SelectValue placeholder="Sort by..." />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button 
        variant="outline" 
        size="icon" 
        className="h-10 w-10 bg-white rounded-lg"
        onClick={onFilterClick}
      >
        <Filter className="h-4 w-4" />
      </Button>
    </div>
  );
}
