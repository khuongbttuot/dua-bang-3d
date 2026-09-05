import React from 'react';
import { 
  X, 
  Sliders, 
  Sparkles, 
  RotateCw, 
  Sun, 
  Layers, 
  Eye, 
  Palette, 
  RotateCcw,
  Check
} from 'lucide-react';
import { StudioSettings, StageEnvironment } from '../types';

interface StudioControlsProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StudioSettings;
  onUpdateSettings: (newSettings: Partial<StudioSettings>) => void;
  onResetSettings: () => void;
}

export const StudioControls: React.FC<StudioControlsProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetSettings,
}) => {
  if (!isOpen) return null;

  const colorPalettes = [
    { label: 'Trắng Sáng', hex: '#ffffff' },
    { label: 'Xám Bạc', hex: '#e2e8f0' },
    { label: 'Xám Titan', hex: '#94a3b8' },
    { label: 'Xám Khói', hex: '#64748b' },
    { label: 'Than Chì', hex: '#334155' },
    { label: 'Đen Mờ', hex: '#1c1c1c' },
  ];

  const environments: { id: StageEnvironment; label: string; desc: string }[] = [
    { id: 'cyber', label: 'Không Gian Lưới Trắng', desc: 'Lưới ánh sáng xám trắng công nghệ cao' },
    { id: 'arena', label: 'Đấu Trường Đơn Sắc', desc: 'Đèn sân khấu viền bạc đơn sắc' },
    { id: 'neon', label: 'Đường Nét Tối Giản', desc: 'Tông màu xám trắng thanh lịch' },
    { id: 'minimal', label: 'Tối Giản Đen Tuyền', desc: 'Nền matte đen tuyền không lưới' },
    { id: 'studio', label: 'Phòng Thu Studio', desc: 'Ánh sáng gradient studio đen xám' },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-[#0e0e0e]/95 backdrop-blur-xl border-l border-neutral-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      {/* Drawer Header */}
      <div className="p-4 border-b border-neutral-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-neutral-800 text-white border border-neutral-700 flex items-center justify-center">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Tùy Chỉnh Studio 3D</h3>
            <p className="text-[11px] text-neutral-400">Góc nhìn, ánh sáng và hiệu ứng sàn</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* 1. 3D Spatial Geometry */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-neutral-400" />
            Không Gian &amp; Độ Dày 3D
          </h4>

          {/* Extrusion Depth */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-neutral-300">Độ dày viền thẻ 3D:</span>
              <span className="font-mono text-white font-bold">{settings.depth}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="2"
              value={settings.depth}
              onChange={(e) => onUpdateSettings({ depth: parseInt(e.target.value) })}
              className="w-full accent-white h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
            />
            <p className="text-[10px] text-neutral-500 mt-1">Tạo độ dày khối hộp vật lý nổi bật cho bảng điểm</p>
          </div>

          {/* Perspective Depth */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-neutral-300">Khoảng cách phối cảnh (Perspective):</span>
              <span className="font-mono text-white font-bold">{settings.perspective}px</span>
            </div>
            <input
              type="range"
              min="600"
              max="2400"
              step="100"
              value={settings.perspective}
              onChange={(e) => onUpdateSettings({ perspective: parseInt(e.target.value) })}
              className="w-full accent-white h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
            />
            <p className="text-[10px] text-neutral-500 mt-1">Giá trị nhỏ làm góc nhìn 3D ấn tượng và kịch tính hơn</p>
          </div>

          {/* Auto Rotate Speed */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-neutral-300">Tốc độ tự quay 360°:</span>
              <span className="font-mono text-white font-bold">{settings.autoRotateSpeed}x</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="2.0"
              step="0.1"
              value={settings.autoRotateSpeed}
              onChange={(e) => onUpdateSettings({ autoRotateSpeed: parseFloat(e.target.value) })}
              className="w-full accent-white h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* 2. Spotlight & Atmosphere */}
        <div className="space-y-4 pt-4 border-t border-neutral-800/80">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-neutral-400" />
            Màu Đèn Sân Khấu (Đơn Sắc)
          </h4>

          <div className="grid grid-cols-3 gap-2">
            {colorPalettes.map((c) => (
              <button
                key={c.hex}
                onClick={() => onUpdateSettings({ lightColor: c.hex })}
                className={`flex items-center gap-2 p-2 rounded-xl text-left border transition-all ${
                  settings.lightColor === c.hex
                    ? 'border-white bg-white/10 shadow-sm'
                    : 'border-neutral-800 hover:border-neutral-700 bg-neutral-900/60'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full ring-1 ring-white/30 shrink-0"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="text-[11px] font-medium text-neutral-300 truncate">
                  {c.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Stage Environment */}
        <div className="space-y-3 pt-4 border-t border-neutral-800/80">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-neutral-400" />
            Môi Trường Sân Khấu
          </h4>

          <div className="space-y-1.5">
            {environments.map((env) => (
              <button
                key={env.id}
                onClick={() => onUpdateSettings({ environment: env.id })}
                className={`w-full flex items-start gap-2.5 p-2.5 rounded-xl text-left border transition-all ${
                  settings.environment === env.id
                    ? 'border-white bg-neutral-800'
                    : 'border-neutral-800 hover:border-neutral-700 bg-neutral-900/60'
                }`}
              >
                <div className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                  settings.environment === env.id ? 'border-white bg-white text-neutral-950' : 'border-neutral-600'
                }`}>
                  {settings.environment === env.id && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">{env.label}</div>
                  <div className="text-[10px] text-neutral-400">{env.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 4. Visual Shaders & Toggles */}
        <div className="space-y-3 pt-4 border-t border-neutral-800/80">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
            Hiệu Ứng Bề Mặt
          </h4>

          {/* Reflection toggle */}
          <label className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800 cursor-pointer hover:border-neutral-700">
            <div>
              <div className="text-xs font-semibold text-neutral-200">Bóng Phản Chiếu Mặt Sàn</div>
              <div className="text-[10px] text-neutral-500">Mô phỏng sàn kính phản chiếu hình ảnh</div>
            </div>
            <input
              type="checkbox"
              checked={settings.reflection}
              onChange={(e) => onUpdateSettings({ reflection: e.target.checked })}
              className="accent-white w-4 h-4 rounded cursor-pointer"
            />
          </label>

          {/* Floor grid toggle */}
          <label className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800 cursor-pointer hover:border-neutral-700">
            <div>
              <div className="text-xs font-semibold text-neutral-200">Lưới Sân Khấu 3D</div>
              <div className="text-[10px] text-neutral-500">Hiển thị đường lưới viễn tưởng dưới chân bảng</div>
            </div>
            <input
              type="checkbox"
              checked={settings.floorGrid}
              onChange={(e) => onUpdateSettings({ floorGrid: e.target.checked })}
              className="accent-white w-4 h-4 rounded cursor-pointer"
            />
          </label>

          {/* Holographic foil toggle */}
          <label className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800 cursor-pointer hover:border-neutral-700">
            <div>
              <div className="text-xs font-semibold text-neutral-200">Ánh Sắc Óng Ánh (Hologram)</div>
              <div className="text-[10px] text-neutral-500">Lớp phủ kim loại phản quang</div>
            </div>
            <input
              type="checkbox"
              checked={settings.holographic}
              onChange={(e) => onUpdateSettings({ holographic: e.target.checked })}
              className="accent-white w-4 h-4 rounded cursor-pointer"
            />
          </label>

          {/* Bevel edge toggle */}
          <label className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800 cursor-pointer hover:border-neutral-700">
            <div>
              <div className="text-xs font-semibold text-neutral-200">Viền Vát Kính Acrylic (Bevel)</div>
              <div className="text-[10px] text-neutral-500">Viền kính phản quang khúc xạ ánh sáng</div>
            </div>
            <input
              type="checkbox"
              checked={settings.bevel}
              onChange={(e) => onUpdateSettings({ bevel: e.target.checked })}
              className="accent-white w-4 h-4 rounded cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* Drawer Footer */}
      <div className="p-4 border-t border-neutral-800/80 bg-neutral-950/80 flex items-center justify-between gap-3">
        <button
          onClick={onResetSettings}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Đặt Lại Chuẩn</span>
        </button>
        <button
          onClick={onClose}
          className="flex-1 py-2 rounded-xl text-xs font-bold text-neutral-950 bg-white hover:bg-neutral-200 transition-colors shadow-lg shadow-white/10"
        >
          Áp Dụng
        </button>
      </div>
    </div>
    </>
  );
};
