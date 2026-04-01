-- ElectroMall RLS Policies
-- Script 2: Row Level Security policies

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Categories policies (public read, admin write)
CREATE POLICY "categories_select_all" ON categories
  FOR SELECT USING (true);

CREATE POLICY "categories_insert_admin" ON categories
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "categories_update_admin" ON categories
  FOR UPDATE USING (is_admin());

CREATE POLICY "categories_delete_admin" ON categories
  FOR DELETE USING (is_admin());

-- Products policies (public read active, admin write)
CREATE POLICY "products_select_active" ON products
  FOR SELECT USING (active = true OR is_admin());

CREATE POLICY "products_insert_admin" ON products
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "products_update_admin" ON products
  FOR UPDATE USING (is_admin());

CREATE POLICY "products_delete_admin" ON products
  FOR DELETE USING (is_admin());

-- Profiles policies (user owns their profile, admin can view all)
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id OR is_admin());

CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_delete_own" ON profiles
  FOR DELETE USING (auth.uid() = id);

-- Orders policies (user sees own orders, admin sees all)
CREATE POLICY "orders_select_own" ON orders
  FOR SELECT USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "orders_insert_own" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "orders_update_admin" ON orders
  FOR UPDATE USING (is_admin());

-- Order items policies (follows order access)
CREATE POLICY "order_items_select" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND (orders.user_id = auth.uid() OR is_admin())
    )
  );

CREATE POLICY "order_items_insert" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Cart items policies (user manages own cart)
CREATE POLICY "cart_items_select_own" ON cart_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "cart_items_insert_own" ON cart_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "cart_items_update_own" ON cart_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "cart_items_delete_own" ON cart_items
  FOR DELETE USING (auth.uid() = user_id);
