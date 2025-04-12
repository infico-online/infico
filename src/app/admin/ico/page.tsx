'use client';

import {  useState, useEffect  } from "react";
import {  useRouter  } from "next/navigation";
import {  Card  } from "@/components/ui/card";
import {  Button  } from "@/components/ui/button";
import {  
  Table, TableHeader, TableBody, TableRow, 
  TableHead, TableCell 
 } from '@/components/ui/table';
import {  Input  } from "@/components/ui/input";
import {  
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
 } from '@/components/ui/select';
import {  Loader2, Check, X, Search  } from "lucide-react";
import {  logger  } from "@/lib/logger";

const ICO_STATUSES = ['ALL', 'PENDING', 'ACTIVE', 'COMPLETED', 'REJECTED'];

interface ICO {
  id: string;
  name: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'REJECTED';
  totalAmount: number;
  raisedAmount: number;
  investors: number;
  createdAt: Date;
}

export default function AdminICOPage() {
  const router = useRouter();
  const [icos, setIcos] = useState<ICO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    const fetchICOs = async () => {
      try {
        const response = await fetch('/api/admin/ico');
        if (!response.ok) throw new Error('Failed to fetch ICOs');
        
        const data = await response.json();
        setIcos(data);
      } catch (error) {
        logger.error('AdminICO', 'Failed to fetch ICOs', error);
      } finally {
        setLoading(false);
      }
    };

    fetchICOs();
  }, []);

  const filteredIcos = icos.filter(ico => {
    const matchesSearch = ico.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || ico.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleRowClick = (icoId: string) => {
    router.push(`/admin/ico/${icoId}`);
  };

  const handleStatusChange = async (icoId: string, newStatus: 'ACTIVE' | 'REJECTED') => {
    try {
      const response = await fetch(`/api/admin/ico/${icoId}/${newStatus.toLowerCase()}`, {
        method: 'POST'
      });

      if (!response.ok) throw new Error('Failed to update ICO status');

      setIcos(prev => prev.map(ico => 
        ico.id === icoId ? { ...ico, status: newStatus } : ico
      ));

      logger.info('AdminICO', `ICO ${icoId} status changed to ${newStatus}`);
    } catch (error) {
      logger.error('AdminICO', 'Failed to update ICO status', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">ICO Management</h1>
        <Button onClick={() => window.location.reload()}>
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search ICOs..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {ICO_STATUSES.map(status => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ICO Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <h3 className="text-sm text-muted-foreground">Total ICOs</h3>
          <p className="text-2xl font-bold">{icos.length}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm text-muted-foreground">Active ICOs</h3>
          <p className="text-2xl font-bold">{icos.filter(ico => ico.status === 'ACTIVE').length}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm text-muted-foreground">Total Raised</h3>
          <p className="text-2xl font-bold">
            {icos.reduce((sum, ico) => sum + ico.raisedAmount, 0).toLocaleString()} INFICO
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm text-muted-foreground">Total Investors</h3>
          <p className="text-2xl font-bold">
            {icos.reduce((sum, ico) => sum + ico.investors, 0).toLocaleString()}
          </p>
        </Card>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Channel</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Raised</TableHead>
              <TableHead>Investors</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredIcos.map((ico) => (
              <TableRow 
                key={ico.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleRowClick(ico.id)}
              >
                <TableCell className="font-medium">{ico.name}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    ico.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                    ico.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    ico.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {ico.status}
                  </span>
                </TableCell>
                <TableCell>{ico.totalAmount.toLocaleString()} INFICO</TableCell>
                <TableCell>{ico.raisedAmount.toLocaleString()} INFICO</TableCell>
                <TableCell>{ico.investors}</TableCell>
                <TableCell>{new Date(ico.createdAt).toLocaleDateString()}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <div className="flex gap-2">
                    {ico.status === 'PENDING' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(ico.id, 'ACTIVE')}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(ico.id, 'REJECTED')}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
