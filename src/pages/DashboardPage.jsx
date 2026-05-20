import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer,
} from "recharts";
import { Coins, Receipt, ChartNoAxesCombined, HandCoins } from 'lucide-react';
import reportAPI from "../services/report";
import DashboardLayout from '../components/admin/layout/DashboardLayout';

const PIE_COLORS = ["#6366f1", "#22d3ee", "#f59e0b", "#10b981", "#f43f5e", "#a78bfa"];

const formatVND = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);


function useDashboardData(filterType, customRange) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { type: filterType };
      if (filterType === "custom" && customRange.startDate && customRange.endDate) {
        params.startDate = customRange.startDate;
        params.endDate = customRange.endDate;
      }

      const res = await reportAPI.getDashboardReport(params);
      console.log(res);
      setData(res.data);
    } catch (err) {
      setError(err?.response?.data?.message ?? "Không thể tải dữ liệu dashboard");
    } finally {
      setLoading(false);
    }
  }, [filterType, customRange.startDate, customRange.endDate]);

  useEffect(() => { fetchData(); }, [fetchData]);
  return { data, loading, error, refetch: fetchData };
}

function useCompareData(enabled, month1, month2) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled || !month1 || !month2) return;
    setLoading(true);
    setError(null);
    // Lưu ý: Đoạn axios này giữ nguyên theo code gốc của bạn
    reportAPI.compareMonths(month1, month2)
      .then((res) => setData(res.data))
      .catch((err) => setError(err?.response?.data?.message ?? "Lỗi so sánh tháng"))
      .finally(() => setLoading(false));
  }, [enabled, month1, month2]);

  return { data, loading, error };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ title, value, sub, icon, accentColor }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
        style={{ backgroundColor: accentColor + "1a" }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{title}</p>
        <p className="text-xl font-bold text-gray-800 mt-0.5 truncate">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center py-16">
      <div className="w-9 h-9 rounded-full border-[3px] border-gray-200 border-t-indigo-500 animate-spin" />
    </div>
  );
}

function ErrorBanner({ message, onRetry }) {
  return (
    <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
      <span className="text-red-500">⚠️</span>
      <span className="flex-1 text-red-700 text-sm">{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
        >
          Thử lại
        </button>
      )}
    </div>
  );
}

