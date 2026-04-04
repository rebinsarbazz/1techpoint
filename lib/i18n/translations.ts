// ElectroMall Translations - English, Kurdish (Sorani), Arabic

export type Locale = 'en' | 'ku' | 'ar'

export const locales: Locale[] = ['en', 'ku', 'ar']
export const defaultLocale: Locale = 'en'

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ku: 'کوردی',
  ar: 'العربية'
}

export const rtlLocales: Locale[] = ['ku', 'ar']

export const isRTL = (locale: Locale): boolean => rtlLocales.includes(locale)

export type TranslationKey = keyof typeof translations.en

export const translations = {
  en: {
    // Brand
    siteName: 'First Tech Point',
    siteDescription: 'Shop the Latest Electronics, Mobiles, Computers & Home Appliances',
    
    // Navigation
    home: 'Home',
    categories: 'Categories',
    products: 'Products',
    cart: 'Cart',
    account: 'Account',
    orders: 'My Orders',
    profile: 'Profile',
    admin: 'Admin Dashboard',
    login: 'Login',
    logout: 'Logout',
    signUp: 'Sign Up',
    
    // Search
    search: 'Search',
    searchPlaceholder: 'Search for products...',
    searchResults: 'Search Results',
    noResults: 'No results found',
    
    // Products
    allProducts: 'All Products',
    featuredProducts: 'Featured Products',
    newArrivals: 'New Arrivals',
    bestSellers: 'Best Sellers',
    onSale: 'On Sale',
    addToCart: 'Add to Cart',
    buyNow: 'Buy Now',
    outOfStock: 'Out of Stock',
    inStock: 'In Stock',
    price: 'Price',
    quantity: 'Quantity',
    description: 'Description',
    specifications: 'Specifications',
    reviews: 'Reviews',
    relatedProducts: 'Related Products',
    text1: "Save up to",
    text2: "on Selected Products",
    text3: "Get the best deals on top electronics.",
    
    // Categories
    allCategories: 'All Categories',
    shopByCategory: 'Shop by Category',
    viewAll: 'View All',
    
    // Cart
    shoppingCart: 'Shopping Cart',
    cartEmpty: 'Your cart is empty',
    cartSubtotal: 'Subtotal',
    cartTotal: 'Total',
    shipping: 'Shipping',
    freeShipping: 'Free Shipping',
    continueShipping: 'Continue Shopping',
    proceedToCheckout: 'Proceed to Checkout',
    removeItem: 'Remove',
    updateCart: 'Update Cart',
    
    // Checkout
    checkout: 'Checkout',
    shippingInfo: 'Shipping Information',
    paymentMethod: 'Payment Method',
    orderSummary: 'Order Summary',
    placeOrder: 'Place Order',
    fullName: 'Full Name',
    phone: 'Phone Number',
    address: 'Address',
    city: 'City',
    notes: 'Order Notes (Optional)',
    
    // Payment Methods
    cod: 'Cash on Delivery',
    codDesc: 'Pay when you receive your order',
    fastpay: 'FastPay',
    fastpayDesc: 'Pay with FastPay wallet',
    fib: 'FIB',
    fibDesc: 'Pay with FIB mobile banking',
    
    // Orders
    orderHistory: 'Order History',
    orderDetails: 'Order Details',
    orderNumber: 'Order Number',
    orderDate: 'Order Date',
    orderStatus: 'Order Status',
    orderTotal: 'Order Total',
    trackOrder: 'Track Order',
    noOrders: 'You have no orders yet',
    
    // Order Statuses
    statusPending: 'Pending',
    statusConfirmed: 'Confirmed',
    statusProcessing: 'Processing',
    statusShipped: 'Shipped',
    statusDelivered: 'Delivered',
    statusCancelled: 'Cancelled',
    
    // Auth
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    forgotPassword: 'Forgot Password?',
    resetPassword: 'Reset Password',
    createAccount: 'Create Account',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    loginSuccess: 'Login successful',
    signUpSuccess: 'Account created! Please check your email to verify.',
    
    // Admin
    dashboard: 'Dashboard',
    manageProducts: 'Manage Products',
    manageCategories: 'Manage Categories',
    manageOrders: 'Manage Orders',
    addProduct: 'Add Product',
    editProduct: 'Edit Product',
    deleteProduct: 'Delete Product',
    addCategory: 'Add Category',
    editCategory: 'Edit Category',
    deleteCategory: 'Delete Category',
    totalOrders: 'Total Orders',
    totalRevenue: 'Total Revenue',
    totalProducts: 'Total Products',
    totalCustomers: 'Total Customers',
    
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    confirm: 'Confirm',
    yes: 'Yes',
    no: 'No',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    submit: 'Submit',
    currency: 'IQD',
    
    // Footer
    aboutUs: 'About Us',
    contactUs: 'Contact Us',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    customerService: 'Customer Service',
    followUs: 'Follow Us',
    newsletter: 'Newsletter',
    subscribeNewsletter: 'Subscribe to our newsletter',
    emailPlaceholder: 'Enter your email',
    subscribe: 'Subscribe',
    payment: 'Payment Methods',
    allRightsReserved: 'All Rights Reserved',
  },
  
  ku: {
    // Brand
    siteName: 'First Tech Point',
    siteDescription: 'نوێترین ئەلیکترۆنیات، مۆبایل، کۆمپیوتەر و ئامێرەکانی ماڵ بکڕە',
    
    // Navigation
    home: 'ماڵەوە',
    categories: 'پۆلەکان',
    products: 'بەرهەمەکان',
    cart: 'سەبەتە',
    account: 'هەژمار',
    orders: 'داواکاریەکانم',
    profile: 'پرۆفایل',
    admin: 'داشبۆردی بەڕێوەبەر',
    login: 'چوونەژوورەوە',
    logout: 'چوونەدەرەوە',
    signUp: 'تۆمارکردن',
    
    // Search
    search: 'گەڕان',
    searchPlaceholder: 'گەڕان بۆ بەرهەم...',
    searchResults: 'ئەنجامەکانی گەڕان',
    noResults: 'هیچ ئەنجامێک نەدۆزرایەوە',
    
    // Products
    allProducts: 'هەموو بەرهەمەکان',
    featuredProducts: 'بەرهەمە تایبەتەکان',
    newArrivals: 'نوێترینەکان',
    bestSellers: 'باشترین فرۆشەکان',
    onSale: 'داشکاندن',
    addToCart: 'زیادکردن بۆ سەبەتە',
    buyNow: 'ئێستا بکڕە',
    outOfStock: 'بەردەست نییە',
    inStock: 'بەردەستە',
    price: 'نرخ',
    quantity: 'ژمارە',
    description: 'وەسف',
    specifications: 'تایبەتمەندییەکان',
    reviews: 'هەڵسەنگاندنەکان',
    relatedProducts: 'بەرهەمە پەیوەندیدارەکان',
    text1: "پاشەکەوت بکە تا",
    text2: "لەسەر بەرهەمە هەڵبژێردراوەکان",
    text3: "باشترین گرێبەستەکان بەدەست بهێنە لەسەر ئەلیکترۆنیاتی سەرەکی.",
    
    // Categories
    allCategories: 'هەموو پۆلەکان',
    shopByCategory: 'کڕین بە پێی پۆل',
    viewAll: 'هەموو ببینە',
    
    // Cart
    shoppingCart: 'سەبەتەی کڕین',
    cartEmpty: 'سەبەتەکەت بەتاڵە',
    cartSubtotal: 'کۆی لاوەکی',
    cartTotal: 'کۆی گشتی',
    shipping: 'گەیاندن',
    freeShipping: 'گەیاندنی بێبەرامبەر',
    continueShipping: 'بەردەوامبوون لە کڕین',
    proceedToCheckout: 'بەردەوامبوون بۆ پارەدان',
    removeItem: 'لابردن',
    updateCart: 'نوێکردنەوەی سەبەتە',
    
    // Checkout
    checkout: 'تەواوکردنی کڕین',
    shippingInfo: 'زانیاری گەیاندن',
    paymentMethod: 'شێوازی پارەدان',
    orderSummary: 'کورتەی داواکاری',
    placeOrder: 'تۆمارکردنی داواکاری',
    fullName: 'ناوی تەواو',
    phone: 'ژمارەی تەلەفۆن',
    address: 'ناونیشان',
    city: 'شار',
    notes: 'تێبینی داواکاری (ئارەزوومەندانە)',
    
    // Payment Methods
    cod: 'پارەدان لە کاتی وەرگرتن',
    codDesc: 'کاتێک داواکاریەکەت دەگات پارە بدە',
    fastpay: 'فاست پەی',
    fastpayDesc: 'پارەدان بە جزدانی فاست پەی',
    fib: 'FIB',
    fibDesc: 'پارەدان بە FIB مۆبایل بانکینگ',
    
    // Orders
    orderHistory: 'مێژووی داواکاری',
    orderDetails: 'وردەکاری داواکاری',
    orderNumber: 'ژمارەی داواکاری',
    orderDate: 'بەرواری داواکاری',
    orderStatus: 'دۆخی داواکاری',
    orderTotal: 'کۆی داواکاری',
    trackOrder: 'بەدواداچوونی داواکاری',
    noOrders: 'هێشتا هیچ داواکاریەکت نییە',
    
    // Order Statuses
    statusPending: 'چاوەڕوان',
    statusConfirmed: 'پشتڕاستکراوە',
    statusProcessing: 'لە ئامادەکردندایە',
    statusShipped: 'نێردراوە',
    statusDelivered: 'گەیەندراوە',
    statusCancelled: 'هەڵوەشێندراوەتەوە',
    
    // Auth
    email: 'ئیمەیڵ',
    password: 'وشەی نهێنی',
    confirmPassword: 'دووبارەکردنەوەی وشەی نهێنی',
    forgotPassword: 'وشەی نهێنی لەبیرچووە؟',
    resetPassword: 'ڕیسێتکردنی وشەی نهێنی',
    createAccount: 'دروستکردنی هەژمار',
    alreadyHaveAccount: 'هەژمارت هەیە؟',
    dontHaveAccount: 'هەژمارت نییە؟',
    loginSuccess: 'چوونەژوورەوە سەرکەوتوو بوو',
    signUpSuccess: 'هەژمار دروستکرا! تکایە ئیمەیڵەکەت بپشکنە بۆ دڵنیاکردنەوە.',
    
    // Admin
    dashboard: 'داشبۆرد',
    manageProducts: 'بەڕێوەبردنی بەرهەمەکان',
    manageCategories: 'بەڕێوەبردنی پۆلەکان',
    manageOrders: 'بەڕێوەبردنی داواکاریەکان',
    addProduct: 'زیادکردنی بەرهەم',
    editProduct: 'دەستکاریکردنی بەرهەم',
    deleteProduct: 'سڕینەوەی بەرهەم',
    addCategory: 'زیادکردنی پۆل',
    editCategory: 'دەستکاریکردنی پۆل',
    deleteCategory: 'سڕینەوەی پۆل',
    totalOrders: 'کۆی داواکاریەکان',
    totalRevenue: 'کۆی داهات',
    totalProducts: 'کۆی بەرهەمەکان',
    totalCustomers: 'کۆی کڕیارەکان',
    
    // Common
    loading: 'چاوەڕوانبە...',
    error: 'هەڵە',
    success: 'سەرکەوتوو',
    cancel: 'پاشگەزبوونەوە',
    save: 'پاشەکەوتکردن',
    delete: 'سڕینەوە',
    edit: 'دەستکاری',
    close: 'داخستن',
    confirm: 'دڵنیاکردنەوە',
    yes: 'بەڵێ',
    no: 'نەخێر',
    back: 'گەڕانەوە',
    next: 'دواتر',
    previous: 'پێشتر',
    submit: 'ناردن',
    currency: 'د.ع',
    
    // Footer
    aboutUs: 'دەربارەی ئێمە',
    contactUs: 'پەیوەندیمان پێوەبکە',
    privacyPolicy: 'سیاسەتی تایبەتمەندی',
    termsOfService: 'مەرجەکانی خزمەتگوزاری',
    customerService: 'خزمەتگوزاری کڕیار',
    followUs: 'شوێنمان بکەوە',
    newsletter: 'نامەی هەواڵ',
    subscribeNewsletter: 'بەشداری لە نامەی هەواڵمان بکە',
    emailPlaceholder: 'ئیمەیڵەکەت بنووسە',
    subscribe: 'بەشداریکردن',
    payment: 'شێوازەکانی پارەدان',
    allRightsReserved: 'هەموو مافەکان پارێزراون',
  },
  
  ar: {
    // Brand
    siteName: 'First Tech Point',
    siteDescription: 'تسوق أحدث الإلكترونيات والهواتف والحواسيب والأجهزة المنزلية',
    
    // Navigation
    home: 'الرئيسية',
    categories: 'الفئات',
    products: 'المنتجات',
    cart: 'السلة',
    account: 'الحساب',
    orders: 'طلباتي',
    profile: 'الملف الشخصي',
    admin: 'لوحة التحكم',
    login: 'تسجيل الدخول',
    logout: 'تسجيل الخروج',
    signUp: 'إنشاء حساب',
    
    // Search
    search: 'بحث',
    searchPlaceholder: 'ابحث عن منتجات...',
    searchResults: 'نتائج البحث',
    noResults: 'لا توجد نتائج',
    
    // Products
    allProducts: 'جميع المنتجات',
    featuredProducts: 'منتجات مميزة',
    newArrivals: 'وصل حديثاً',
    bestSellers: 'الأكثر مبيعاً',
    onSale: 'عروض',
    addToCart: 'أضف إلى السلة',
    buyNow: 'اشترِ الآن',
    outOfStock: 'غير متوفر',
    inStock: 'متوفر',
    price: 'السعر',
    quantity: 'الكمية',
    description: 'الوصف',
    specifications: 'المواصفات',
    reviews: 'التقييمات',
    relatedProducts: 'منتجات ذات صلة',
    text1: "وفر حتى",
    text2: "على منتجات مختارة",
    text3: "احصل على أفضل العروض على أفضل الأجهزة الإلكترونية.",
    
    // Categories
    allCategories: 'جميع الفئات',
    shopByCategory: 'تسوق حسب الفئة',
    viewAll: 'عرض الكل',
    
    // Cart
    shoppingCart: 'سلة التسوق',
    cartEmpty: 'سلتك فارغة',
    cartSubtotal: 'المجموع الفرعي',
    cartTotal: 'المجموع الكلي',
    shipping: 'الشحن',
    freeShipping: 'شحن مجاني',
    continueShipping: 'متابعة التسوق',
    proceedToCheckout: 'المتابعة للدفع',
    removeItem: 'إزالة',
    updateCart: 'تحديث السلة',
    
    // Checkout
    checkout: 'إتمام الشراء',
    shippingInfo: 'معلومات الشحن',
    paymentMethod: 'طريقة الدفع',
    orderSummary: 'ملخص الطلب',
    placeOrder: 'تأكيد الطلب',
    fullName: 'الاسم الكامل',
    phone: 'رقم الهاتف',
    address: 'العنوان',
    city: 'المدينة',
    notes: 'ملاحظات الطلب (اختياري)',
    
    // Payment Methods
    cod: 'الدفع عند الاستلام',
    codDesc: 'ادفع عند استلام طلبك',
    fastpay: 'فاست باي',
    fastpayDesc: 'ادفع بمحفظة فاست باي',
    fib: 'FIB',
    fibDesc: 'ادفع بخدمة FIB المصرفية',
    
    // Orders
    orderHistory: 'سجل الطلبات',
    orderDetails: 'تفاصيل الطلب',
    orderNumber: 'رقم الطلب',
    orderDate: 'تاريخ الطلب',
    orderStatus: 'حالة الطلب',
    orderTotal: 'إجمالي الطلب',
    trackOrder: 'تتبع الطلب',
    noOrders: 'لا توجد طلبات حتى الآن',
    
    // Order Statuses
    statusPending: 'قيد الانتظار',
    statusConfirmed: 'مؤكد',
    statusProcessing: 'قيد التجهيز',
    statusShipped: 'تم الشحن',
    statusDelivered: 'تم التوصيل',
    statusCancelled: 'ملغي',
    
    // Auth
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    forgotPassword: 'نسيت كلمة المرور؟',
    resetPassword: 'إعادة تعيين كلمة المرور',
    createAccount: 'إنشاء حساب',
    alreadyHaveAccount: 'لديك حساب بالفعل؟',
    dontHaveAccount: 'ليس لديك حساب؟',
    loginSuccess: 'تم تسجيل الدخول بنجاح',
    signUpSuccess: 'تم إنشاء الحساب! يرجى التحقق من بريدك الإلكتروني.',
    
    // Admin
    dashboard: 'لوحة التحكم',
    manageProducts: 'إدارة المنتجات',
    manageCategories: 'إدارة الفئات',
    manageOrders: 'إدارة الطلبات',
    addProduct: 'إضافة منتج',
    editProduct: 'تعديل منتج',
    deleteProduct: 'حذف منتج',
    addCategory: 'إضافة فئة',
    editCategory: 'تعديل فئة',
    deleteCategory: 'حذف فئة',
    totalOrders: 'إجمالي الطلبات',
    totalRevenue: 'إجمالي الإيرادات',
    totalProducts: 'إجمالي المنتجات',
    totalCustomers: 'إجمالي العملاء',
    
    // Common
    loading: 'جاري التحميل...',
    error: 'خطأ',
    success: 'نجاح',
    cancel: 'إلغاء',
    save: 'حفظ',
    delete: 'حذف',
    edit: 'تعديل',
    close: 'إغلاق',
    confirm: 'تأكيد',
    yes: 'نعم',
    no: 'لا',
    back: 'رجوع',
    next: 'التالي',
    previous: 'السابق',
    submit: 'إرسال',
    currency: 'د.ع',
    
    // Footer
    aboutUs: 'من نحن',
    contactUs: 'اتصل بنا',
    privacyPolicy: 'سياسة الخصوصية',
    termsOfService: 'شروط الخدمة',
    customerService: 'خدمة العملاء',
    followUs: 'تابعنا',
    newsletter: 'النشرة الإخبارية',
    subscribeNewsletter: 'اشترك في نشرتنا الإخبارية',
    emailPlaceholder: 'أدخل بريدك الإلكتروني',
    subscribe: 'اشترك',
    payment: 'طرق الدفع',
    allRightsReserved: 'جميع الحقوق محفوظة',
  },
} as const

export function t(key: TranslationKey, locale: Locale): string {
  return translations[locale][key] || translations.en[key] || key
}
