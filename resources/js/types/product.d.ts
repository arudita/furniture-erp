import { Category } from "./category";

export interface ProductAttribute {
    name: string;
    value: string;
}

export interface Product {
    id: number;
    public_id: string;
    category_id: number;
    category: Category;
    name: string;
    description: string;
    product_code: string;
    unit_price: number;
}

interface ProductForm {
    id?: number;
    public_id?: string;
    category_id: number;
    name: string;
    description: string;
    product_code: string;
    unit_price: number;
    attributes: ProductAttribute[];
    images: File[];
    main_image_index: number;
}
