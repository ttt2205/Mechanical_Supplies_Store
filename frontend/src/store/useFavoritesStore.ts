import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/product';

interface FavoritesState {
  favorites: Product[];
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: number) => void;
  clearFavorites: () => void;
  isFavorite: (productId: number) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      
      addFavorite: (product) => {
        const { favorites } = get();
        if (!favorites.some(p => p.product_id === product.product_id)) {
          set({ favorites: [...favorites, product] });
        }
      },

      removeFavorite: (productId) => {
        set({ favorites: get().favorites.filter(p => p.product_id !== productId) });
      },

      clearFavorites: () => set({ favorites: [] }),

      isFavorite: (productId) => {
        return get().favorites.some(p => p.product_id === productId);
      }
    }),
    {
      name: 'favorites-storage',
    }
  )
);
