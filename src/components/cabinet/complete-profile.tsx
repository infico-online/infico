'use client';

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import * as z from "zod";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { FormControl, FormField, FormItem, FormLabel, FormMessage,  } from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";

const profileSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  telegram: z.string().min(5),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export interface CompleteProfileProps {
  telegramId?: string;
  isVerified?: boolean;
}

export function CompleteProfile({ telegramId, isVerified = false }: CompleteProfileProps) {
  const router = useRouter();

  const handleCreateProfile = () => {
    router.push('/profile/create');
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
      email: "",
      telegram: "",
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    try {
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      // Обработка успешного обновления
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Завершите ваш профиль</CardTitle>
        <CardDescription>
          Для полного доступа к функциям платформы необходимо создать профиль.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2 text-sm">
          <div className="flex justify-between">
            <span>ID Telegram:</span>
            <span className="font-medium">{telegramId || 'Не определено'}</span>
          </div>
          <div className="flex justify-between">
            <span>Статус верификации:</span>
            <span className={isVerified ? 'text-green-500' : 'text-yellow-500'}>
              {isVerified ? 'Верифицирован' : 'Не верифицирован'}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleCreateProfile}>
          <UserPlus className="mr-2 h-4 w-4" />
          Создать профиль
        </Button>
      </CardFooter>
    </Card>
  );
}
