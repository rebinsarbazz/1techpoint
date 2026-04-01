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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Pencil, Trash2 } from "lucide-react"
import type { Category } from "@/lib/types/database"
import Image from "next/image"

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const supabase = createClient()

  const [formData, setFormData] = useState({
    name_en: "",
    name_ku: "",
    name_ar: "",
    slug: "",
    image_url: "",
    parent_id: "",
    sort_order: "0",
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true })
    if (data) setCategories(data)
    setLoading(false)
  }

  function resetForm() {
    setFormData({
      name_en: "",
      name_ku: "",
      name_ar: "",
      slug: "",
      image_url: "",
      parent_id: "",
      sort_order: "0",
    })
    setEditingCategory(null)
  }

  function handleEdit(category: Category) {
    setEditingCategory(category)
    setFormData({
      name_en: category.name_en,
      name_ku: category.name_ku,
      name_ar: category.name_ar,
      slug: category.slug,
      image_url: category.image_url || "",
      parent_id: category.parent_id || "",
      sort_order: category.sort_order?.toString() || "0",
    })
    setIsDialogOpen(true)
  }

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const categoryData = {
      name_en: formData.name_en,
      name_ku: formData.name_ku,
      name_ar: formData.name_ar,
      slug: formData.slug || generateSlug(formData.name_en),
      image_url: formData.image_url || null,
      parent_id: formData.parent_id || null,
      sort_order: parseInt(formData.sort_order),
    }

    if (editingCategory) {
      await supabase
        .from("categories")
        .update(categoryData)
        .eq("id", editingCategory.id)
    } else {
      await supabase.from("categories").insert(categoryData)
    }

    setIsDialogOpen(false)
    resetForm()
    fetchCategories()
  }

  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this category?")) {
      await supabase.from("categories").delete().eq("id", id)
      fetchCategories()
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
        <h1 className="text-2xl font-bold">Categories</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 me-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit Category" : "Add New Category"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="name_en">Name (English)</Label>
                  <Input
                    id="name_en"
                    className="mt-2"
                    value={formData.name_en}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        name_en: e.target.value,
                        slug: generateSlug(e.target.value),
                      })
                    }}
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

              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  className="mt-2"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  className="mt-2"
                  value={formData.image_url}
                  onChange={(e) =>
                    setFormData({ ...formData, image_url: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <Label htmlFor="parent_id">Parent Category</Label>
                <select
                  id="parent_id"
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 mt-2"
                  value={formData.parent_id}
                  onChange={(e) =>
                    setFormData({ ...formData, parent_id: e.target.value })
                  }
                >
                  <option value="">None (Top Level)</option>
                  {categories
                    .filter((c) => c.id !== editingCategory?.id)
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name_en}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input
                  id="sort_order"
                  className="mt-2"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) =>
                    setFormData({ ...formData, sort_order: e.target.value })
                  }
                />
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
                  {editingCategory ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{categories.length} Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name (EN)</TableHead>
                <TableHead>Name (KU)</TableHead>
                <TableHead>Name (AR)</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Order</TableHead>
                <TableHead className="text-end">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    {category.image_url ? (
                      <Image
                        src={category.image_url}
                        alt={category.name_en}
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
                    {category.name_en}
                  </TableCell>
                  <TableCell>{category.name_ku}</TableCell>
                  <TableCell>{category.name_ar}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {category.slug}
                  </TableCell>
                  <TableCell>{category.sort_order}</TableCell>
                  <TableCell className="text-end">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(category)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(category.id)}
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
