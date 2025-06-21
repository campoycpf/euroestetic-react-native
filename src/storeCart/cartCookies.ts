import Cookies from 'js-cookie';
import { CART_COOKIE_NAME } from 'utils/consts';
import { CartItem } from './types';

export const currentCart = () => {
  const saveCartToCookie = (items: CartItem[]) => {
    Cookies.set(CART_COOKIE_NAME, JSON.stringify(items), { expires: 7 });
  };

  const getCartFromCookie = (): CartItem[] => {
    const cartData = Cookies.get(CART_COOKIE_NAME);
    return cartData ? JSON.parse(cartData) : [];
  };

  return {
    getCurrentCart: () => {
      const items = getCartFromCookie();
      return { cartItems: items };
    },

    addToCart: (item: CartItem) => {
      const currentItems = getCartFromCookie();
      const existingItemIndex = currentItems.findIndex(i => 
        i.productId === item.productId
      );

      if (existingItemIndex >= 0) {
        currentItems[existingItemIndex].quantity += item.quantity;
      } else {
        currentItems.push(item);
      }

      saveCartToCookie(currentItems);
      return { cartItems: currentItems };
    },

    removeLineItemsFromCart: (productId: number) => {
      const currentItems = getCartFromCookie();
      const updatedItems = currentItems.filter(item => item.productId !== productId);
      saveCartToCookie(updatedItems);
      return { cartItems: updatedItems };
    },

    updateLineItemQuantity: (productId: number, quantity: number) => {
      const currentItems = getCartFromCookie();
      const updatedItems = currentItems.map(item => 
        item.productId === productId ? { ...item, quantity } : item
      );
      saveCartToCookie(updatedItems);
      return { cartItems: updatedItems };
    },

    clearCart: () => {
      Cookies.remove(CART_COOKIE_NAME);
    }
  };
};