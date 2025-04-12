'use client';

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import * as z from "zod";

import { Card } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { FormControl, FormField, FormItem, FormLabel, FormMessage,  } from "@/components/ui/form";

import { Input } from "@/components/ui/input";


const profileSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  telegram: z.string().min(5),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

function CompleteProfile() {
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
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Complete Your Profile</h2>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter email" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="telegram"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telegram</FormLabel>
              <FormControl>
                <Input placeholder="@username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Save Profile
        </Button>
      </form>
    </Card>
  );
}
