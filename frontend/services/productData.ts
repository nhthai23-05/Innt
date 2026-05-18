import productsJson from '../../data/products.json';
import categoriesJson from '../../data/categories.json';
import type { Product, Category, CategoriesFile } from '../types/product';

const products = productsJson as Product[];
const categoriesData = categoriesJson as CategoriesFile;

export function getAllProducts(): Product[] {
  return products;
}

export function getAllCategories(): Category[] {
  return categoriesData.categories;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categoriesData.categories.find((c) => c.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.metadata.category_slug === categorySlug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return products;

  return products.filter((p) => {
    const haystack = [
      p.embedding_data.product_name,
      p.embedding_data.detailed_description,
      p.metadata.category,
      ...(p.embedding_data.use_cases || []),
      ...(p.embedding_data.finishing_options || []),
      ...Object.values(p.metadata.technical_specs || {}).filter((v): v is string => typeof v === 'string'),
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  });
}

export function getPrimaryImage(product: Product): string | undefined {
  return product.generation_enhancers.image_url?.[0];
}
