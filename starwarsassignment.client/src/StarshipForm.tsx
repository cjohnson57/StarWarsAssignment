import type { Starship } from './types.ts';

type Props = {
    ship: Starship;
    setShip: (updater: Starship | ((prev: Starship) => Starship)) => void;
};

export default function StarshipForm({ ship, setShip }: Props) {
    const setString = (key: keyof Starship, value: string | null) =>
        setShip(prev => ({ ...prev, [key]: value }));

    const setInt = (key: keyof Starship, value: string) => {
        const v = value.trim();
        if (v === '') {
            setShip(prev => ({ ...prev, [key]: null }));
            return;
        }
        const parsed = parseInt(v.replace(/[^0-9\-]/g, ''), 10);
        setShip(prev => ({ ...prev, [key]: Number.isFinite(parsed) ? parsed : null }));
    };

    const setFloat = (key: keyof Starship, value: string) => {
        const v = value.trim();
        if (v === '') {
            setShip(prev => ({ ...prev, [key]: null }));
            return;
        }
        const parsed = parseFloat(v.replace(/,/g, ''));
        setShip(prev => ({ ...prev, [key]: Number.isFinite(parsed) ? parsed : null }));
    };

    return (
        <div className="sidebarForm">
            <label className="sidebarLabel" htmlFor="sidebar-name">Name *</label>
            <input
                id="sidebar-name"
                type="text"
                value={ship.name ?? ''}
                className="sidebarField"
                onChange={e => setString('name', e.target.value || null)}
                placeholder="Enter ship name"
            />            

            <label className="sidebarLabel" htmlFor="sidebar-model">Model *</label>
            <input
                id="sidebar-model"
                type="text"
                value={ship.model ?? ''}
                className="sidebarField"
                onChange={e => setString('model', e.target.value || null)}
                placeholder="Enter model"
            />            

            <label className="sidebarLabel" htmlFor="sidebar-manufacturer">Manufacturer *</label>
            <input
                id="sidebar-manufacturer"
                type="text"
                value={ship.manufacturer ?? ''}
                className="sidebarField"
                onChange={e => setString('manufacturer', e.target.value || null)}
                placeholder="Enter manufacturer"
            />            

            <label className="sidebarLabel" htmlFor="sidebar-costInCredits">Cost (in credits)</label>
            <input
                id="sidebar-costInCredits"
                type="text"
                value={ship.costInCredits ?? ''}
                className="sidebarField"
                onChange={e => setInt('costInCredits', e.target.value)}
                placeholder="e.g. 100000"
            />            

            <label className="sidebarLabel" htmlFor="sidebar-length">Length</label>
            <input
                id="sidebar-length"
                type="text"
                value={ship.length ?? ''}
                className="sidebarField"
                onChange={e => setFloat('length', e.target.value)}
                placeholder="e.g. 34.37"
            />            

            <label className="sidebarLabel" htmlFor="sidebar-maxAtmospheringSpeed">Max Atmosphering Speed</label>
            <input
                id="sidebar-maxAtmospheringSpeed"
                type="text"
                value={ship.maxAtmospheringSpeed ?? ''}
                className="sidebarField"
                onChange={e => setString('maxAtmospheringSpeed', e.target.value || null)}
                placeholder="e.g. 1050"
            />            

            <label className="sidebarLabel" htmlFor="sidebar-crew">Crew</label>
            <input
                id="sidebar-crew"
                type="text"
                value={ship.crew ?? ''}
                className="sidebarField"
                onChange={e => setInt('crew', e.target.value)}
                placeholder="e.g. 4"
            />            

            <label className="sidebarLabel" htmlFor="sidebar-passengers">Passengers</label>
            <input
                id="sidebar-passengers"
                type="text"
                value={ship.passengers ?? ''}
                className="sidebarField"
                onChange={e => setInt('passengers', e.target.value)}
                placeholder="e.g. 6"
            />                      

            <label className="sidebarLabel" htmlFor="sidebar-cargoCapacity">Cargo Capacity</label>
            <input
                id="sidebar-cargoCapacity"
                type="text"
                value={ship.cargoCapacity ?? ''}
                className="sidebarField"
                onChange={e => setInt('cargoCapacity', e.target.value)}
                placeholder="e.g. 100000"
            />            

            <label className="sidebarLabel" htmlFor="sidebar-consumables">Consumables</label>
            <input
                id="sidebar-consumables"
                type="text"
                value={ship.consumables ?? ''}
                className="sidebarField"
                onChange={e => setString('consumables', e.target.value || null)}
                placeholder="e.g. 2 months"
            />            

            <label className="sidebarLabel" htmlFor="sidebar-hyperdriveRating">Hyperdrive Rating</label>
            <input
                id="sidebar-hyperdriveRating"
                type="text"
                value={ship.hyperdriveRating ?? ''}
                className="sidebarField"
                onChange={e => setFloat('hyperdriveRating', e.target.value)}
                placeholder="e.g. 0.5"
            />            

            <label className="sidebarLabel" htmlFor="sidebar-mglt">MGLT</label>
            <input
                id="sidebar-mglt"
                type="text"
                value={ship.mglt ?? ''}
                className="sidebarField"
                onChange={e => setInt('mglt', e.target.value)}
                placeholder="e.g. 75"
            />            

            <label className="sidebarLabel" htmlFor="sidebar-starshipClass">Starship Class</label>
            <input
                id="sidebar-starshipClass"
                type="text"
                value={ship.starshipClass ?? ''}
                className="sidebarField"
                onChange={e => setString('starshipClass', e.target.value || null)}
                placeholder="e.g. Light freighter"
            />
        </div>
    );
}