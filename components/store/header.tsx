'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, ShoppingCart, User, Menu, Globe, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { useI18n, type Locale, locales } from '@/lib/i18n'
import { useCart } from '@/lib/cart/context'
import { createClient } from '@/lib/supabase/client'
import type { Category } from '@/lib/types/database'

export function Header() {
  const { t, locale, setLocale, localeNames, isRTL } = useI18n()
  const { itemCount } = useCart()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [user, setUser] = useState<{ email: string; isAdmin: boolean } | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      const { data: cats } = await supabase.from('categories').select('*').order('sort_order')
      if (cats) setCategories(cats)

      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', authUser.id)
          .single()
        setUser({ email: authUser.email || '', isAdmin: profile?.is_admin || false })
      }
    }
    loadData()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile }) => {
            setUser({ email: session.user.email || '', isAdmin: profile?.is_admin || false })
          })
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
  }

  const getCategoryName = (cat: Category) => {
    const key = `name_${locale}` as keyof Category
    return cat[key] as string
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* Mobile menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent
              side={isRTL ? 'right' : 'left'}
              className="w-80 p-6 flex flex-col h-full overflow-y-auto"
            >
              {/* Visually hidden title for accessibility */}
              <VisuallyHidden>
                <SheetTitle>{t('siteName')}</SheetTitle>
              </VisuallyHidden>

              {/* Logo and Site Name visible in UI */}
              <div className="flex items-center gap-2 mb-6">
                <img src="/logo.png" alt="Logo" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
                <span className="text-lg font-bold text-primary">{t('siteName')}</span>
              </div>

              <nav className="flex flex-col gap-4">
                <Link
                  href="/"
                  className="text-lg font-medium hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('home')}
                </Link>

                <div className="space-y-2">
                  <span className="text-sm font-semibold text-muted-foreground">{t('categories')}</span>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      className="block py-1 text-foreground hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {getCategoryName(cat)}
                    </Link>
                  ))}
                </div>

                {user && (
                  <>
                    <Link
                      href="/orders"
                      className="text-lg font-medium hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('orders')}
                    </Link>
                    {user.isAdmin && (
                      <Link
                        href="/admin"
                        className="text-lg font-medium text-primary hover:text-primary/80 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t('admin')}
                      </Link>
                    )}
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
            />
            <span className="hidden sm:inline">{t('siteName')}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:items-center lg:gap-6">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
              {t('home')}
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-1">
                  {t('categories')}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/products">{t('allProducts')}</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {categories.map((cat) => (
                  <DropdownMenuItem key={cat.id} asChild>
                    <Link href={`/category/${cat.slug}`}>{getCategoryName(cat)}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden flex-1 md:flex md:max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-6 gap-1 text-foreground hover:bg-foreground/10">
                  <Globe className="h-3.5 w-3.5" />
                  <span>{localeNames[locale]}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isRTL ? 'start' : 'end'}>
                {locales.map((loc) => (
                  <DropdownMenuItem
                    key={loc}
                    onClick={() => setLocale(loc)}
                    className={locale === loc ? 'bg-accent' : ''}
                  >
                    {localeNames[loc]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Search */}
            <Button variant="ghost" size="icon" className="md:hidden" asChild>
              <Link href="/search">
                <Search className="h-5 w-5" />
                <span className="sr-only">{t('search')}</span>
              </Link>
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
                <span className="sr-only">{t('cart')}</span>
              </Link>
            </Button>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                    <span className="sr-only">{t('account')}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={isRTL ? 'start' : 'end'}>
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">{user.email}</div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">{t('profile')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">{t('orders')}</Link>
                  </DropdownMenuItem>
                  {user.isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="bg-accent">{t('admin')}</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>{t('logout')}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login">{t('login')}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}