'use client'

import { Skeleton } from '@/components/ui/skeleton';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import {
    createColumnHelper, flexRender, getCoreRowModel, useReactTable
} from '@tanstack/react-table';

export type Event = {
  id: string
  title: string | null
  event_date: string | null
  created_at: string
}

type Props = {
  onEdit: (item: Event) => void;
  onDelete: (item: Event) => void;
  queryKeyGetter(): unknown[];
};

const columnHelper = createColumnHelper<Event>()

const columns = [
  columnHelper.accessor('title', {
    header: 'Title',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('event_date', {
    header: 'Date',
    cell: (info) => {
      const cellValue = info.getValue()

      if (!cellValue) return null
      return new Date(cellValue).toLocaleDateString()
    }
  }),
  columnHelper.accessor('created_at', {
    header: 'Created At',
    cell: (info) =>
      new Date(info.getValue()).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
  }),
]

export default function EventsTable(props: Props) {
  const { data, isLoading, isError } = useQuery({
    queryKey: props.queryKeyGetter(),
    queryFn: async ({ queryKey }) => {
      const [, params] = queryKey as [string, { searchInput: string }];
      const query = supabase
        .from("events")
        .select("*")
        .order("created_at", { ascending: false })
        .throwOnError();

      if (params?.searchInput) {
        query.ilike("search", `%${params.searchInput}%`);
      }

      const { data } = await query;
      return data ?? [];
    },
  });

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader className="bg-muted sticky top-0 z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {isLoading ? (
            [...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={4}>
                  <Skeleton className="h-4 w-[250px]" />
                </TableCell>
              </TableRow>
            ))
          ) : isError ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-destructive">
                Failed to load events.
              </TableCell>
            </TableRow>
          ) : data && data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                No events found.
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
