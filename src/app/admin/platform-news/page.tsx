'use client';

import {  useState  } from "react";
import {  Card  } from "@/components/ui/card";
import {  Button  } from "@/components/ui/button";
import {  Input  } from "@/components/ui/input";
import {  Textarea  } from "@/components/ui/textarea";
import {  Checkbox  } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
 } from '@/components/ui/select';
import {  Eye, Send  } from "lucide-react";

export default function PlatformNewsPage() {
  const [newsType, setNewsType] = useState('update');
  const [language, setLanguage] = useState('eng');
  const [audience, setAudience] = useState('all');
  const [region, setRegion] = useState('worldwide');
  const [distribution, setDistribution] = useState({
    app: true,
    bot: true,
    banner: true
  });

  const [message, setMessage] = useState('');
  const [buttonText, setButtonText] = useState('Close');

  const handlePreview = () => {
    // Реализация предпросмотра
  };

  const handleSend = async () => {
    try {
      const response = await fetch('/api/admin/platform-news/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: newsType,
          language,
          audience,
          region,
          distribution,
          message,
          buttonText
        }),
      });

      if (!response.ok) throw new Error('Failed to send news');
      
      // Обработка успешной отправки
    } catch (error) {
      console.error('Error sending news:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Platform News</h1>
      </div>

      {/* News Type & Language */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <label className="text-sm text-muted-foreground">News Type</label>
          <Select value={newsType} onValueChange={setNewsType}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="update">Platform Update</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="announcement">Announcement</SelectItem>
            </SelectContent>
          </Select>
        </Card>

        <Card className="p-4">
          <label className="text-sm text-muted-foreground">Language</label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="eng">English</SelectItem>
              <SelectItem value="rus">Russian</SelectItem>
              <SelectItem value="spa">Spanish</SelectItem>
            </SelectContent>
          </Select>
        </Card>
      </div>

      {/* Target Audience & Region */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <label className="text-sm text-muted-foreground">Target Audience</label>
          <Select value={audience} onValueChange={setAudience}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select audience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="investors">Investors</SelectItem>
              <SelectItem value="channels">Channel Owners</SelectItem>
            </SelectContent>
          </Select>
        </Card>

        <Card className="p-4">
          <label className="text-sm text-muted-foreground">Region</label>
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="worldwide">Worldwide</SelectItem>
              <SelectItem value="europe">Europe</SelectItem>
              <SelectItem value="asia">Asia</SelectItem>
            </SelectContent>
          </Select>
        </Card>
      </div>

      {/* Distribution Methods */}
      <Card className="p-4">
        <label className="text-sm text-muted-foreground">Distribution:</label>
        <div className="mt-2 space-x-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="app"
              checked={distribution.app}
              onCheckedChange={(checked) => 
                setDistribution(prev => ({...prev, app: !!checked}))}
            />
            <label htmlFor="app">App</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="bot"
              checked={distribution.bot}
              onCheckedChange={(checked) => 
                setDistribution(prev => ({...prev, bot: !!checked}))}
            />
            <label htmlFor="bot">Bot</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="banner"
              checked={distribution.banner}
              onCheckedChange={(checked) => 
                setDistribution(prev => ({...prev, banner: !!checked}))}
            />
            <label htmlFor="banner">Banner</label>
          </div>
        </div>
      </Card>

      {/* Message Content */}
      <Card className="p-4">
        <label className="text-sm text-muted-foreground">Message:</label>
        <Textarea 
          className="mt-2"
          placeholder="Enter message text..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
        />
      </Card>

      {/* Banner Button Text */}
      <Card className="p-4">
        <label className="text-sm text-muted-foreground">Banner Button Text:</label>
        <Input 
          className="mt-2"
          placeholder="Close"
          value={buttonText}
          onChange={(e) => setButtonText(e.target.value)}
        />
      </Card>

      {/* Preview & Send Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Button 
          variant="outline" 
          onClick={handlePreview}
          className="w-full"
        >
          <Eye className="mr-2 h-4 w-4" />
          Preview
        </Button>
        
        <Button 
          onClick={handleSend}
          className="w-full"
        >
          <Send className="mr-2 h-4 w-4" />
          Send Now
        </Button>
      </div>
    </div>
  );
}
