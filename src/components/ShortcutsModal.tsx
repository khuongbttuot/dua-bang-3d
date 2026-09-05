import React from 'react';
import { X, Keyboard, Command } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Kéo Chuột (Drag)', action: 'Xoay tự do bảng điểm theo trục X và Y trong không gian 3D' },
    { key: 'Cuộn Chuột (Wheel)', action: 'Phóng to / thu nhỏ bảng điểm (Zoom in / out)' },
    { key: 'Mũi Tên Trái / Phải', action: 'Chuyển đổi sang bảng điểm kế tiếp hoặc bảng trước đó' },
    { key: 'Mũi Tên Lên / Xuống', action: 'Nghiêng góc nhìn lên hoặc xuống theo bước 8 độ' },
    { key: 'Phím Space (Cách)', action: 'Bật / tắt chế độ tự động xoay 360°' },
    { key: 'Phím R', action: 'Đặt lại góc nhìn chuẩn (Reset Camera)' },
    { key: 'Phím F', action: 'Bật / tắt chế độ toàn màn hình (Fullscreen)' },
    { key: 'Phím Esc', action: 'Đóng bảng điều khiển Studio hoặc cửa sổ phím tắt' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0e0e0e] border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-5 border-b border-neutral-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-neutral-800 text-white border border-neutral-700 flex items-center justify-center">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Phím Tắt &amp; Thao Tác 3D</h3>
              <p className="text-[11px] text-neutral-400">Điều khiển trình diễn tiện lợi và nhanh chóng</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-3">
          {shortcuts.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-neutral-900/70 border border-neutral-800/80"
            >
              <span className="text-xs text-neutral-300">{s.action}</span>
              <kbd className="px-2.5 py-1 text-[11px] font-mono font-bold text-neutral-100 bg-neutral-800 rounded-lg border border-neutral-700 shadow-inner shrink-0">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-neutral-800/80 bg-neutral-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-950 bg-white hover:bg-neutral-200 transition-colors shadow-lg shadow-white/10"
          >
            Đã Hiểu
          </button>
        </div>
      </div>
    </div>
  );
};
