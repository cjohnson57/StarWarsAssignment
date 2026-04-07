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
import type { Starship } from './types.ts';
import StarshipForm from './StarshipForm';

const emptyShip: Starship = {
    starshipId: 0,
    name: null,
    model: null,
    manufacturer: null,
    costInCredits: null,
    length: null,
    maxAtmospheringSpeed: null,
    crew: null,
    passengers: null,
    cargoCapacity: null,
    consumables: null,
    hyperdriveRating: null,
    mglt: null,
    starshipClass: null,
    created: null,
    edited: null,
};

type SortingStateLocal = { id: string; desc: boolean }[];

function App() {
    const [starships, setStarships] = useState<Starship[]>([]);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const [sorting, setSorting] = useState<SortingStateLocal>([]);
    const [showSidebar, setShowSidebar] = useState<boolean>(false);
    const [sidebarShip, setSidebarShip] = useState<Starship>(emptyShip);

    useEffect(() => {
        void populateStarshipData();
    }, []);

    const columns = useMemo(
        () => [
            { accessorKey: 'name', header: 'Name' },
            { accessorKey: 'model', header: 'Model' },
            { accessorKey: 'manufacturer', header: 'Manufacturer' },
            { accessorKey: 'costInCredits', header: 'Cost (credits)' },
            { accessorKey: 'length', header: 'Length (m)' },
            { accessorKey: 'maxAtmospheringSpeed', header: 'Max Speed (kph)' },
            { accessorKey: 'crew', header: 'Crew' },
            { accessorKey: 'passengers', header: 'Passengers' },
            { accessorKey: 'cargoCapacity', header: 'Cargo Capacity' },
            { accessorKey: 'consumables', header: 'Consumables' },
            { accessorKey: 'hyperdriveRating', header: 'Hyperdrive Class' },
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
            //If the library passes an updater function, call it with previous state.
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
            <div
                id="sidebar"
                aria-hidden={!showSidebar}
                className="sidebar"
                style={{
                    transform: showSidebar ? 'translateX(0)' : 'translateX(100%)'
                }}
            >
                <h2 style={{ marginTop: 0 }}>Ship Editor</h2>

                <StarshipForm ship={sidebarShip} setShip={setSidebarShip} />

                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <button type="button" id="submitBtn" style={{ color: 'lightgray' }} onClick={handleSubmitSidebar}>Submit</button>
                    <button type="button" id="cancelBtn" style={{ color: 'lightgray' }} onClick={() => setShowSidebar(false)}>Cancel</button>
                </div>
            </div>

            <h1>Starship Dealership Listings</h1>
            <p>Use this page to edit listings for our customers.</p>

            <button
                type="button"
                onClick={handleUpdateShipsClick}
                style={{ marginTop: 8, color: 'lightgray' }}
                id="updateShipsBtn"
            >
                Update Ships from API
            </button>

            <br />

            <button
                type="button"
                onClick={handleNewShipClick}
                style={{ marginTop: 8, color: 'lightgray' }}
                id="newShipBtn"
            >
                Add New Ship
            </button>

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
                                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
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
                                                style={{ padding: 4, width: '100%', boxSizing: 'border-box' }}
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

    async function handleUpdateShipsClick() {
        const confirmed = window.confirm('Are you sure you want to update ships from the API? This will erase any changes made to ships found on the API.');
        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch('/starships/UpdateShipsFromAPI', { method: 'GET' });
            if (response.ok) {
                await populateStarshipData();
                window.alert('Ships updated successfully.');
            } else {
                const text = await response.text();
                window.alert(`Update failed: ${response.status} ${response.statusText}\n${text}`);
            }
        } catch (err) {
            window.alert(`Update failed: ${String(err)}`);
        }
    }

    function handleNewShipClick() {
        setSidebarShip(emptyShip); //Clear fields
        setShowSidebar(true); //Show sidebar
    }

    //POSTs new or updated ship to backend
    async function handleSubmitSidebar() {
        try {
            const shipIsNew: boolean = sidebarShip.starshipId == 0;
            const response = await fetch('/starships', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sidebarShip),
            });
            if (response.ok) {
                await populateStarshipData();
                setShowSidebar(false);
                if (shipIsNew) {
                    window.alert('Ship ' + sidebarShip.name + ' created successfully.');
                }
                else {
                    window.alert('Ship ' + sidebarShip.name + ' updated successfully.');
                }                
            } else {
                const text = await response.text();
                window.alert(`Submit failed: ${response.status} ${response.statusText}\n${text}`);
            }
        } catch (err) {
            window.alert(`Submit failed: ${String(err)}`);
        }
    }
}

export default App;