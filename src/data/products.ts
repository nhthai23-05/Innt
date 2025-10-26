export interface Product {
  id: string;
  name: string;
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
    name: 'Phong bì A4 iNET',
    description: 'Phong bì trắng khổ A4 chất lượng cao, được làm từ giấy kraft cao cấp. Thích hợp cho văn phòng, doanh nghiệp, và các nhu cầu gửi tài liệu quan trọng.',
    category: 'Phong bì',
    brand: 'INNT',
    image: 'https://res.cloudinary.com/dt4zsrqho/image/upload/v1760546906/phong_b%C3%AC_1_zlvbwk.jpg',
    images: [
      'https://res.cloudinary.com/dt4zsrqho/image/upload/v1760546906/phong_b%C3%AC_1_zlvbwk.jpg',
      'https://res.cloudinary.com/dt4zsrqho/image/upload/v1760546906/phong_b%C3%AC_1_zlvbwk.jpg'
    ],
    specifications: {
      'Kích thước': '220 x 310 mm',
      'Chất liệu': 'Giấy kraft 100gsm',
      'Màu sắc': 'Trắng',
      'Định lượng': '100 gsm'
    },
    inStock: true,
    featured: true
  },
  {
    id: '2',
    name: 'Phong bì A4 GAPIT',
    description: 'Phong bì GAPIT chất lượng cao với thiết kế chuyên nghiệp, in offset 2 màu sắc nét. Phù hợp cho doanh nghiệp, công ty cần gửi tài liệu, hợp đồng quan trọng.',
    category: 'Phong bì',
    brand: 'INNT',
    image: 'https://res.cloudinary.com/dt4zsrqho/image/upload/v1760546911/phong_b%C3%AC_2_qhfjfn.jpg',
    images: [
      'https://res.cloudinary.com/dt4zsrqho/image/upload/v1760546911/phong_b%C3%AC_2_qhfjfn.jpg'
    ],
    specifications: {
      'Kích thước': '20 x 20 x 10 cm',
      'Chất liệu': 'Giấy duplex 350gsm',
      'Màu sắc': 'Đa dạng',
      'In ấn': 'Offset 2 màu',
    },
    inStock: true,
    featured: true
  },
  {
    id: '3',
    name: 'Phong bì A4 stpgroup',
    description: 'Phong bì stpgroup được in trên giấy mỹ thuật cao cấp với kỹ thuật chạm nổi và in vàng sang trọng. Lựa chọn hoàn hảo cho thư mời, giấy chứng nhận cao cấp.',
    category: 'Phong bì',
    brand: 'INNT',
    image: 'https://res.cloudinary.com/dt4zsrqho/image/upload/v1760546906/phong_b%C3%AC_3_y66dux.jpg',
    images: [
      'https://res.cloudinary.com/dt4zsrqho/image/upload/v1760546906/phong_b%C3%AC_3_y66dux.jpg'
    ],
    specifications: {
      'Kích thước': '15 x 21 cm',
      'Chất liệu': 'Giấy mỹ thuật 300gsm',
      'Màu sắc': 'Vàng đồng/Trắng ngà',
      'In ấn': 'Chạm nổi + in vàng',
    },
    inStock: true,
    featured: true
  },
  {
    id: '4',
    name: 'Phong bì chúc mừng năm mới',
    description: 'Phong bì màu hồng nổi bật với họa tiết chúc mừng năm mới, in chạm nổi và in vàng tinh tế. Hoàn hảo để gửi lời chúc Tết, quà tặng đầu năm cho khách hàng và đối tác.',
    category: 'Phong bì',
    brand: 'INNT',
    image: 'https://res.cloudinary.com/dt4zsrqho/image/upload/v1760546908/phong_b%C3%AC_4_jld7pq.jpg',
    images: [
      'https://res.cloudinary.com/dt4zsrqho/image/upload/v1760546908/phong_b%C3%AC_4_jld7pq.jpg'
    ],
    specifications: {
      'Kích thước': '15 x 21 cm',
      'Chất liệu': 'Giấy mỹ thuật 300gsm',
      'Màu sắc': 'Hồng',
      'In ấn': 'Chạm nổi + in vàng',
    },
    inStock: true,
    featured: false
  },
  {
    id: '5',
    name: 'Sổ khám bệnh',
    description: 'Sổ khám bệnh chuyên dụng cho các phòng khám, bệnh viện. In offset trên giấy ivory cao cấp với bìa cứng bền đẹp, giúp lưu trữ thông tin y tế chính xác và lâu dài.',
    category: 'Sổ sách',
    brand: 'INNT',
    image: 'https://res.cloudinary.com/dt4zsrqho/image/upload/v1760546908/s%E1%BB%95_kh%C3%A1m_h%C3%B3a_%C4%91%C6%A1n_1_hsvw10.jpg',
    images: [
      'https://res.cloudinary.com/dt4zsrqho/image/upload/v1760546908/s%E1%BB%95_kh%C3%A1m_h%C3%B3a_%C4%91%C6%A1n_1_hsvw10.jpgg'
    ],
    specifications: {
      'Kích thước': '25 x 25 x 8 cm',
      'Chất liệu': 'Giấy ivory 350gsm',
      'Màu sắc': 'Xanh lục',
      'In ấn': 'Offset + in vàng kim',
    },
    inStock: true,
    featured: false
  },
  {
    id: '6',
    name: 'Hóa đơn A5',
    description: 'Hóa đơn khổ A5 in trên giấy couche chất lượng cao, rõ nét, dễ ghi chép. Phù hợp cho các cửa hàng, doanh nghiệp vừa và nhỏ cần in hóa đơn bán hàng, phiếu thu chi.',
    category: 'Hóa đơn',
    brand: 'INNT',
    image: 'https://res.cloudinary.com/dt4zsrqho/image/upload/v1760546906/phong_b%C3%AC_1_zlvbwk.jpg',
    images: [
      'https://res.cloudinary.com/dt4zsrqho/image/upload/v1760546906/phong_b%C3%AC_1_zlvbwk.jpg'
    ],
    specifications: {
      'Kích thước': '10 x 15 cm',
      'Chất liệu': 'Giấy couche 250gsm',
      'Màu sắc': 'Theo yêu cầu',
      'In ấn': 'Digital printing',
    },
    inStock: true,
    featured: false
  },
  {
    id: '7',
    name: 'Hóa đơn sổ ngang',
    description: 'Hóa đơn dạng sổ ngang tiện lợi, dễ sử dụng và bảo quản. In ấn sắc nét với các cột thông tin rõ ràng, phù hợp cho nhà hàng, quán ăn, cửa hàng bán lẻ.',
    category: 'Hóa đơn',
    brand: 'INNT',
    image: 'https://res.cloudinary.com/dt4zsrqho/image/upload/v1760546908/s%E1%BB%95_kh%C3%A1m_h%C3%B3a_%C4%91%C6%A1n_3_io4hny.jpg',
    images: [
      'https://res.cloudinary.com/dt4zsrqho/image/upload/v1760546908/s%E1%BB%95_kh%C3%A1m_h%C3%B3a_%C4%91%C6%A1n_3_io4hny.jpg'
    ],
    specifications: {
      'Kích thước': '10 x 15 cm',
      'Chất liệu': 'Giấy couche 250gsm',
      'Màu sắc': 'Theo yêu cầu',
      'In ấn': 'Digital printing',
    },
    inStock: true,
    featured: false
  },
  {
    id: '8',
    name: 'Sổ khám sức khỏe',
    description: 'Sổ khám sức khỏe định kỳ cho doanh nghiệp, công ty. Thiết kế chuyên nghiệp với đầy đủ các mục ghi chép thông tin sức khỏe, tiêm chủng, khám định kỳ cho nhân viên.',
    category: 'Sổ sách',
    brand: 'INNT',
    image: 'https://res.cloudinary.com/dt4zsrqho/image/upload/v1760546911/s%E1%BB%95_kh%C3%A1m_h%C3%B3a_%C4%91%C6%A1n_4_ikrpxj.jpg',
    images: [
      'https://res.cloudinary.com/dt4zsrqho/image/upload/v1760546911/s%E1%BB%95_kh%C3%A1m_h%C3%B3a_%C4%91%C6%A1n_4_ikrpxj.jpg'
    ],
    specifications: {
      'Kích thước': '10 x 15 cm',
      'Chất liệu': 'Giấy couche 250gsm',
      'Màu sắc': 'Theo yêu cầu',
      'In ấn': 'Digital printing',
    },
    inStock: true,
    featured: false
  }
]

// Tự động tạo categories từ products
export const categories = Array.from(
  new Set(products.map(p => p.category))
).map(category => ({
  id: category.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/\s+/g, '-'),
  name: category,
  count: products.filter(p => p.category === category).length
}));
