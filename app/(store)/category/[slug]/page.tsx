import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProductGrid } from '@/components/store/product-grid'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!category) {
    return { title: 'Category Not Found' }
  }

  return {
    title: category.name_en,
    description: `Shop ${category.name_en} at ElectroMall. Best prices and fast delivery.`,
  }
}

export default async function CategoryPage({ 
  params,
  searchParams, 
}: { 
  params: Promise<{ slug: string }>
  searchParams: Promise<{ sort?: string }>
}) {
  const { slug } = await params
  const search = await searchParams
  const supabase = await createClient()
  
  // Fetch category
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!category) {
    notFound()
  }

  // Fetch products in category
  let query = supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .eq('category_id', category.id)

  // Sort
  switch (search.sort) {
    case 'price-asc':
      query = query.order('price', { ascending: true })
      break
    case 'price-desc':
      query = query.order('price', { ascending: false })
      break
    case 'newest':
      query = query.order('created_at', { ascending: false })
      break
    default:
      query = query.order('featured', { ascending: false }).order('created_at', { ascending: false })
  }

  const { data: products } = await query

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductGrid 
        products={products || []} 
        category={category}
        showFilters
      />
    </div>
  )
}
