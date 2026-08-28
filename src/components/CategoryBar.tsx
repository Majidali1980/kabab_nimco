import React from 'react';
import { 
  Drumstick, 
  Beef, 
  Cookie, 
  Sparkles, 
  Flame, 
  Layers, 
  Package, 
  UtensilsCrossed, 
  Utensils, 
  Star,
  Heart
} from 'lucide-react';
import { Category } from '../types';
import { useStore } from '../context/StoreContext';

interface CategoryBarProps {
  activeCategory: Category;
  onSelectCategory: (cat: Category) => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({ activeCategory, onSelectCategory }) => {
  const { categories: storeCategories } = useStore();

  const getCategoryIcon = (iconName?: string) => {
    switch (iconName) {
      case 'drumstick':
        return <Drumstick className="w-6 h-6" />;
      case 'beef':
        return <Beef className="w-6 h-6" />;
      case 'cookie':
        return <Cookie className="w-6 h-6" />;
      case 'flame':
        return <Flame className="w-6 h-6" />;
      case 'sparkles':
        return <Sparkles className="w-6 h-6" />;
      case 'package':
        return <Package className="w-6 h-6" />;
      case 'utensils':
      case 'utensils-crossed':
        return <UtensilsCrossed className="w-6 h-6" />;
      case 'star':
        return <Star className="w-6 h-6" />;
      case 'heart':
        return <Heart className="w-6 h-6" />;
      default:
        return <Layers className="w-6 h-6" />;
    }
  };

  // Sort and filter active categories
  const activeCategoriesList = (storeCategories || [])
    .filter(c => c.isEnabled)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  return (
    <section className="py-10 bg-[#FAF7F0] border-b border-[#E8DFC8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#801414] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#E69500]" />
              <span>Explore By Category</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2D1A16] font-display mt-1">
              What Are You Craving Today?
            </h2>
          </div>
          <p className="text-sm text-[#735A50] max-w-md">
            Prepared fresh daily with unadulterated meats and spices. Sealed and blast frozen for peak freshness.
          </p>
        </div>

        {/* Category Grid / Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {activeCategoriesList.map((cat) => {
            const isSelected = activeCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug as Category)}
                className={`relative group text-left p-4 sm:p-5 rounded-2xl border transition-all transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-linear-to-br from-[#801414] to-[#5C0E0E] text-white border-[#801414] shadow-xl shadow-[#801414]/20'
                    : 'bg-white hover:bg-[#FFFDF8] text-[#2D1A16] border-[#E8DFC8] hover:border-[#D97706]/40 shadow-xs'
                }`}
              >
                {cat.badge && (
                  <span className={`absolute top-3 right-3 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    isSelected ? 'bg-amber-400 text-slate-900' : 'bg-[#FAF0DC] text-[#801414]'
                  }`}>
                    {cat.badge}
                  </span>
                )}

                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${
                  isSelected
                    ? 'bg-white/15 text-amber-300'
                    : 'bg-[#FAF0DC] text-[#801414]'
                }`}>
                  {getCategoryIcon(cat.iconName)}
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className={`font-bold text-sm sm:text-base leading-snug ${
                      isSelected ? 'text-white' : 'text-[#2D1A16]'
                    }`}>
                      {cat.name}
                    </h3>
                  </div>
                  {cat.urduName && (
                    <div className={`text-xs font-urdu font-medium ${
                      isSelected ? 'text-amber-200' : 'text-[#801414]'
                    }`}>
                      {cat.urduName}
                    </div>
                  )}
                  {cat.description && (
                    <p className={`text-[11px] mt-1 line-clamp-1 ${
                      isSelected ? 'text-stone-300' : 'text-[#8C7A70]'
                    }`}>
                      {cat.description}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
