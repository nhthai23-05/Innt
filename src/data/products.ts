export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  brand: string;
  image: string;
  images: string[];
  specifications: Record<string, string>;
  inStock: boolean;
  featured: boolean;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Phong bì Inet',
    price: 1199,
    originalPrice: 1299,
    description: 'The most advanced iPhone ever with titanium design, A17 Pro chip, and pro camera system.',
    category: 'phong bì',
    brand: 'INNT',
    image: 'https://res.cloudinary.com/dt4zsrqho/image/upload/v1760546906/phong_b%C3%AC_1_zlvbwk.jpg',
    images: [
      'https://res.cloudinary.com/dt4zsrqho/image/upload/v1760546906/phong_b%C3%AC_1_zlvbwk.jpg',
      'https://res.cloudinary.com/dt4zsrqho/image/upload/v1760546906/phong_b%C3%AC_1_zlvbwk.jpg'
    ],
    specifications: {
    },
    inStock: true,
    featured: true
  }
]