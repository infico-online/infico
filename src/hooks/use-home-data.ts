'use client';

import { useState, useEffect } from "react";

export interface HomeData {
  icos: Array<{
    title: string;
    line1: string;
    line2?: string;
    line3?: string;
    line4?: string;
    badges?: Array<{ text: string; variant?: 'default' | 'secondary' | 'destructive' | 'outline' }>;
  }>;
  investors: Array<{
    title: string;
    line1: string;
    line2?: string;
    line3?: string;
    line4?: string;
    badges?: Array<{ text: string; variant?: 'default' | 'secondary' | 'destructive' | 'outline' }>;
  }>;
  pages: Array<{
    title: string;
    line1: string;
    line2?: string;
    line3?: string;
    line4?: string;
    badges?: Array<{ text: string; variant?: 'default' | 'secondary' | 'destructive' | 'outline' }>;
  }>;
  channels: Array<{
    title: string;
    line1: string;
    line2?: string;
    line3?: string;
    line4?: string;
    badges?: Array<{ text: string; variant?: 'default' | 'secondary' | 'destructive' | 'outline' }>;
  }>;
}

export function useHomeData() {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}
