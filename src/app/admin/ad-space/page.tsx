'use client';

import {  useState, useEffect  } from "react";
import {  Card  } from "@/components/ui/card";
import {  Button  } from "@/components/ui/button";
import {  Input  } from "@/components/ui/input";
import {  
  Upload,
  Link,
  Eye,
  TrendingUp,
  UserCheck,
  Activity,
  ArrowUpRight
 } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
 } from '@/components/ui/select';

interface AdStats {
  views: number;
  clicks: number;
  ctr: number;
  activeUsers: number;
  status: 'active' | 'inactive';
}

export default function AdSpacePage() {
  const [selectedLanguage, setSelectedLanguage] = useState('eng');
  const [currentAd, setCurrentAd] = useState<{
    imageUrl: string | null;
    linkUrl: string;
  }>({ imageUrl: null, linkUrl: '' });
  const [stats, setStats] = useState<AdStats | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchCurrentAd();
  }, [selectedLanguage]);

  const fetchCurrentAd = async () => {
    try {
      const response = await fetch(`/api/admin/ad-space?language=${selectedLanguage}`);
      const data = await response.json();
      setCurrentAd(data.ad);
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching ad:', error);
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
      const response = await fetch('/api/admin/ad-space/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setCurrentAd(prev => ({ ...prev, imageUrl: data.imageUrl }));
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      await fetch('/api/admin/ad-space', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: selectedLanguage,
          ...currentAd
        }),
      });
    } catch (error) {
      console.error('Error saving ad:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Ad Space</h1>
        
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

      {/* Current Ad Stats */}
      {stats && (
        <div className="grid grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Views</p>
                <h3 className="text-2xl font-bold mt-2">{stats.views}</h3>
              </div>
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Eye className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Clicks</p>
                <h3 className="text-2xl font-bold mt-2">{stats.clicks}</h3>
              </div>
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">CTR</p>
                <h3 className="text-2xl font-bold mt-2">{stats.ctr}%</h3>
              </div>
              <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Activity className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <h3 className="text-2xl font-bold mt-2">{stats.activeUsers}</h3>
              </div>
              <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Current Ad Preview */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Current Ad</h2>
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${stats?.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`} />
            <span className="text-sm text-muted-foreground">
              {stats?.status === 'active' ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        {currentAd.imageUrl ? (
          <div className="relative aspect-[21/9] bg-gray-100 rounded-lg overflow-hidden mb-4">
            <img 
              src={currentAd.imageUrl} 
              alt="Advertisement"
              className="object-cover w-full h-full"
            />
          </div>
        ) : (
          <div className="aspect-[21/9] bg-gray-100 rounded-lg flex items-center justify-center mb-4">
            <p className="text-muted-foreground">No ad image</p>
          </div>
        )}

        <div className="flex items-center gap-2">
          <LinkIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{currentAd.linkUrl || 'No link set'}</span>
        </div>
      </Card>

      {/* Upload New Ad */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Upload New Ad</h2>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">Ad Image</label>
            <Button 
              variant="outline" 
              className="w-full mt-1.5"
              disabled={uploading}
              onClick={() => document.getElementById('ad-image')?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? 'Uploading...' : 'Select Image'}
            </Button>
            <input
              id="ad-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Link URL</label>
            <Input
              value={currentAd.linkUrl}
              onChange={(e) => setCurrentAd(prev => ({ ...prev, linkUrl: e.target.value }))}
              placeholder="Enter URL..."
              className="mt-1.5"
            />
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => window.open(currentAd.imageUrl || '', '_blank')}
          disabled={!currentAd.imageUrl}
        >
          <Eye className="mr-2 h-4 w-4" />
          Preview
        </Button>

        <Button
          className="flex-1"
          onClick={handleSave}
        >
          Upload and Activate
        </Button>
      </div>
    </div>
  );
}
