-- ElectroMall Seed Data
-- Script 4: Sample categories and products

-- Insert categories
INSERT INTO categories (name_en, name_ku, name_ar, slug, sort_order) VALUES
  ('Smartphones', 'مۆبایل', 'الهواتف الذكية', 'smartphones', 1),
  ('Laptops', 'لاپتۆپ', 'أجهزة اللابتوب', 'laptops', 2),
  ('Tablets', 'تابلێت', 'الأجهزة اللوحية', 'tablets', 3),
  ('Audio', 'دەنگ', 'الصوتيات', 'audio', 4),
  ('Gaming', 'یاری', 'الألعاب', 'gaming', 5),
  ('Accessories', 'پێوەندیدار', 'الإكسسوارات', 'accessories', 6),
  ('Smart Home', 'ماڵی زیرەک', 'المنزل الذكي', 'smart-home', 7),
  ('Cameras', 'کامێرا', 'الكاميرات', 'cameras', 8)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO products (name_en, name_ku, name_ar, description_en, description_ku, description_ar, price, sale_price, stock, category_id, featured, images) 
SELECT 
  'iPhone 15 Pro Max',
  'ئایفۆن ١٥ پرۆ ماکس',
  'آيفون 15 برو ماكس',
  'The most powerful iPhone ever with A17 Pro chip, titanium design, and advanced camera system.',
  'بەهێزترین ئایفۆن هەتا ئێستا لەگەڵ چیپی A17 Pro، دیزاینی تیتانیۆم، و سیستەمی کامێرای پێشکەوتوو.',
  'أقوى آيفون على الإطلاق مع شريحة A17 Pro وتصميم تيتانيوم ونظام كاميرا متقدم.',
  1199.99,
  NULL,
  50,
  id,
  true,
  ARRAY['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800']
FROM categories WHERE slug = 'smartphones'
ON CONFLICT DO NOTHING;

INSERT INTO products (name_en, name_ku, name_ar, description_en, description_ku, description_ar, price, sale_price, stock, category_id, featured, images) 
SELECT 
  'Samsung Galaxy S24 Ultra',
  'سامسۆنگ گالاکسی S24 ئۆڵترا',
  'سامسونج جالاكسي S24 ألترا',
  'Ultimate Galaxy experience with built-in S Pen, 200MP camera, and Galaxy AI features.',
  'باشترین ئەزموونی گالاکسی لەگەڵ S Pen، کامێرای 200MP، و تایبەتمەندییەکانی Galaxy AI.',
  'تجربة جالاكسي المطلقة مع قلم S Pen المدمج وكاميرا 200 ميجابكسل وميزات Galaxy AI.',
  1299.99,
  1199.99,
  35,
  id,
  true,
  ARRAY['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800']
FROM categories WHERE slug = 'smartphones'
ON CONFLICT DO NOTHING;

INSERT INTO products (name_en, name_ku, name_ar, description_en, description_ku, description_ar, price, sale_price, stock, category_id, featured, images) 
SELECT 
  'MacBook Pro 16"',
  'ماکبووک پرۆ ١٦"',
  'ماك بوك برو 16 بوصة',
  'Supercharged by M3 Pro or M3 Max chip. Up to 22 hours battery life.',
  'بەهێزکراوە بە چیپی M3 Pro یان M3 Max. هەتا ٢٢ کاتژمێر تەمەنی باتری.',
  'مدعوم بشريحة M3 Pro أو M3 Max. حتى 22 ساعة من عمر البطارية.',
  2499.99,
  NULL,
  20,
  id,
  true,
  ARRAY['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800']
FROM categories WHERE slug = 'laptops'
ON CONFLICT DO NOTHING;

INSERT INTO products (name_en, name_ku, name_ar, description_en, description_ku, description_ar, price, sale_price, stock, category_id, featured, images) 
SELECT 
  'Dell XPS 15',
  'دێل XPS ١٥',
  'ديل XPS 15',
  'Premium laptop with InfinityEdge display, 13th Gen Intel Core processors.',
  'لاپتۆپی پریمیەم لەگەڵ شاشەی InfinityEdge، پرۆسێسەرەکانی نەوەی ١٣ی Intel Core.',
  'لابتوب متميز مع شاشة InfinityEdge ومعالجات Intel Core من الجيل الثالث عشر.',
  1799.99,
  1599.99,
  25,
  id,
  false,
  ARRAY['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800']
FROM categories WHERE slug = 'laptops'
ON CONFLICT DO NOTHING;

