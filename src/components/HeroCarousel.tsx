import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, Flame, Sparkles, Snowflake, Award } from 'lucide-react';
import { PageView } from '../types';
import { useStore } from '../context/StoreContext';

interface HeroCarouselProps {
  onNavigate: (page: PageView, filterCategory?: string) => void;
  onOpenQuickView?: (productId: string) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onNavigate }) => {
  const { heroSlides } = useStore();
  const activeSlides = heroSlides.filter(s => s.isEnabled);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const totalSlides = activeSlides.length > 0 ? activeSlides.length : 1;

  useEffect(() => {
    if (!isAutoPlaying || totalSlides <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 6500);
    return () => clearInterval(interval);
  }, [isAutoPlaying, totalSlides]);

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const slide = activeSlides[currentSlide] || heroSlides[0];

  const getBadgeIcon = (iconType?: string) => {
    switch (iconType) {
      case 'snowflake': return <Snowflake className="w-3.5 h-3.5 text-amber-300 inline" />;
      case 'flame': return <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 inline" />;
      case 'sparkles': return <Sparkles className="w-3.5 h-3.5 text-amber-300 inline" />;
      case 'award': return <Award className="w-3.5 h-3.5 text-amber-300 inline" />;
      default: return <Snowflake className="w-3.5 h-3.5 text-amber-300 inline" />;
    }
  };

  if (!slide) return null;

  return (
    <div 
      className="relative bg-[#1A0B09] overflow-hidden text-white min-h-[520px] md:min-h-[560px] flex items-center"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Slide Background Image with Smooth Crossfade */}
      {activeSlides.map((s, index) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
          } transition-transform duration-7000`}
        >
          <img
            src={s.image}
            alt={s.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          {/* Multi-stage artistic gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1E0606]/95 via-[#2D0A0A]/85 sm:via-[#2D0A0A]/70 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A0B09] via-transparent to-transparent opacity-80" />
        </div>
      ))}

      {/* Slide Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 w-full">
        <div className="max-w-2xl">
          
          {/* Badge */}
          {slide.badge && (
            <div className="inline-flex items-center gap-2 bg-[#801414]/90 text-amber-200 border border-[#E69500]/50 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md mb-4 shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
              {getBadgeIcon(slide.badgeIconType)}
              <span>{slide.badge}</span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] font-display">
            {slide.title}
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-base sm:text-lg text-stone-200 leading-relaxed font-normal">
            {slide.subtitle}
          </p>

          {/* Highlights Chips */}
          {slide.highlights && slide.highlights.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2 sm:gap-3">
              {slide.highlights.map((hl, i) => (
                <span 
                  key={i} 
                  className="bg-black/40 backdrop-blur-md border border-white/15 text-stone-100 text-xs font-medium px-3 py-1.5 rounded-lg shadow-xs"
                >
                  {hl}
                </span>
              ))}
            </div>
          )}

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={() => onNavigate(slide.primaryPage || 'shop', slide.primaryCategory)}
              className="bg-gradient-to-r from-[#D97706] to-[#E69500] hover:from-[#B45309] hover:to-[#D97706] text-slate-950 font-black px-7 py-3.5 rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 text-sm sm:text-base cursor-pointer"
            >
              <span>{slide.primaryBtnText || 'Order Now'}</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>

            {slide.secondaryBtnText && (
              <button
                onClick={() => onNavigate(slide.secondaryPage || 'shop', slide.secondaryCategory)}
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3.5 rounded-xl border border-white/25 backdrop-blur-md transition-all text-sm sm:text-base cursor-pointer"
              >
                {slide.secondaryBtnText}
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Carousel Navigation Controls */}
      {totalSlides > 1 && (
        <div className="absolute z-20 bottom-6 right-4 sm:right-8 flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md p-1.5 rounded-full border border-white/10">
            {activeSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentSlide(index);
                }}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  index === currentSlide ? 'w-8 bg-[#E69500]' : 'w-2.5 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={prevSlide}
              aria-label="Previous Slide"
              className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 flex items-center justify-center text-white transition-all backdrop-blur-md cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next Slide"
              className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 flex items-center justify-center text-white transition-all backdrop-blur-md cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
