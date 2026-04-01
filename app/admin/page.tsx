import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, FolderTree, ShoppingCart, DollarSign, TrendingUp, Clock } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()
  
  // Fetch stats
  const [
    { count: productCount },
    { count: categoryCount },
    { count: orderCount },
    { data: recentOrders },
    { data: orders },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('orders').select('total, status'),
  ])

  const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total), 0) || 0
  const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0

  const stats = [
    { label: 'Total Products', value: productCount || 0, icon: Package, href: '/admin/products', color: 'text-blue-600' },
    { label: 'Categories', value: categoryCount || 0, icon: FolderTree, href: '/admin/categories', color: 'text-purple-600' },
    { label: 'Total Orders', value: orderCount || 0, icon: ShoppingCart, href: '/admin/orders', color: 'text-green-600' },
    { label: 'Revenue', value: `${totalRevenue.toLocaleString()} IQD`, icon: DollarSign, href: '/admin/orders', color: 'text-yellow-600' },
  ]

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="mt-1 text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-10 w-10 ${stat.color} opacity-80`} />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Pending Orders Alert */}
        {pendingOrders > 0 && (
          <Card className="border-yellow-200 bg-yellow-50 lg:col-span-2">
            <CardContent className="flex items-center gap-4 p-4">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="font-medium">You have {pendingOrders} pending orders</p>
                <p className="text-sm text-muted-foreground">Review and confirm them to start processing</p>
              </div>
              <Link
                href="/admin/orders?status=pending"
                className="ml-auto rounded-md bg-yellow-600 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-700"
              >
                View Orders
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Link href="/admin/orders" className="text-sm text-primary hover:underline">
              View All
            </Link>
          </CardHeader>
          <CardContent>
            {recentOrders && recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/admin/orders/${order.id}`}
                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-secondary/50"
                  >
                    <div>
                      <p className="font-mono text-sm">#{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`rounded px-2 py-1 text-xs font-medium ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                      <span className="font-semibold">
                        {Number(order.total).toLocaleString()} IQD
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">No orders yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
