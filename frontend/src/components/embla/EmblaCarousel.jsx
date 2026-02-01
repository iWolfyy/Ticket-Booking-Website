import React, { useCallback, useEffect, useRef, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { NextButton, PrevButton, usePrevNextButtons } from './EmblaCarouselArrowButtons'
import { DotButton, useDotButton } from './EmblaCarouselDotButton'
import { TextAnimate } from "@/components/ui/text-animate"
import { BlurFade } from "@/components/ui/blur-fade"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Clapperboard, Music, Trophy, Drama } from 'lucide-react'

const TWEEN_FACTOR_BASE = 0.2
const AUTOPLAY_DELAY = 4000;

const getCategoryIcon = (category) => {
  switch (category?.toLowerCase()) {
    case 'movie': return <Clapperboard className="w-3 h-3 md:w-3.5 md:h-3.5 mr-1.5" />;
    case 'concert': return <Music className="w-3 h-3 md:w-3.5 md:h-3.5 mr-1.5" />;
    case 'sports': return <Trophy className="w-3 h-3 md:w-3.5 md:h-3.5 mr-1.5" />;
    case 'theatre': return <Drama className="w-3 h-3 md:w-3.5 md:h-3.5 mr-1.5" />;
    default: return null;
  }
}

const getCategoryColor = (category) => {
  switch (category?.toLowerCase()) {
    case 'movie': return "bg-sky-950/90 text-sky-100 border-sky-800 dark:bg-sky-950/90 dark:text-sky-100"; 
    case 'concert': return "bg-purple-950/90 text-purple-100 border-purple-800 dark:bg-purple-950/90 dark:text-purple-100"; 
    case 'sports': return "bg-green-950/90 text-green-100 border-green-800 dark:bg-green-950/90 dark:text-green-100"; 
    case 'theatre': return "bg-red-950/90 text-red-100 border-red-800 dark:bg-red-950/90 dark:text-red-100"; 
    default: return "bg-gray-950/90 text-gray-100 border-gray-800";
  }
}

