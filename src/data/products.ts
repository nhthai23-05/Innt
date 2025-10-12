export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  brand: string;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  specifications: Record<string, string>;
  inStock: boolean;
  featured: boolean;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    price: 1199,
    originalPrice: 1299,
    description: 'The most advanced iPhone ever with titanium design, A17 Pro chip, and pro camera system.',
    category: 'smartphones',
    brand: 'Apple',
    rating: 4.8,
    reviewCount: 1247,
    image: 'https://images.unsplash.com/photo-1758186386318-42f7fb10f465?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwZWxlY3Ryb25pY3MlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc1OTA2NjIzNnww&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1758186386318-42f7fb10f465?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwZWxlY3Ryb25pY3MlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc1OTA2NjIzNnww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1758186386318-42f7fb10f465?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwZWxlY3Ryb25pY3MlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc1OTA2NjIzNnww&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    specifications: {
      'Display': '6.7" Super Retina XDR',
      'Chip': 'A17 Pro',
      'Storage': '256GB',
      'Camera': '48MP Main + 12MP Ultra Wide',
      'Battery': 'Up to 29 hours video playback'
    },
    inStock: true,
    featured: true
  },
  {
    id: '2',
    name: 'MacBook Pro 16"',
    price: 2499,
    description: 'Supercharged by M3 Pro or M3 Max chip for the ultimate pro performance.',
    category: 'laptops',
    brand: 'Apple',
    rating: 4.9,
    reviewCount: 892,
    image: 'https://images.unsplash.com/photo-1737868131532-0efce8062b43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlciUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU4OTU2NjExfDA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1737868131532-0efce8062b43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlciUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU4OTU2NjExfDA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    specifications: {
      'Display': '16.2" Liquid Retina XDR',
      'Chip': 'M3 Pro',
      'Memory': '18GB Unified Memory',
      'Storage': '512GB SSD',
      'Battery': 'Up to 22 hours'
    },
    inStock: true,
    featured: true
  },
  {
    id: '3',
    name: 'Sony WH-1000XM5',
    price: 399,
    originalPrice: 449,
    description: 'Industry-leading noise canceling headphones with exceptional sound quality.',
    category: 'headphones',
    brand: 'Sony',
    rating: 4.7,
    reviewCount: 2156,
    image: 'https://images.unsplash.com/photo-1649956736509-f359d191bbcb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFkcGhvbmVzJTIwYXVkaW8lMjBlbGVjdHJvbmljc3xlbnwxfHx8fDE3NTg5NTcwMzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1649956736509-f359d191bbcb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFkcGhvbmVzJTIwYXVkaW8lMjBlbGVjdHJvbmljc3xlbnwxfHx8fDE3NTg5NTcwMzN8MA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    specifications: {
      'Type': 'Over-ear, Closed-back',
      'Driver': '30mm',
      'Frequency Response': '4Hz-40kHz',
      'Battery Life': '30 hours',
      'Weight': '250g'
    },
    inStock: true,
    featured: true
  },
  {
    id: '4',
    name: 'Apple Watch Series 9',
    price: 429,
    description: 'The most advanced Apple Watch yet with new S9 chip and enhanced capabilities.',
    category: 'wearables',
    brand: 'Apple',
    rating: 4.6,
    reviewCount: 1834,
    image: 'https://images.unsplash.com/photo-1696688713460-de12ac76ebc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwZml0bmVzcyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU5MDY2MjQyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1696688713460-de12ac76ebc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwZml0bmVzcyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU5MDY2MjQyfDA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    specifications: {
      'Display': '45mm Retina LTPO',
      'Chip': 'S9 SiP',
      'Storage': '64GB',
      'Battery': 'Up to 18 hours',
      'Water Resistance': '50 meters'
    },
    inStock: true,
    featured: true
  },
  {
    id: '5',
    name: 'iPad Air 5th Gen',
    price: 599,
    description: 'Powerful, colorful, and wonderfully versatile. iPad Air is more capable than ever.',
    category: 'tablets',
    brand: 'Apple',
    rating: 4.8,
    reviewCount: 743,
    image: 'https://images.unsplash.com/photo-1600204345883-c89086d54128?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWJsZXQlMjBkZXZpY2UlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc1OTAzOTc5OHww&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1600204345883-c89086d54128?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWJsZXQlMjBkZXZpY2UlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc1OTAzOTc5OHww&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    specifications: {
      'Display': '10.9" Liquid Retina',
      'Chip': 'M1',
      'Storage': '64GB',
      'Camera': '12MP Wide',
      'Battery': 'Up to 10 hours'
    },
    inStock: true,
    featured: false
  },
  {
    id: '6',
    name: 'PlayStation 5',
    price: 499,
    description: 'Experience lightning-fast loading with an ultra-high speed SSD.',
    category: 'gaming',
    brand: 'Sony',
    rating: 4.9,
    reviewCount: 3421,
    image: 'https://images.unsplash.com/photo-1655976796204-308e6f3deaa8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBjb25zb2xlJTIwY29udHJvbGxlcnxlbnwxfHx8fDE3NTkwMDUwODJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1655976796204-308e6f3deaa8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBjb25zb2xlJTIwY29udHJvbGxlcnxlbnwxfHx8fDE3NTkwMDUwODJ8MA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    specifications: {
      'CPU': 'AMD Zen 2',
      'GPU': 'AMD Radeon RDNA 2',
      'Storage': '825GB SSD',
      'RAM': '16GB GDDR6',
      'Resolution': 'Up to 8K'
    },
    inStock: true,
    featured: true
  },
  {
    id: '7',
    name: 'AirPods Pro 2',
    price: 249,
    description: 'Next-level active noise cancellation and Adaptive Transparency.',
    category: 'audio',
    brand: 'Apple',
    rating: 4.7,
    reviewCount: 2891,
    image: 'https://images.unsplash.com/photo-1627989580309-bfaf3e58af6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGVhcmJ1ZHN8ZW58MXx8fHwxNzU5MDQ2NDAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1627989580309-bfaf3e58af6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGVhcmJ1ZHN8ZW58MXx8fHwxNzU5MDQ2NDAwfDA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    specifications: {
      'Chip': 'H2',
      'Battery': '6 hours + 24 hours with case',
      'Water Resistance': 'IPX4',
      'Features': 'Active Noise Cancellation',
      'Connectivity': 'Bluetooth 5.3'
    },
    inStock: true,
    featured: true
  },
  {
    id: '8',
    name: 'JBL Charge 5',
    price: 179,
    originalPrice: 199,
    description: 'Powerful portable Bluetooth speaker with deep bass and long battery life.',
    category: 'speakers',
    brand: 'JBL',
    rating: 4.5,
    reviewCount: 1672,
    image: 'https://images.unsplash.com/photo-1674303324806-7018a739ed11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0YWJsZSUyMHNwZWFrZXIlMjBibHVldG9vdGh8ZW58MXx8fHwxNzU5MDY2MjUxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1674303324806-7018a739ed11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0YWJsZSUyMHNwZWFrZXIlMjBibHVldG9vdGh8ZW58MXx8fHwxNzU5MDY2MjUxfDA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    specifications: {
      'Output Power': '40W',
      'Battery Life': '20 hours',
      'Water Resistance': 'IP67',
      'Connectivity': 'Bluetooth 5.1',
      'Weight': '960g'
    },
    inStock: true,
    featured: true
  }
];

export const categories = [
  { id: 'smartphones', name: 'Smartphones', icon: '📱' },
  { id: 'laptops', name: 'Laptops', icon: '💻' },
  { id: 'headphones', name: 'Headphones', icon: '🎧' },
  { id: 'wearables', name: 'Wearables', icon: '⌚' },
  { id: 'tablets', name: 'Tablets', icon: '📱' },
  { id: 'gaming', name: 'Gaming', icon: '🎮' },
  { id: 'audio', name: 'Audio', icon: '🔊' },
  { id: 'speakers', name: 'Speakers', icon: '📢' }
];

export const brands = ['Apple', 'Sony', 'Samsung', 'JBL', 'Bose', 'Microsoft', 'Nintendo'];