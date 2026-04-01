import { createClient } from '@/lib/supabase/server'
import { HeroSection } from '@/components/store/hero-section'
import { FeaturedProducts } from '@/components/store/featured-products'
import { CategoryGrid } from '@/components/store/category-grid'
import { PromoBanner } from '@/components/store/promo-banner'

export default async function HomePage() {
  const supabase = await createClient()
  
  // Fetch featured products
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .eq('featured', true)
    .limit(8)
  
  // Fetch categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')
  
  // Fetch latest products
  const { data: latestProducts } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })
    .limit(8)

  // Fetch sale products
  const { data: saleProducts } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .not('sale_price', 'is', null)
    .limit(4)

  return (
    <div className="flex flex-col">
      <HeroSection />
      
      <section className="container mx-auto px-4 py-12">
        <CategoryGrid categories={categories || []} />
      </section>

      {featuredProducts && featuredProducts.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <FeaturedProducts 
            products={featuredProducts} 
            title="featuredProducts"
          />
        </section>
      )}

      {saleProducts && saleProducts.length > 0 && (
        <PromoBanner products={saleProducts} />
      )}

      {latestProducts && latestProducts.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <FeaturedProducts 
            products={latestProducts} 
            title="newArrivals"
          />
        </section>
      )}
    </div>
  )
}
