'use client';

import {  useState, useEffect  } from "react";
import {  Card  } from "@/components/ui/card";
import {  Button  } from "@/components/ui/button";
import {  Input  } from "@/components/ui/input";
import {  
  Camera, 
  Link, 
  Eye, 
  Download,
  TrendingUp,
  Users
 } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
 } from '@/components/ui/select';

interface WelcomeScreenStats {
  views: number;
  clicks: number;
  ctr: number;
  language: string;
}

export default function WelcomeScreenPage() {
  const [selectedLanguage, setSelectedLanguage] = useState('eng');
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [stats, setStats] = useState<WelcomeScreenStats | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchCurrentScreen();
  }, [selectedLanguage]);

  const fetchCurrentScreen = async () => {
    try {
      const response = await fetch(`/api/admin/welcome-screen?language=${selectedLanguage}`);
      const data = await response.json();
      setCurrentImage(data.imageUrl);
      setLinkUrl(data.linkUrl);
      setButtonText(data.buttonText);
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching welcome screen:', error);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('language', selectedLanguage);

    try {
      const response = await fetch('/api/admin/welcome-screen/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      setCurrentImage(data.imageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      await fetch('/api/admin/welcome-screen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: selectedLanguage,
          linkUrl,
          buttonText
        }),
      });
    } catch (error) {
      console.error('Error saving welcome screen:', error);
    }
  };

  const handlePreview = () => {
    window.open(`/admin/welcome-screen/preview?language=${selectedLanguage}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Welcome Screen</h1>
        
        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="eng">English</SelectItem>
            <SelectItem value="rus">Russian</SelectItem>
            <SelectItem value="spa">Spanish</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Current Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <h3 className="text-2xl font-bold mt-2">{stats.views}</h3>
              </div>
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Total Clicks</p>
                <h3 className="text-2xl font-bold mt-2">{stats.clicks}</h3>
              </div>
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">CTR</p>
                <h3 className="text-2xl font-bold mt-2">{stats.ctr}%</h3>
              </div>
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Current Image Preview */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Current Image</h2>
        {currentImage ? (
          <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src={currentImage} 
              alt="Welcome Screen"
              className="object-cover w-full h-full"
            />
          </div>
        ) : (
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">No image uploaded</p>
          </div>
        )}
      </Card>

      {/* Upload Section */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Upload New Image</h2>
        <p className="text-sm text-muted-foreground mb-4">Maximum size: 2MB</p>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            className="w-full"
            disabled={uploading}
            onClick={() => document.getElementById('image-upload')?.click()}
          >
            <Camera className="mr-2 h-4 w-4" />
            Select File
          </Button>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>
      </Card>

      {/* Link Settings */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Link Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">URL</label>
            <div className="flex mt-1.5">
              <span className="flex items-center px-3 rounded-l-md border border-r-0 bg-muted">
                <LinkIcon className="h-4 w-4" />
              </span>
              <Input
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="rounded-l-none"
                placeholder="Enter URL..."
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Button Text</label>
            <Input
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
              placeholder="Enter button text..."
            />
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          className="flex-1"
          onClick={handlePreview}
        >
          <Eye className="mr-2 h-4 w-4" />
          Preview
        </Button>

        <Button
          className="flex-1"
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </div>

      {/* Export Stats */}
      <Button 
        variant="outline" 
        className="w-full"
      >
        <Download className="mr-2 h-4 w-4" />
        Export Statistics
      </Button>
    </div>
  );
}
