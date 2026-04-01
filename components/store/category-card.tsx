'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { useLocalizedField } from '@/lib/i18n'
import type { Category } from '@/lib/types/database'

type CategoryCardProps = {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  const { getName } = useLocalizedField()

  return (
    <Link href={`/category/${category.slug}`} className="group block">

      <Card className="relative overflow-hidden rounded-2xl border-0 shadow-none">

        {/* Image wrapper with radius */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">

          {category.image_url ? (
            <Image
              src={category.image_url}
              alt={getName(category)}
              fill
              className="object-cover scale-110 transition-transform duration-500 group-hover:scale-125"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
              <span className="text-4xl">📦</span>
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300" />

          {/* Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Content */}
          <CardContent className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">

            <h3 className="text-lg font-semibold text-white drop-shadow-md">
              {getName(category)}
            </h3>

            <span className="mt-2 h-[2px] w-12 bg-white/70 transition-all duration-300 group-hover:w-0 group-hover:opacity-0" />

          </CardContent>
        </div>
      </Card>

    </Link>
  )
}