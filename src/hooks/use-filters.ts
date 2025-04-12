import {  useState, useMemo  } from "react";
import {  FilterState  } from "@/types";

function useFilters<T extends Record<string, any>>(initialData: T[]) {
  const [filters, setFilters] = useState<FilterState[]>([]);

  const filteredData = useMemo(() => {
    return initialData.filter(item => {
      return filters.every(filter => {
        if (filter.value === 'all') return true;
        
        const itemValue = item[filter.field];
        if (Array.isArray(itemValue)) {
          return itemValue.includes(filter.value);
        }
        return String(itemValue).toLowerCase() === filter.value.toLowerCase();
      });
    });
  }, [initialData, filters]);

  const addFilter = (field: string, value: string) => {
    setFilters(current => {
      const existing = current.findIndex(f => f.field === field);
      if (existing >= 0) {
        const newFilters = [...current];
        newFilters[existing] = { field, value };
        return newFilters;
      }
      return [...current, { field, value }];
    });
  };

  const clearFilters = () => setFilters([]);

  return { filteredData, addFilter, clearFilters, filters };
}
