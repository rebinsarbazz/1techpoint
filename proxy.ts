// proxy.ts
import { updateSession } from '@/lib/supabase/proxy'
import type { NextRequest } from 'next/server'

// ------------------------
// 1. Main proxy function
// Must be named "proxy" and exported
// ------------------------
export async function proxy(request: NextRequest) {
  // Call your existing updateSession function
  return await updateSession(request)
}

// ------------------------
// 2. Proxy matcher config
// ------------------------
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}