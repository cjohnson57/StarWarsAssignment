/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import './App.css';

interface Starship {
    starshipId: number;
    name: string | null;
    model: string | null;
    manufacturer: string | null;
    costInCredits: number | null;
    length: number | null;
    maxAtmospheringSpeed: string | null;
    crew: number | null;
    passengers: number | null;
    cargoCapacity: number | null;
    consumables: string | null;
    hyperdriveRating: number | null;
    mglt: number | null;
    starshipClass: string | null;
    created: string | null;
    edited: string | null;
}

type SortingStateLocal = { id: string; desc: boolean }[];

function App() {
    const [starships, setStarships] = useState<Starship[]>([]);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const [sorting, setSorting] = useState<SortingStateLocal>([]);

    useEffect(() => {
        void populateStarshipData();
    }, []);

    const columns = useMemo(
        () => [
            { accessorKey: 'name', header: 'Name', enableColumnFilter: true },
            { accessorKey: 'model', header: 'Model', enableColumnFilter: true },
            { accessorKey: 'manufacturer', header: 'Manufacturer', enableColumnFilter: true },
            {
                accessorKey: 'costInCredits',
                header: 'Cost',
                cell: (info: any) => info.getValue() ?? '',
            },
            {
                accessorKey: 'length',
                header: 'Length',
                cell: (info: any) => info.getValue() ?? '',
            },
            { accessorKey: 'maxAtmospheringSpeed', header: 'Max Speed' },
            { accessorKey: 'crew', header: 'Crew' },
            { accessorKey: 'passengers', header: 'Passengers' },
            { accessorKey: 'cargoCapacity', header: 'Cargo' },
            { accessorKey: 'consumables', header: 'Consumables' },
            { accessorKey: 'hyperdriveRating', header: 'Hyperdrive' },
            { accessorKey: 'mglt', header: 'MGLT' },
            { accessorKey: 'starshipClass', header: 'Class' },
            {
                accessorKey: 'created',
                header: 'Created',
                cell: (info: any) => (info.getValue() ? new Date(info.getValue() as string).toLocaleString() : ''),
            },
            {
                accessorKey: 'edited',
                header: 'Edited',
                cell: (info: any) => (info.getValue() ? new Date(info.getValue() as string).toLocaleString() : ''),
            },
        ],
        []
    );

    const starshipTable = useReactTable({
        data: starships,
        columns,
        state: {
            globalFilter,
            sorting,
        },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: (updater: any) => {
            // If the library passes an updater function, call it with previous state.
            if (typeof updater === 'function') {
                setSorting(prev => updater(prev));
            } else {
                setSorting(updater as SortingStateLocal);
            }
        },
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        globalFilterFn: 'includesString',
    });

    return (
        <div>
            <h1>Starship Dealership Listings</h1>
            <p>Use this page to edit listings for our customers.</p>

            <div style={{ marginBottom: 8, marginTop: 30 }}>
                <input
                    value={globalFilter ?? ''}
                    onChange={e => setGlobalFilter(e.target.value)}
                    placeholder="Global search..."
                    style={{ padding: '6px', width: 240 }}
                    id="GlobalSearch"
                    aria-label="GlobalSearch"
                />
            </div>

            <table className="table table-striped" style={{ width: '100%' }}>
                <thead>
                    {starshipTable.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id} colSpan={header.colSpan} style={{ cursor: header.column.getCanSort() ? 'pointer' : 'default', whiteSpace: "nowrap" }}>
                                    {header.isPlaceholder ? null : (
                                        <div
                                            onClick={header.column.getToggleSortingHandler()}
                                            title={header.column.getCanSort() ? 'Toggle sort' : undefined}
                                            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                                        >
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {{
                                                asc: ' ▲',
                                                desc: ' ▼',
                                            }[String(header.column.getIsSorted() as string)] ?? null}
                                        </div>
                                    )}
                                    {header.column.getCanFilter() ? (
                                        <div style={{ marginTop: 4 }}>
                                            <input
                                                value={(header.column.getFilterValue() ?? '') as string}
                                                onChange={e => header.column.setFilterValue(e.target.value ?? undefined)}
                                                style={{ padding: 4, width: '100%' }}
                                                id={"Filter" + String(header.column.columnDef.header)}
                                                aria-label={"Filter" + String(header.column.columnDef.header)}
                                            />
                                        </div>
                                    ) : null}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>

                <tbody>
                    {starshipTable.getRowModel().rows.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} style={{ textAlign: 'center', padding: 16 }}>
                                No data
                            </td>
                        </tr>
                    ) : (
                            starshipTable.getRowModel().rows.map(row => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} style={{ verticalAlign: 'top' }}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );

    async function populateStarshipData() {
        const response = await fetch('/starships');
        if (response.ok) {
            const data = await response.json();
            setStarships(data);
        }
    }
}

export default App;