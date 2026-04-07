export interface Starship {
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