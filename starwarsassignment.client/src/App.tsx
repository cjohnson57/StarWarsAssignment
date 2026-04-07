/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState, useRef } from 'react';
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
import editIcon from './assets/edit.png';
import deleteIcon from './assets/delete.png';

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
    const scrollYRef = useRef(0);
    const scrollXRef = useRef(0);

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
                    transform: showSidebar ? 'translateX(0)' : 'translateX(100%)',
                }}
            >
                <h2 style={{ marginTop: 0 }}>Ship Editor</h2>

                <StarshipForm ship={sidebarShip} setShip={setSidebarShip} />

                <div style={{ display: 'flex', gap: '5%', marginTop: '7.5%', marginBottom: '5%', justifyContent: 'center' }}>
                    <button type="button" id="submitBtn" style={{ color: 'lightgray' }} onClick={handleSubmitSidebar}>Submit</button>
                    <button type="button" id="cancelBtn" style={{ color: 'lightgray' }} onClick={() => changeSidebar(false) }>Cancel</button>
                </div>
            </div>

            <div className="header">
                <h1>Starship Dealership Listings</h1>
                <p>Use this page to edit listings for our customers.</p>

                <button
                    type="button"
                    onClick={handleUpdateShipsClick}
                    style={{ color: 'lightgray' }}
                    id="updateShipsBtn"
                >
                    Update Ships from API
                </button>

                <button
                    type="button"
                    onClick={handleNewShipClick}
                    style={{ color: 'lightgray' }}
                    id="newShipBtn"
                >
                    Add New Ship
                </button>

                <div style={{ }}>
                    <input
                        value={globalFilter ?? ''}
                        onChange={e => setGlobalFilter(e.target.value)}
                        placeholder="Global search..."
                        style={{ padding: '1%', width: '100%' }}
                        id="GlobalSearch"
                        aria-label="GlobalSearch"
                    />
                </div>
            </div>            

            <table className="table table-striped starshipTable">
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
                                        <div style={{ marginTop: '1.5%' }}>
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
                                <td style={{ textAlign: 'right', display: 'flex', flexDirection: 'row', gap: 10 }}>
                                    <button
                                        type="button"
                                        onClick={() => handleShipEditClick(row.original)}
                                        aria-label="Edit ship"
                                        className="iconButton"
                                        style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer' }}
                                    >
                                        <img src={editIcon} alt="Edit" className="iconImg" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleShipDeleteClick(row.original)}
                                        aria-label="Delete ship"
                                        className="iconButton"
                                        style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer' }}
                                    >
                                        <img src={deleteIcon} alt="Delete" className="iconImg" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );

    async function populateStarshipData() {
        //Get ship data from DB
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
            //Call backend which will contact the SWAPI
            const response = await fetch('/starships/UpdateShipsFromAPI', { method: 'GET' });
            if (response.ok) { //Success, update ship table
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
        changeSidebar(true); //Show sidebar        
    }

    function handleShipEditClick(ship: Starship) {
        setSidebarShip(ship); //Set ship to the sidebar
        changeSidebar(true); //Show sidebar        
    }

    function changeSidebar(show: boolean) {
        setShowSidebar(show);
        const isMobile = window.matchMedia('(max-width: 1024px)').matches;
        const sidebar = document.getElementById('sidebar');
        if (!sidebar) return;
        if (isMobile) {
            if (show) {
                //Show the bar          
                sidebar.style.visibility = 'inherit';
                //Store the current scroll and scroll to the top left so sidebar is shown correctly
                scrollXRef.current = window.scrollX;
                scrollYRef.current = window.scrollY;
                document.body.style.overflow = 'hidden';
                document.body.style.position = 'fixed';
                document.body.style.left = `-${scrollXRef.current}px`;
                document.body.style.top = `-${scrollYRef.current}px`;
                document.body.style.width = '100%';
            }
            else {
                //Hide the sidebar                
                sidebar.style.visibility = 'hidden';
                //Unset body position and scroll back to previous position
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.left = '';
                document.body.style.top = '';
                document.body.style.width = '';
                //Could not get this scroll to previous position to work
                //window.scrollTo(scrollXRef.current, scrollYRef.current);
            }
        }
    }

    //POSTs new or updated ship to backend
    async function handleSubmitSidebar() {
        try {
            //Check for required fields
            let errors: string = '';
            if (!sidebarShip.name || sidebarShip.name.trim() === '') {
                errors += 'Name is required.\n';
            }
            if (!sidebarShip.model || sidebarShip.model.trim() === '') {
                errors += 'Model is required.\n';
            }
            if (!sidebarShip.manufacturer || sidebarShip.manufacturer.trim() === '') {
                errors += 'Manufacturer is required.\n';
            }
            if (errors) {
                window.alert(errors);
                return;
            }
            const shipIsNew: boolean = sidebarShip.starshipId == 0; //If this is a new ship
            //POST request
            const response = await fetch('/starships', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sidebarShip),
            });
            if (response.ok) { //Success, message depends on action
                await populateStarshipData();
                changeSidebar(false);
                if (shipIsNew) {
                    window.alert('Ship ' + sidebarShip.name + ' created successfully.');
                }
                else {
                    window.alert('Ship ' + sidebarShip.name + ' updated successfully.');
                }                
            } else { //Failed
                const text = await response.text();
                window.alert(`Submit failed: ${response.status} ${response.statusText}\n${text}`);
            }
        } catch (err) {
            window.alert(`Submit failed: ${String(err)}`);
        }
    }

    async function handleShipDeleteClick(ship: Starship) {
        const confirmed = window.confirm('Are you sure you want to delete ship ' + ship.name + '?');
        if (!confirmed) {
            return;
        }
        try {
            //Call backend to delete this ship
            const response = await fetch('/starships/' + ship.starshipId, { method: 'DELETE' });
            if (response.ok) { //Success, update ship table
                await populateStarshipData();
                window.alert('Ship ' + ship.name + ' deleted successfully.');
            } else {
                const text = await response.text();
                window.alert(`Delete failed: ${response.status} ${response.statusText}\n${text}`);
            }
        } catch (err) {
            window.alert(`Delete failed: ${String(err)}`);
        }
    }
}

export default App;