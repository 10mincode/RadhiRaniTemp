export class Locality {
    id!: string;
    state!: string;
    city!: string;
    locality!: string;
}
export interface StateCityLocality {
    state: string;
    cities: {
        city: string;
        localities: string[];
    }[];
}