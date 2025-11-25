export interface Wood {
    id: number;
    public_id: string;
    name: string;
    description: string;
}

export interface WoodForm {
    id?: number | null;
    public_id?: string | null;
    name: string;
    description: string;
}
