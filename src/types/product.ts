export type CategoryId = 'coffee' | 'tea' | 'freeze' | 'pastry' | 'snack' | string;

export interface ProductOption {
  id: string;
  name: string;
  price: number;
}

export interface ProductOptionGroup {
  id: string;
  name: string;
  required: boolean;
  options: ProductOption[];
}

export interface Product {
  id: string;
  name: string;
  categoryId: CategoryId;
  price: number;
  image: string;
  description?: string;
  story?: string;
  origin?: string;
  servingSuggestion?: string;
  aromaNotes?: string[];
  isAvailable: boolean;
  optionGroups?: ProductOptionGroup[];
  createdAt?: string;
}
