import React, { useState, useRef, useEffect } from 'react';
import { 
  UploadCloud, 
  Image as ImageIcon, 
  Trash2, 
  Check, 
  AlertCircle, 
  Eye, 
  Info, 
  Layers, 
  Star,
  Plus
} from 'lucide-react';
import { SAMPLE_IMAGE_PRESETS } from '../../data/defaultConfig';

export interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  recommendedWidth?: number;
  recommendedHeight?: number;
  aspectRatioLabel?: string; // e.g. "1:1 Square", "16:9 Landscape", "2.4:1 Wide Banner", "4:3 Classic"
  maxSizeMB?: number;
  helpText?: string;
  // Multiple / Gallery support
  galleryValues?: string[];
  onGalleryChange?: (urls: string[]) => void;
  allowGallery?: boolean;
}

export const ImageUploader: React.FC<ImageUploadProps> = ({
  label,
  value,
  onChange,
  recommendedWidth = 800,
  recommendedHeight = 800,
  aspectRatioLabel = '1:1 Square',
  maxSizeMB = 2,
  helpText,
  galleryValues,
  onGalleryChange,
  allowGallery = false
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [urlInput, setUrlInput] = useState(value || '');
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [detectedStats, setDetectedStats] = useState<{
    width?: number;
    height?: number;
    fileSizeKB?: number;
    fileName?: string;
    format?: string;
  }>({});
  const [previewOpen, setPreviewOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Sync internal url input if value prop changes externally
  useEffect(() => {
    setUrlInput(value || '');
    if (value) {
      detectImageDimensions(value);
    }
  }, [value]);

  const detectImageDimensions = (imageSrc: string, fileSize?: number, fileName?: string) => {
    if (!imageSrc) return;
    const img = new Image();
    img.onload = () => {
      let format = 'JPG/PNG';
      if (imageSrc.startsWith('data:image/png')) format = 'PNG';
      else if (imageSrc.startsWith('data:image/jpeg')) format = 'JPEG';
      else if (imageSrc.startsWith('data:image/webp')) format = 'WEBP';
      else if (imageSrc.includes('.png')) format = 'PNG';
      else if (imageSrc.includes('.webp')) format = 'WEBP';

      setDetectedStats(prev => ({
        ...prev,
        width: img.naturalWidth,
        height: img.naturalHeight,
        format,
        fileSizeKB: fileSize ? Math.round(fileSize / 1024) : prev.fileSizeKB,
        fileName: fileName || prev.fileName || 'Selected Image'
      }));
    };
    img.src = imageSrc;
  };

  const handleFileProcess = (file: File, isGalleryItem: boolean = false) => {
    setFileError(null);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setFileError('Please select a valid image file (JPG, PNG, WEBP, etc.).');
      return;
    }

    // Validate max size
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > maxSizeMB) {
      setFileError(`File size (${sizeInMB.toFixed(2)} MB) exceeds maximum limit of ${maxSizeMB} MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) return;

      detectImageDimensions(dataUrl, file.size, file.name);

      if (isGalleryItem && onGalleryChange && galleryValues) {
        onGalleryChange([...galleryValues, dataUrl]);
      } else {
        onChange(dataUrl);
        setUrlInput(dataUrl);
      }
    };
    reader.onerror = () => {
      setFileError('Failed to read image file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file, false);
    }
  };

  const handleGalleryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && onGalleryChange && galleryValues) {
      const remainingSlots = 6 - galleryValues.length;
      const filesToProcess: File[] = Array.from(files).slice(0, remainingSlots) as File[];

      filesToProcess.forEach((file: File) => {
        handleFileProcess(file, true);
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file, false);
    }
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      detectImageDimensions(urlInput.trim());
    }
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    if (!onGalleryChange || !galleryValues) return;
    const updated = galleryValues.filter((_, i) => i !== indexToRemove);
    onGalleryChange(updated);
  };

  const handleSetPrimaryFromGallery = (imgUrl: string) => {
    onChange(imgUrl);
  };

  return (
    <div className="space-y-3 bg-[#FAF7F0] p-4 sm:p-5 rounded-2xl border border-[#E8DFC8]">
      {/* Header and Required Dimensions Box */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8DFC8] pb-3">
        <div>
          <label className="text-xs font-extrabold text-[#2D1A16] flex items-center gap-1.5 uppercase tracking-wider">
            <ImageIcon className="w-4 h-4 text-[#801414]" />
            <span>{label}</span>
          </label>
          {helpText && <p className="text-[11px] text-[#735A50] mt-0.5">{helpText}</p>}
        </div>

        {/* Required Dimension Badge */}
        <div className="inline-flex items-center gap-2 bg-[#FAF0DC] text-[#801414] border border-[#EAD5AB] px-3 py-1.5 rounded-xl text-xs font-bold shrink-0">
          <Info className="w-3.5 h-3.5 text-[#D97706]" />
          <span>
            Target Size: <strong className="text-[#2D1A16]">{recommendedWidth} × {recommendedHeight} px</strong> ({aspectRatioLabel}, Max {maxSizeMB}MB)
          </span>
        </div>
      </div>

      {/* Tabs for Upload Method */}
      <div className="flex items-center gap-1.5 p-1 bg-[#F0E8D8] rounded-xl text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-1.5 px-3 rounded-lg transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'upload'
              ? 'bg-white text-[#801414] shadow-xs'
              : 'text-[#5C453D] hover:text-[#2D1A16]'
          }`}
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Direct Upload</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('url')}
          className={`flex-1 py-1.5 px-3 rounded-lg transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'url'
              ? 'bg-white text-[#801414] shadow-xs'
              : 'text-[#5C453D] hover:text-[#2D1A16]'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Image URL</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('presets')}
          className={`flex-1 py-1.5 px-3 rounded-lg transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'presets'
              ? 'bg-white text-[#801414] shadow-xs'
              : 'text-[#5C453D] hover:text-[#2D1A16]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Preset Library</span>
        </button>
      </div>

      {/* Tab 1: Direct File Upload */}
      {activeTab === 'upload' && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-[#801414] bg-[#FAF0DC]'
              : 'border-[#DDD4CA] bg-white hover:bg-[#FFFDF9] hover:border-[#801414]/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp, image/jpg"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="w-12 h-12 rounded-full bg-[#FAF0DC] text-[#801414] flex items-center justify-center mx-auto mb-3">
            <UploadCloud className="w-6 h-6" />
          </div>

          <div className="text-xs font-bold text-[#2D1A16]">
            Drag and drop your image here, or <span className="text-[#801414] underline">browse files</span>
          </div>

          <p className="text-[11px] text-[#8C7A70] mt-1">
            Supports JPG, PNG, WEBP. Recommended size: <strong>{recommendedWidth} × {recommendedHeight} px</strong> (Max {maxSizeMB}MB)
          </p>
        </div>
      )}

      {/* Tab 2: URL Input */}
      {activeTab === 'url' && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/images/kabab-pack.jpg"
              className="flex-1 bg-white border border-[#DDD4CA] text-xs font-medium px-3 py-2 rounded-xl outline-none focus:border-[#801414]"
            />
            <button
              type="button"
              onClick={handleApplyUrl}
              className="bg-[#801414] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#681010] transition-colors cursor-pointer"
            >
              Apply
            </button>
          </div>
          <p className="text-[10px] text-[#8C7A70]">
            Paste any publicly accessible image URL or CDN link.
          </p>
        </div>
      )}

      {/* Tab 3: Presets */}
      {activeTab === 'presets' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {SAMPLE_IMAGE_PRESETS.map((preset, idx) => {
            const isSelected = value === preset.url;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onChange(preset.url);
                  setUrlInput(preset.url);
                }}
                className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#FAF0DC] border-[#801414] text-[#801414] font-bold shadow-xs'
                    : 'bg-white border-[#E8DFC8] hover:border-[#801414]/40 text-[#2D1A16]'
                }`}
              >
                <img
                  src={preset.url}
                  alt={preset.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-lg object-cover border border-[#E8DFC8] shrink-0"
                />
                <div className="overflow-hidden">
                  <div className="text-[11px] font-bold truncate">{preset.name}</div>
                  <div className="text-[9px] text-[#8C7A70]">Preset Asset</div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Error Message */}
      {fileError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-2.5 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{fileError}</span>
        </div>
      )}

      {/* Live Thumbnail & Detected Dimensions Preview Card */}
      {value && (
        <div className="bg-white p-3.5 rounded-xl border border-[#DDD4CA] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {/* Thumbnail Box */}
            <div className="relative group w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-stone-100 border border-[#E8DFC8] shrink-0">
              <img
                src={value}
                alt="Selected preview"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setPreviewOpen(true)}
                className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                title="View full preview"
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>

            {/* Image Metainfo */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-[#2D1A16]">Primary Thumbnail</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.2 rounded-full flex items-center gap-0.5">
                  <Check className="w-3 h-3" /> Active
                </span>
              </div>

              {/* Detected dimensions & file size stats */}
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#735A50]">
                {detectedStats.width && detectedStats.height && (
                  <span className="bg-[#FAF7F0] border border-[#E8DFC8] px-2 py-0.5 rounded font-mono font-semibold text-[#2D1A16]">
                    {detectedStats.width} × {detectedStats.height} px
                  </span>
                )}
                {detectedStats.fileSizeKB ? (
                  <span className="bg-[#FAF7F0] border border-[#E8DFC8] px-2 py-0.5 rounded font-semibold text-[#801414]">
                    {detectedStats.fileSizeKB > 1024
                      ? `${(detectedStats.fileSizeKB / 1024).toFixed(2)} MB`
                      : `${detectedStats.fileSizeKB} KB`}
                  </span>
                ) : null}
                {detectedStats.format && (
                  <span className="bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold">
                    {detectedStats.format}
                  </span>
                )}
              </div>

              {/* Dimensions feedback */}
              {detectedStats.width && detectedStats.height && (
                <div className="text-[10px]">
                  {detectedStats.width >= recommendedWidth && detectedStats.height >= recommendedHeight ? (
                    <span className="text-emerald-700 font-medium flex items-center gap-1">
                      ✓ Optimal resolution for high-DPI screens.
                    </span>
                  ) : (
                    <span className="text-amber-700 font-medium">
                      ⚠️ Smaller than recommended ({recommendedWidth}×{recommendedHeight}px), may appear soft.
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-bold text-[#801414] bg-[#FAF0DC] hover:bg-[#F5E5C4] px-3 py-1.5 rounded-lg border border-[#EAD5AB] transition-colors cursor-pointer"
            >
              Replace
            </button>
          </div>
        </div>
      )}

      {/* Gallery & Extra Thumbnails Section (if allowGallery is enabled) */}
      {allowGallery && onGalleryChange && (
        <div className="mt-4 pt-3 border-t border-[#E8DFC8] space-y-2.5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#2D1A16] uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#801414]" />
                Gallery Thumbnails ({galleryValues?.length || 0} / 6)
              </span>
              <p className="text-[10px] text-[#8C7A70]">
                Add multiple product angles, raw vs fried shots, or packaging photos (800 × 800 px).
              </p>
            </div>

            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              disabled={(galleryValues?.length || 0) >= 6}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#801414] bg-[#FAF0DC] hover:bg-[#F5E5C4] px-2.5 py-1 rounded-lg border border-[#EAD5AB] disabled:opacity-40 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Thumbnail</span>
            </button>
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleGalleryFileChange}
              className="hidden"
            />
          </div>

          {/* Thumbnails list */}
          <div className="flex flex-wrap gap-2.5">
            {galleryValues && galleryValues.length > 0 ? (
              galleryValues.map((imgUrl, gIdx) => {
                const isCurrentPrimary = value === imgUrl;
                return (
                  <div
                    key={gIdx}
                    className={`relative group w-18 h-18 rounded-xl overflow-hidden border-2 bg-stone-100 shadow-xs ${
                      isCurrentPrimary ? 'border-[#801414]' : 'border-[#DDD4CA]'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumbnail ${gIdx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />

                    {isCurrentPrimary && (
                      <span className="absolute top-1 left-1 bg-[#801414] text-white p-0.5 rounded-full shadow-xs">
                        <Star className="w-2.5 h-2.5 fill-amber-300 text-amber-300" />
                      </span>
                    )}

                    {/* Hover Actions Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                      {!isCurrentPrimary && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimaryFromGallery(imgUrl)}
                          className="p-1 bg-white/90 hover:bg-white text-[#801414] rounded-md"
                          title="Set as Main Cover Photo"
                        >
                          <Star className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(gIdx)}
                        className="p-1 bg-red-600/90 hover:bg-red-700 text-white rounded-md"
                        title="Delete thumbnail"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-[11px] text-[#8C7A70] italic bg-white p-3 rounded-xl border border-dashed border-[#DDD4CA] w-full text-center">
                No additional gallery thumbnails uploaded yet. Click "Add Thumbnail" to upload more angles.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lightbox / Zoom Modal */}
      {previewOpen && (
        <div
          className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPreviewOpen(false)}
        >
          <div className="relative max-w-2xl max-h-[85vh] bg-white rounded-2xl overflow-hidden p-2">
            <img
              src={value}
              alt="Full preview"
              referrerPolicy="no-referrer"
              className="max-w-full max-h-[75vh] object-contain rounded-xl mx-auto"
            />
            <div className="p-3 text-center text-xs font-bold text-[#2D1A16] flex items-center justify-between border-t border-[#E8DFC8] mt-2">
              <span>{label}</span>
              {detectedStats.width && (
                <span className="text-[#801414]">
                  {detectedStats.width} × {detectedStats.height} px ({detectedStats.fileSizeKB} KB)
                </span>
              )}
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="text-stone-500 hover:text-stone-900 underline font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
