'use client';

import {  useState, useEffect  } from "react";
import {  
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
 } from '@/components/ui/table';
import {  Card  } from "@/components/ui/card";
import {  Button  } from "@/components/ui/button";
import {  Input  } from "@/components/ui/input";
import {  
  Shield, 
  AlertTriangle, 
  Lock,
  UserX,
  ActivitySquare,
  Search,
  Globe,
  RefreshCcw
 } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
 } from '@/components/ui/select';

interface SecurityEvent {
  id: string;
  type: 'login' | 'transaction' | 'api' | 'admin';
  severity: 'low' | 'medium' | 'high';
  ip: string;
  userAgent: string;
  userId?: string;
  description: string;
  createdAt: string;
}

interface BlockedIP {
  ip: string;
  reason: string;
  createdAt: string;
  attempts: number;
}

export default function SecurityPage() {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [blockedIPs, setBlockedIPs] = useState<BlockedIP[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const fetchSecurityData = async () => {
    try {
      const [eventsResponse, blocklistResponse] = await Promise.all([
        fetch('/api/admin/security/activity'),
        fetch('/api/admin/security/blocklist')
      ]);

      const [eventsData, blocklistData] = await Promise.all([
        eventsResponse.json(),
        blocklistResponse.json()
      ]);

      setEvents(eventsData);
      setBlockedIPs(blocklistData);
    } catch (error) {
      console.error('Error fetching security data: ' as unknown as Prisma.InputJsonValue, error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockIP = async (ip: string) => {
    try {
      await fetch('/api/admin/security/blocklist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ip }),
      });
      await fetchSecurityData();
    } catch (error) {
      console.error('Error blocking IP:', error);
    }
  };

  const handleUnblockIP = async (ip: string) => {
    try {
      await fetch(`/api/admin/security/blocklist/${ip}`, {
        method: 'DELETE',
      });
      await fetchSecurityData();
    } catch (error) {
      console.error('Error unblocking IP:', error);
    }
  };

  const SecurityStats = () => (
    <div className="grid grid-cols-4 gap-6 mb-6">
      <Card className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Threats Blocked</p>
            <h3 className="text-2xl font-bold mt-2">1,234</h3>
          </div>
          <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
            <Shield className="h-5 w-5 text-red-600" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Blocked IPs</p>
            <h3 className="text-2xl font-bold mt-2">{blockedIPs.length}</h3>
          </div>
          <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
            <Globe className="h-5 w-5 text-orange-600" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Active Sessions</p>
            <h3 className="text-2xl font-bold mt-2">456</h3>
          </div>
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <ActivitySquare className="h-5 w-5 text-blue-600" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Failed Logins</p>
            <h3 className="text-2xl font-bold mt-2">89</h3>
          </div>
          <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
            <UserX className="h-5 w-5 text-yellow-600" />
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Security Center</h1>
        <Button onClick={fetchSecurityData}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <SecurityStats />

      {/* Suspicious Activity Log */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Security Events</h2>
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="relative overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Timestamp</TableHead>
                <TableHead className="w-[100px]">Severity</TableHead>
                <TableHead className="w-[150px]">IP Address</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    {new Date(event.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${event.severity === 'high' ? 'bg-red-100 text-red-800' :
                        event.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'}`}>
                      {event.severity}
                    </div>
                  </TableCell>
                  <TableCell>{event.ip}</TableCell>
                  <TableCell>{event.description}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBlockIP(event.ip)}
                    >
                      <Lock className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Blocked IPs */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-6">Blocked IPs</h2>
        <div className="relative overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>IP Address</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Blocked At</TableHead>
                <TableHead>Failed Attempts</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blockedIPs.map((ip) => (
                <TableRow key={ip.ip}>
                  <TableCell>{ip.ip}</TableCell>
                  <TableCell>{ip.reason}</TableCell>
                  <TableCell>
                    {new Date(ip.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>{ip.attempts}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUnblockIP(ip.ip)}
                    >
                      <Lock className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
