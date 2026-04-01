'use client'

import { CategoryCard } from './category-card'
import { useI18n } from '@/lib/i18n'
import type { Category } from '@/lib/types/database'

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

type CategoryGridProps = {
  categories: Category[]
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  const { t } = useI18n()

  if (categories.length === 0) return null

  return (
    <div>
      {/* Title */}
      <div className="mb-8 flex flex-col items-center text-center">
        <h2 className="text-2xl font-bold md:text-3xl">
          {t('shopByCategory')}
        </h2>

        {/* Primary line */}
        <div className="mt-3 h-[3px] w-24 rounded-full bg-primary" />
      </div>

      {/* Slider */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={16}
        navigation={false}
        autoplay={{
          delay: 2000, // 2 seconds
          disableOnInteraction: true,
        }}
        breakpoints={{
          0: {
            slidesPerView: 2,
          },
          640: {
            slidesPerView: 3,
          },
          768: {
            slidesPerView: 4,
          },
          1024: {
            slidesPerView: 6,
          },
          1280: {
            slidesPerView: 8,
          },
        }}
        className="pb-40"
      >
        {categories.map((category) => (
          <SwiperSlide key={category.id}>
            <CategoryCard category={category} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}