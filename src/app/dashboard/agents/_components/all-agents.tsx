'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { DEFAULT_PAGE } from '@/constants';
import { useAgentsFilters } from '@/data/agents/use-agents-filters';
import { useTRPC } from '@/trpc/client';
import { columns } from './columns';
import { DataPagination } from './data-pagination';
import { DataTable } from './data-table';
import { AgentsSearchFilter } from './search-filter';

export const AllAgents = () => {
  const router = useRouter();
  const [filters, setFilters] = useAgentsFilters();
  const isAnyFilterModified = !!filters.search;
  const onClearFilters = () =>
    setFilters({
      search: '',
      page: DEFAULT_PAGE,
    });

  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.agents.getMany.queryOptions({ ...filters })
  );
  return (
    <div className="my-4">
      <div className="mb-2 flex items-center gap-x-2">
        <AgentsSearchFilter />
        {isAnyFilterModified && (
          <Button onClick={onClearFilters} size="sm" variant="outline">
            <XCircle /> Clear
          </Button>
        )}
      </div>
      <DataTable
        columns={columns}
        data={data.items}
        onRowClick={(row) => router.push(`/dashboard/agents/${row.id}`)}
      />
      <DataPagination
        onPageChange={(page) => setFilters({ page })}
        page={filters.page}
        totalPages={data.totalPages}
      />
    </div>
  );
};
