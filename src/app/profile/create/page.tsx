'use client';

import {  useState  } from "react";
import {  useRouter  } from "next/navigation";
import {  useTelegram  } from "@/lib/telegram";
import {  NavigationHeader  } from "@/components/shared/navigation-header";
import {  Button  } from "@/components/ui/button";
import {  Input  } from "@/components/ui/input";
import {  Select, SelectContent, SelectItem, SelectTrigger, SelectValue  } from "@/components/ui/select";
import {  Textarea  } from "@/components/ui/textarea";
import {  logger  } from "@/lib/logger";

const DEFAULT_FORM_DATA = {
  name: '',
  age: '',
  gender: '',
  country: '',
  city: '',
  language: '',
  category: '',
  bio: '',
  walletTon: '',
  walletUsdt: ''
};

export default function CreateProfilePage() {
  const router = useRouter();
  const { webApp, getUserId } = useTelegram();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const telegramId = getUserId();
    if (!telegramId) {
      setError('Telegram ID not found');
      setLoading(false);
      return;
    }

    try {
      logger.info('CreateProfile', 'Submitting profile', { telegramId, ...formData });

      const response = await fetch('/api/profile/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegramId,
          ...formData
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create profile');
      }

      const result = await response.json();
      logger.info('CreateProfile', 'Profile created successfully', result);

      router.push('/cabinet');
    } catch (err) {
      logger.error('CreateProfile', 'Error creating profile', err);
      setError('Failed to create profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-4">
      <NavigationHeader title="Create Profile" />
      
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div className="space-y-2">
          <Input 
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />

          <div className="grid grid-cols-2 gap-2">
            <Select 
              value={formData.age}
              onValueChange={(value) => setFormData(prev => ({ ...prev, age: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Age" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({length: 83}, (_, i) => i + 18).map(age => (
                  <SelectItem key={age} value={age.toString()}>{age}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={formData.gender}
              onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Select 
              value={formData.country}
              onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usa">USA</SelectItem>
                <SelectItem value="uk">UK</SelectItem>
                <SelectItem value="russia">Russia</SelectItem>
                {/* Add more countries */}
              </SelectContent>
            </Select>

            <Input 
              placeholder="City"
              value={formData.city}
              onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Select 
              value={formData.language}
              onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="russian">Russian</SelectItem>
                {/* Add more languages */}
              </SelectContent>
            </Select>

            <Select 
              value={formData.category}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="crypto">Crypto</SelectItem>
                <SelectItem value="tech">Tech</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                {/* Add more categories */}
              </SelectContent>
            </Select>
          </div>

          <Textarea 
            placeholder="Tell about yourself..."
            value={formData.bio}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            className="min-h-[100px]"
          />

          <Input 
            placeholder="TON Wallet Address"
            value={formData.walletTon}
            onChange={(e) => setFormData(prev => ({ ...prev, walletTon: e.target.value }))}
          />

          <Input 
            placeholder="USDT Wallet Address"
            value={formData.walletUsdt}
            onChange={(e) => setFormData(prev => ({ ...prev, walletUsdt: e.target.value }))}
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm py-2">
            {error}
          </div>
        )}

        <div className="pt-4">
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? 'Creating Profile...' : 'Create Profile'}
          </Button>
        </div>
      </form>
    </div>
  );
}