const EmblaCarousel = ({ slides, options }) => {
  const [progressBarKey, setProgressBarKey] = useState(0);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);

  const autoplay = useRef(
    Autoplay({ delay: AUTOPLAY_DELAY, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(options, [autoplay.current]);
  
  const tweenFactor = useRef(0)
  const tweenNodes = useRef([])

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi)
  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi)

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setProgressBarKey(prev => prev + 1);
    const onAutoplayStop = () => setIsAutoplayPaused(true);
    const onAutoplayPlay = () => setIsAutoplayPaused(false);

    emblaApi
      .on('select', onSelect)
      .on('autoplay:stop', onAutoplayStop)
      .on('autoplay:play', onAutoplayPlay);

    const setTweenNodes = (emblaApi) => {
      tweenNodes.current = emblaApi.slideNodes().map((slideNode) => {
        return slideNode.querySelector('.embla__parallax__layer')
      })
    }
    const setTweenFactor = (emblaApi) => {
      tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length
    }
    const tweenParallax = (emblaApi, event) => {
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
    }

    setTweenNodes(emblaApi)
    setTweenFactor(emblaApi)
    tweenParallax(emblaApi)

    emblaApi
      .on('reInit', setTweenNodes)
      .on('reInit', setTweenFactor)
      .on('reInit', tweenParallax)
      .on('scroll', tweenParallax)
      .on('slideFocus', tweenParallax)

    return () => {
      emblaApi
        .off('select', onSelect)
        .off('autoplay:stop', onAutoplayStop)
        .off('autoplay:play', onAutoplayPlay);
    };
  }, [emblaApi])

  return (
    <BlurFade delay={0.25} inView className="w-full">
      <div className="embla">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {slides.map((slide, index) => {
              // STABLE IMAGE LOGIC - Moved inside map to access 'slide'
              const stableImageSrc = (slide.bannerImage || slide.artistImage) 
                ? `${slide.bannerImage || slide.artistImage}?v=${slide._id}` 
                : null;

              return (
                <div className={`embla__slide ${index === selectedIndex ? 'is-selected' : ''}`} key={slide._id || index}>
                  <div className="embla__parallax relative group overflow-hidden rounded-[1.8rem] transform-gpu shadow-2xl ring-1 ring-black/5 dark:shadow-none dark:ring-0">
                    
                    <div className="embla__parallax__layer will-change-transform backface-hidden">
                      {stableImageSrc ? (
                        <img 
                          className="embla__slide__img embla__parallax__img" 
                          src={stableImageSrc}
                          alt={slide.title}
                          decoding="async"
                          loading={index === 0 ? "eager" : "lazy"} 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1459749411177-8c2914278f67?q=80&w=1000"; // Generic concert fallback
                          }} 
                        />
                      ) : (
                        <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                          <Music className="text-zinc-500 w-12 h-12" />
                        </div>
                      )}
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/25 to-transparent dark:from-black/90 dark:via-black/40 dark:to-transparent flex flex-col justify-end p-5 md:p-12">
                      
                      <div className={`absolute top-4 left-4 md:top-10 md:left-10 flex gap-2 transition-opacity duration-500 origin-top-left ${index === selectedIndex ? 'opacity-100' : 'opacity-0'}`}>
                        <Badge className={`px-2 py-0.5 md:px-3 md:py-1 text-[10px] md:text-sm uppercase tracking-wide flex items-center shadow-lg border-0 ${getCategoryColor(slide.category)}`}>
                          {getCategoryIcon(slide.category)}
                          {slide.category}
                        </Badge>
                        {slide.rating > 0 && (
                          <Badge variant="default" className="bg-white/90 text-black border-yellow-400 dark:bg-black/80 dark:border-yellow-500/50 dark:text-yellow-400 px-2 py-0.5 md:px-3 md:py-1 text-[10px] md:text-sm flex items-center gap-1 shadow-md">
                            <Star className="w-3 h-3 md:w-3.5 md:h-3.5 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold">{Number(slide.rating).toFixed(1)}</span>
                          </Badge>
                        )}
                      </div>

                      <div className="w-full">
                        {index === selectedIndex && (
                          <TextAnimate animation="blurInUp" by="character" className="text-zinc-950 dark:text-white text-2xl sm:text-4xl md:text-6xl font-bold mb-2 md:mb-3 tracking-tight dark:drop-shadow-xl leading-tight">
                            {slide.title}
                          </TextAnimate>
                        )}
                        
                        <div className={`transition-all duration-700 delay-200 ${index === selectedIndex ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                          <p className="text-zinc-800 dark:text-gray-300 text-xs sm:text-sm md:text-lg font-medium mb-2 flex items-center gap-2">
                             
                             {slide.category === 'concert' && (
                               <>
                                 <span className="text-zinc-950 dark:text-white font-bold">{slide.artistName}</span>
                                 {slide.metadata?.artists?.length > 0 && (
                                   <span className="text-muted-foreground italic text-[0.85em]"> ft. {slide.metadata.artists.join(', ')}</span>
                                 )}
                               </>
                             )}

                             {(slide.category === 'movie' || slide.category === 'theatre') && slide.metadata?.cast && (
                               <>
                                 <span>Starring:</span> 
                                 <span className="text-zinc-950 dark:text-white font-semibold">
                                   {slide.metadata.cast.slice(0, 3).map(c => typeof c === 'string' ? c : c.name).join(', ')}
                                 </span>
                               </>
                             )}

                             {slide.category === 'sports' && slide.metadata?.teams && (
                               <span className="text-zinc-950 dark:text-white font-semibold">
                                 {slide.metadata.teams.home} vs {slide.metadata.teams.away}
                               </span>
                             )}
                          </p>
                          
                          <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6 text-zinc-700 dark:text-gray-400 text-xs sm:text-sm md:text-base font-medium">
                             <div className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                <span className="truncate max-w-[150px] md:max-w-none">{slide.venue?.name || 'Venue TBA'}</span>
                             </div>
                             <div className="w-1 h-1 bg-zinc-600 dark:bg-gray-500 rounded-full"></div>
                             <div className="text-green-700 dark:text-green-400 font-bold">from Rs. {slide.basePrice?.toLocaleString()}</div>
                          </div>

                          <button className="bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 px-6 py-2 md:px-8 md:py-3 text-sm md:text-base rounded-full font-bold hover:scale-105 transition-all shadow-lg hover:shadow-xl">
                            Get Tickets
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="embla__controls">
          <div className="embla__buttons">
            <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
            <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
          </div>

          <div className="flex items-center gap-4 flex-1 justify-end">
             <div className="relative w-full max-w-[100px] md:max-w-[200px] h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  key={progressBarKey}
                  className="absolute top-0 left-0 h-full bg-zinc-900 dark:bg-white animate-carousel-progress"
                  style={{ 
                    animationDuration: `${AUTOPLAY_DELAY}ms`,
                    animationPlayState: isAutoplayPaused ? 'paused' : 'running' 
                  }}
                />
             </div>
             
             <div className="embla__dots">
               {scrollSnaps.map((_, index) => (
                 <DotButton
                   key={index}
                   selected={index === selectedIndex}
                   onClick={() => onDotButtonClick(index)}
                 />
               ))}
             </div>
          </div>
        </div>
      </div>
    </BlurFade>
  )
}

export default EmblaCarousel;