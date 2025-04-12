'use client';

import { Button } from "@/components/ui/button";
import { Plus, Settings } from "lucide-react";

export function ActionButtons() {
  return (
    <div className="flex gap-2 px-4 py-2">
      <Button className="flex-1" variant="outline">
        <Plus className="w-4 h-4 mr-2" />
        Add New
      </Button>
      <Button className="flex-1" variant="outline">
        <Settings className="w-4 h-4 mr-2" />
        Settings
      </Button>
    </div>
  );
}
