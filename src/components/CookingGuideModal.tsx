import React, { useState } from 'react';
import { X, ChefHat, Flame, Clock, Snowflake, AlertTriangle, CheckCircle2, Sparkles, Wind, Utensils } from 'lucide-react';

interface CookingGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CookingGuideModal: React.FC<CookingGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'pan' | 'airfryer' | 'tawa' | 'nimko'>('pan');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      
      <div 
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#E8DFC8] overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#801414] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold font-display">
                Master Chef Frying & Preparation Guide
              </h2>
              <p className="text-xs text-amber-200">
                How to fry frozen kababs to golden juicy perfection in 3–4 minutes
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-[#FAF7F0] border-b border-[#E8DFC8] px-6 py-2.5 flex gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('pan')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'pan' ? 'bg-[#801414] text-white shadow-xs' : 'bg-white text-[#523B33] hover:bg-[#F2EBDC]'
            }`}
          >
            🍳 Pan / Shallow Frying (3 Mins)
          </button>
          <button
            onClick={() => setActiveTab('airfryer')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'airfryer' ? 'bg-[#801414] text-white shadow-xs' : 'bg-white text-[#523B33] hover:bg-[#F2EBDC]'
            }`}
          >
            💨 Air Fryer (Zero Guilt)
          </button>
          <button
            onClick={() => setActiveTab('tawa')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'tawa' ? 'bg-[#801414] text-white shadow-xs' : 'bg-white text-[#523B33] hover:bg-[#F2EBDC]'
            }`}
          >
            🔥 Tawa / BBQ Grill
          </button>
          <button
            onClick={() => setActiveTab('nimko')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'nimko' ? 'bg-[#801414] text-white shadow-xs' : 'bg-white text-[#523B33] hover:bg-[#F2EBDC]'
            }`}
          >
            🥜 Nimko Crunch Tips
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6 text-[#2D1A16]">
          
          {/* Golden Rule Warning Callout */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 flex items-start gap-3 text-xs text-[#523B33]">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-900 font-bold block text-sm mb-0.5">
                The #1 Secret: NEVER Thaw Before Frying!
              </strong>
              Do not microwave-defrost or leave kababs at room temperature for hours. Dropping them straight from frozen into hot oil traps the meat juices, creates a crisp crust, and prevents shape breakage.
            </div>
          </div>

          {/* Tab 1: Pan Shallow Frying */}
          {activeTab === 'pan' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold font-display text-[#801414] flex items-center gap-2">
                <Flame className="w-5 h-5" />
                <span>Pan / Shallow Frying Steps (Recommended for Seekh & Shami)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-[#FAF7F0] p-4 rounded-xl border border-[#E8DFC8] space-y-2">
                  <div className="w-7 h-7 rounded-full bg-[#801414] text-white font-bold flex items-center justify-center text-xs">1</div>
                  <h4 className="font-bold text-sm text-[#2D1A16]">Heat the Oil</h4>
                  <p className="text-[#523B33]">Add 2–3 tbsp of cooking oil or desi ghee in a non-stick pan over medium heat (approx 170°C). Wait until oil shimmers.</p>
                </div>

                <div className="bg-[#FAF7F0] p-4 rounded-xl border border-[#E8DFC8] space-y-2">
                  <div className="w-7 h-7 rounded-full bg-[#801414] text-white font-bold flex items-center justify-center text-xs">2</div>
                  <h4 className="font-bold text-sm text-[#2D1A16]">Fry Straight Frozen</h4>
                  <p className="text-[#523B33]">Place frozen kababs carefully into hot pan. Fry for 3–4 minutes, gently turning every 45–60 seconds for even golden color.</p>
                </div>

                <div className="bg-[#FAF7F0] p-4 rounded-xl border border-[#E8DFC8] space-y-2">
                  <div className="w-7 h-7 rounded-full bg-[#801414] text-white font-bold flex items-center justify-center text-xs">3</div>
                  <h4 className="font-bold text-sm text-[#2D1A16]">Rest & Garnish</h4>
                  <p className="text-[#523B33]">Transfer to paper towel for 60 seconds to allow natural juices to settle. Garnish with lemon juice and chaat masala.</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Air Fryer */}
          {activeTab === 'airfryer' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold font-display text-[#801414] flex items-center gap-2">
                <Wind className="w-5 h-5" />
                <span>Air Fryer Instructions (Crispy Skin with 80% Less Oil)</span>
              </h3>

              <div className="bg-[#FAF7F0] p-5 rounded-2xl border border-[#E8DFC8] space-y-3 text-xs text-[#523B33]">
                <div className="flex items-center gap-2 font-bold text-sm text-[#2D1A16]">
                  <Clock className="w-4 h-4 text-[#D97706]" />
                  <span>Time: 6 to 8 minutes • Temperature: 185°C (365°F)</span>
                </div>
                <p>1. Preheat your air fryer for 2 minutes at 185°C.</p>
                <p>2. Lightly brush or spray the frozen kababs with 1 teaspoon of vegetable oil or olive oil.</p>
                <p>3. Place them in a single layer in the air fryer basket without overlapping.</p>
                <p>4. Air fry for 4 minutes, pause to shake or flip the kababs, then fry for another 3 to 4 minutes until sizzling hot with caramelized edges.</p>
              </div>
            </div>
          )}

          {/* Tab 3: Tawa / BBQ Grill */}
          {activeTab === 'tawa' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold font-display text-[#801414] flex items-center gap-2">
                <Flame className="w-5 h-5" />
                <span>Tawa Searing & Bun Kabab Assembly</span>
              </h3>

              <div className="bg-[#FAF7F0] p-5 rounded-2xl border border-[#E8DFC8] space-y-2.5 text-xs text-[#523B33]">
                <p><strong>Flat Tawa Technique:</strong> Smear flat iron tawa with a dollop of butter. Sear each side of the kabab for 90 seconds while pressing lightly with a wooden spatula.</p>
                <p><strong>Karachi Bun Kabab Style:</strong> Fry Shami kabab, toast round burger bun with butter on the tawa, spread spicy green mint chutney and imli sauce, add onion rings and slice of tomato, and press lightly!</p>
              </div>
            </div>
          )}

          {/* Tab 4: Nimko Crunch */}
          {activeTab === 'nimko' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold font-display text-[#801414] flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span>Nimko Freshness & Crisping Pro-Tips</span>
              </h3>

              <div className="bg-[#FAF7F0] p-5 rounded-2xl border border-[#E8DFC8] space-y-2.5 text-xs text-[#523B33]">
                <p><strong>Storage:</strong> Keep nimko in our zipper seal pouch or transfer to a tight glass jar at room temperature. Keep away from humid air or direct steam.</p>
                <p><strong>Instant Warmth Hack:</strong> Microwave 1 bowl of mix nimko for 15 seconds, or toss in a dry warm pan for 30 seconds. The roasted peanuts and sev release rich roasted nutty aromas that taste straight from the fryer!</p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF7F0] border-t border-[#E8DFC8] flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#801414] hover:bg-[#681010] text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-colors cursor-pointer"
          >
            Got It, Thanks!
          </button>
        </div>

      </div>
    </div>
  );
};
