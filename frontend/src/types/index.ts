export type Region = 'odisha' | 'kolkata';
export type Category = 'snacks' | 'sweets' | 'masala' | 'healthy' | 'pickles' | 'mixtures';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: Category;
  state: Region;
  image: string;
  price: number;
  discountPrice: number;
  rating: number;
  ratingCount: number;
  stock: number;
  featured: boolean;
  weight?: string;
  tags?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CheckoutFormData {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  paymentMethod: 'razorpay' | 'upi' | 'cod';
}
