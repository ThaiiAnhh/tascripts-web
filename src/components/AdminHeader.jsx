import React from 'react';

const AdminHeader = () => {
  return (
    <nav className="h-16 border-b border-white/5 bg-[#0a0a0f] flex items-center justify-between px-8 sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center font-black text-black text-xs">TA</div>
          <span className="font-black text-lg tracking-tighter uppercase">TASCRIPTS</span>
        </div>
        <div className="hidden md:flex gap-6 text-[11px] font-bold text-gray-500 uppercase tracking-wide">
          <a href="#" class="hover:text-cyan-400 transition-all">Trang Chủ</a>
          <a href="#" class="hover:text-cyan-400 transition-all">Executors</a>
          <a href="#" class="hover:text-cyan-400 transition-all italic text-yellow-500 flex items-center gap-1">
             <i className="ri-shield-star-line text-sm"></i> Admin
          </a>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-gray-400 hover:text-cyan-400 border border-white/5"><i class="ri-search-line"></i></button>
        <button className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-gray-400 border border-white/5">
          <i class="ri-notification-3-line"></i>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] w-3.5 h-3.5 flex items-center justify-center rounded-full ring-2 ring-[#0a0a0f]">6</span>
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <div className="text-right">
            <div className="text-[10px] font-black text-white leading-none">TAGamer</div>
            <div className="text-[8px] font-bold text-yellow-500 bg-yellow-500/10 px-1 py-0.5 rounded mt-1 uppercase inline-block">Admin</div>
          </div>
          <div className="w-8 h-8 rounded-full border border-cyan-500/30 p-0.5">
             <div className="w-full h-full bg-gray-800 rounded-full overflow-hidden"></div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminHeader;