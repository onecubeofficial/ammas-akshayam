export interface Product {
  id: string;
  name: string;
  nameTamil?: string;
  slug: string;
  category: string;
  categorySlug: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  image: string;
  images?: string[];
  description: string;
  shortDescription?: string;
  ingredients?: string[];
  nutritionalInfo?: Record<string, string>;
  storageInstructions?: string;
  weight?: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  inStock: boolean;
  stockCount: number;
  isVisible: boolean;
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  nameTamil?: string;
  slug: string;
  image: string;
  productCount: number;
  icon?: string;
  color?: string;
}

export interface Review {
  id: string;
  productId?: string;
  name: string;
  location: string;
  rating: number;
  review: string;
  date: string;
  avatar?: string;
  verified?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  category: string;
  readTime: number;
  tags: string[];
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerMobile: string;
  customerEmail: string;
  address: string;
  state: string;
  district: string;
  pin: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
}
