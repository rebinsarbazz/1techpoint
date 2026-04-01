"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
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
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Eye } from "lucide-react"
import type { Order, OrderItem } from "@/lib/types/database"

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

const paymentStatusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-800",
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
    if (data) setOrders(data)
    setLoading(false)
  }

  async function fetchOrderItems(orderId: string) {
    const { data } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId)
    if (data) setOrderItems(data)
  }

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shipping_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shipping_phone.includes(searchQuery)
  )

  async function handleViewOrder(order: Order) {
    setSelectedOrder(order)
    await fetchOrderItems(order.id)
    setIsDialogOpen(true)
  }

  async function handleStatusChange(orderId: string, status: string) {
    await supabase.from("orders").update({ status }).eq("id", orderId)
    fetchOrders()
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status })
    }
  }

  async function handlePaymentStatusChange(
    orderId: string,
    payment_status: string
  ) {
    await supabase.from("orders").update({ payment_status }).eq("id", orderId)
    fetchOrders()
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, payment_status })
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
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
      <h1 className="text-2xl font-bold">Orders</h1>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID, name, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-9"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {filteredOrders.length} orders
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-end">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-sm">
                    {order.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.shipping_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.shipping_phone}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">{order.total} IQD</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs rounded capitalize ${
                        statusColors[order.status]
                      }`}
                    >
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs rounded capitalize ${
                        paymentStatusColors[order.payment_status]
                      }`}
                    >
                      {order.payment_status}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(order.created_at)}
                  </TableCell>
                  <TableCell className="text-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewOrder(order)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Order Details - {selectedOrder?.id.slice(0, 8)}...
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Order Status</Label>
                  <select
                    className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 py-2"
                    value={selectedOrder.status}
                    onChange={(e) =>
                      handleStatusChange(selectedOrder.id, e.target.value)
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <Label className="text-muted-foreground">Payment Status</Label>
                  <select
                    className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 py-2"
                    value={selectedOrder.payment_status}
                    onChange={(e) =>
                      handlePaymentStatusChange(selectedOrder.id, e.target.value)
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Shipping Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Name</p>
                    <p>{selectedOrder.shipping_name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p>{selectedOrder.shipping_phone}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">City</p>
                    <p>{selectedOrder.shipping_city}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Address</p>
                    <p>{selectedOrder.shipping_address}</p>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Order Items</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead className="text-end">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.product_name}</TableCell>
                        <TableCell>{item.price} IQD</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell className="text-end">
                          {(item.price * item.quantity).toFixed(2)} IQD
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{selectedOrder.subtotal} IQD</span>
                  </div>
                  <div className="flex justify-between font-semibold text-base border-t pt-2">
                    <span>Total</span>
                    <span>{selectedOrder.total} IQD</span>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Payment</h3>
                <p className="text-sm">
                  Method:{" "}
                  <span className="uppercase">{selectedOrder.payment_method}</span>
                </p>
              </div>

              {selectedOrder.notes && (
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Notes</h3>
                  <p className="text-sm">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
