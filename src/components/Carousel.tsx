import React, {useState, useEffect, useCallback} from 'react'
import type {EmblaCarouselType, EmblaOptionsType} from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import Thumbnail from './Thumbnail'
import LazyLoadSlide from './LazyLoadSlide.tsx'
import type {Image} from '../types/Image.ts'
import clsx from 'clsx'
import Slide from './Slide.tsx'

type PropType = {
  images: Image[]
  options?: EmblaOptionsType
}

const Carousel: React.FC<PropType> = props => {
  const {
    images,
    options
  } = props

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [slidesInView, setSlidesInView] = useState<number[]>([])
  const [isFullScreen, setIsFullScreen] = useState(false)

  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options)
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true
  })

  const handleToggleIsFullScreen = useCallback(() => setIsFullScreen((current) => !current), [isFullScreen])

  useEffect(() => {
    if (isFullScreen) {
      document.body.style.overflow = 'hidden'
      return
    }

    document.body.removeAttribute('style')
  }, [isFullScreen])

  const onThumbClick = useCallback((index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) {
        return
      }

      emblaMainApi.scrollTo(index)
    },
    [emblaMainApi, emblaThumbsApi]
  )

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) {
      return
    }

    setSelectedIndex(emblaMainApi.selectedScrollSnap())

    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap())

  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex])

  useEffect(() => {
    if (!emblaMainApi) {
      return
    }

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
    if (!emblaMainApi) {
      return
    }

    updateSlidesInView(emblaMainApi)
    emblaMainApi.on('slidesInView', updateSlidesInView)
    emblaMainApi.on('reInit', updateSlidesInView)
  }, [emblaMainApi, updateSlidesInView])

  return (
    <div className={clsx('w-full flex flex-col', isFullScreen && 'fixed top-0 left-0 p-5 h-full z-100 min-h-60')}>
      <div className={clsx(isFullScreen && 'bg-primary/90 h-full w-full absolute top-0 left-0 backdrop-blur-md')}
           onClick={handleToggleIsFullScreen}/>
      <div className={clsx('w-full flex overflow-hidden rounded-sm', isFullScreen ? 'h-full' : 'h-[400px]')}
           ref={emblaMainRef}>
        <div className="w-full flex items-center flex-row space-x-4">
          {images.map((image, i) => (
            i === 0 ? (
                <Slide key={i}
                       alt={image.alt}
                       srcSet={isFullScreen ? image.fullScreenUrl : image.url}
                       isFullScreen={isFullScreen}
                       fetchPriority="high"/>
              ) :
              <LazyLoadSlide key={i}
                             alt={image.alt}
                             imgSrc={isFullScreen ? image.fullScreenUrl : image.url}
                             inView={slidesInView.indexOf(i) > -1}
                             isFullScreen={isFullScreen}
              />
          ))}
        </div>
      </div>
      <div className={clsx('mt-2 flex flex-row', isFullScreen && 'self-center z-20 w-full max-w-[900px]')}>
        <div className="overflow-hidden grow rounded-sm" ref={emblaThumbsRef}>
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
        <button
          aria-label="open/close carousel in fullscreen"
          className={clsx('rounded-sm cursor-pointer ml-4 my-2 p-2',
            isFullScreen ? 'bg-secondary-dark hover:bg-secondary stroke-primary' :
              'bg-primary hover:bg-primary-lighter stroke-secondary')}
          onClick={handleToggleIsFullScreen}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
               stroke="inherit" className="size-6">
            {
              isFullScreen ? (
                <path strokeLinecap="round"
                      strokeLinejoin="round"
                      stroke="inherit"
                      d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25"/>
              ) : (
                <path strokeLinecap="round"
                      strokeLinejoin="round"
                      stroke="inherit"
                      d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"/>
              )
            }
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Carousel
