import React from 'react'

type PropType = {
  selected: boolean
  imageSrc: string
  alt: string
  onClick: () => void
}

const Thumbnail: React.FC<PropType> = (props) => {
  const { selected, imageSrc, onClick, alt } = props

  return (
      <button className={`cursor-pointer flex shrink-0 rounded-sm overflow-hidden border-3 border-solid ${selected ? 'border-accent' : 'border-transparent'}`}
              onClick={onClick}
              type="button">
        <img className="h-[50px]" srcSet={imageSrc} alt={alt} />
      </button>
  )
}

export default Thumbnail
