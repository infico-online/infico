'use client';

import {  Button  } from "@/components/ui/button";
import {  Sheet, SheetContent, SheetHeader, SheetTitle  } from "@/components/ui/sheet";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterSection {
  title: string;
  options: FilterOption[];
  columns: number;
}

interface FilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sections: FilterSection[];
  activeFilters: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
}

function FilterSheet({
  open,
  onOpenChange,
  sections,
  activeFilters,
  onFilterChange
}: FilterSheetProps) {
  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Filters</SheetTitle>
      </SheetHeader>
      <div className="py-4 space-y-4">
        {sections.map((section) => (
          <div key={section.title} className="space-y-2">
            <div className="text-sm text-muted-foreground">{section.title}</div>
            <div className={`grid grid-cols-${section.columns} gap-2`}>
              {section.options.map((option) => (
                <Button
                  key={option.value}
                  variant={
                    activeFilters[section.title.toLowerCase()] === 
                    option.value.toLowerCase() ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => onFilterChange(section.title.toLowerCase(), option.value.toLowerCase())}
                  className="w-full"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SheetContent>
  );
}
