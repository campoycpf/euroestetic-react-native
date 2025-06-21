import { JWTUser } from "@/app/actions/cart";

export interface CartItem {
    quantity: number;
    price: number;
    name: string;
    slug: string;
    productId: number;
    image: string;
}
export interface CartStore {
    items: CartItem[];
    isLoading: boolean;
    jwtUser: JWTUser | null;
    setJWTUser: () => Promise<void>;
    addItem: (productId: number, name: string, price: number, quantity: number, slug: string, image: string) => Promise<void>;
    removeItem: (productId: number) => Promise<void>;
    updateItemQuantity: (productId: number, quantity: number) => Promise<void>;
    fetchCart: () => Promise<void>;
    removeCart: () => Promise<void>;
    removeCartLogout: () => Promise<void>;
}