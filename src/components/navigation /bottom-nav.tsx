
import {  Button  } from "@/components/ui/button";

function BottomNav() {
  return (
    <div className="px-4 py-2 border-t">
      <div className="flex justify-between">
        <Button
          variant="ghost"
          className="flex-col gap-1 h-auto py-2 text-xs"
        >
          Home
        </Button>
        <Button
          variant="ghost"
          className="flex-col gap-1 h-auto py-2 text-xs"
        >
          Cabinet
        </Button>
        <Button
          variant="ghost"
          className="flex-col gap-1 h-auto py-2 text-xs"
        >
          Channels
        </Button>
        <Button
          variant="ghost"
          className="flex-col gap-1 h-auto py-2 text-xs"
        >
          More
        </Button>
      </div>
    </div>
  );
}
