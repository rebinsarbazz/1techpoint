import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProductDetails } from '@/components/store/product-details'
import { FeaturedProducts } from '@/components/store/featured-products'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (!product) {
    return { title: 'Product Not Found' }
  }

  return {
    title: product.name_en,
    description: product.description_en || `Buy ${product.name_en} at ElectroMall`,
    openGraph: {
      images: product.images?.[0] ? [product.images[0]] : [],
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: product } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('id', id)
    .eq('active', true)
    .single()

  if (!product) {
    notFound()
  }

  // Fetch related products
  const { data: relatedProducts } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .eq('category_id', product.category_id)
    .neq('id', product.id)
    .limit(4)

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetails product={product} />
      
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="mt-16">
          <FeaturedProducts 
            products={relatedProducts} 
            title="relatedProducts"
            showViewAll={false}
          />
        </section>
      )}
    </div>
  )
}
