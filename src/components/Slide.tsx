import React from 'react'
import clsx from 'clsx'

type PropType = {
  fetchPriority?: 'high' | 'low' | 'auto'
  srcSet?: string
  src?: string
  alt: string
  isFullScreen: boolean
  children?: React.ReactNode
  onImageLoad?: () => void
}

export const Slide: React.FC<PropType> = props => {
  const {
    srcSet,
    src,
    isFullScreen,
    alt,
    children,
    onImageLoad,
    fetchPriority
  } = props

  return (
    <div className={clsx('w-full',
      'flex',
      'justify-center',
      'relative',
      'items-center',
      'shrink-0',
      isFullScreen ? 'max-h-[1300px]' : 'h-[400px]')}>
      {children}
      <img
        className="rounded-sm max-h-max"
        style={{height: 'inherit'}}
        onLoad={onImageLoad}
        fetchPriority={fetchPriority}
        srcSet={srcSet}
        src={src}
        alt={alt}
        data-src={srcSet}
      />
    </div>
  )
}

export default Slide
