import {  Filter  } from "lucide-react";
import {  Button  } from "@/components/ui/button";
import {  Select, SelectContent, SelectItem, SelectTrigger, SelectValue  } from "@/components/ui/select";

interface SortFilterRowProps {
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string; }[];
  onFilterClick: () => void;
}

function SortFilterRow({
  value,
  onValueChange,
  options,
  onFilterClick
}: SortFilterRowProps) {
  return (
    <div className="flex w-full gap-2 px-4">
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full bg-white rounded-xl">
          <SelectValue placeholder="Select..." />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button 
        variant="outline" 
        size="icon" 
        className="h-10 w-10 bg-white rounded-xl"
        onClick={onFilterClick}
      >
        <Filter className="h-4 w-4" />
      </Button>
    </div>
  );
}