INSERT INTO products (name_en, name_ku, name_ar, description_en, description_ku, description_ar, price, sale_price, stock, category_id, featured, images) 
SELECT 
  'iPad Pro 12.9"',
  'ئایپاد پرۆ ١٢.٩"',
  'آيباد برو 12.9 بوصة',
  'The ultimate iPad experience with M2 chip and Liquid Retina XDR display.',
  'باشترین ئەزموونی ئایپاد لەگەڵ چیپی M2 و شاشەی Liquid Retina XDR.',
  'تجربة آيباد المطلقة مع شريحة M2 وشاشة Liquid Retina XDR.',
  1099.99,
  NULL,
  30,
  id,
  true,
  ARRAY['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800']
FROM categories WHERE slug = 'tablets'
ON CONFLICT DO NOTHING;

INSERT INTO products (name_en, name_ku, name_ar, description_en, description_ku, description_ar, price, sale_price, stock, category_id, featured, images) 
SELECT 
  'Sony WH-1000XM5',
  'سۆنی WH-1000XM5',
  'سوني WH-1000XM5',
  'Industry-leading noise cancellation headphones with exceptional sound quality.',
  'گوێگرەکانی نۆیز کانسێلەیشنی پێشەنگی پیشەسازی لەگەڵ کوالیتی دەنگی نایاب.',
  'سماعات إلغاء الضوضاء الرائدة في الصناعة مع جودة صوت استثنائية.',
  349.99,
  299.99,
  45,
  id,
  true,
  ARRAY['https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800']
FROM categories WHERE slug = 'audio'
ON CONFLICT DO NOTHING;

INSERT INTO products (name_en, name_ku, name_ar, description_en, description_ku, description_ar, price, sale_price, stock, category_id, featured, images) 
SELECT 
  'PlayStation 5',
  'پلەیستەیشن ٥',
  'بلايستيشن 5',
  'Experience lightning-fast loading, deeper immersion with haptic feedback.',
  'ئەزموونی لۆدکردنی خێرای وەک بروسکە، چوونە ناو قووڵتر لەگەڵ haptic feedback.',
  'استمتع بتحميل سريع كالبرق وانغماس أعمق مع ردود الفعل اللمسية.',
  499.99,
  NULL,
  15,
  id,
  true,
  ARRAY['https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800']
FROM categories WHERE slug = 'gaming'
ON CONFLICT DO NOTHING;

INSERT INTO products (name_en, name_ku, name_ar, description_en, description_ku, description_ar, price, sale_price, stock, category_id, featured, images) 
SELECT 
  'AirPods Pro 2',
  'ئێرپۆدز پرۆ ٢',
  'إيربودز برو 2',
  'Active Noise Cancellation, Adaptive Transparency, and Personalized Spatial Audio.',
  'Active Noise Cancellation، Adaptive Transparency، و Personalized Spatial Audio.',
  'إلغاء الضوضاء النشط والشفافية التكيفية والصوت المكاني المخصص.',
  249.99,
  229.99,
  60,
  id,
  false,
  ARRAY['https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800']
FROM categories WHERE slug = 'accessories'
ON CONFLICT DO NOTHING;

INSERT INTO products (name_en, name_ku, name_ar, description_en, description_ku, description_ar, price, sale_price, stock, category_id, featured, images) 
SELECT 
  'Google Nest Hub Max',
  'گووگڵ نێست هەب ماکس',
  'جوجل نيست هاب ماكس',
  'The biggest, best Google Nest display with a built-in Nest Cam.',
  'گەورەترین و باشترین شاشەی Google Nest لەگەڵ Nest Cam ی ناوەکی.',
  'أكبر وأفضل شاشة Google Nest مع كاميرا Nest مدمجة.',
  229.99,
  199.99,
  40,
  id,
  false,
  ARRAY['https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=800']
FROM categories WHERE slug = 'smart-home'
ON CONFLICT DO NOTHING;

INSERT INTO products (name_en, name_ku, name_ar, description_en, description_ku, description_ar, price, sale_price, stock, category_id, featured, images) 
SELECT 
  'Canon EOS R6 Mark II',
  'کانۆن EOS R6 Mark II',
  'كانون EOS R6 Mark II',
  'Full-frame mirrorless camera with 24.2MP sensor and 40fps continuous shooting.',
  'کامێرای میرۆرلەس فول-فرەیم لەگەڵ سێنسەری 24.2MP و وێنەگرتنی بەردەوامی 40fps.',
  'كاميرا ميرورليس فل فريم بدقة 24.2 ميجابكسل وتصوير متواصل 40 إطار في الثانية.',
  2499.99,
  NULL,
  10,
  id,
  false,
  ARRAY['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800']
FROM categories WHERE slug = 'cameras'
ON CONFLICT DO NOTHING;
