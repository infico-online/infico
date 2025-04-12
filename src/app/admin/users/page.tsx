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
import {  
  Search, Shield, AlertTriangle, Lock, 
  Unlock, MoreVertical, Download 
 } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
 } from '@/components/ui/select';

interface User {
  id: string;
  username: string;
  telegramId: string;
  role: string;
  status: string;
  balance: number;
  lastActive: string;
  isVerified: boolean;
  isBanned: boolean;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId: string) => {
    try {
      await fetch(`/api/admin/users/${userId}/ban`, {
        method: 'POST'
      });
      await fetchUsers();
    } catch (error) {
      console.error('Error banning user:', error);
    }
  };

  const handleVerifyUser = async (userId: string) => {
    try {
      await fetch(`/api/admin/users/${userId}/verify`, {
        method: 'POST'
      });
      await fetchUsers();
    } catch (error) {
      console.error('Error verifying user:', error);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(search.toLowerCase()) ||
                         user.telegramId.includes(search);
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Users Management</h1>
        
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Users
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="moderator">Moderator</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="banned">Banned</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">@{user.username}</div>
                    <div className="text-sm text-muted-foreground">
                      {user.telegramId}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Shield className="mr-2 h-4 w-4 text-muted-foreground" />
                    {user.role}
                  </div>
                </TableCell>
                <TableCell>
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.status === 'active' ? 'bg-green-100 text-green-800' :
                    user.status === 'banned' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.status}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {user.balance.toLocaleString()} INFICO
                </TableCell>
                <TableCell>
                  {new Date(user.lastActive).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleVerifyUser(user.id)}
                    >
                      {user.isVerified ? (
                        <Shield className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      )}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleBanUser(user.id)}
                    >
                      {user.isBanned ? (
                        <Lock className="h-4 w-4 text-red-500" />
                      ) : (
                        <Unlock className="h-4 w-4" />
                      )}
                    </Button>
                    
                    <Button variant="outline" size="icon">
                      <MoreVertical className="h-4 w-4" />
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
