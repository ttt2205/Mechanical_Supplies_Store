import { create } from 'zustand';

interface UIState {
    // Featured Products Slider
    featuredSliderIndex: number;
    setFeaturedSliderIndex: (index: number) => void;

    // Category Tabs Slider
    activeCategoryId: number | null;
    categorySliderIndex: number;
    setActiveCategoryId: (id: number | null) => void;
    setCategorySliderIndex: (index: number) => void;
}

export const useUIStore = create<UIState>((set) => ({
    // Featured Products Slider
    featuredSliderIndex: 0,
    setFeaturedSliderIndex: (index) => set({ featuredSliderIndex: index }),

    // Category Tabs Slider
    activeCategoryId: null,
    categorySliderIndex: 0,
    setActiveCategoryId: (id) => set({ 
        activeCategoryId: id, 
        categorySliderIndex: 0 // Reset slider index when category changes
    }),
    setCategorySliderIndex: (index) => set({ categorySliderIndex: index }),
}));
