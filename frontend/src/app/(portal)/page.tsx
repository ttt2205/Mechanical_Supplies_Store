import Hero from "@/features/portal/home/hero";
import WhyChooseUs from "@/features/portal/home/WhyChooseUs";
import FeaturedProducts from "@/features/portal/home/FeaturedProducts";
import CategoryProductTabs from "@/features/portal/home/CategoryProductTabs";
import CategoryProductsShowcase from "@/features/portal/home/CategoryProductsShowcase";

export default function HomePage() {
    return (
        <main>
            <Hero />
            <FeaturedProducts />
            <CategoryProductTabs />
            <CategoryProductsShowcase />
            <WhyChooseUs />
        </main>
    )
}