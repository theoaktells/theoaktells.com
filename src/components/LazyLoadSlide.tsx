import React, {useState, useCallback} from 'react'

const PLACEHOLDER_SRC = `data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D`

type PropType = {
  imgSrc: string
  alt: string
  inView: boolean
  index: number
}

export const LazyLoadSlide: React.FC<PropType> = (props) => {
  const {imgSrc, inView, alt} = props
  const [hasLoaded, setHasLoaded] = useState(false)

  const setLoaded = useCallback(() => {
    if (inView) setHasLoaded(true)
  }, [inView, setHasLoaded])

  return (
    <div className="w-full flex justify-center items-center shrink-0 h-[400px]">
      {!hasLoaded && <span />}
      <img
        className="rounded-sm"
        onLoad={setLoaded}
        src={!inView ? PLACEHOLDER_SRC : undefined}
        srcSet={inView ? imgSrc : undefined}
        alt={alt}
        data-src={imgSrc}
      />
    </div>
  )
}

export default LazyLoadSlide
