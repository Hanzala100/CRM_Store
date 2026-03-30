export interface Product {
  id: number;
  name: string;
  price: number;
  slug: string;
  images: string[];
  stock: number;
  description?: string;
  categories?: Category[];
}

export interface Category {
  id: number;
  name: string;
  slug?: string;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}
