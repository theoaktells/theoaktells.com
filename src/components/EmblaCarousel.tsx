import React, {useState, useEffect, useCallback} from 'react'
import type {EmblaCarouselType, EmblaOptionsType} from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import Thumbnail from './Thumbnail'
import LazyLoadSlide from './LazyLoadSlide.tsx'
import type {Image} from '../types/Image.ts'

type PropType = {
  images: Image[]
  options?: EmblaOptionsType
}

const EmblaCarousel: React.FC<PropType> = (props) => {
  const {images, options} = props
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options)
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true
  })
  const [slidesInView, setSlidesInView] = useState<number[]>([])

  const onThumbClick = useCallback((index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) {
        return
      }

      emblaMainApi.scrollTo(index)
    },
    [emblaMainApi, emblaThumbsApi]
  )

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return
    setSelectedIndex(emblaMainApi.selectedScrollSnap())
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap())
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex])

  useEffect(() => {
    if (!emblaMainApi) return
    onSelect()

    emblaMainApi.on('select', onSelect).on('reInit', onSelect)
  }, [emblaMainApi, onSelect])

  const updateSlidesInView = useCallback((emblaApi: EmblaCarouselType) => {
    setSlidesInView((slidesInView) => {
      if (slidesInView.length === emblaApi.slideNodes().length) {
        emblaApi.off('slidesInView', updateSlidesInView)
      }
      const inView = emblaApi
        .slidesInView()
        .filter((index) => !slidesInView.includes(index))
      return slidesInView.concat(inView)
    })
  }, [])

  useEffect(() => {
    if (!emblaMainApi) return

    updateSlidesInView(emblaMainApi)
    emblaMainApi.on('slidesInView', updateSlidesInView)
    emblaMainApi.on('reInit', updateSlidesInView)
  }, [emblaMainApi, updateSlidesInView])

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-sm h-[400px]" ref={emblaMainRef}>
        <div className="flex flex-row space-x-4">
          {images.map((image, i) => (i === 0 ? (
                <div key={i} className="w-full flex justify-center items-center shrink-0">
                  <img fetchPriority="high" className="rounded-sm" srcSet={image.url} alt={image.alt}/>
                </div>) :
              <LazyLoadSlide key={i} alt={image.alt} imgSrc={image.url} inView={slidesInView.indexOf(i) > -1} index={i}/>
          ))}
        </div>
      </div>
      <div className="mt-2">
        <div className="overflow-hidden rounded-sm" ref={emblaThumbsRef}>
          <div className="flex flex-row space-x-1">
            {images.map((image, i) => (
              <Thumbnail
                key={i}
                onClick={() => onThumbClick(i)}
                selected={i === selectedIndex}
                imageSrc={image.thumbnailUrl}
                alt={image.alt}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmblaCarousel
