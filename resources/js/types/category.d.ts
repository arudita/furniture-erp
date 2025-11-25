export interface Category {
    id: number;
    public_id: string;
    name: string;
    slug: string;
    parent_id?: number;
    parent?: Category;
}

export interface CategoryForm {
    id?: number;
    public_id?: string;
    name: string;
    slug: string;
    parent_id?: number;
}
