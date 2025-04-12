'use client';

import {  useState  } from "react";
import {  useRouter  } from "next/navigation";
import {  Button  } from "@/components/ui/button";
import {  Input  } from "@/components/ui/input";
import {  Card  } from "@/components/ui/card";
import {  useTelegram  } from "@/lib/telegram";

export default function CreateProfilePage() {
  const router = useRouter();
  const { getUserId } = useTelegram();
  const [loading, setLoading] = useState(false);

  const handleCreateProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/profile/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telegramId: getUserId(),
          name: 'Admin', // Временное имя
          isAdmin: true
        }),
      });

      if (response.ok) {
        router.push('/cabinet');
      }
    } catch (error) {
      console.error('Error creating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto p-4">
      <Card className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Create Admin Profile</h1>
        <p className="text-muted-foreground">
          Create your admin profile to access the platform.
        </p>
        <Button 
          onClick={handleCreateProfile}
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Creating...' : 'Create Profile'}
        </Button>
      </Card>
    </div>
  );
}