const STATUS_MAP = {
  PENDING: { label: "Chờ xác nhận", cls: "bg-amber-50 text-amber-600 border-amber-200" },
  CONFIRMED: { label: "Đã xác nhận", cls: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  COMPLETED: { label: "Hoàn thành", cls: "bg-indigo-50 text-indigo-600 border-indigo-200" },
  CANCELLED: { label: "Đã hủy", cls: "bg-red-50 text-red-500 border-red-200" },
};

function StatusBadge({ status }) {
  const s = STATUS_MAP[status] ?? { label: status, cls: "bg-gray-100 text-gray-500 border-gray-200" };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${s.cls}`}>
      {s.label}
    </span>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">{title}</h3>
      {children}
    </div>
  );
}

const FILTER_OPTIONS = [
  { value: "today", label: "Hôm nay" },
  { value: "week", label: "Tuần này" },
  { value: "month", label: "Tháng này" },
  { value: "quarter", label: "Quý này" },
  { value: "custom", label: "Tuỳ chọn" },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const navigate = useNavigate();

  const [filterType, setFilterType] = useState("month");
  const [customRange, setCustomRange] = useState({ startDate: "", endDate: "" });
  const [compareMode, setCompareMode] = useState(false);
  const [compareM1, setCompareM1] = useState("");
  const [compareM2, setCompareM2] = useState("");

  // Thêm state cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 4;

  const { data, loading, error, refetch } = useDashboardData(filterType, customRange);
  const compare = useCompareData(compareMode, compareM1, compareM2);

  const stats = data?.stats ?? {};
  const chartData = data?.chartData ?? [];
  const roomTypeData = data?.roomTypeData ?? [];
  const recentTransactions = data?.recentTransactions ?? [];

  // Logic phân trang
  const totalPages = Math.ceil(recentTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = recentTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset về trang 1 khi đổi bộ lọc làm dữ liệu thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [filterType, customRange, data]);

  return (
    <DashboardLayout>
      <div className="space-y-6">

      {/* ── Sticky top bar ─────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-100 sticky top-16 z-20 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

          {/* Back to /admin */}
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors group flex-shrink-0"
          >
            <span className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 flex items-center justify-center transition-colors text-sm font-bold">
              ←
            </span>
            <span className="hidden sm:inline text-sm">Sơ đồ phòng</span>
          </button>

          {/* Center title */}
          <h1 className="text-sm font-bold text-gray-800 absolute left-1/2 -translate-x-1/2 whitespace-nowrap">
            Báo cáo & Thống kê
          </h1>

          {/* Compare toggle */}
          <button
            onClick={() => setCompareMode((v) => !v)}
            className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border transition-all ${compareMode
              ? "bg-indigo-600 text-white border-indigo-600"
              : "bg-white text-gray-500 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
              }`}
          >
            ⇆ <span className="hidden sm:inline">So sánh</span>
          </button>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* ── Filter pills ──────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 shadow-sm">
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilterType(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterType === opt.value
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-500 hover:text-indigo-600"
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Date range picker (only when custom) */}
          {filterType === "custom" && (
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm">
              <span className="text-xs text-gray-400 font-medium">Từ</span>
              <input
                type="date"
                value={customRange.startDate}
                onChange={(e) => setCustomRange((r) => ({ ...r, startDate: e.target.value }))}
                className="text-xs outline-none bg-transparent text-gray-700"
              />
              <span className="text-gray-300">—</span>
              <span className="text-xs text-gray-400 font-medium">Đến</span>
              <input
                type="date"
                value={customRange.endDate}
                onChange={(e) => setCustomRange((r) => ({ ...r, endDate: e.target.value }))}
                className="text-xs outline-none bg-transparent text-gray-700"
              />
            </div>
          )}
        </div>

        {/* ── Compare month picker ──────────────────────────────────────── */}
        {compareMode && (
          <div className="flex flex-wrap items-center gap-3 bg-indigo-50 border border-indigo-100 rounded-2xl px-4 py-3">
            <span className="text-xs font-semibold text-indigo-700">So sánh:</span>
            <input
              type="month"
              value={compareM1}
              onChange={(e) => setCompareM1(e.target.value)}
              className="text-xs border border-indigo-200 rounded-lg px-2.5 py-1.5 bg-white text-indigo-700 outline-none focus:ring-2 focus:ring-indigo-300 transition-shadow"
            />
            <span className="text-indigo-400 font-bold text-sm">vs</span>
            <input
              type="month"
              value={compareM2}
              onChange={(e) => setCompareM2(e.target.value)}
              className="text-xs border border-indigo-200 rounded-lg px-2.5 py-1.5 bg-white text-indigo-700 outline-none focus:ring-2 focus:ring-indigo-300 transition-shadow"
            />
            {(!compareM1 || !compareM2) && (
              <span className="text-xs text-indigo-400 italic">Chọn 2 tháng để xem so sánh</span>
            )}
          </div>
        )}

        {/* ── Error / Loading ───────────────────────────────────────────── */}
        {error && <ErrorBanner message={error} onRetry={refetch} />}
        {loading && <LoadingSpinner />}

        {!loading && !error && data && (
          <>
            {/* ── 4 stat cards (ĐÃ BỎ Tỷ lệ lấp đầy) ──────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Tổng doanh thu"
                value={formatVND(stats.totalRevenue ?? 0)}
                icon={<Coins className="w-6 h-6 text-indigo-500" />}
                accentColor="#6366f1"
              />
              <StatCard
                title="Tổng đặt phòng"
                value={`${stats.totalBookings ?? 0} đơn`}
                icon={<Receipt className="w-6 h-6 text-indigo-500" />}
                accentColor="#22d3ee"
              />
              <StatCard
                title="RevPAR"
                value={formatVND(stats.revPAR ?? 0)}
                sub="Doanh thu / phòng sẵn có"
                icon={<ChartNoAxesCombined className="w-6 h-6 text-indigo-500" />}
                accentColor="#f59e0b"
              />
              <StatCard
                title="Giá trị TB / đơn"
                value={formatVND(stats.avgBookingValue ?? 0)}
                icon={<HandCoins className="w-6 h-6 text-indigo-500" />}
                accentColor="#10b981"
              />
            </div>

            {/* ── Charts: Line (2/3) + Pie (1/3) ───────────────────────── */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
              <div className="xl:col-span-2">
                <ChartCard title="Doanh thu theo thời gian">
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={chartData} margin={{ top: 4, right: 12, bottom: 4, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                      <YAxis
                        tickFormatter={(v) => (v / 1e6).toFixed(0) + "M"}
                        tick={{ fontSize: 11 }}
                        width={40}
                      />
                      <Tooltip
                        formatter={(v, n) => n === "Doanh thu" ? [formatVND(v), n] : [v, n]}
                        contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}
                      />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        name="Doanh thu"
                        stroke="#6366f1"
                        strokeWidth={2.5}
                        dot={false}
                        activeDot={{ r: 4, fill: "#6366f1" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>

              <ChartCard title="Phân loại phòng">
                {roomTypeData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={roomTypeData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%" cy="48%"
                        outerRadius={85}
                        innerRadius={42}
                        paddingAngle={3}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {roomTypeData.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(v) => [`${v} đêm`, "Số đêm"]}
                        contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[260px] text-gray-300 gap-2">
                    <span className="text-4xl">🛏️</span>
                    <span className="text-sm">Không có dữ liệu</span>
                  </div>
                )}
              </ChartCard>
            </div>

            {/* ── Bar chart – số lượng đặt phòng ───────────────────────── */}
            <ChartCard title="Số lượng đặt phòng theo thời gian">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} margin={{ top: 4, right: 12, bottom: 4, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={30} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                  <Bar dataKey="bookings" name="Đặt phòng" fill="#22d3ee" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* ── Compare chart ─────────────────────────────────────────── */}
            {compareMode && (
              <ChartCard
                title={
                  compare.data
                    ? `So sánh: ${compare.data.month1.label} vs ${compare.data.month2.label}`
                    : "So sánh tháng"
                }
              >
                {compare.loading && <LoadingSpinner />}
                {compare.error && <ErrorBanner message={compare.error} />}
                {!compare.loading && !compare.error && !compare.data && (
                  <p className="text-center text-sm text-gray-400 py-10">
                    Chọn 2 tháng ở thanh trên để xem biểu đồ so sánh
                  </p>
                )}
                {!compare.loading && !compare.error && compare.data && (
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart
                      data={[
                        {
                          metric: "Doanh thu (M₫)",
                          [compare.data.month1.label]: +(compare.data.month1.revenue / 1e6).toFixed(1),
                          [compare.data.month2.label]: +(compare.data.month2.revenue / 1e6).toFixed(1),
                        },
                        {
                          metric: "Đặt phòng",
                          [compare.data.month1.label]: compare.data.month1.bookings,
                          [compare.data.month2.label]: compare.data.month2.bookings,
                        },
                      ]}
                      margin={{ top: 4, right: 12, bottom: 4, left: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="metric" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 11 }} width={35} />
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                      <Bar dataKey={compare.data.month1.label} fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={50} />
                      <Bar dataKey={compare.data.month2.label} fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={50} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </ChartCard>
            )}

            {/* ── Recent transactions ───────────────────────────────────── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-gray-700">Giao dịch gần nhất</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      {["Mã đặt phòng", "Khách hàng", "Email", "Nhận phòng", "Trả phòng", "Tổng tiền", "Trạng thái"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recentTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-sm text-gray-400">
                          <div className="flex flex-col items-center gap-2">
                            <span className="text-3xl">📭</span>
                            <span>Chưa có giao dịch nào</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedTransactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-4 py-3 font-semibold text-indigo-600 whitespace-nowrap">
                            {tx.booking_code}
                          </td>
                          <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{tx.guest_name}</td>
                          <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{tx.guest_email}</td>
                          <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                            {new Date(tx.check_in_date).toLocaleDateString("vi-VN")}
                          </td>
                          <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                            {new Date(tx.check_out_date).toLocaleDateString("vi-VN")}
                          </td>
                          <td className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">
                            {formatVND(tx.total_price)}
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={tx.status} />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* ── Pagination Controls ────────────────────────────────────── */}
              {totalPages > 1 && (
                <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-xs text-gray-500 hidden sm:block">
                    Hiển thị {(currentPage - 1) * ITEMS_PER_PAGE + 1} đến {Math.min(currentPage * ITEMS_PER_PAGE, recentTransactions.length)} trong tổng số {recentTransactions.length} giao dịch
                  </span>
                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      Trước
                    </button>
                    <span className="text-xs font-medium text-gray-600 px-2">
                      Trang {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      Sau
                    </button>
                  </div>
                </div>
              )}
            </div>

          </>
        )}
      </main>
      </div>
    </DashboardLayout>
  );
}