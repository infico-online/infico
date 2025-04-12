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
import {  Input  } from "@/components/ui/input";
import {  Button  } from "@/components/ui/button";
import {  Card  } from "@/components/ui/card";
import {  
  Search, CheckCircle, XCircle, AlertTriangle,
  Users, Eye, ArrowUpRight, Download 
 } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
 } from '@/components/ui/select';
import {  logger  } from "@/lib/logger";

interface Channel {
  id: string;
  username: string;
  name: string;
  category: string;
  language: string;
  followers: number;
  postsPerDay: number;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  owner: {
    username: string;
    telegramId: string;
  };
  hasICO: boolean;
  isPremium: boolean;
  growth: number;
}

export default function ChannelsPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    try {
      const response = await fetch('/api/admin/channels');
      if (!response.ok) throw new Error('Failed to fetch channels');
      const data = await response.json();
      setChannels(data);
      logger.info('ChannelsAdmin', 'Channels fetched successfully', { count: data.length });
    } catch (error) {
      logger.error('ChannelsAdmin', 'Error fetching channels', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyChannel = async (channelId: string) => {
    try {
      const response = await fetch(`/api/admin/channels/${channelId}/verify`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Failed to verify channel');
      await fetchChannels();
      logger.info('ChannelsAdmin', 'Channel verified successfully', { channelId });
    } catch (error) {
      logger.error('ChannelsAdmin', 'Error verifying channel', error);
    }
  };

  const handleRejectChannel = async (channelId: string) => {
    try {
      const response = await fetch(`/api/admin/channels/${channelId}/reject`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Failed to reject channel');
      await fetchChannels();
      logger.info('ChannelsAdmin', 'Channel rejected successfully', { channelId });
    } catch (error) {
      logger.error('ChannelsAdmin', 'Error rejecting channel', error);
    }
  };

  // Статистика по каналам
  const Stats = () => (
    <div className="grid grid-cols-4 gap-6 mb-6">
      <Card className="p-6">
        <h3 className="text-sm font-medium text-muted-foreground">Total Channels</h3>
        <p className="text-2xl font-bold mt-2">
          {channels.length}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {channels.filter(c => c.status === 'PENDING').length} pending verification
        </p>
      </Card>

      <Card className="p-6">
        <h3 className="text-sm font-medium text-muted-foreground">Premium Channels</h3>
        <p className="text-2xl font-bold mt-2">
          {channels.filter(c => c.isPremium).length}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {Math.round((channels.filter(c => c.isPremium).length / channels.length) * 100)}% of total
        </p>
      </Card>

      <Card className="p-6">
        <h3 className="text-sm font-medium text-muted-foreground">Total Followers</h3>
        <p className="text-2xl font-bold mt-2">
          {channels.reduce((sum, c) => sum + c.followers, 0).toLocaleString()}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Across all channels
        </p>
      </Card>

      <Card className="p-6">
        <h3 className="text-sm font-medium text-muted-foreground">Active ICOs</h3>
        <p className="text-2xl font-bold mt-2">
          {channels.filter(c => c.hasICO).length}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          On verified channels
        </p>
      </Card>
    </div>
  );

  const filteredChannels = channels.filter(channel => {
    const matchesSearch = 
      channel.name.toLowerCase().includes(search.toLowerCase()) ||
      channel.owner.username.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || channel.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || channel.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Channel Management</h1>
        
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <Stats />

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search channels..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="crypto">Crypto</SelectItem>
            <SelectItem value="tech">Tech</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
            <SelectItem value="education">Education</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="VERIFIED">Verified</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Channel/Owner</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Followers</TableHead>
              <TableHead>Growth</TableHead>
              <TableHead>Posts/Day</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredChannels.map((channel) => (
              <TableRow key={channel.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{channel.name}</div>
                    <div className="text-sm text-muted-foreground">
                      @{channel.owner.username}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    channel.status === 'VERIFIED' ? 'bg-green-100 text-green-800' :
                    channel.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {channel.status}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {channel.category} • {channel.language}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    {channel.followers.toLocaleString()}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-green-600">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    {channel.growth}%
                  </div>
                </TableCell>
                <TableCell>
                  {channel.postsPerDay}
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    {channel.status === 'PENDING' && (
                      <>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleVerifyChannel(channel.id)}
                        >
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleRejectChannel(channel.id)}
                        >
                          <XCircle className="h-4 w-4 text-red-500" />
                        </Button>
                      </>
                    )}
                    
                    <Button variant="outline" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
