'use client';

import {  useState, useEffect  } from "react";
import {  useRouter  } from "next/navigation";
import {  Card  } from "@/components/ui/card";
import {  Button  } from "@/components/ui/button";
import {  
  Users, Wallet, Clock, TrendingUp, ArrowLeft,
  Shield, BarChart 
 } from 'lucide-react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
 } from '@/components/ui/table';
import {  IcoStats  } from "@/components/admin/ico/IcoStats";
import {  IcoInvestors  } from "@/components/admin/ico/IcoInvestors";
import {  IcoChart  } from "@/components/admin/ico/IcoChart";
import {  logger  } from "@/lib/logger";

interface ICODetail {
  id: string;
  name: string;
  status: string;
  totalAmount: number;
  raisedAmount: number;
  investors: number;
  createdAt: Date;
  owner: {
    name: string;
    isVerified: boolean;
  };
  transactions: {
    id: string;
    type: string;
    amount: number;
    createdAt: Date;
    investor: {
      name: string;
    };
  }[];
  dailyStats: {
    date: string;
    amount: number;
    investors: number;
  }[];
}

export default function ICODetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [ico, setIco] = useState<ICODetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchICODetails = async () => {
      try {
        const response = await fetch(`/api/admin/ico/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch ICO details');
        
        const data = await response.json();
        setIco(data);
      } catch (error) {
        logger.error('ICODetail', 'Failed to fetch ICO details', error);
      } finally {
        setLoading(false);
      }
    };

    fetchICODetails();
  }, [params.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!ico) {
    return <div>ICO not found</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">{ico.name} ICO Details</h1>
          <span className={`px-3 py-1 rounded-full text-sm ${
            ico.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
            ico.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
            ico.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
            'bg-red-100 text-red-800'
          }`}>
            {ico.status}
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 space-y-2">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-blue-500" />
            <h3 className="font-medium">Total Amount</h3>
          </div>
          <p className="text-2xl font-bold">{ico.totalAmount.toLocaleString()} INFICO</p>
          <p className="text-sm text-muted-foreground">
            Target amount for this ICO
          </p>
        </Card>

        <Card className="p-6 space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <h3 className="font-medium">Raised Amount</h3>
          </div>
          <p className="text-2xl font-bold">{ico.raisedAmount.toLocaleString()} INFICO</p>
          <p className="text-sm text-muted-foreground">
            {((ico.raisedAmount / ico.totalAmount) * 100).toFixed(1)}% of target
          </p>
        </Card>

        <Card className="p-6 space-y-2">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-500" />
            <h3 className="font-medium">Total Investors</h3>
          </div>
          <p className="text-2xl font-bold">{ico.investors}</p>
          <p className="text-sm text-muted-foreground">
            Active investors in this ICO
          </p>
        </Card>
      </div>

      {/* Charts & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-medium mb-4">Investment Progress</h3>
          <IcoChart data={ico.dailyStats} />
        </Card>

        <Card className="p-6">
          <h3 className="font-medium mb-4">Statistics</h3>
          <IcoStats ico={ico} />
        </Card>
      </div>

      {/* Investors Table */}
      <Card className="p-6">
        <h3 className="font-medium mb-4">Recent Investments</h3>
        <IcoInvestors transactions={ico.transactions} />
      </Card>
    </div>
  );
}
