import React, { useCallback, useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"

export const usePrevNextButtons = (emblaApi) => {
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true)

  const onPrevButtonClick = useCallback(() => {
    if (!emblaApi) return
    emblaApi.scrollPrev()
  }, [emblaApi])

  const onNextButtonClick = useCallback(() => {
    if (!emblaApi) return
    emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = useCallback((emblaApi) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev())
    setNextBtnDisabled(!emblaApi.canScrollNext())
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    onSelect(emblaApi)
    emblaApi.on('reInit', onSelect).on('select', onSelect)
  }, [emblaApi, onSelect])

  return {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  }
}

export const PrevButton = ({ disabled, onClick, ...restProps }) => {
  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full w-10 h-10 md:w-12 md:h-12 bg-white/80 dark:bg-black/50 backdrop-blur-md border-zinc-200 dark:border-zinc-800 shadow-sm hover:bg-white dark:hover:bg-black hover:scale-105 transition-all disabled:opacity-30"
      disabled={disabled}
      onClick={onClick}
      {...restProps}
    >
      <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-zinc-900 dark:text-zinc-100" />
    </Button>
  )
}

export const NextButton = ({ disabled, onClick, ...restProps }) => {
  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full w-10 h-10 md:w-12 md:h-12 bg-white/80 dark:bg-black/50 backdrop-blur-md border-zinc-200 dark:border-zinc-800 shadow-sm hover:bg-white dark:hover:bg-black hover:scale-105 transition-all disabled:opacity-30"
      disabled={disabled}
      onClick={onClick}
      {...restProps}
    >
      <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-zinc-900 dark:text-zinc-100" />
    </Button>
  )
}