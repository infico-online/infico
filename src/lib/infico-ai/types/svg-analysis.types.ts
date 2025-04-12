export interface DesignSystemAnalysis {
  components: Record<string, {
    name: string;
    type: string;
    complexity: string;
    interactions: string[];
    colors: string[];
    layout: {
      width: number;
      height: number;
      sections: string[];
    };
  }>;
  flows: Record<string, {
    name: string;
    steps: string[];
    interactions: string[];
  }>;
  screens?: Record<string, any>;
  styles?: {
    colors: string[];
  };
  themes?: Record<string, any>;
  palette: string[];
  complexity: {
    total: number;
    average: number;
  };
}

export type PartialDesignSystemAnalysis = Partial<DesignSystemAnalysis>;
