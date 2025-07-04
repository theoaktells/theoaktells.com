import React, {useState, useCallback} from 'react'
import Slide from './Slide.tsx'
import clsx from 'clsx'

type PropType = {
  isFullScreen: boolean
  imgSrc: string
  alt: string
  inView: boolean
}

export const LazyLoadSlide: React.FC<PropType> = props => {
  const {
    imgSrc,
    inView,
    alt,
    isFullScreen
  } = props

  const [hasLoaded, setHasLoaded] = useState(false)

  const setLoaded = useCallback(() => {
    if (inView) {
      setHasLoaded(true)
    }
  }, [inView, setHasLoaded])

  return (
    <Slide isFullScreen={isFullScreen}
           alt={alt}
           srcSet={inView ? imgSrc : undefined}
           onImageLoad={setLoaded}>
      {
        !hasLoaded &&
          <span className={clsx(
            'spinner',
            isFullScreen && 'light')}/>
      }
    </Slide>
  )
}

export default LazyLoadSlide
