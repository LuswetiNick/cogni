import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAgentsFilters } from '@/data/agents/use-agents-filters';

export const AgentsSearchFilter = () => {
  const [filters, setFilters] = useAgentsFilters();
  return (
    <div className="relative">
      <Input
        className="h-8 w-[200px] pl-6"
        onChange={(e) => setFilters({ search: e.target.value })}
        placeholder="Filter by name"
        value={filters.search}
      />
      <Search className="-translate-y-1/2 absolute top-1/2 left-2 size-4 text-muted-foreground" />
    </div>
  );
};
