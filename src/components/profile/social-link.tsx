'use client';

import {  Button  } from "@/components/ui/button";
import {  Input  } from "@/components/ui/input";
import {  Trash2, Edit2, CheckCircle  } from "lucide-react";

interface SocialLinkProps {
  platform: string;
  username: string;
  isVerified?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onVerify: () => void;
}

function SocialLink({
  platform,
  username,
  isVerified,
  onEdit,
  onDelete,
  onVerify
}: SocialLinkProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Input value={username} readOnly />
        <div className="flex gap-1">
          <Button size="icon" variant="outline" onClick={onEdit}>
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="destructive" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {!isVerified && (
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full" 
          onClick={onVerify}
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Verify {platform}
        </Button>
      )}
    </div>
  );
}
