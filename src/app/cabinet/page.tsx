'use client';

import {  useEffect, useState  } from "react";
import {  Card  } from "@/components/ui/card";
import {  Button  } from "@/components/ui/button";
import {  useRouter  } from "next/navigation";
import {  useTelegram  } from "@/lib/telegram";
import {  logger  } from "@/lib/logger";

export default function CabinetPage() {
  const router = useRouter();
  const { getUserId } = useTelegram();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = getUserId();
        logger.info('CabinetPage', 'Fetching profile', { userId });

        const response = await fetch(`/api/profile?userId=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch profile');

        const data = await response.json();
        setProfile(data);
      } catch (error) {
        logger.error('CabinetPage', 'Error fetching profile', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [getUserId]);

  if (loading) return <div className="p-4">Loading...</div>;

  if (!profile) {
    return (
      <div className="p-4 space-y-4">
        <h1 className="text-2xl font-bold">Welcome to INFICO</h1>
        <p>Create your profile to start.</p>
        <Button onClick={() => router.push('/create-profile')}>
          Create Profile
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <Card className="p-4">
        <h2 className="text-xl font-bold mb-2">{profile.name}</h2>
        <div className="space-y-2">
          <div>Balance: {profile.tokens?.availableToWithdraw || 0} INFICO</div>
          <div>ICO Limit: {profile.tokens?.icoLimit || 0} INFICO</div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-2">
        <Button onClick={() => router.push('/cabinet/buy')}>Buy Tokens</Button>
        <Button onClick={() => router.push('/cabinet/withdraw')}>Withdraw</Button>
      </div>
    </div>
  );
}
