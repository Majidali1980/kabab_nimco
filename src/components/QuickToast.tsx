import React from 'react';
import { CheckCircle2, ShoppingBag, X } from 'lucide-react';

interface QuickToastProps {
  message: string | null;
  onClose: () => void;
  onOpenCart?: () => void;
}

export const QuickToast: React.FC<QuickToastProps> = ({ message, onClose, onOpenCart }) => {
  if (!message) return null;

  return (
    <div className="fixed top-24 right-4 sm:right-6 z-50 animate-in slide-in-from-top-4 fade-in duration-200">
      <div className="bg-[#2D1A16] text-[#FDFBF7] border border-[#E69500]/50 shadow-2xl rounded-2xl p-4 flex items-center gap-3.5 max-w-md">
        <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        
        <div className="flex-1 text-xs">
          <p className="font-bold text-white">{message}</p>
        </div>

        {onOpenCart && (
          <button
            onClick={() => {
              onClose();
              onOpenCart();
            }}
            className="bg-[#D97706] hover:bg-[#B45309] text-slate-950 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-colors cursor-pointer shrink-0"
          >
            View Cart
          </button>
        )}

        <button
          onClick={onClose}
          className="text-stone-400 hover:text-white p-1"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
