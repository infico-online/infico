'use client';

import {  useState, useEffect  } from "react";
import {  Button  } from "@/components/ui/button";
import {  Card  } from "@/components/ui/card";

interface PreviewData {
  imageUrl: string;
  buttonText: string;
  linkUrl: string;
}

export default function WelcomeScreenPreview() {
  const [data, setData] = useState<PreviewData | null>(null);

  useEffect(() => {
    const language = new URLSearchParams(window.location.search).get('language') || 'eng';
    fetchPreview(language);
  }, []);

  const fetchPreview = async (language: string) => {
    try {
      const response = await fetch(`/api/admin/welcome-screen?language=${language}`);
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error('Error fetching preview:', error);
    }
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Card className="max-w-md mx-auto">
        <div className="relative aspect-[9/16] bg-white">
          {data.imageUrl && (
            <img 
              src={data.imageUrl}
              alt="Welcome Screen"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
            <Button 
              className="w-full"
              onClick={() => window.open(data.linkUrl, '_blank')}
            >
              {data.buttonText || 'Close'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
