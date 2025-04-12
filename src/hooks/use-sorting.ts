import {  useState, useMemo  } from "react";
import {  SortConfig  } from "@/types";

function useSorting<T extends Record<string, any>>(
  initialData: T[],
  initialConfig: SortConfig<T>
) {
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>(initialConfig);

  const sortedData = useMemo(() => {
    const sorted = [...initialData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === bValue) return 0;
      
      const comparison = aValue < bValue ? -1 : 1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [initialData, sortConfig]);

  const updateSort = (key: keyof T) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return { sortedData, updateSort, sortConfig };
}
