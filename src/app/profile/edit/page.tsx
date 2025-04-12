'use client';

import {  useState  } from "react";
import {  NavigationHeader  } from "@/components/shared/navigation-header";
import {  PhotoUpload  } from "@/components/profile/photo-upload";
import {  SocialLink  } from "@/components/profile/social-link";
import {  Button  } from "@/components/ui/button";
import {  Input  } from "@/components/ui/input";
import {  Select, SelectContent, SelectItem, SelectTrigger, SelectValue  } from "@/components/ui/select";
import {  Textarea  } from "@/components/ui/textarea";
import {  Camera, Trash2  } from "lucide-react";
import {  useRouter  } from "next/navigation";

export default function EditProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState({
    name: 'John Doe',
    bio: 'Tech enthusiast and content creator',
    age: '25',
    gender: 'male',
    country: 'USA',
    city: 'New York',
    language: 'en',
    category: 'tech',
    youtube: '@techChannel',
    twitter: '@john_tech',
    instagram: '@john.tech'
  });

  return (
    <div className="p-3 space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Edit Profile</h1>
      </div>

      {/* Фото и фон */}
      <div className="grid grid-cols-2 gap-2">
        <div className="aspect-square rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center">
          <Camera className="h-5 w-5 text-gray-400" />
          <span className="text-xs text-gray-400">Change Photo</span>
        </div>
        <div className="aspect-square rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center">
          <Camera className="h-5 w-5 text-gray-400" />
          <span className="text-xs text-gray-400">Change Background</span>
        </div>
      </div>

      {/* Форма */}
      <div className="space-y-3">
        <Input 
          value={profile.name}
          onChange={e => setProfile({...profile, name: e.target.value})}
        />

        <div className="grid grid-cols-2 gap-2">
          <Select value={profile.age}>
            <SelectTrigger>
              <SelectValue placeholder="Age" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({length: 83}, (_, i) => i + 18).map(age => (
                <SelectItem key={age} value={age.toString()}>{age}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={profile.gender}>
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

        <Textarea 
          value={profile.bio}
          onChange={e => setProfile({...profile, bio: e.target.value})}
          className="min-h-[100px]"
        />

        {/* Социальные сети */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Input value={profile.youtube} readOnly />
            <Button size="icon" variant="destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Input value={profile.twitter} readOnly />
            <Button size="icon" variant="destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Input value={profile.instagram} readOnly />
            <Button size="icon" variant="destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Кнопки */}
      <div className="space-y-2">
        <Button className="w-full" onClick={() => router.push('/cabinet')}>
          Save Changes
        </Button>
        <Button variant="outline" className="w-full" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
