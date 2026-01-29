import React, { useCallback, useEffect, useRef } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { NextButton, PrevButton, usePrevNextButtons } from './EmblaCarouselArrowButtons'
import { DotButton, useDotButton } from './EmblaCarouselDotButton'
import { TextAnimate } from "@/components/ui/text-animate"
import { BlurFade } from "@/components/ui/blur-fade"

// Shadcn & Icons
import { Badge } from "@/components/ui/badge"
import { 
  MapPin, 
  Star, 
  Clapperboard, 
  Music, 
  Trophy, 
  Drama 
} from 'lucide-react'

const TWEEN_FACTOR_BASE = 0.2

// 1. HELPER: Get Icon based on Category
const getCategoryIcon = (category) => {
  switch (category?.toLowerCase()) {
    case 'movie': return <Clapperboard className="w-3.5 h-3.5 mr-1.5" />;
    case 'concert': return <Music className="w-3.5 h-3.5 mr-1.5" />;
    case 'sports': return <Trophy className="w-3.5 h-3.5 mr-1.5" />;
    case 'theatre': return <Drama className="w-3.5 h-3.5 mr-1.5" />;
    default: return null;
  }
}

// 2. HELPER: Get Color Styles based on Category
const getCategoryColor = (category) => {
  switch (category?.toLowerCase()) {
    case 'movie': 
      // Sky Blue Glass
      return "bg-sky-500/20 text-sky-100 border-sky-400/30 backdrop-blur-md"; 
    case 'concert': 
      // Purple Glass
      return "bg-purple-500/20 text-purple-100 border-purple-400/30 backdrop-blur-md"; 
    case 'sports': 
      // Green Glass
      return "bg-green-500/20 text-green-100 border-green-400/30 backdrop-blur-md"; 
    case 'theatre': 
      // Red Glass
      return "bg-red-500/20 text-red-100 border-red-400/30 backdrop-blur-md"; 
    default: 
      return "bg-gray-500/20 text-gray-100 border-gray-400/30 backdrop-blur-md";
  }
}

const EmblaCarousel = ({ slides, options }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options)
  const tweenFactor = useRef(0)
  const tweenNodes = useRef([])

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi)
  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi)

  const setTweenNodes = useCallback((emblaApi) => {
    tweenNodes.current = emblaApi.slideNodes().map((slideNode) => {
      return slideNode.querySelector('.embla__parallax__layer')
    })
  }, [])

  const setTweenFactor = useCallback((emblaApi) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length
  }, [])

  const tweenParallax = useCallback((emblaApi, event) => {
    const engine = emblaApi.internalEngine()
    const scrollProgress = emblaApi.scrollProgress()
    const slidesInView = emblaApi.slidesInView()
    const isScrollEvent = event?.type === 'scroll'

    emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
      let diffToTarget = scrollSnap - scrollProgress
      const slidesInSnap = engine.slideRegistry[snapIndex]

      slidesInSnap.forEach((slideIndex) => {
        if (isScrollEvent && !slidesInView.includes(slideIndex)) return

        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((loopItem) => {
            const target = loopItem.target()
            if (slideIndex === loopItem.index && target !== 0) {
              const sign = Math.sign(target)
              if (sign === -1) diffToTarget = scrollSnap - (1 + scrollProgress)
              if (sign === 1) diffToTarget = scrollSnap + (1 - scrollProgress)
            }
          })
        }

        const translate = diffToTarget * (-1 * tweenFactor.current) * 100
        const tweenNode = tweenNodes.current[slideIndex]
        if (tweenNode) {
          tweenNode.style.transform = `translate3d(${translate}%,0,0)`
        }
      })
    })
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    setTweenNodes(emblaApi)
    setTweenFactor(emblaApi)
    tweenParallax(emblaApi)

    emblaApi
      .on('reInit', setTweenNodes)
      .on('reInit', setTweenFactor)
      .on('reInit', tweenParallax)
      .on('scroll', tweenParallax)
      .on('slideFocus', tweenParallax)
  }, [emblaApi, tweenParallax])

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((slide, index) => (
            <div className={`embla__slide ${index === selectedIndex ? 'is-selected' : ''}`} key={slide._id || index}>
            <BlurFade delay={0.25 + index * 0.05} inView>
              <div className="embla__parallax relative group overflow-hidden rounded-3xl">
                
                {/* Image Layer */}
                <div className="embla__parallax__layer">
                  <img
                    className="embla__slide__img embla__parallax__img"
                    src={slide.url}
                    alt={slide.title}
                  />
                </div>
                
                {/* Overlay Content */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-12">
                  
                  {/* --- BADGES SECTION --- */}
                  <div className={`absolute top-6 left-6 md:top-10 md:left-10 flex gap-2 transition-opacity duration-500 ${index === selectedIndex ? 'opacity-100' : 'opacity-0'}`}>
                    
                    {/* Dynamic Category Badge */}
                    <Badge className={`px-3 py-1 text-sm uppercase tracking-wide flex items-center shadow-lg backdrop-blur-md border-0 ${getCategoryColor(slide.category)}`}>
                      {getCategoryIcon(slide.category)}
                      {slide.category}
                    </Badge>
                    
                    {/* Rating Badge */}
                    {slide.rating > 0 && (
                      <Badge variant="default" className="bg-black/60 border-yellow-500/50 text-yellow-400 backdrop-blur-md px-3 py-1 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-yellow-400" />
                        <span className="font-bold">{slide.rating}</span>
                      </Badge>
                    )}
                  </div>

                  {/* Main Text Content */}
                  <div className="w-full">
                    {index === selectedIndex && (
                      <TextAnimate animation="blurInUp" by="character" className="text-white text-4xl md:text-6xl font-bold mb-3 tracking-tight drop-shadow-xl">
                        {slide.title}
                      </TextAnimate>
                    )}

                    <div className={`transition-all duration-700 delay-200 ${index === selectedIndex ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                      
                      {/* Dynamic Metadata */}
                      <p className="text-gray-300 text-sm md:text-lg font-medium mb-2 flex items-center gap-2">
                         {slide.category === 'concert' && slide.metadata?.artists && (
                            <><span>Featuring:</span> <span className="text-white">{slide.metadata.artists.join(', ')}</span></>
                         )}
                         {slide.category === 'movie' && slide.metadata?.cast && (
                            <><span>Starring:</span> <span className="text-white">{slide.metadata.cast.slice(0, 3).join(', ')}</span></>
                         )}
                         {slide.category === 'sports' && slide.metadata?.teams && (
                            <span className="text-white">{slide.metadata.teams.home} vs {slide.metadata.teams.away}</span>
                         )}
                      </p>

                      {/* Location & Price */}
                      <div className="flex items-center gap-4 mb-6 text-gray-400 text-sm md:text-base">
                         <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {slide.location || 'Venue TBA'}
                         </div>
                         <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                         <div className="text-green-400 font-semibold">
                            from Rs. {slide.price?.toLocaleString()}
                         </div>
                      </div>

                      <button className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                        Get Tickets
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              </BlurFade>
            </div>
          ))}
        </div>
      </div>

      <div className="embla__controls">
        <div className="embla__buttons">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>
        <div className="embla__dots">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={`embla__dot ${index === selectedIndex ? 'embla__dot--selected' : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default EmblaCarousel