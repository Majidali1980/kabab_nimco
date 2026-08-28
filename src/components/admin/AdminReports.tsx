import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Receipt,
  Percent,
  Calendar,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Award,
  Clock,
  Printer
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const AdminReports: React.FC = () => {
  const { orders, purchases, products, siteSettings } = useStore();

  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [dateFilter, setDateFilter] = useState<'all' | '7d' | '30d' | '90d'>('30d');

  // Colors for charts
  const COLORS = ['#b91c1c', '#d97706', '#059669', '#7c3aed', '#2563eb', '#db2777'];

  // 1. Calculate Core Financial Metrics
  const metrics = useMemo(() => {
    // Valid completed/active orders (excluding cancelled)
    const validOrders = orders.filter(o => o.status !== 'Cancelled');

    const totalSales = validOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalCOGS = validOrders.reduce((sum, o) => {
      if (o.costTotal !== undefined) return sum + o.costTotal;
      // Fallback if not populated
      const fallbackCost = o.items.reduce((s, it) => {
        const cost = it.selectedPack?.costPrice || (it.selectedPack?.price ? Math.round(it.selectedPack.price * 0.55) : 0);
        return s + cost * (it.quantity || 1);
      }, 0);
      return sum + fallbackCost;
    }, 0);

    const grossProfit = Math.max(0, totalSales - totalCOGS);
    const grossMarginPercent = totalSales > 0 ? ((grossProfit / totalSales) * 100).toFixed(1) : '0';

    const totalPurchasesLogged = purchases.reduce((sum, p) => sum + (p.totalAmount || 0), 0);
    const netCashMargin = totalSales - totalPurchasesLogged;

    const totalOrderCount = validOrders.length;
    const averageOrderValue = totalOrderCount > 0 ? Math.round(totalSales / totalOrderCount) : 0;

    return {
      totalSales,
      totalCOGS,
      grossProfit,
      grossMarginPercent,
      totalPurchasesLogged,
      netCashMargin,
      totalOrderCount,
      averageOrderValue
    };
  }, [orders, purchases]);

  // 2. Aggregate Data for Timeframe Chart (Daily / Weekly / Monthly)
  const timeSeriesData = useMemo(() => {
    const validOrders = orders.filter(o => o.status !== 'Cancelled');
    const map = new Map<string, { label: string; sales: number; cogs: number; profit: number; purchases: number; orderCount: number }>();

    // Seed last 7 days or weeks or months
    if (timeframe === 'daily') {
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateKey = d.toISOString().slice(0, 10);
        const label = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        map.set(dateKey, { label, sales: 0, cogs: 0, profit: 0, purchases: 0, orderCount: 0 });
      }
    } else if (timeframe === 'weekly') {
      for (let i = 3; i >= 0; i--) {
        const label = `Week -${i}`;
        const weekKey = `w-${i}`;
        map.set(weekKey, { label, sales: 0, cogs: 0, profit: 0, purchases: 0, orderCount: 0 });
      }
    } else if (timeframe === 'monthly') {
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const monthKey = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
        const label = d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' });
        map.set(monthKey, { label, sales: 0, cogs: 0, profit: 0, purchases: 0, orderCount: 0 });
      }
    }

    // Populate Orders
    validOrders.forEach(o => {
      const orderDate = new Date(o.createdAt || o.deliveryDate || Date.now());
      let key = '';

      if (timeframe === 'daily') {
        key = orderDate.toISOString().slice(0, 10);
      } else if (timeframe === 'weekly') {
        const diffWeeks = Math.floor((Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24 * 7));
        key = diffWeeks <= 3 ? `w-${diffWeeks}` : '';
      } else if (timeframe === 'monthly') {
        key = `${orderDate.getFullYear()}-${(orderDate.getMonth() + 1).toString().padStart(2, '0')}`;
      }

      if (key && map.has(key)) {
        const entry = map.get(key)!;
        const sale = o.total || 0;
        const cogs = o.costTotal !== undefined ? o.costTotal : Math.round(sale * 0.55);
        entry.sales += sale;
        entry.cogs += cogs;
        entry.profit += Math.max(0, sale - cogs);
        entry.orderCount += 1;
      }
    });

    // Populate Purchases
    purchases.forEach(p => {
      const purDate = new Date(p.date || p.createdAt || Date.now());
      let key = '';

      if (timeframe === 'daily') {
        key = purDate.toISOString().slice(0, 10);
      } else if (timeframe === 'weekly') {
        const diffWeeks = Math.floor((Date.now() - purDate.getTime()) / (1000 * 60 * 60 * 24 * 7));
        key = diffWeeks <= 3 ? `w-${diffWeeks}` : '';
      } else if (timeframe === 'monthly') {
        key = `${purDate.getFullYear()}-${(purDate.getMonth() + 1).toString().padStart(2, '0')}`;
      }

      if (key && map.has(key)) {
        const entry = map.get(key)!;
        entry.purchases += p.totalAmount || 0;
      }
    });

    return Array.from(map.values());
  }, [orders, purchases, timeframe]);

  // 3. Category Breakdown Data
  const categoryData = useMemo(() => {
    const validOrders = orders.filter(o => o.status !== 'Cancelled');
    const catMap: Record<string, { name: string; sales: number; profit: number; itemsSold: number }> = {
      chicken: { name: 'Chicken Kababs', sales: 0, profit: 0, itemsSold: 0 },
      beef: { name: 'Beef Kababs', sales: 0, profit: 0, itemsSold: 0 },
      nimko: { name: 'Mix Nimko', sales: 0, profit: 0, itemsSold: 0 },
      combos: { name: 'Combos & Deals', sales: 0, profit: 0, itemsSold: 0 }
    };

    validOrders.forEach(ord => {
      ord.items.forEach(it => {
        const cat = it.product?.category || 'chicken';
        const price = it.selectedPack?.price || 0;
        const cost = it.selectedPack?.costPrice || Math.round(price * 0.55);
        const qty = it.quantity || 1;
        const lineTotal = price * qty;
        const lineProfit = (price - cost) * qty;

        if (catMap[cat]) {
          catMap[cat].sales += lineTotal;
          catMap[cat].profit += lineProfit;
          catMap[cat].itemsSold += qty;
        } else {
          catMap[cat] = {
            name: cat.toUpperCase(),
            sales: lineTotal,
            profit: lineProfit,
            itemsSold: qty
          };
        }
      });
    });

    return Object.values(catMap).filter(c => c.sales > 0);
  }, [orders]);

  // 4. Product Profitability Ranking
  const productProfitability = useMemo(() => {
    const validOrders = orders.filter(o => o.status !== 'Cancelled');
    const prodMap = new Map<string, { name: string; category: string; unitsSold: number; revenue: number; cost: number; profit: number }>();

    validOrders.forEach(o => {
      o.items.forEach(it => {
        const prodId = it.productId || it.product?.id || 'unknown';
        const prodName = it.product?.name || 'Artisanal Product';
        const cat = it.product?.category || 'General';
        const price = it.selectedPack?.price || 0;
        const cost = it.selectedPack?.costPrice || Math.round(price * 0.55);
        const qty = it.quantity || 1;

        if (!prodMap.has(prodId)) {
          prodMap.set(prodId, {
            name: prodName,
            category: cat,
            unitsSold: 0,
            revenue: 0,
            cost: 0,
            profit: 0
          });
        }

        const entry = prodMap.get(prodId)!;
        entry.unitsSold += qty;
        entry.revenue += price * qty;
        entry.cost += cost * qty;
        entry.profit += (price - cost) * qty;
      });
    });

    return Array.from(prodMap.values()).sort((a, b) => b.profit - a.profit);
  }, [orders]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Period / Label', 'Orders', 'Gross Sales (PKR)', 'COGS (PKR)', 'Gross Profit (PKR)', 'Purchases Logged (PKR)', 'Margin %'];
    const rows = timeSeriesData.map(row => {
      const margin = row.sales > 0 ? ((row.profit / row.sales) * 100).toFixed(1) : '0';
      return [
        row.label,
        row.orderCount,
        row.sales,
        row.cogs,
        row.profit,
        row.purchases,
        `${margin}%`
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `financial_report_${timeframe}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-100 text-red-800 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900">Purchase to Sale & Profit Reports</h2>
            <p className="text-sm text-stone-500">
              Complete cost accounting, profit margin analysis, and inventory procurement tracking.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Timeframe selector */}
          <div className="inline-flex p-1 bg-stone-100 rounded-xl border border-stone-200 text-xs font-semibold">
            <button
              onClick={() => setTimeframe('daily')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeframe === 'daily' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Daily (7-Day)
            </button>
            <button
              onClick={() => setTimeframe('weekly')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeframe === 'weekly' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setTimeframe('monthly')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeframe === 'monthly' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Monthly (6-Mo)
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors border border-stone-200"
            title="Download CSV Report"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* 4 Big KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Sales */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Gross Sales Revenue</span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-stone-900 mt-2 font-mono">
            {siteSettings.currency} {metrics.totalSales.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-xs text-emerald-700 mt-1 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{metrics.totalOrderCount} valid orders processed</span>
          </div>
        </div>

        {/* Cost of Goods Sold (COGS) */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Cost of Goods Sold (COGS)</span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-stone-900 mt-2 font-mono">
            {siteSettings.currency} {metrics.totalCOGS.toLocaleString()}
          </div>
          <div className="text-xs text-stone-500 mt-1">
            Raw meat + spices + packaging recipe costs
          </div>
        </div>

        {/* Gross Profit & Margin */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs relative overflow-hidden bg-radial from-red-50/50 to-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-900 uppercase tracking-wider">Gross Profit (Gross Margin)</span>
            <div className="p-2 bg-red-100 text-red-700 rounded-lg">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-red-700 mt-2 font-mono">
            {siteSettings.currency} {metrics.grossProfit.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-red-800 mt-1">
            <span className="px-2 py-0.5 bg-red-100 rounded-md">{metrics.grossMarginPercent}% Profit Margin</span>
          </div>
        </div>

        {/* Inward Purchases Spend */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Purchases Inward</span>
            <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-stone-900 mt-2 font-mono">
            {siteSettings.currency} {metrics.totalPurchasesLogged.toLocaleString()}
          </div>
          <div className="text-xs text-stone-500 mt-1">
            {purchases.length} invoices logged from vendors
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales vs COGS vs Gross Profit Trend */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-stone-900 text-base">Sales vs. Cost vs. Profit Analysis</h3>
              <p className="text-xs text-stone-500">Revenue generation compared against item direct cost and purchase inward</p>
            </div>
            <span className="text-xs font-mono font-semibold px-2.5 py-1 bg-stone-100 rounded-lg text-stone-700 capitalize">
              {timeframe} view
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeSeriesData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value: any) => [`Rs. ${Number(value).toLocaleString()}`, '']}
                  contentStyle={{ backgroundColor: '#1c1917', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="sales" name="Sales Revenue" fill="#b91c1c" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cogs" name="COGS (Food Cost)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" name="Gross Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Contribution Donut */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-stone-900 text-base">Category Profit Contribution</h3>
            <p className="text-xs text-stone-500">Revenue share across product categories</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            {categoryData.length === 0 ? (
              <div className="text-xs text-stone-400">No category sales data</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="sales"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`Rs. ${Number(value).toLocaleString()}`, 'Sales']} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="space-y-2 pt-2 border-t border-stone-100">
            {categoryData.map((cat, i) => (
              <div key={cat.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                  <span className="font-medium text-stone-800">{cat.name}</span>
                </div>
                <div className="font-mono font-bold text-stone-900">
                  {siteSettings.currency} {cat.sales.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Breakdown Table: Period-by-Period */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-stone-900">Period Breakdown Ledger</h3>
            <p className="text-xs text-stone-500">Detailed purchase to sale financial summary for {timeframe} periods</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-stone-700">
            <thead className="bg-stone-50 border-b border-stone-200 text-xs font-bold text-stone-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Period</th>
                <th className="py-3 px-4 text-center">Orders</th>
                <th className="py-3 px-4 text-right">Sales Revenue</th>
                <th className="py-3 px-4 text-right">Cost (COGS)</th>
                <th className="py-3 px-4 text-right">Gross Profit</th>
                <th className="py-3 px-4 text-right">Raw Purchases</th>
                <th className="py-3 px-4 text-right">Margin %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {timeSeriesData.map((row, idx) => {
                const margin = row.sales > 0 ? ((row.profit / row.sales) * 100).toFixed(1) : '0';
                return (
                  <tr key={idx} className="hover:bg-stone-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-stone-900">{row.label}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700">
                        {row.orderCount}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-stone-900">
                      {siteSettings.currency} {row.sales.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-amber-700 font-medium">
                      {siteSettings.currency} {row.cogs.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-700">
                      {siteSettings.currency} {row.profit.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-blue-700 font-medium">
                      {siteSettings.currency} {row.purchases.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          Number(margin) > 40
                            ? 'bg-emerald-100 text-emerald-800'
                            : Number(margin) > 20
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {margin}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Profitable Items Ranking */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-stone-900">Product Profitability Leaderboard</h3>
          </div>
          <span className="text-xs text-stone-500">Ranked by total net profit generated</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-stone-700">
            <thead className="bg-stone-50 border-b border-stone-200 text-xs font-bold text-stone-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 w-12 text-center">Rank</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">Units Sold</th>
                <th className="py-3 px-4 text-right">Total Revenue</th>
                <th className="py-3 px-4 text-right">Total Cost</th>
                <th className="py-3 px-4 text-right">Total Profit</th>
                <th className="py-3 px-4 text-right">Margin %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {productProfitability.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-stone-400">
                    No orders logged yet.
                  </td>
                </tr>
              ) : (
                productProfitability.map((item, index) => {
                  const margin = item.revenue > 0 ? ((item.profit / item.revenue) * 100).toFixed(1) : '0';
                  return (
                    <tr key={item.name} className="hover:bg-stone-50 transition-colors">
                      <td className="py-3.5 px-4 text-center font-bold text-stone-400 font-mono text-xs">
                        #{index + 1}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-stone-900">{item.name}</td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-700 capitalize">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold font-mono">{item.unitsSold} packs</td>
                      <td className="py-3.5 px-4 text-right font-mono font-medium text-stone-900">
                        {siteSettings.currency} {item.revenue.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-stone-500">
                        {siteSettings.currency} {item.cost.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-700">
                        {siteSettings.currency} {item.profit.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {margin}%
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
