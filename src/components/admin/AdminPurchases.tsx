import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { PurchaseRecord, PurchaseItem } from '../../types';
import {
  ShoppingBag,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  FileText,
  Calendar,
  Building2,
  Phone,
  DollarSign,
  Search,
  Filter,
  Receipt,
  Download
} from 'lucide-react';

export const AdminPurchases: React.FC = () => {
  const { purchases, addPurchase, updatePurchase, deletePurchase, siteSettings, primaryMaterialCategories } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);

  const initialItems: PurchaseItem[] = [
    { name: '', category: 'Raw Meat', quantity: 1, unit: 'Kg', unitCost: 0, totalCost: 0 }
  ];

  const [formData, setFormData] = useState<Omit<PurchaseRecord, 'id'>>({
    purchaseInvoiceNo: `INV-${Date.now().toString().slice(-4)}`,
    date: new Date().toISOString().slice(0, 10),
    supplierName: '',
    supplierPhone: '',
    category: 'Raw Meat',
    items: initialItems,
    totalAmount: 0,
    paymentStatus: 'Paid',
    paymentMethod: 'bank_transfer',
    notes: '',
    createdAt: new Date().toISOString()
  });

  const recalculateTotal = (items: PurchaseItem[]) => {
    return items.reduce((sum, item) => sum + (item.totalCost || 0), 0);
  };

  const handleStartCreate = () => {
    const defaultItem: PurchaseItem = {
      name: '',
      category: 'Raw Meat',
      quantity: 10,
      unit: 'Kg',
      unitCost: 500,
      totalCost: 5000
    };
    setFormData({
      purchaseInvoiceNo: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().slice(0, 10),
      supplierName: '',
      supplierPhone: '',
      category: 'Raw Meat',
      items: [defaultItem],
      totalAmount: 5000,
      paymentStatus: 'Paid',
      paymentMethod: 'bank_transfer',
      notes: '',
      createdAt: new Date().toISOString()
    });
    setIsCreating(true);
    setIsEditing(null);
  };

  const handleStartEdit = (record: PurchaseRecord) => {
    setFormData({
      purchaseInvoiceNo: record.purchaseInvoiceNo,
      date: record.date,
      supplierName: record.supplierName,
      supplierPhone: record.supplierPhone || '',
      category: record.category,
      items: record.items && record.items.length > 0 ? record.items : initialItems,
      totalAmount: record.totalAmount,
      paymentStatus: record.paymentStatus,
      paymentMethod: record.paymentMethod,
      notes: record.notes || '',
      createdAt: record.createdAt || new Date().toISOString()
    });
    setIsEditing(record.id);
    setIsCreating(false);
  };

  const handleItemChange = (index: number, field: keyof PurchaseItem, value: any) => {
    const updatedItems = [...formData.items];
    const targetItem = { ...updatedItems[index], [field]: value };

    if (field === 'quantity' || field === 'unitCost') {
      const q = field === 'quantity' ? Number(value) : Number(targetItem.quantity);
      const u = field === 'unitCost' ? Number(value) : Number(targetItem.unitCost);
      targetItem.totalCost = Math.round(q * u);
    }

    updatedItems[index] = targetItem;
    const total = recalculateTotal(updatedItems);

    setFormData(prev => ({
      ...prev,
      items: updatedItems,
      totalAmount: total
    }));
  };

  const handleAddItem = () => {
    const newItem: PurchaseItem = {
      name: '',
      category: formData.category,
      quantity: 1,
      unit: 'Kg',
      unitCost: 0,
      totalCost: 0
    };
    const updated = [...formData.items, newItem];
    setFormData(prev => ({
      ...prev,
      items: updated,
      totalAmount: recalculateTotal(updated)
    }));
  };

  const handleRemoveItem = (index: number) => {
    if (formData.items.length === 1) return;
    const updated = formData.items.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      items: updated,
      totalAmount: recalculateTotal(updated)
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.supplierName.trim() || formData.items.length === 0) return;

    if (isCreating) {
      addPurchase(formData);
      setIsCreating(false);
    } else if (isEditing) {
      updatePurchase(isEditing, formData);
      setIsEditing(null);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setIsEditing(null);
  };

  // Filtered purchases
  const filteredPurchases = purchases.filter(p => {
    const matchesSearch =
      p.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.purchaseInvoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.items.some(it => it.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalSpent = purchases.reduce((sum, p) => sum + (p.totalAmount || 0), 0);
  const totalInvoices = purchases.length;
  const avgPurchase = totalInvoices > 0 ? Math.round(totalSpent / totalInvoices) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900">Purchase & Material Inward Invoices</h2>
            <p className="text-sm text-stone-500">
              Log raw meat, whole spices, packaging foils, and cooking oil costs for accurate profit reporting.
            </p>
          </div>
        </div>
        <button
          onClick={handleStartCreate}
          disabled={isCreating}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          Log Purchase Invoice
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-700 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Purchases Logged</div>
            <div className="text-2xl font-black text-stone-900 mt-0.5">
              {siteSettings.currency} {totalSpent.toLocaleString()}
            </div>
            <div className="text-xs text-stone-500 mt-0.5">{totalInvoices} total bills recorded</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">Avg. Invoice Size</div>
            <div className="text-2xl font-black text-stone-900 mt-0.5">
              {siteSettings.currency} {avgPurchase.toLocaleString()}
            </div>
            <div className="text-xs text-stone-500 mt-0.5">Per procurement batch</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">Supplier Coverage</div>
            <div className="text-2xl font-black text-stone-900 mt-0.5">
              {new Set(purchases.map(p => p.supplierName)).size} Vendors
            </div>
            <div className="text-xs text-stone-500 mt-0.5">Meat, Spices & Packaging</div>
          </div>
        </div>
      </div>

      {/* Invoice Form Box */}
      {(isCreating || isEditing) && (
        <div className="bg-stone-50 border border-emerald-300 rounded-2xl p-6 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-stone-200">
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              {isCreating ? 'Record New Purchase Inward' : 'Edit Purchase Invoice'}
            </h3>
            <button
              onClick={handleCancel}
              className="text-stone-400 hover:text-stone-600 p-1.5 rounded-lg hover:bg-stone-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Invoice / Bill No. *
                </label>
                <input
                  type="text"
                  required
                  value={formData.purchaseInvoiceNo}
                  onChange={e => setFormData(prev => ({ ...prev, purchaseInvoiceNo: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-stone-900 text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Purchase Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-stone-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Supplier / Vendor Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.supplierName}
                  onChange={e => setFormData(prev => ({ ...prev, supplierName: e.target.value }))}
                  placeholder="e.g. Al-Haram Poultry & Meat"
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-stone-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Supplier Contact Phone
                </label>
                <input
                  type="text"
                  value={formData.supplierPhone}
                  onChange={e => setFormData(prev => ({ ...prev, supplierPhone: e.target.value }))}
                  placeholder="e.g. 0321-4455667"
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-stone-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Primary Material Category
                </label>
                <select
                  value={formData.category}
                  onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-stone-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="Raw Meat">Raw Meat (Chicken & Beef Mince)</option>
                  <option value="Spices & Seasoning">Spices & Whole Condiments</option>
                  <option value="Packaging Materials">Packaging Pouches & Trays</option>
                  <option value="Cooking Oil & Ghee">Cooking Oil, Ghee & Fry Aids</option>
                  <option value="Flour & Lentils">Gram Flour (Besan) & Lentils</option>
                  <option value="Other Overhead">Other Kitchen Consumables</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Payment Status
                </label>
                <select
                  value={formData.paymentStatus}
                  onChange={e => setFormData(prev => ({ ...prev, paymentStatus: e.target.value as any }))}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-stone-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="Paid">Paid in Full</option>
                  <option value="Partial">Partial Payment</option>
                  <option value="Unpaid">Unpaid / Credit</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Payment Method
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={e => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-stone-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="bank_transfer">Bank Transfer (Raast / IBFT)</option>
                  <option value="cash">Cash on Delivery / Inward</option>
                  <option value="cheque">Company Cheque</option>
                  <option value="jazzcash_easypaisa">JazzCash / EasyPaisa</option>
                </select>
              </div>
            </div>

            {/* Line Items Table */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Purchased Items & Material Cost Breakdown
                </label>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Another Item
                </button>
              </div>

              <div className="bg-white rounded-xl border border-stone-300 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-100 border-b border-stone-200 font-bold text-stone-600">
                    <tr>
                      <th className="py-2.5 px-3">Item Description</th>
                      <th className="py-2.5 px-3 w-32">Category</th>
                      <th className="py-2.5 px-3 w-24">Qty</th>
                      <th className="py-2.5 px-3 w-24">Unit</th>
                      <th className="py-2.5 px-3 w-28">Unit Cost (Rs.)</th>
                      <th className="py-2.5 px-3 w-32 text-right">Line Total (Rs.)</th>
                      <th className="py-2.5 px-2 w-10 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {formData.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-stone-50/60">
                        <td className="p-2">
                          <input
                            type="text"
                            required
                            placeholder="e.g. Boneless Chicken Mince"
                            value={item.name}
                            onChange={e => handleItemChange(idx, 'name', e.target.value)}
                            className="w-full px-2.5 py-1.5 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            placeholder="Raw Meat"
                            value={item.category || ''}
                            onChange={e => handleItemChange(idx, 'category', e.target.value)}
                            className="w-full px-2.5 py-1.5 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            min="1"
                            step="any"
                            value={item.quantity}
                            onChange={e => handleItemChange(idx, 'quantity', e.target.value)}
                            className="w-full px-2.5 py-1.5 border border-stone-200 rounded-lg text-stone-900 font-medium text-center focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
                          />
                        </td>
                        <td className="p-2">
                          <select
                            value={item.unit}
                            onChange={e => handleItemChange(idx, 'unit', e.target.value)}
                            className="w-full px-2 py-1.5 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
                          >
                            <option value="Kg">Kg</option>
                            <option value="Grams">Grams</option>
                            <option value="Packs">Packs</option>
                            <option value="Liters">Liters</option>
                            <option value="Bags">Bags</option>
                            <option value="Pcs">Pcs</option>
                          </select>
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={item.unitCost}
                            onChange={e => handleItemChange(idx, 'unitCost', e.target.value)}
                            className="w-full px-2.5 py-1.5 border border-stone-200 rounded-lg text-stone-900 font-mono text-right focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
                          />
                        </td>
                        <td className="p-2 text-right font-bold text-stone-900 font-mono">
                          {siteSettings.currency} {(item.totalCost || 0).toLocaleString()}
                        </td>
                        <td className="p-2 text-center">
                          <button
                            type="button"
                            disabled={formData.items.length === 1}
                            onClick={() => handleRemoveItem(idx)}
                            className="p-1 text-stone-400 hover:text-red-600 disabled:opacity-20 rounded-md"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-stone-200">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-stone-600">Total Purchase Amount:</span>
                <span className="text-xl font-black text-emerald-800 font-mono">
                  {siteSettings.currency} {formData.totalAmount.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 text-stone-600 hover:text-stone-800 text-sm font-medium hover:bg-stone-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  {isCreating ? 'Save Purchase Invoice' : 'Update Invoice'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search by invoice number, supplier or item name..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-stone-400" />
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
          >
            <option value="all">All Categories</option>
            <option value="Raw Meat">Raw Meat</option>
            <option value="Spices & Seasoning">Spices & Seasoning</option>
            <option value="Packaging Materials">Packaging Materials</option>
            <option value="Cooking Oil & Ghee">Cooking Oil & Ghee</option>
            <option value="Flour & Lentils">Flour & Lentils</option>
          </select>
        </div>
      </div>

      {/* Purchases List Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-stone-700">
            <thead className="bg-stone-50 border-b border-stone-200 text-xs font-bold text-stone-500 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Invoice / Date</th>
                <th className="py-3.5 px-4">Supplier & Contact</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Items Summary</th>
                <th className="py-3.5 px-4 text-right">Total Amount</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredPurchases.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-stone-400">
                    No purchase records found matching your query.
                  </td>
                </tr>
              ) : (
                filteredPurchases.map(record => (
                  <tr key={record.id} className="hover:bg-stone-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-stone-900">{record.purchaseInvoiceNo}</div>
                      <div className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {new Date(record.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-stone-900">{record.supplierName}</div>
                      {record.supplierPhone && (
                        <div className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3" />
                          {record.supplierPhone}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-md text-xs font-medium bg-stone-100 text-stone-700">
                        {record.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        {record.items.map((it, i) => (
                          <div key={i} className="text-xs text-stone-600">
                            • <span className="font-medium">{it.name}</span> ({it.quantity} {it.unit} @ {it.unitCost})
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-stone-900 text-base">
                      {siteSettings.currency} {record.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                          record.paymentStatus === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : record.paymentStatus === 'Partial'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {record.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleStartEdit(record)}
                          className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                          title="Edit Invoice"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete purchase invoice ${record.purchaseInvoiceNo}?`)) {
                              deletePurchase(record.id);
                            }
                          }}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Invoice"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
