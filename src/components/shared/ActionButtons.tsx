import {  Button  } from "@/components/ui/button";

function ActionButtons() {
  return (
    <div className="px-4 pb-2 pt-2 border-t bg-background">
      <div className="grid grid-cols-3 gap-2">
        <Button className="w-full" size="lg">Create ICO</Button>
        <Button className="w-full" size="lg">Create Page</Button>
        <Button className="w-full" size="lg">Start Invest</Button>
      </div>
    </div>
  );
}
