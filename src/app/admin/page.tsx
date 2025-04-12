'use client';

import { prisma } from "@/lib/prisma";
import { useCallback } from "react";
import { AdvertisementStatus, ICOStatus } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPage() {
  const loadStats = useCallback(async () => {
    try {
      const [users, activeICOs, activeAds] = await Promise.all([
        prisma.profile.count(),
        prisma.iCO.count({
          where: { status: ICOStatus.ACTIVE }
        }),
        prisma.advertisement.count({
          where: { status: AdvertisementStatus.ACTIVE }
        })
      ]);

      return { users, activeICOs, activeAds };
    } catch (error) {
      console.error('Error loading stats:', error);
      return null;
    }
  }, []);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">Loading...</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active ICOs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">Loading...</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Ads</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">Loading...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
