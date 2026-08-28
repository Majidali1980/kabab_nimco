import React, { useState } from 'react';
import { 
  Database, 
  Download, 
  Upload, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle, 
  FileText 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminBackup: React.FC = () => {
  const { 
    siteSettings, 
    notificationBar, 
    navbarConfig, 
    heroSlides, 
    products, 
    deals, 
    topSellingConfig, 
    nimkoRangeConfig, 
    footerConfig, 
    orders,
    resetToFactoryDefaults
  } = useStore();

  const [importJson, setImportJson] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  // Export all store data as JSON download
  const handleExportData = () => {
    const fullBackup = {
      siteSettings,
      notificationBar,
      navbarConfig,
      heroSlides,
      products,
      deals,
      topSellingConfig,
      nimkoRangeConfig,
      footerConfig,
      orders,
      exportedAt: new Date().toISOString(),
      version: '2.0.0'
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `kabab_nimko_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setStatusMessage({ type: 'success', text: 'Backup JSON downloaded successfully!' });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Import JSON from textarea or file
  const handleImportData = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importJson.trim()) return;

    try {
      const parsed = JSON.parse(importJson);
      
      if (parsed.siteSettings) localStorage.setItem('nk_site_settings_v2', JSON.stringify(parsed.siteSettings));
      if (parsed.notificationBar) localStorage.setItem('nk_notification_bar_v2', JSON.stringify(parsed.notificationBar));
      if (parsed.navbarConfig) localStorage.setItem('nk_navbar_config_v2', JSON.stringify(parsed.navbarConfig));
      if (parsed.heroSlides) localStorage.setItem('nk_hero_slides_v2', JSON.stringify(parsed.heroSlides));
      if (parsed.products) localStorage.setItem('nk_products_v2', JSON.stringify(parsed.products));
      if (parsed.deals) localStorage.setItem('nk_deals_v2', JSON.stringify(parsed.deals));
      if (parsed.topSellingConfig) localStorage.setItem('nk_top_selling_config_v2', JSON.stringify(parsed.topSellingConfig));
      if (parsed.nimkoRangeConfig) localStorage.setItem('nk_nimko_range_config_v2', JSON.stringify(parsed.nimkoRangeConfig));
      if (parsed.footerConfig) localStorage.setItem('nk_footer_config_v2', JSON.stringify(parsed.footerConfig));
      if (parsed.orders) localStorage.setItem('nk_orders_v2', JSON.stringify(parsed.orders));

      setStatusMessage({ type: 'success', text: 'Data imported successfully! Reloading data...' });
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Invalid JSON format! Please check the structure and try again.' });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportJson(content);
    };
    reader.readAsText(file);
  };

  const handlePerformReset = () => {
    resetToFactoryDefaults();
    setConfirmReset(false);
    setStatusMessage({ type: 'success', text: 'Reset to factory defaults completed!' });
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#E8DFC8] pb-4">
        <h2 className="text-xl font-bold text-[#2D1A16] font-display flex items-center gap-2">
          <Database className="w-6 h-6 text-slate-700" />
          Backup, Export & Factory Reset
        </h2>
        <p className="text-xs text-[#735A50]">
          Export complete website configurations and product catalog as JSON, import previous backups, or restore defaults.
        </p>
      </div>

      {statusMessage && (
        <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {statusMessage.type === 'success' ? <CheckCircle className="w-5 h-5 text-emerald-600" /> : <AlertTriangle className="w-5 h-5 text-red-600" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Export Section */}
      <div className="bg-white p-6 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-[#2D1A16] font-display">
          <Download className="w-5 h-5 text-emerald-700" />
          <span>Export Storefront Configuration (Download JSON)</span>
        </div>
        <p className="text-xs text-[#735A50]">
          Downloads all your custom WhatsApp phone numbers, notification ribbon, navbar links, hero slides, products, combo deals, sections, and logged orders into an offline file.
        </p>
        <button
          type="button"
          onClick={handleExportData}
          className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs cursor-pointer transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Download Backup JSON</span>
        </button>
      </div>

      {/* Import Section */}
      <form onSubmit={handleImportData} className="bg-white p-6 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-[#2D1A16] font-display">
            <Upload className="w-5 h-5 text-indigo-700" />
            <span>Import Configuration JSON</span>
          </div>

          <label className="text-xs font-bold text-[#801414] bg-[#FAF0DC] hover:bg-[#F5E5C4] px-3 py-1.5 rounded-xl border border-[#EAD5AB] cursor-pointer">
            <span>Upload .JSON File</span>
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        <textarea
          rows={5}
          value={importJson}
          onChange={(e) => setImportJson(e.target.value)}
          placeholder="Paste exported backup JSON here or click 'Upload .JSON File' above..."
          className="w-full bg-[#FAF7F0] border border-[#DDD4CA] focus:border-[#801414] text-xs font-mono p-3 rounded-xl outline-none"
        />

        <button
          type="submit"
          disabled={!importJson.trim()}
          className="inline-flex items-center gap-2 bg-indigo-700 hover:bg-indigo-800 disabled:opacity-40 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs cursor-pointer transition-all"
        >
          <Upload className="w-4 h-4" />
          <span>Apply & Restore From JSON</span>
        </button>
      </form>

      {/* Factory Reset Section */}
      <div className="bg-red-50/70 p-6 rounded-2xl border border-red-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-red-900 font-display">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <span>Restore Factory Defaults</span>
        </div>
        <p className="text-xs text-red-700 leading-relaxed">
          This will clear any local modifications made to WhatsApp numbers, products, deals, and hero slides, resetting them back to the original artisanal Karachi kababs & nimko seed data.
        </p>

        {!confirmReset ? (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="inline-flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs cursor-pointer transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset All to Defaults</span>
          </button>
        ) : (
          <div className="flex items-center gap-3 pt-2">
            <span className="text-xs font-bold text-red-900">Are you sure?</span>
            <button
              type="button"
              onClick={handlePerformReset}
              className="bg-red-800 hover:bg-red-900 text-white font-black text-xs px-4 py-2 rounded-xl shadow-sm cursor-pointer"
            >
              Yes, Reset Everything
            </button>
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="bg-white border border-stone-300 text-stone-700 text-xs font-bold px-4 py-2 rounded-xl hover:bg-stone-100 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
