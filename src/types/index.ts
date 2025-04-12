export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterSection {
  title: string;
  options: FilterOption[];
  columns: number;
}

export interface ICO {
  id: string;
  channelName: string;
  rate: number;
  term: number;
  raised: number;
  goal: number;
  progress: number;
  language: string;
  category: string;
  investors: number;
  isPremium?: boolean;
  isAngel?: boolean;
}

export interface Investor {
  id: string;
  name: string;
  invested: string;
  investedAmount: number;
  activeIcos: number;
  profit: string;
  isWhale?: boolean;
  isAngel?: boolean;
  interests: string[];
  language: string;
}

export interface Channel {
  id: string;
  name: string;
  category: string;
  language: string;
  followers: string;
  followersCount: number;
  growth: number;
  postsPerDay: number;
  hasIco: boolean;
  isPremium?: boolean;
  isAngel?: boolean;
}

export interface Page {
  id: string;
  name: string;
  category: string;
  language: string;
  views: string;
  viewsCount: number;
  growth: number;
  subscribers: string;
  hasIco: boolean;
  isPremium?: boolean;
  isAngel?: boolean;
}

export interface SortConfig<T> {
  key: keyof T;
  direction: 'asc' | 'desc';
}

export interface FilterState {
  field: string;
  value: string;
}

export interface FilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sections: FilterSection[];
  activeFilters: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
}

export interface CardProps<T> {
  data: T; as Prisma.InputJsonValue
}
