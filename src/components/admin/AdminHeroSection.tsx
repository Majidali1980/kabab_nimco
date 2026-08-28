import React, { useState } from 'react';
import { 
  Sliders, 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  CheckCircle, 
  X, 
  Image as ImageIcon, 
  Snowflake, 
  Flame, 
  Sparkles, 
  Award,
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { HeroSlide, PageView } from '../../types';
import { SAMPLE_IMAGE_PRESETS } from '../../data/defaultConfig';
import { ImageUploader } from '../common/ImageUploader';

export const AdminHeroSection: React.FC = () => {
  const { heroSlides, addHeroSlide, updateHeroSlide, deleteHeroSlide } = useStore();
  const [isEditingSlide, setIsEditingSlide] = useState<HeroSlide | null>(null);
  const [isAddingSlide, setIsAddingSlide] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const initialSlideForm: Omit<HeroSlide, 'id'> = {
    badge: 'Karachi Home Delivery',
    badgeIconType: 'snowflake',
    title: 'Frozen, Fresh, Ready to Fry',
    subtitle: 'Artisanal kababs and crispy mix nimko snacks with blast-frozen freshness.',
    primaryBtnText: 'Order Kababs Now',
    primaryPage: 'shop',
    primaryCategory: 'all',
    secondaryBtnText: 'View Bestsellers',
    secondaryPage: 'shop',
    secondaryCategory: 'chicken',
    image: SAMPLE_IMAGE_PRESETS[0].url,
    highlights: ['❄️ 100% Cold-Chain Protected', '⏱️ Fry Direct From Frozen', '✨ Zero Preservatives'],
    isEnabled: true
  };

  const [slideForm, setSlideForm] = useState<Omit<HeroSlide, 'id'>>(initialSlideForm);
  const [highlightsInput, setHighlightsInput] = useState(initialSlideForm.highlights.join(', '));

  const handleCreateSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slideForm.title.trim()) return;

    const parsedHighlights = highlightsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    addHeroSlide({
      ...slideForm,
      highlights: parsedHighlights
    });

    setIsAddingSlide(false);
    setSlideForm(initialSlideForm);
    setHighlightsInput(initialSlideForm.highlights.join(', '));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleUpdateSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditingSlide || !isEditingSlide.title.trim()) return;

    const parsedHighlights = highlightsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    updateHeroSlide(isEditingSlide.id, {
      ...isEditingSlide,
      highlights: parsedHighlights
    });

    setIsEditingSlide(null);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const startEdit = (slide: HeroSlide) => {
    setIsEditingSlide(slide);
    setHighlightsInput(slide.highlights.join(', '));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DFC8] pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#2D1A16] font-display flex items-center gap-2">
            <Sliders className="w-6 h-6 text-indigo-600" />
            Hero Section & Carousel Slides (CRUD)
          </h2>
          <p className="text-xs text-[#735A50]">
            Add, modify, and manage promotional slides, main headline copy, CTA buttons, and high-resolution background photos.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsAddingSlide(true);
            setSlideForm(initialSlideForm);
            setHighlightsInput(initialSlideForm.highlights.join(', '));
          }}
          className="inline-flex items-center gap-1.5 bg-[#801414] hover:bg-[#681010] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Hero Slide</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span>Hero slide updated successfully! Check the storefront preview to see live results.</span>
        </div>
      )}

      {/* Slide Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {heroSlides.map((slide, index) => (
          <div 
            key={slide.id}
            className={`bg-white rounded-2xl border overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
              slide.isEnabled ? 'border-[#E8DFC8]' : 'border-stone-300 opacity-60'
            }`}
          >
            <div>
              {/* Image Preview Container */}
              <div className="relative h-44 w-full bg-stone-900 overflow-hidden">
                <img
                  src={slide.image}
                  alt={slide.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                
                <div className="absolute top-3 left-3 bg-[#801414] text-amber-200 text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md">
                  Slide {index + 1}
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
                    {slide.badge}
                  </span>
                  <h4 className="font-bold text-sm leading-snug line-clamp-1">
                    {slide.title}
                  </h4>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-4 space-y-3">
                <p className="text-xs text-[#5C453C] line-clamp-2 leading-relaxed">
                  {slide.subtitle}
                </p>

                {/* Highlights */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {slide.highlights.map((hl, hIdx) => (
                    <span key={hIdx} className="bg-[#FAF0DC] text-[#801414] text-[10px] font-semibold px-2 py-0.5 rounded-md border border-[#EAD5AB]">
                      {hl}
                    </span>
                  ))}
                </div>

                {/* CTAs Info */}
                <div className="text-[11px] text-[#8C7A70] bg-[#FAF7F0] p-2 rounded-xl border border-[#E8DFC8] space-y-1">
                  <div><strong>Primary Button:</strong> {slide.primaryBtnText} → {slide.primaryPage}</div>
                  <div><strong>Secondary Button:</strong> {slide.secondaryBtnText} → {slide.secondaryPage}</div>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-4 bg-[#FFFDF9] border-t border-[#E8DFC8] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => updateHeroSlide(slide.id, { isEnabled: !slide.isEnabled })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                  slide.isEnabled 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-stone-100 text-stone-600 border border-stone-200'
                }`}
              >
                {slide.isEnabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{slide.isEnabled ? 'Active' : 'Disabled'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(slide)}
                  className="p-2 bg-[#FAF7F0] hover:bg-[#F2EBDC] border border-[#DDD4CA] text-[#4A352F] rounded-xl transition-colors cursor-pointer"
                  title="Edit slide"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => deleteHeroSlide(slide.id)}
                  disabled={heroSlides.length <= 1}
                  className="p-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-xl transition-colors disabled:opacity-30 cursor-pointer"
                  title="Delete slide"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Slide Modal */}
      {(isAddingSlide || isEditingSlide) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#E8DFC8] space-y-6 animate-in zoom-in-95 my-8 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-[#E8DFC8] pb-4">
              <h3 className="font-bold text-lg text-[#2D1A16] font-display">
                {isAddingSlide ? 'Create New Hero Carousel Slide' : 'Edit Hero Carousel Slide'}
              </h3>
              <button 
                onClick={() => { setIsAddingSlide(false); setIsEditingSlide(null); }}
                className="text-stone-400 hover:text-stone-600 p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={isAddingSlide ? handleCreateSlide : handleUpdateSlide} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#3D2821] mb-1">Slide Badge Text *</label>
                  <input
                    type="text"
                    required
                    value={isAddingSlide ? slideForm.badge : isEditingSlide?.badge}
                    onChange={(e) => isAddingSlide 
                      ? setSlideForm({ ...slideForm, badge: e.target.value })
                      : setIsEditingSlide(prev => prev ? { ...prev, badge: e.target.value } : null)
                    }
                    placeholder="e.g. Karachi Home Delivery • Blast Frozen"
                    className="w-full bg-[#FAF7F0] border border-[#DDD4CA] focus:border-[#801414] text-xs font-semibold px-3 py-2.5 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3D2821] mb-1">Badge Icon Style</label>
                  <select
                    value={isAddingSlide ? slideForm.badgeIconType : isEditingSlide?.badgeIconType}
                    onChange={(e) => isAddingSlide
                      ? setSlideForm({ ...slideForm, badgeIconType: e.target.value as any })
                      : setIsEditingSlide(prev => prev ? { ...prev, badgeIconType: e.target.value as any } : null)
                    }
                    className="w-full bg-[#FAF7F0] border border-[#DDD4CA] focus:border-[#801414] text-xs font-semibold px-3 py-2.5 rounded-xl outline-none"
                  >
                    <option value="snowflake">Snowflake (Cold Chain / Frozen)</option>
                    <option value="flame">Flame (Hot Deals / Spicy)</option>
                    <option value="sparkles">Sparkles (Artisanal / Fresh)</option>
                    <option value="award">Award (Bestseller / Quality)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3D2821] mb-1">Headline Title *</label>
                <input
                  type="text"
                  required
                  value={isAddingSlide ? slideForm.title : isEditingSlide?.title}
                  onChange={(e) => isAddingSlide
                    ? setSlideForm({ ...slideForm, title: e.target.value })
                    : setIsEditingSlide(prev => prev ? { ...prev, title: e.target.value } : null)
                  }
                  placeholder="e.g. Frozen, Fresh, Ready to Fry in 3 Minutes"
                  className="w-full bg-[#FAF7F0] border border-[#DDD4CA] focus:border-[#801414] text-xs font-semibold px-3 py-2.5 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3D2821] mb-1">Subtitle / Description</label>
                <textarea
                  rows={2}
                  value={isAddingSlide ? slideForm.subtitle : isEditingSlide?.subtitle}
                  onChange={(e) => isAddingSlide
                    ? setSlideForm({ ...slideForm, subtitle: e.target.value })
                    : setIsEditingSlide(prev => prev ? { ...prev, subtitle: e.target.value } : null)
                  }
                  placeholder="Detailed description of the offer, quality, and ingredients..."
                  className="w-full bg-[#FAF7F0] border border-[#DDD4CA] focus:border-[#801414] text-xs font-semibold px-3 py-2.5 rounded-xl outline-none"
                />
              </div>

              {/* Image Uploader with Mentioned Size and Thumbnail */}
              <ImageUploader
                label="Hero Slide Banner Image"
                value={isAddingSlide ? slideForm.image : (isEditingSlide?.image || '')}
                onChange={(newUrl) => {
                  if (isAddingSlide) {
                    setSlideForm({ ...slideForm, image: newUrl });
                  } else {
                    setIsEditingSlide(prev => prev ? { ...prev, image: newUrl } : null);
                  }
                }}
                recommendedWidth={1920}
                recommendedHeight={800}
                aspectRatioLabel="2.4:1 Wide Banner"
                maxSizeMB={3}
                helpText="High-resolution hero banner for the homepage carousel. Recommended: 1920 × 800 px (Max 3MB)."
              />

              {/* Highlights Chips */}
              <div>
                <label className="block text-xs font-bold text-[#3D2821] mb-1">
                  Feature Highlight Badges (Comma-separated)
                </label>
                <input
                  type="text"
                  value={highlightsInput}
                  onChange={(e) => setHighlightsInput(e.target.value)}
                  placeholder="❄️ 100% Cold-Chain, ⏱️ Fry in 3 Mins, ✨ Zero Preservatives"
                  className="w-full bg-[#FAF7F0] border border-[#DDD4CA] focus:border-[#801414] text-xs font-semibold px-3 py-2.5 rounded-xl outline-none"
                />
              </div>

              {/* Button Configurations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#E8DFC8]">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#3D2821]">Primary Action Button</label>
                  <input
                    type="text"
                    placeholder="Button Text"
                    value={isAddingSlide ? slideForm.primaryBtnText : isEditingSlide?.primaryBtnText}
                    onChange={(e) => isAddingSlide
                      ? setSlideForm({ ...slideForm, primaryBtnText: e.target.value })
                      : setIsEditingSlide(prev => prev ? { ...prev, primaryBtnText: e.target.value } : null)
                    }
                    className="w-full bg-[#FAF7F0] border border-[#DDD4CA] text-xs px-3 py-2 rounded-xl"
                  />
                  <select
                    value={isAddingSlide ? slideForm.primaryPage : isEditingSlide?.primaryPage}
                    onChange={(e) => isAddingSlide
                      ? setSlideForm({ ...slideForm, primaryPage: e.target.value as PageView })
                      : setIsEditingSlide(prev => prev ? { ...prev, primaryPage: e.target.value as PageView } : null)
                    }
                    className="w-full bg-[#FAF7F0] border border-[#DDD4CA] text-xs px-3 py-2 rounded-xl"
                  >
                    <option value="shop">Shop All / Category</option>
                    <option value="deals">Hot Deals Page</option>
                    <option value="about">About Page</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#3D2821]">Secondary Action Button</label>
                  <input
                    type="text"
                    placeholder="Button Text"
                    value={isAddingSlide ? slideForm.secondaryBtnText : isEditingSlide?.secondaryBtnText}
                    onChange={(e) => isAddingSlide
                      ? setSlideForm({ ...slideForm, secondaryBtnText: e.target.value })
                      : setIsEditingSlide(prev => prev ? { ...prev, secondaryBtnText: e.target.value } : null)
                    }
                    className="w-full bg-[#FAF7F0] border border-[#DDD4CA] text-xs px-3 py-2 rounded-xl"
                  />
                  <select
                    value={isAddingSlide ? slideForm.secondaryPage : isEditingSlide?.secondaryPage}
                    onChange={(e) => isAddingSlide
                      ? setSlideForm({ ...slideForm, secondaryPage: e.target.value as PageView })
                      : setIsEditingSlide(prev => prev ? { ...prev, secondaryPage: e.target.value as PageView } : null)
                    }
                    className="w-full bg-[#FAF7F0] border border-[#DDD4CA] text-xs px-3 py-2 rounded-xl"
                  >
                    <option value="shop">Shop All / Category</option>
                    <option value="deals">Hot Deals Page</option>
                    <option value="about">About Page</option>
                    <option value="delivery">Delivery Areas</option>
                  </select>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#E8DFC8]">
                <button
                  type="button"
                  onClick={() => { setIsAddingSlide(false); setIsEditingSlide(null); }}
                  className="px-5 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#801414] hover:bg-[#681010] text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  {isAddingSlide ? 'Create Slide' : 'Update Slide'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
