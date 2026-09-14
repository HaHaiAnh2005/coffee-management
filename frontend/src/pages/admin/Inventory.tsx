import React, { useState } from 'react';
import { useInventoryStore } from '../../stores/useInventoryStore';
import { useAuthStore } from '../../store/auth.store';
import type { InventoryItem, InventoryReceipt, ReceiptItem, ReceiptType } from '../../types';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import {
  FiBox,
  FiPlus,
  FiArrowDownRight,
  FiArrowUpRight,
  FiPrinter,
  FiSearch,
  FiX,
  FiCheckCircle,
  FiAlertTriangle,
  FiFileText,
  FiCalendar,
  FiUser,
  FiTruck,
  FiTrash2,
  FiDollarSign,
  FiLayers,
} from 'react-icons/fi';

export const Inventory: React.FC = () => {
  const { items, receipts, addItem, updateQuantity, deleteItem, createReceipt } = useInventoryStore();
  const currentUser = useAuthStore((state) => state.user);

  // Tabs state
  const [activeTab, setActiveTab] = useState<'materials' | 'import_receipts' | 'export_receipts'>('materials');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Modals state
  const [isAddMaterialModalOpen, setIsAddMaterialModalOpen] = useState(false);
  const [isCreateReceiptModalOpen, setIsCreateReceiptModalOpen] = useState(false);
  const [receiptTypeToCreate, setReceiptTypeToCreate] = useState<ReceiptType>('IMPORT');
  const [viewingReceipt, setViewingReceipt] = useState<InventoryReceipt | null>(null);

  // Form states: New Material
  const [newMatName, setNewMatName] = useState('');
  const [newMatSku, setNewMatSku] = useState('');
  const [newMatUnit, setNewMatUnit] = useState('Kg');
  const [newMatCategory, setNewMatCategory] = useState('Cà phê');
  const [newMatQty, setNewMatQty] = useState<number>(10);
  const [newMatPrice, setNewMatPrice] = useState<number>(150000);
  const [newMatMinAlert, setNewMatMinAlert] = useState<number>(5);
  const [newMatSupplier, setNewMatSupplier] = useState('');

  // Form states: Create Receipt
  const [receiptReason, setReceiptReason] = useState('');
  const [receiptSupplier, setReceiptSupplier] = useState('');
  const [receiptNotes, setReceiptNotes] = useState('');
  const [receiptLines, setReceiptLines] = useState<
    Array<{ materialId: string; quantity: number; unitPrice: number }>
  >([{ materialId: items[0]?.id || '', quantity: 1, unitPrice: items[0]?.unitPrice || 0 }]);

  // Computed KPIs
  const totalInventoryValue = items.reduce((sum, item) => sum + (item.quantity * (item.unitPrice || 0)), 0);
  const lowStockCount = items.filter((item) => item.quantity <= item.minAlertThreshold).length;
  const totalImportAmount = receipts
    .filter((r) => r.type === 'IMPORT')
    .reduce((sum, r) => sum + r.totalAmount, 0);
  const totalExportAmount = receipts
    .filter((r) => r.type === 'EXPORT')
    .reduce((sum, r) => sum + r.totalAmount, 0);

  // Filtered materials
  const categories = ['ALL', ...Array.from(new Set(items.map((i) => i.category)))];
  const filteredMaterials = items.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.sku && item.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.supplier && item.supplier.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchSearch && matchCat;
  });

  // Filtered Receipts
  const importReceipts = receipts.filter(
    (r) =>
      r.type === 'IMPORT' &&
      (r.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.supplier && r.supplier.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const exportReceipts = receipts.filter(
    (r) =>
      r.type === 'EXPORT' &&
      (r.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.reason.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Handler: Open Create Receipt Modal
  const handleOpenCreateReceipt = (type: ReceiptType) => {
    setReceiptTypeToCreate(type);
    setReceiptReason(type === 'IMPORT' ? 'Nhập nguyên liệu định kỳ' : 'Xuất nguyên liệu pha chế cho quầy Bar');
    setReceiptSupplier(type === 'IMPORT' ? 'Tổng Kho Nguyên Liệu Tân Cương' : '');
    setReceiptNotes('');
    setReceiptLines([{ materialId: items[0]?.id || '', quantity: 1, unitPrice: items[0]?.unitPrice || 0 }]);
    setIsCreateReceiptModalOpen(true);
  };

  // Handler: Add row to receipt
  const handleAddReceiptRow = () => {
    const defaultItem = items[0];
    setReceiptLines([...receiptLines, { materialId: defaultItem?.id || '', quantity: 1, unitPrice: defaultItem?.unitPrice || 0 }]);
  };

  // Handler: Remove row from receipt
  const handleRemoveReceiptRow = (index: number) => {
    if (receiptLines.length === 1) return;
    setReceiptLines(receiptLines.filter((_, i) => i !== index));
  };

  // Handler: Update row in receipt
  const handleUpdateReceiptRow = (index: number, field: 'materialId' | 'quantity' | 'unitPrice', value: any) => {
    const updated = [...receiptLines];
    if (field === 'materialId') {
      const selectedMat = items.find((m) => m.id === value);
      updated[index] = {
        ...updated[index],
        materialId: value,
        unitPrice: selectedMat?.unitPrice || 0,
      };
    } else if (field === 'quantity') {
      updated[index] = { ...updated[index], quantity: Math.max(0.1, Number(value)) };
    } else if (field === 'unitPrice') {
      updated[index] = { ...updated[index], unitPrice: Math.max(0, Number(value)) };
    }
    setReceiptLines(updated);
  };

  // Handler: Submit Create Receipt
  const handleSubmitReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (receiptLines.length === 0) return;

    // Validate Export stock availability
    if (receiptTypeToCreate === 'EXPORT') {
      for (const line of receiptLines) {
        const mat = items.find((m) => m.id === line.materialId);
        if (mat && line.quantity > mat.quantity) {
          alert(`Số lượng xuất mặt hàng "${mat.name}" (${line.quantity} ${mat.unit}) vượt quá tồn kho hiện có (${mat.quantity} ${mat.unit})!`);
          return;
        }
      }
    }

    const receiptItems: ReceiptItem[] = receiptLines.map((line) => {
      const mat = items.find((m) => m.id === line.materialId);
      const qty = Number(line.quantity);
      const price = Number(line.unitPrice);
      return {
        materialId: line.materialId,
        materialName: mat?.name || 'Nguyên liệu',
        unit: mat?.unit || 'Kg',
        quantity: qty,
        unitPrice: price,
        totalPrice: qty * price,
      };
    });

    const totalAmount = receiptItems.reduce((s, it) => s + it.totalPrice, 0);

    const created = createReceipt({
      type: receiptTypeToCreate,
      reason: receiptReason.trim(),
      supplier: receiptTypeToCreate === 'IMPORT' ? receiptSupplier.trim() : undefined,
      creatorName: currentUser?.name || 'Thủ kho 88 Bồng Biêng',
      items: receiptItems,
      totalAmount,
      notes: receiptNotes.trim(),
    });

    setIsCreateReceiptModalOpen(false);
    // Open receipt viewing modal to preview printable voucher immediately
    setViewingReceipt(created);
  };

  // Handler: Submit Add New Material
  const handleAddNewMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatName.trim()) return;

    addItem({
      sku: newMatSku.trim() || `NL-${Math.floor(100 + Math.random() * 900)}`,
      name: newMatName.trim(),
      unit: newMatUnit.trim(),
      quantity: Number(newMatQty),
      unitPrice: Number(newMatPrice),
      minAlertThreshold: Number(newMatMinAlert),
      category: newMatCategory.trim(),
      supplier: newMatSupplier.trim() || 'Nhà Cung Cấp Mộc',
    });

    setNewMatName('');
    setNewMatSku('');
    setIsAddMaterialModalOpen(false);
  };

  // Helper print
  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-stone-900 flex items-center gap-2 font-serif-title">
            <FiBox className="text-sky-600" /> Quản Lý Kho Nguyên Liệu & Nhập Xuất
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Theo dõi định mức tồn kho, lập phiếu nhập xuất chứng từ và kiểm soát giá vốn nguyên vật liệu.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => handleOpenCreateReceipt('IMPORT')}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            <FiArrowDownRight className="stroke-[3]" /> + Phiếu Nhập Kho
          </button>

          <button
            onClick={() => handleOpenCreateReceipt('EXPORT')}
            className="px-4 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-extrabold text-xs flex items-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            <FiArrowUpRight className="stroke-[3]" /> + Phiếu Xuất Kho
          </button>

          <button
            onClick={() => setIsAddMaterialModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-white border border-sky-200 hover:bg-sky-50 text-sky-800 font-extrabold text-xs flex items-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <FiPlus className="stroke-[3]" /> Thêm Mặt Hàng
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-sky-100 rounded-2xl p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500">Tổng Giá Trị Tồn Kho</span>
            <span className="p-2 rounded-xl bg-sky-50 text-sky-700">
              <FiDollarSign className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xl font-extrabold text-stone-900">{formatCurrency(totalInventoryValue)}</p>
          <p className="text-[11px] text-stone-500 font-semibold">{items.length} mặt hàng trong kho</p>
        </div>

        <div className="bg-white border border-sky-100 rounded-2xl p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500">Cảnh Báo Hết Hàng</span>
            <span className={`p-2 rounded-xl ${lowStockCount > 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
              <FiAlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <p className={`text-xl font-extrabold ${lowStockCount > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
            {lowStockCount} Mặt Hàng
          </p>
          <p className="text-[11px] text-stone-500 font-semibold">
            {lowStockCount > 0 ? 'Cần lập phiếu nhập kho bổ sung' : 'Mức tồn kho an toàn'}
          </p>
        </div>

        <div className="bg-white border border-sky-100 rounded-2xl p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500">Tổng Tiền Nhập Kho</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <FiArrowDownRight className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xl font-extrabold text-emerald-700">{formatCurrency(totalImportAmount)}</p>
          <p className="text-[11px] text-stone-500 font-semibold">{receipts.filter((r) => r.type === 'IMPORT').length} phiếu nhập đã hoàn tất</p>
        </div>

        <div className="bg-white border border-sky-100 rounded-2xl p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500">Tổng Giá Trị Xuất Kho</span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <FiArrowUpRight className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xl font-extrabold text-amber-800">{formatCurrency(totalExportAmount)}</p>
          <p className="text-[11px] text-stone-500 font-semibold">{receipts.filter((r) => r.type === 'EXPORT').length} phiếu xuất pha chế</p>
        </div>
      </div>

      {/* Main Content & Navigation Tabs */}
      <div className="bg-white border border-sky-100 rounded-3xl p-6 shadow-sm space-y-5">
        {/* Navigation Tabs Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sky-100 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setActiveTab('materials')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'materials'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'bg-sky-50 text-stone-700 hover:bg-sky-100'
              }`}
            >
              <FiBox /> Tồn Kho Nguyên Liệu ({items.length})
            </button>

            <button
              onClick={() => setActiveTab('import_receipts')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'import_receipts'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-emerald-50 text-stone-700 hover:bg-emerald-100'
              }`}
            >
              <FiArrowDownRight /> Phiếu Nhập Kho ({receipts.filter((r) => r.type === 'IMPORT').length})
            </button>

            <button
              onClick={() => setActiveTab('export_receipts')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'export_receipts'
                  ? 'bg-amber-700 text-white shadow-md'
                  : 'bg-amber-50 text-stone-700 hover:bg-amber-100'
              }`}
            >
              <FiArrowUpRight /> Phiếu Xuất Kho ({receipts.filter((r) => r.type === 'EXPORT').length})
            </button>
          </div>

          {/* Quick Search Box */}
          <div className="relative w-full sm:w-72">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên, mã SKU, NCC..."
              className="w-full bg-sky-50/50 border border-sky-200 rounded-xl pl-10 pr-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* TAB 1: Danh Sách Tồn Kho Nguyên Liệu */}
        {activeTab === 'materials' && (
          <div className="space-y-4">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {cat === 'ALL' ? 'Tất Cả Phân Loại' : cat}
                </button>
              ))}
            </div>

            {/* Materials Table */}
            <div className="overflow-x-auto rounded-2xl border border-sky-100">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-sky-50/70 text-stone-600 text-[11px] uppercase tracking-wider font-extrabold border-b border-sky-100">
                    <th className="p-3.5">Mã SKU</th>
                    <th className="p-3.5">Tên Nguyên Liệu</th>
                    <th className="p-3.5">Phân Loại</th>
                    <th className="p-3.5">Số Lượng Tồn</th>
                    <th className="p-3.5">Đơn Giá Vốn</th>
                    <th className="p-3.5">Tổng Giá Trị</th>
                    <th className="p-3.5">Trạng Thái Tồn</th>
                    <th className="p-3.5">Nhà Cung Cấp</th>
                    <th className="p-3.5 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-50 text-xs text-stone-800">
                  {filteredMaterials.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-stone-400 font-semibold">
                        Không tìm thấy nguyên liệu nào phù hợp.
                      </td>
                    </tr>
                  ) : (
                    filteredMaterials.map((item) => {
                      const isLowStock = item.quantity <= item.minAlertThreshold;
                      const isOutOfStock = item.quantity <= 0;
                      const itemTotalVal = item.quantity * (item.unitPrice || 0);

                      return (
                        <tr key={item.id} className="hover:bg-sky-50/40 transition-colors">
                          <td className="p-3.5 font-mono text-[11px] font-bold text-sky-800">{item.sku || item.id}</td>
                          <td className="p-3.5 font-extrabold text-stone-900">{item.name}</td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px] font-bold">
                              {item.category}
                            </span>
                          </td>
                          <td className="p-3.5 font-black text-stone-900 text-sm">
                            {item.quantity} <span className="text-xs font-semibold text-stone-500">{item.unit}</span>
                          </td>
                          <td className="p-3.5 font-bold text-stone-700">{formatCurrency(item.unitPrice || 0)}</td>
                          <td className="p-3.5 font-extrabold text-sky-900">{formatCurrency(itemTotalVal)}</td>
                          <td className="p-3.5">
                            {isOutOfStock ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                                Hết Hàng
                              </span>
                            ) : isLowStock ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full animate-pulse">
                                Sắp Hết (≤{item.minAlertThreshold})
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                                Đầy Đủ
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 text-stone-500 truncate max-w-[150px]">{item.supplier || 'Mộc 88'}</td>
                          <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                            <button
                              onClick={() => {
                                const newQty = prompt(`Nhập số lượng tồn kho mới cho "${item.name}" (${item.unit}):`, String(item.quantity));
                                if (newQty !== null && !isNaN(Number(newQty))) {
                                  updateQuantity(item.id, Number(newQty));
                                }
                              }}
                              className="px-2.5 py-1 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-800 text-[11px] font-bold cursor-pointer transition-colors"
                              title="Điều chỉnh số lượng trực tiếp"
                            >
                              Sửa Tồn
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Bạn có chắc muốn xóa nguyên liệu "${item.name}" khỏi danh sách?`)) {
                                  deleteItem(item.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                              title="Xóa nguyên liệu"
                            >
                              <FiTrash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Danh Sách Phiếu Nhập Kho (IMPORT) */}
        {activeTab === 'import_receipts' && (
          <div className="space-y-4">
            <div className="overflow-x-auto rounded-2xl border border-sky-100">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-emerald-50/70 text-stone-600 text-[11px] uppercase tracking-wider font-extrabold border-b border-sky-100">
                    <th className="p-3.5">Mã Phiếu Nhập</th>
                    <th className="p-3.5">Ngày Lập</th>
                    <th className="p-3.5">Lý Do Nhập</th>
                    <th className="p-3.5">Nhà Cung Cấp</th>
                    <th className="p-3.5">Người Lập</th>
                    <th className="p-3.5">Số Mặt Hàng</th>
                    <th className="p-3.5">Tổng Tiền Hóa Đơn</th>
                    <th className="p-3.5 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-50 text-xs text-stone-800">
                  {importReceipts.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-stone-400 font-semibold">
                        Chưa có phiếu nhập kho nào.
                      </td>
                    </tr>
                  ) : (
                    importReceipts.map((receipt) => (
                      <tr key={receipt.id} className="hover:bg-emerald-50/30 transition-colors">
                        <td className="p-3.5">
                          <button
                            onClick={() => setViewingReceipt(receipt)}
                            className="font-mono font-bold text-emerald-700 hover:underline cursor-pointer flex items-center gap-1.5"
                          >
                            <FiFileText /> {receipt.code}
                          </button>
                        </td>
                        <td className="p-3.5 text-stone-500">{formatDate(receipt.createdAt)}</td>
                        <td className="p-3.5 font-bold text-stone-900">{receipt.reason}</td>
                        <td className="p-3.5 text-stone-600">{receipt.supplier || 'N/A'}</td>
                        <td className="p-3.5 font-semibold text-stone-700">{receipt.creatorName}</td>
                        <td className="p-3.5 font-extrabold text-stone-900">{receipt.items.length} món</td>
                        <td className="p-3.5 font-black text-emerald-700 text-sm">{formatCurrency(receipt.totalAmount)}</td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => setViewingReceipt(receipt)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-extrabold text-[11px] inline-flex items-center gap-1 cursor-pointer transition-all"
                          >
                            <FiPrinter /> Xem & In Phiếu
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Danh Sách Phiếu Xuất Kho (EXPORT) */}
        {activeTab === 'export_receipts' && (
          <div className="space-y-4">
            <div className="overflow-x-auto rounded-2xl border border-sky-100">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-amber-50/70 text-stone-600 text-[11px] uppercase tracking-wider font-extrabold border-b border-sky-100">
                    <th className="p-3.5">Mã Phiếu Xuất</th>
                    <th className="p-3.5">Ngày Lập</th>
                    <th className="p-3.5">Mục Đích / Lý Do Xuất</th>
                    <th className="p-3.5">Người Lập</th>
                    <th className="p-3.5">Số Mặt Hàng</th>
                    <th className="p-3.5">Tổng Giá Trị Xuất</th>
                    <th className="p-3.5 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-50 text-xs text-stone-800">
                  {exportReceipts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-stone-400 font-semibold">
                        Chưa có phiếu xuất kho nào.
                      </td>
                    </tr>
                  ) : (
                    exportReceipts.map((receipt) => (
                      <tr key={receipt.id} className="hover:bg-amber-50/30 transition-colors">
                        <td className="p-3.5">
                          <button
                            onClick={() => setViewingReceipt(receipt)}
                            className="font-mono font-bold text-amber-800 hover:underline cursor-pointer flex items-center gap-1.5"
                          >
                            <FiFileText /> {receipt.code}
                          </button>
                        </td>
                        <td className="p-3.5 text-stone-500">{formatDate(receipt.createdAt)}</td>
                        <td className="p-3.5 font-bold text-stone-900">{receipt.reason}</td>
                        <td className="p-3.5 font-semibold text-stone-700">{receipt.creatorName}</td>
                        <td className="p-3.5 font-extrabold text-stone-900">{receipt.items.length} món</td>
                        <td className="p-3.5 font-black text-amber-800 text-sm">{formatCurrency(receipt.totalAmount)}</td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => setViewingReceipt(receipt)}
                            className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold text-[11px] inline-flex items-center gap-1 cursor-pointer transition-all"
                          >
                            <FiPrinter /> Xem & In Phiếu
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: TẠO PHIẾU NHẬP / XUẤT KHO */}
      {isCreateReceiptModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={handleSubmitReceipt}
            className="bg-white border border-stone-200 rounded-3xl w-full max-w-2xl p-6 space-y-5 shadow-2xl text-stone-900 my-8"
          >
            <div className="flex items-center justify-between border-b border-sky-100 pb-3">
              <div>
                <h3 className="font-extrabold text-stone-900 text-lg flex items-center gap-2">
                  {receiptTypeToCreate === 'IMPORT' ? (
                    <>
                      <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                        <FiArrowDownRight />
                      </span>
                      Lập Phiếu Nhập Kho Mới (Stock In)
                    </>
                  ) : (
                    <>
                      <span className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                        <FiArrowUpRight />
                      </span>
                      Lập Phiếu Xuất Kho Mới (Stock Out)
                    </>
                  )}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Số lượng sẽ được tự động {receiptTypeToCreate === 'IMPORT' ? 'cộng vào' : 'khấu trừ khỏi'} tồn kho ngay khi lưu.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsCreateReceiptModalOpen(false)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* General info fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Lý do / Mục đích:</label>
                <input
                  type="text"
                  required
                  value={receiptReason}
                  onChange={(e) => setReceiptReason(e.target.value)}
                  placeholder={receiptTypeToCreate === 'IMPORT' ? 'VD: Nhập định kỳ, Nhập bổ sung...' : 'VD: Xuất pha chế ca sáng, Xuất kiểm kê...'}
                  className="w-full bg-sky-50/50 border border-sky-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-sky-500"
                />
              </div>

              {receiptTypeToCreate === 'IMPORT' ? (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Nhà cung cấp / Đơn vị giao:</label>
                  <input
                    type="text"
                    required
                    value={receiptSupplier}
                    onChange={(e) => setReceiptSupplier(e.target.value)}
                    placeholder="VD: Dalat Milk, Tân Nhất Hương, Fonterra..."
                    className="w-full bg-sky-50/50 border border-sky-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-sky-500"
                  />
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Người nhận / Quầy nhận:</label>
                  <input
                    type="text"
                    value={receiptSupplier}
                    onChange={(e) => setReceiptSupplier(e.target.value)}
                    placeholder="VD: Quầy Pha Chế Barista, Bếp Bánh..."
                    className="w-full bg-sky-50/50 border border-sky-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-sky-500"
                  />
                </div>
              )}
            </div>

            {/* Multi-item rows selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-stone-800 uppercase tracking-wider">
                  Danh Sách Mặt Hàng ({receiptLines.length}):
                </label>
                <button
                  type="button"
                  onClick={handleAddReceiptRow}
                  className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1 cursor-pointer"
                >
                  <FiPlus /> Thêm Mặt Hàng
                </button>
              </div>

              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {receiptLines.map((line, idx) => {
                  const selectedMat = items.find((m) => m.id === line.materialId);
                  const lineTotal = line.quantity * line.unitPrice;

                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-sky-50/60 border border-sky-100 flex flex-col sm:flex-row items-center gap-3"
                    >
                      {/* Select Material */}
                      <div className="flex-1 w-full">
                        <select
                          value={line.materialId}
                          onChange={(e) => handleUpdateReceiptRow(idx, 'materialId', e.target.value)}
                          className="w-full bg-white border border-sky-200 rounded-xl px-3 py-2 text-xs text-stone-900 font-bold focus:outline-none focus:border-sky-500"
                        >
                          {items.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name} ({m.sku || m.id}) - Hiện có: {m.quantity} {m.unit}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Quantity & Unit */}
                      <div className="w-full sm:w-28 flex items-center gap-1">
                        <input
                          type="number"
                          step="any"
                          min="0.1"
                          required
                          value={line.quantity}
                          onChange={(e) => handleUpdateReceiptRow(idx, 'quantity', e.target.value)}
                          className="w-full bg-white border border-sky-200 rounded-xl px-2.5 py-2 text-xs text-stone-900 font-extrabold text-right focus:outline-none focus:border-sky-500"
                          placeholder="SL"
                        />
                        <span className="text-[11px] font-bold text-stone-500 whitespace-nowrap">
                          {selectedMat?.unit || 'Kg'}
                        </span>
                      </div>

                      {/* Unit Price */}
                      <div className="w-full sm:w-32">
                        <input
                          type="number"
                          step="any"
                          min="0"
                          required
                          value={line.unitPrice}
                          onChange={(e) => handleUpdateReceiptRow(idx, 'unitPrice', e.target.value)}
                          className="w-full bg-white border border-sky-200 rounded-xl px-2.5 py-2 text-xs text-stone-900 font-bold text-right focus:outline-none focus:border-sky-500"
                          placeholder="Đơn giá"
                        />
                      </div>

                      {/* Line Total */}
                      <div className="w-full sm:w-28 text-right font-black text-xs text-sky-950">
                        {formatCurrency(lineTotal)}
                      </div>

                      {/* Remove row button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveReceiptRow(idx)}
                        disabled={receiptLines.length === 1}
                        className="p-1.5 text-stone-400 hover:text-rose-600 disabled:opacity-30 cursor-pointer"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Note & Total Bar */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Ghi chú bổ sung:</label>
              <textarea
                rows={2}
                value={receiptNotes}
                onChange={(e) => setReceiptNotes(e.target.value)}
                placeholder="Ghi chú về chất lượng hàng, hạn sử dụng, số hóa đơn đỏ..."
                className="w-full bg-sky-50/50 border border-sky-200 rounded-xl p-2.5 text-xs text-stone-900 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Total calculation summary */}
            <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700">Tổng Giá Trị Phiếu:</span>
              <span className="text-lg font-black text-sky-950">
                {formatCurrency(receiptLines.reduce((s, it) => s + (it.quantity * it.unitPrice), 0))}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCreateReceiptModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                type="submit"
                className={`flex-1 py-2.5 rounded-xl text-white font-extrabold text-xs shadow-md cursor-pointer transition-all ${
                  receiptTypeToCreate === 'IMPORT'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-amber-700 hover:bg-amber-800'
                }`}
              >
                {receiptTypeToCreate === 'IMPORT' ? '✓ Xác Nhận & Nhập Kho' : '✓ Xác Nhận & Xuất Kho'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 2: XEM CHI TIẾT & IN PHIẾU NHẬP / XUẤT KHO (PRINT VOUCHER) */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-stone-200 rounded-3xl w-full max-w-2xl p-6 sm:p-8 space-y-6 shadow-2xl text-stone-900 my-8">
            {/* Modal Controls Bar (hidden during print) */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-3 print:hidden">
              <span className="text-xs font-bold text-stone-500 flex items-center gap-1.5">
                <FiFileText className="text-sky-600" /> Bản xem trước chứng từ kho
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintReceipt}
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <FiPrinter /> In Phiếu Kho (Print)
                </button>
                <button
                  onClick={() => setViewingReceipt(null)}
                  className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* PRINTABLE VOUCHER DOCUMENT CONTENT */}
            <div className="space-y-6 print:m-0 print:p-0">
              {/* Header: Brand & Meta */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-stone-200 pb-4">
                <div>
                  <h2 className="text-lg font-black tracking-widest text-stone-900 font-serif-title uppercase">
                    88 BỒNG BIÊNG
                  </h2>
                  <p className="text-[11px] text-stone-600 font-semibold">Trà Hương Hoa Ủ Nhiệt & Cà Phê Mộc</p>
                  <p className="text-[10px] text-stone-500">128 Nguyễn Huệ, Bến Nghé, Quận 1, TP. HCM</p>
                  <p className="text-[10px] text-stone-500">Hotline: 0988.888.999</p>
                </div>

                <div className="text-right sm:text-right w-full sm:w-auto">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                      viewingReceipt.type === 'IMPORT'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}
                  >
                    {viewingReceipt.type === 'IMPORT' ? 'PHIẾU NHẬP KHO' : 'PHIẾU XUẤT KHO'}
                  </span>
                  <p className="text-xs font-mono font-black text-stone-900 mt-1">Mã: {viewingReceipt.code}</p>
                  <p className="text-[11px] text-stone-500">Ngày: {formatDate(viewingReceipt.createdAt)}</p>
                </div>
              </div>

              {/* Document Meta Information */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-stone-500 font-semibold">Người lập phiếu:</p>
                  <p className="font-extrabold text-stone-900">{viewingReceipt.creatorName}</p>
                </div>
                <div>
                  <p className="text-stone-500 font-semibold">
                    {viewingReceipt.type === 'IMPORT' ? 'Nhà cung cấp:' : 'Đơn vị / Quầy nhận:'}
                  </p>
                  <p className="font-extrabold text-stone-900">{viewingReceipt.supplier || 'Nội bộ cửa hàng'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-stone-500 font-semibold">Mục đích / Lý do chứng từ:</p>
                  <p className="font-extrabold text-stone-900">{viewingReceipt.reason}</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="rounded-xl border border-stone-200 overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-stone-100 text-stone-700 font-extrabold border-b border-stone-200">
                      <th className="p-2.5 w-10 text-center">STT</th>
                      <th className="p-2.5">Tên Nguyên Liệu</th>
                      <th className="p-2.5 text-center">ĐVT</th>
                      <th className="p-2.5 text-right">Số Lượng</th>
                      <th className="p-2.5 text-right">Đơn Giá</th>
                      <th className="p-2.5 text-right">Thành Tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {viewingReceipt.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-2.5 text-center font-bold text-stone-500">{idx + 1}</td>
                        <td className="p-2.5 font-bold text-stone-900">{item.materialName}</td>
                        <td className="p-2.5 text-center font-semibold text-stone-600">{item.unit}</td>
                        <td className="p-2.5 text-right font-black text-stone-900">{item.quantity}</td>
                        <td className="p-2.5 text-right text-stone-700 font-bold">{formatCurrency(item.unitPrice)}</td>
                        <td className="p-2.5 text-right font-black text-stone-900">{formatCurrency(item.totalPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-stone-50 font-black border-t border-stone-200">
                      <td colSpan={5} className="p-3 text-right uppercase text-stone-700">
                        Tổng Cộng Giá Trị:
                      </td>
                      <td className="p-3 text-right text-base text-stone-950">
                        {formatCurrency(viewingReceipt.totalAmount)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {viewingReceipt.notes && (
                <p className="text-xs text-stone-600 italic">
                  * Ghi chú: {viewingReceipt.notes}
                </p>
              )}

              {/* Signatures Area */}
              <div className="grid grid-cols-3 gap-4 pt-6 text-center text-xs">
                <div>
                  <p className="font-extrabold text-stone-900">Người Lập Phiếu</p>
                  <p className="text-[10px] text-stone-400 italic">(Ký, họ tên)</p>
                  <div className="h-14" />
                  <p className="font-bold text-stone-800">{viewingReceipt.creatorName}</p>
                </div>

                <div>
                  <p className="font-extrabold text-stone-900">Người Giao / Nhận</p>
                  <p className="text-[10px] text-stone-400 italic">(Ký, họ tên)</p>
                  <div className="h-14" />
                  <p className="font-bold text-stone-800">{viewingReceipt.supplier?.split('-')[0] || 'Đối tác'}</p>
                </div>

                <div>
                  <p className="font-extrabold text-stone-900">Thủ Kho / Quản Lý</p>
                  <p className="text-[10px] text-stone-400 italic">(Ký, đóng dấu)</p>
                  <div className="h-14" />
                  <p className="font-bold text-stone-800">Trần Thị Quản Lý</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: THÊM MẶT HÀNG NGUYÊN LIỆU MỚI */}
      {isAddMaterialModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleAddNewMaterial}
            className="bg-white border border-stone-200 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl text-stone-900"
          >
            <div className="flex items-center justify-between border-b border-sky-100 pb-3">
              <h3 className="font-extrabold text-stone-900 text-base flex items-center gap-2">
                <FiPlus className="text-sky-600" /> Thêm Nguyên Liệu Mới Vào Kho
              </h3>
              <button
                type="button"
                onClick={() => setIsAddMaterialModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Tên Nguyên Liệu:</label>
              <input
                type="text"
                required
                value={newMatName}
                onChange={(e) => setNewMatName(e.target.value)}
                placeholder="VD: Hạt Cà Phê Culi Robusta, Bột Kem Béo..."
                className="w-full bg-sky-50/50 border border-sky-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Mã SKU (tùy chọn):</label>
                <input
                  type="text"
                  value={newMatSku}
                  onChange={(e) => setNewMatSku(e.target.value)}
                  placeholder="VD: NL-CF-03"
                  className="w-full bg-sky-50/50 border border-sky-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Đơn vị tính:</label>
                <input
                  type="text"
                  required
                  value={newMatUnit}
                  onChange={(e) => setNewMatUnit(e.target.value)}
                  placeholder="Kg, Lít, Hộp, Lon..."
                  className="w-full bg-sky-50/50 border border-sky-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Phân loại:</label>
                <select
                  value={newMatCategory}
                  onChange={(e) => setNewMatCategory(e.target.value)}
                  className="w-full bg-sky-50/50 border border-sky-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-sky-500"
                >
                  <option value="Cà phê">Cà phê</option>
                  <option value="Trà & Hoa">Trà & Hoa</option>
                  <option value="Sữa & Kem">Sữa & Kem</option>
                  <option value="Matcha & Bột">Matcha & Bột</option>
                  <option value="Topping & Hạt">Topping & Hạt</option>
                  <option value="Siro & Đường">Siro & Đường</option>
                  <option value="Bao bì & Ly">Bao bì & Ly</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Đơn giá vốn ước tính:</label>
                <input
                  type="number"
                  min="0"
                  value={newMatPrice}
                  onChange={(e) => setNewMatPrice(Number(e.target.value))}
                  className="w-full bg-sky-50/50 border border-sky-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Số lượng tồn ban đầu:</label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={newMatQty}
                  onChange={(e) => setNewMatQty(Number(e.target.value))}
                  className="w-full bg-sky-50/50 border border-sky-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Ngưỡng cảnh báo hết:</label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={newMatMinAlert}
                  onChange={(e) => setNewMatMinAlert(Number(e.target.value))}
                  className="w-full bg-sky-50/50 border border-sky-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Nhà cung cấp mặc định:</label>
              <input
                type="text"
                value={newMatSupplier}
                onChange={(e) => setNewMatSupplier(e.target.value)}
                placeholder="VD: Dalat Milk, Nông Sản Cầu Đất..."
                className="w-full bg-sky-50/50 border border-sky-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAddMaterialModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs"
              >
                Hủy Bỏ
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs shadow-md"
              >
                Lưu Vào Kho
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
