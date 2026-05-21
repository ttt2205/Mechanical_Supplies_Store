'use client';

import React from 'react';
import { useProductCategories } from '@/hooks/useProductCategories';
import { useProducts } from '@/hooks/useProducts';
import CategoryProductSection from './CategoryProductSection';

const CategoryProductsShowcase: React.FC = () => {
    const { categories, loading: categoriesLoading } = useProductCategories();
    const { products, loading: productsLoading } = useProducts();

    if (categoriesLoading || productsLoading) return null;

    const parentCategories = categories
        .filter(cat => cat.parent_id === null)
        .sort((a, b) => a.display_order - b.display_order);

    return (
        <>
            {parentCategories.map((category, index) => (
                <CategoryProductSection 
                    key={category.category_id}
                    category={category}
                    allCategories={categories}
                    allProducts={products}
                    index={index}
                />
            ))}
        </>
    );
};

export default CategoryProductsShowcase;
