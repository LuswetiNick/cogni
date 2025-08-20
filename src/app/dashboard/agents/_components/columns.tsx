'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { CornerDownRight, Video } from 'lucide-react';
import { GenerateAvatar } from '@/components/generate-avatar';
import { Badge } from '@/components/ui/badge';
import type { GetOneAgent } from '@/data/agents/types';

export const columns: ColumnDef<GetOneAgent>[] = [
  {
    accessorKey: 'name',
    header: 'Agent Name',
    cell: ({ row }) => (
      <div className="flex w-full flex-col gap-y-1">
        <div className="flex items-center gap-x-2">
          <GenerateAvatar
            className="size-6"
            seed={row.original.name}
            variant="bottts"
          />
          <span className="font-semibold">{row.original.name}</span>
        </div>

        <div className="ml-2 flex items-center gap-x-2">
          <CornerDownRight className="size-4" />
          <span className="text-muted-foreground text-sm">
            {row.original.instructions}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'meetingCount',
    header: 'Meetings',
    cell: ({ row }) => (
      <Badge className="flex items-center gap-1" variant="outline">
        <Video className="size-4 text-primary" />
        {row.original.meetingCount}
        {row.original.meetingCount === 1 ? ' meeting' : ' meetings'}
      </Badge>
    ),
  },
];
