export interface ProductEmbeddingData {
  product_name: string;
  detailed_description: string;
  use_cases: string[];
  finishing_options?: string[];
}

export interface ProductTechnicalSpecs {
  dimensions?: string;
  dimensions_unfolded?: string;
  dimensions_finished?: string;
  dimensions_3d?: string;
  thickness_gsm?: string;
  quantity?: string;
  material?: string;
  colors?: string;
  load_capacity?: string;
  [key: string]: string | undefined;
}

export interface ProductMetadata {
  category: string;
  category_slug: string;
  technical_specs: ProductTechnicalSpecs;
}

export interface ProductGenerationEnhancers {
  product_url: string;
  image_url: string[];
  redirect_note: string;
}

export interface Product {
  id: string;
  embedding_data: ProductEmbeddingData;
  metadata: ProductMetadata;
  generation_enhancers: ProductGenerationEnhancers;
}

export interface Category {
  slug: string;
  name_vi: string;
  name_en: string;
  description: string;
  product_count: number;
}

export interface CategoriesFile {
  categories: Category[];
  metadata: {
    total_products: number;
    total_categories: number;
    created: string;
  };
}
