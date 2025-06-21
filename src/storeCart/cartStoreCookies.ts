import { CartStore, CartItem } from "./types";
import { create } from "zustand";
import Cookies from 'js-cookie';
import { Media, Product } from "@/payload-types";
import { addToCart, removeFromCart, updateCartQuantity, getCart, clearCart, getCurrentUser, JWTUser } from "@/app/actions/cart";
import { CART_COOKIE_NAME, getPriceProduct } from "utils/consts";
import { getUserAuth } from "@/actions/auth";

const saveCartToCookie = (items: CartItem[]) => {
  Cookies.set(CART_COOKIE_NAME, JSON.stringify(items), { expires: 7 });
};

const getCartFromCookie = (): CartItem[] => {
  const cartData = Cookies.get(CART_COOKIE_NAME);
  return cartData ? JSON.parse(cartData) : [];
};

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  isLoading: false,
  jwtUser: null,
    setJWTUser: async () => {
      const userResponse = await getUserAuth();
      console.log('userResponse', userResponse);
      if (!userResponse) {
        set({ jwtUser: null });
        return;
      }
      const user: JWTUser =  {
        id: userResponse.id,
        email: userResponse.email,
        name: userResponse.name as string,
        role: userResponse.role 
        
      } 
      //todo: uso el usser de base de datos de payload porque no se refresca el token
      //const user = await getCurrentUser();
      set({ jwtUser: user });
    },
    addItem: async (productId, name, price, quantity, slug, image) => {
    try {
      set({ isLoading: true });
      const user = await getCurrentUser();
      
      if (user?.role === 'user' || user?.role === 'pro') {
        await addToCart(productId, quantity);
        const cart = await getCart();
        
        if (cart) {
          const cartItems: CartItem[] = cart.docs.map(item => {
            const product = item.product as Product;
            return {
              productId: product.id,
              quantity: item.quantity,
              name: product.title,
              price: getPriceProduct(product),
              slug: product.slug as string,
              image: (product.image as Media)?.filename as string || 'logo-white-blue_512.png'
            }
          });
          set({ items: cartItems, isLoading: false });
        }
      } else {
        const currentItems = getCartFromCookie();
        const existingItemIndex = currentItems.findIndex(i => i.productId === productId);

        if (existingItemIndex >= 0) {
          currentItems[existingItemIndex].quantity += quantity;
        } else {
          currentItems.push({ productId, quantity, name, price, slug, image });
        }

        saveCartToCookie(currentItems);
        set({ items: currentItems, isLoading: false });
      }
    } catch (error) {
      console.error('Error al añadir item al carrito:', error);
      set({ isLoading: false });
    }
  },

  removeItem: async (productId) => {
    try {
      set({ isLoading: true });
      const user = await getCurrentUser();

      if (user?.role === 'user' || user?.role === 'pro') {
        await removeFromCart(productId);
        const cart = await getCart();
        
        if (cart) {
          const cartItems: CartItem[] = cart.docs.map(item => {
            const product = item.product as Product;
            return {
              productId: product.id,
              quantity: item.quantity,
              name: product.title,
              price: getPriceProduct(product),
              slug: product.slug as string,
              image: (product.image as Media)?.filename as string || 'logo-white-blue_512.png'
            }
          });
          set({ items: cartItems, isLoading: false });
        }
      } else {
        const currentItems = getCartFromCookie();
        const updatedItems = currentItems.filter(item => item.productId !== productId);
        saveCartToCookie(updatedItems);
        set({ items: updatedItems, isLoading: false });
      }
    } catch (error) {
      console.error('Error al eliminar item del carrito:', error);
      set({ isLoading: false });
    }
  },

  updateItemQuantity: async (productId, quantity) => {
    try {
      set({ isLoading: true });
      const user = await getCurrentUser();

      if (user?.role === 'user' || user?.role === 'pro') {
        await updateCartQuantity(productId, quantity);
        const cart = await getCart();
        
        if (cart) {
          const cartItems: CartItem[] = cart.docs.map(item => {
            const product = item.product as Product;
            return {
              productId: product.id,
              quantity: item.quantity,
              name: product.title,
              price: getPriceProduct(product),
              slug: product.slug as string,
              image: (product.image as Media)?.filename as string || 'logo-white-blue_512.png'
            }
          });
          set({ items: cartItems, isLoading: false });
        }
      } else {
        const currentItems = getCartFromCookie();
        const itemIndex = currentItems.findIndex(item => item.productId === productId);
        if (itemIndex >= 0) {
          currentItems[itemIndex].quantity = quantity;
          saveCartToCookie(currentItems);
          set({ items: currentItems, isLoading: false });
        }
      }
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
      set({ isLoading: false });
    }
  },

  fetchCart: async () => {
    try {
      set({ isLoading: true });
      const user = await getCurrentUser();

      if (user?.role === 'user' || user?.role === 'pro') {
        const cart = await getCart();
        
        if (cart) {
          const cartItems: CartItem[] = cart.docs.map(item => {
            const product = item.product as Product;
            return {
              productId: product.id,
              quantity: item.quantity,
              name: product.title,
              price: getPriceProduct(product),
              slug: product.slug as string,
              image: (product.image as Media)?.filename as string || 'logo-white-blue_512.png'
            }
          });
          set({ items: cartItems, isLoading: false });
        }
      } else {
        const cartItems = getCartFromCookie();
        set({ items: cartItems, isLoading: false });
      }
    } catch (error) {
      console.error('Error al obtener carrito:', error);
      set({ isLoading: false });
    }
  },

  removeCart: async () => {
    try {
      set({ isLoading: true });
      const user = await getCurrentUser();

      if (user?.role === 'user' || user?.role === 'pro') {
        await clearCart();
      } else {
        Cookies.remove(CART_COOKIE_NAME);
      }
      set({ items: [], isLoading: false });
    } catch (error) {
      console.error('Error al eliminar carrito:', error);
      set({ isLoading: false });
    }
  },
  removeCartLogout: async () => {
    set({ items: [], jwtUser: null });
  }
}));