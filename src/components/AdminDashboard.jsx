import React, { useState } from 'react';

const AdminDashboard = () => {
  // Mock data giống hệt trong ảnh của bạn
  const [scripts] = useState([
    { id: 1, name: 'Blox Fruits - Auto Farm & Devil Fruit ESP', game: 'Blox Fruits', author: 'ScriptMaster_VN', views: '128.5K', rating: 4.8, tag: 'FEATURED', tagColor: 'text-yellow-400 bg-yellow-400/10' },
    { id: 2, name: 'Pet Simulator 99 - Auto Hatch & Auto Farm', game: 'Pet Simulator 99', author: 'ProScripter_X', views: '95.2K', rating: 4.6, tag: 'HOT', tagColor: 'text-red-400 bg-red-400/10' },
    { id: 3, name: 'Arsenal - Aimbot & ESP Full Unlock', game: 'Arsenal', author: 'AimGod_RBX', views: '74.8K', rating: 4.7, tag: 'NEW', tagColor: 'text-green-400 bg-green-400/10' },
  ]);

  return (
    <div className="min-h-screen bg-[#07070c] text-white p-8">
      {/* 1. Header & Logout */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="flex items-center gap-2 text-green-400 text-[10px] font-bold mb-1 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span> Online • TAGamer
          </div>
          <h1 className="text-2xl font-black italic uppercase">Admin Panel</h1>
          <p className="text-gray-500 text-xs mt-1">Quản lý script và executor của TASCRIPTS</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-bold hover:bg-red-500/10 hover:text-red-400 transition-all">
          <i className="ri-logout-box-line"></i> Đăng Xuất
        </button>
      </div>

      {/* 2. Bốn ô Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatItem title="Tổng Script" value="9" icon="ri-code-s-slash-line" color="cyan" />
        <StatItem title="Lượt Tải Hôm Nay" value="12,430" icon="ri-download-cloud-line" color="emerald" />
        <StatItem title="Script Hot" value="2" icon="ri-fire-line" color="orange" />
        <StatItem title="Script Mới" value="2" icon="ri-star-line" color="yellow" />
      </div>

      {/* 3. Tabs Chuyển Đổi */}
      <div className="flex gap-1 p-1 bg-white/5 border border-white/10 rounded-xl w-fit mb-6">
        <button className="px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg text-xs font-bold flex items-center gap-2">
          <i className="ri-list-check"></i> Danh Sách Script
        </button>
        <button className="px-4 py-2 text-gray-500 hover:text-gray-300 rounded-lg text-xs font-bold flex items-center gap-2 transition-all">
          <i className="ri-add-circle-line"></i> Đăng Script
        </button>
      </div>

      {/* 4. Table / List Area */}
      <div className="bg-[#0f0f16] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
          <h2 className="text-sm font-bold">Tất Cả Script (9)</h2>
          <button className="bg-cyan-400 text-black text-[10px] font-black px-4 py-2 rounded-lg flex items-center gap-1.5 hover:bg-cyan-300 transition-all uppercase">
            <i className="ri-add-line text-xs"></i> Đăng Mới
          </button>
        </div>
        <div className="divide-y divide-white/5">
          {scripts.map(script => (
            <div key={script.id} className="p-4 hover:bg-white/[0.02] transition-all flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 rounded-lg bg-gray-800 overflow-hidden border border-white/5 relative">
                   <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-transparent"></div>
                </div>
                <div>
                  <h3 className="text-xs font-bold mb-0.5 group-hover:text-cyan-400 transition-colors">{script.name}</h3>
                  <div className="flex items-center gap-3 text-[10px] text-gray-500">
                    <span className="uppercase">{script.game}</span>
                    <span className="text-gray-700">•</span>
                    <span>{script.author}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-black border border-white/5 ${script.tagColor}`}>{script.tag}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                   <div className="text-[10px] text-gray-400 flex items-center justify-end gap-1"><i className="ri-download-2-line"></i> {script.views}</div>
                   <div className="text-[10px] text-yellow-500 flex items-center justify-end gap-1"><i className="ri-star-fill"></i> {script.rating}</div>
                </div>
                <button className="text-[10px] font-bold text-gray-500 bg-white/5 px-3 py-1.5 rounded-md border border-white/10 hover:border-cyan-500/50 hover:text-cyan-400 transition-all">Xem</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Component con cho các ô thống kê (Stats)
const StatItem = ({ title, value, icon, color }) => {
  const colors = {
    cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  };
  return (
    <div className={`p-5 rounded-2xl border ${colors[color]} relative overflow-hidden group`}>
      <i className={`${icon} absolute -right-2 -bottom-2 text-5xl opacity-5 transition-transform group-hover:scale-125`}></i>
      <div className="flex justify-between items-start mb-3">
        <span className="text-[10px] font-bold uppercase opacity-60 tracking-wider">{title}</span>
        <i className={`${icon} text-lg opacity-80`}></i>
      </div>
      <div className="text-2xl font-black tracking-tight">{value}</div>
    </div>
  );
};

export default AdminDashboard;