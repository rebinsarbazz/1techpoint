"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Plus, Pencil, Trash2, Search } from "lucide-react"
import type { Product, Category } from "@/lib/types/database"
import Image from "next/image"

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const supabase = createClient()

  const [formData, setFormData] = useState({
    name_en: "",
    name_ku: "",
    name_ar: "",
    description_en: "",
    description_ku: "",
    description_ar: "",
    price: "",
    sale_price: "",
    stock: "",
    sku: "",
    category_id: "",
    images: "",
    featured: false,
    active: true,
  })

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  async function fetchProducts() {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
    if (data) setProducts(data)
    setLoading(false)
  }

  async function fetchCategories() {
    const { data } = await supabase.from("categories").select("*")
    if (data) setCategories(data)
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  function resetForm() {
    setFormData({
      name_en: "",
      name_ku: "",
      name_ar: "",
      description_en: "",
      description_ku: "",
      description_ar: "",
      price: "",
      sale_price: "",
      stock: "",
      sku: "",
      category_id: "",
      images: "",
      featured: false,
      active: true,
    })
    setEditingProduct(null)
  }

  function handleEdit(product: Product) {
    setEditingProduct(product)
    setFormData({
      name_en: product.name_en,
      name_ku: product.name_ku,
      name_ar: product.name_ar,
      description_en: product.description_en || "",
      description_ku: product.description_ku || "",
      description_ar: product.description_ar || "",
      price: product.price.toString(),
      sale_price: product.sale_price?.toString() || "",
      stock: product.stock.toString(),
      sku: product.sku || "",
      category_id: product.category_id || "",
      images: product.images?.join(", ") || "",
      featured: product.featured,
      active: product.active,
    })
    setIsDialogOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const productData = {
      name_en: formData.name_en,
      name_ku: formData.name_ku,
      name_ar: formData.name_ar,
      description_en: formData.description_en || null,
      description_ku: formData.description_ku || null,
      description_ar: formData.description_ar || null,
      price: parseFloat(formData.price),
      sale_price: formData.sale_price ? parseFloat(formData.sale_price) : null,
      stock: parseInt(formData.stock),
      sku: formData.sku || null,
      category_id: formData.category_id || null,
      images: formData.images
        ? formData.images.split(",").map((s) => s.trim())
        : [],
      featured: formData.featured,
      active: formData.active,
    }

    if (editingProduct) {
      await supabase
        .from("products")
        .update(productData)
        .eq("id", editingProduct.id)
    } else {
      const { error } = await supabase
  .from("products")
  .insert(productData)

if (error) {
  console.error("Insert error:", error)
  alert(error.message)
}
    }

    setIsDialogOpen(false)
    resetForm()
    fetchProducts()
  }

  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this product?")) {
      await supabase.from("products").delete().eq("id", id)
      fetchProducts()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 me-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="name_en">Name (English)</Label>
                  <Input
                    id="name_en"
                    className="mt-2"
                    value={formData.name_en}
                    onChange={(e) =>
                      setFormData({ ...formData, name_en: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="name_ku">Name (Kurdish)</Label>
                  <Input
                    id="name_ku"
                    className="mt-2"
                    value={formData.name_ku}
                    onChange={(e) =>
                      setFormData({ ...formData, name_ku: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="name_ar">Name (Arabic)</Label>
                  <Input
                    id="name_ar"
                    className="mt-2"
                    value={formData.name_ar}
                    onChange={(e) =>
                      setFormData({ ...formData, name_ar: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="description_en">Description (English)</Label>
                  <Textarea
                    id="description_en"
                    className="mt-2"
                    value={formData.description_en}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description_en: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="description_ku">Description (Kurdish)</Label>
                  <Textarea
                    id="description_ku"
                    className="mt-2"
                    value={formData.description_ku}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description_ku: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="description_ar">Description (Arabic)</Label>
                  <Textarea
                    id="description_ar"
                    className="mt-2"
                    value={formData.description_ar}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description_ar: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="price">Price (IQD)</Label>
                  <Input
                    id="price"
                    className="mt-2"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="sale_price">Sale Price (IQD)</Label>
                  <Input
                    id="sale_price"
                    className="mt-2"
                    type="number"
                    step="0.01"
                    value={formData.sale_price}
                    onChange={(e) =>
                      setFormData({ ...formData, sale_price: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    className="mt-2"
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    className="mt-2"
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category_id">Category</Label>
                <select
                  id="category_id"
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 mt-2"
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData({ ...formData, category_id: e.target.value })
                  }
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name_en}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="images">Image URLs (comma-separated)</Label>
                <Textarea
                  id="images"
                  className="mt-2"
                  value={formData.images}
                  onChange={(e) =>
                    setFormData({ ...formData, images: e.target.value })
                  }
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  rows={2}
                />
              </div>

              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, featured: checked })
                    }
                  />
                  <Label htmlFor="featured">Featured</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, active: checked })
                    }
                  />
                  <Label htmlFor="active">Active</Label>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingProduct ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-9"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {filteredProducts.length} products
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-end">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name_en}
                        width={48}
                        height={48}
                        className="rounded object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center text-xs">
                        No img
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {product.name_en}
                  </TableCell>
                  <TableCell>{product.sku || "-"}</TableCell>
                  <TableCell>
                    {product.sale_price ? (
                      <div>
                        <span className="text-destructive line-through text-sm">
                          {product.price} IQD
                        </span>
                        <span className="ms-2 font-semibold">
                          {product.sale_price} IQD
                        </span>
                      </div>
                    ) : (
                      <span>{product.price} IQD</span>
                    )}
                  </TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {product.featured && (
                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                          Featured
                        </span>
                      )}
                      <span
                        className={`px-2 py-1 text-xs rounded ${product.active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                          }`}
                      >
                        {product.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-end">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
