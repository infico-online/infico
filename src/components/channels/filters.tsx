
import { Button } from "@/components/ui/button";


const topics = [
  "Crypto", "Tech", "Finance", "Education", "Entertainment",
  "Gaming", "News", "Sports", "Travel", "Art", "Music"
];

const types = [
  { id: "all", label: "All" },
  { id: "free", label: "Free" },
  { id: "premium", label: "Premium" }
];

function ChannelFilters({ activeFilters, onFilterChange }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">Topic</div>
        <div className="grid grid-cols-2 gap-2">
          {topics.map((topic) => (
            <Button
              key={topic}
              variant={activeFilters.topic === topic.toLowerCase() ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange("topic", topic.toLowerCase())}
              className="w-full"
            >
              {topic}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">Type</div>
        <div className="grid grid-cols-3 gap-2">
          {types.map((type) => (
            <Button
              key={type.id}
              variant={activeFilters.type === type.id ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange("type", type.id)}
              className="w-full"
            >
              {type.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
