import React, { useCallback, useEffect, useState } from 'react'

export const useDotButton = (emblaApi) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState([])

  const onDotButtonClick = useCallback(
    (index) => {
      if (!emblaApi) return
      emblaApi.scrollTo(index)
    },
    [emblaApi]
  )

  const onInit = useCallback((emblaApi) => {
    setScrollSnaps(emblaApi.scrollSnapList())
  }, [])

  const onSelect = useCallback((emblaApi) => {
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    onInit(emblaApi)
    onSelect(emblaApi)
    emblaApi.on('reInit', onInit).on('reInit', onSelect).on('select', onSelect)
  }, [emblaApi, onInit, onSelect])

  return {
    selectedIndex,
    scrollSnaps,
    onDotButtonClick
  }
}

export const DotButton = ({ selected, onClick, ...restProps }) => {
  return (
    <button
      type="button"
      className={`
        group relative flex items-center justify-center w-6 h-6 p-0 bg-transparent border-0 cursor-pointer outline-none
      `}
      onClick={onClick}
      {...restProps}
    >
      {/* Outer Ring (Focus/Hover) */}
      <span 
        className={`
          absolute w-full h-full rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100
          ${selected ? 'scale-100 opacity-100 border border-zinc-900/20 dark:border-white/20' : 'scale-50'}
        `} 
      />
      
      {/* Inner Dot */}
      <span 
        className={`
          w-2.5 h-2.5 rounded-full transition-all duration-300 shadow-sm
          ${selected 
            ? 'bg-zinc-900 dark:bg-white scale-110' 
            : 'bg-zinc-300 dark:bg-zinc-600 hover:bg-zinc-400 dark:hover:bg-zinc-500'}
        `} 
      />
    </button>
  )
}