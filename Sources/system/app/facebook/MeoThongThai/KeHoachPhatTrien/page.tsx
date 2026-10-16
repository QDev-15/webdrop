'use client'


export default function MeoThongThaiContentPage() {
  return (
    <>
        <title>Kế Hoạch Phát Triển Facebook - Mèo Thông Thái v1.0</title>
        {/* Google Fonts: Be Vietnam Pro */}
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>
        {/* FontAwesome Icons */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"/>
        {/* Tailwind CSS CDN */}
        <script src="https://cdn.tailwindcss.com"></script>
        <script>
            {script}
        </script>
        <style>{CSS}</style>

        <div className="font-sans bg-brand-lightBg dark:bg-[#0B132B] text-slate-800 dark:text-slate-100 transition-colors duration-300 min-h-screen flex flex-col md:flex-row">
            {/* MOBILE HEADER / SIDEBAR TOGGLE */}
            <div className="md:hidden sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold text-lg shadow-md">
                        🐱
                    </div>
                    <span className="font-bold text-brand-orange text-lg tracking-tight">Mèo Thông Thái</span>
                </div>
                <div className="flex items-center gap-2">
                    <button id="themeToggleMobile" className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                        <i className="fa-solid fa-moon dark:hidden"></i>
                        <i className="fa-solid fa-sun hidden dark:inline text-amber-400"></i>
                    </button>
                    <button id="mobileMenuBtn" className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                        <i className="fa-solid fa-bars text-xl"></i>
                    </button>
                </div>
            </div>

            {/* SIDEBAR NAVIGATION */}
            <aside id="sidebar" className="fixed inset-y-0 left-0 z-40 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform -translate-x-full md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col h-screen md:sticky md:top-0">
                {/* Sidebar Header */}
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-orange to-brand-warm flex items-center justify-center text-2xl shadow-lg shadow-orange-500/20 text-white">
                                🐱
                            </div>
                            <span className="absolute -bottom-1 -right-1 bg-brand-teal text-white p-0.5 rounded-full text-[10px] w-4 h-4 flex items-center justify-center border-2 border-white dark:border-slate-900">👓</span>
                        </div>
                        <div>
                            <h1 className="font-extrabold text-slate-900 dark:text-white text-base leading-tight">Mèo Thông Thái</h1>
                            <p className="text-xs text-brand-teal font-medium mt-0.5">FB Reels Strategy v1.0</p>
                        </div>
                    </div>
                    <button id="closeSidebarBtn" className="md:hidden text-slate-400 hover:text-slate-600">
                        <i className="fa-solid fa-xmark text-xl"></i>
                    </button>
                </div>

                {/* Quick Filter / Search */}
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="relative">
                        <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                        <input type="text" id="searchInput" placeholder="Tìm kiếm nội dung..." className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border-0 focus:ring-2 focus:ring-brand-orange outline-none dark:text-slate-200 transition"/>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-1 text-sm font-medium" id="navMenu">
                    <a href="#section-1" className="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-slate-800 hover:text-brand-orange transition">
                        <i className="fa-solid fa-circle-info w-5 text-brand-orange"></i> 1. Thông tin dự án
                    </a>
                    <a href="#section-2" className="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-slate-800 hover:text-brand-orange transition">
                        <i className="fa-solid fa-cat w-5 text-brand-orange"></i> 2. Định vị thương hiệu
                    </a>
                    <a href="#section-3" className="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-slate-800 hover:text-brand-orange transition">
                        <i className="fa-solid fa-layer-group w-5 text-brand-teal"></i> 3. Nhóm nội dung chính
                    </a>
                    <a href="#section-4" className="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-slate-800 hover:text-brand-orange transition">
                        <i className="fa-solid fa-film w-5 text-brand-warm"></i> 4. Công thức Reels
                    </a>
                    <a href="#section-5" className="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-slate-800 hover:text-brand-orange transition">
                        <i className="fa-solid fa-robot w-5 text-indigo-500"></i> 5. Quy trình AI (8 bước)
                    </a>
                    <a href="#section-6" className="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-slate-800 hover:text-brand-orange transition">
                        <i className="fa-solid fa-calendar-days w-5 text-purple-500"></i> 6. Lịch đăng thử nghiệm
                    </a>
                    <a href="#section-7" className="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-slate-800 hover:text-brand-orange transition">
                        <i className="fa-solid fa-play-circle w-5 text-emerald-500"></i> 7. Video mẫu đầu tiên
                    </a>
                    <a href="#section-8" className="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-slate-800 hover:text-brand-orange transition">
                        <i className="fa-solid fa-lightbulb w-5 text-amber-500"></i> 8. Nguyên tắc thu hút
                    </a>
                    <a href="#section-9" className="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-slate-800 hover:text-brand-orange transition">
                        <i className="fa-solid fa-shield-halved w-5 text-rose-500"></i> 9. Bản quyền & Kiếm tiền
                    </a>
                    <a href="#section-10" className="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-slate-800 hover:text-brand-orange transition">
                        <i className="fa-solid fa-timeline w-5 text-blue-500"></i> 10. Kế hoạch 30 ngày
                    </a>
                    <a href="#section-11" className="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-slate-800 hover:text-brand-orange transition">
                        <i className="fa-solid fa-chart-line w-5 text-brand-teal"></i> 11. Bảng đo lường
                    </a>
                    <a href="#section-12" className="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-slate-800 hover:text-brand-orange transition">
                        <i className="fa-solid fa-bullseye w-5 text-brand-orange"></i> 12. Mục tiêu dài hạn
                    </a>
                </nav>

                {/* Sidebar Footer Action */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <button onClick={() => window.print()} className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition">
                        <i className="fa-solid fa-print"></i> Xuất PDF / In tài liệu
                    </button>
                    <div className="flex justify-between items-center pt-2">
                        <span className="text-[11px] text-slate-400">Phiên bản: 1.0 (16/10/2026)</span>
                        <button id="themeToggle" className="p-1.5 text-slate-500 hover:text-brand-orange rounded-lg text-sm">
                            <i className="fa-solid fa-moon dark:hidden"></i>
                            <i className="fa-solid fa-sun hidden dark:inline text-amber-400"></i>
                        </button>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 min-w-0 p-4 md:p-8 lg:p-10 space-y-10 max-w-7xl mx-auto">

                {/* HEADER BANNER */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-orange via-brand-warm to-brand-teal p-6 md:p-8 text-white shadow-xl">
                    <div className="absolute -right-10 -bottom-10 opacity-20 text-9xl select-none">🐱</div>
                    <div className="relative z-10 max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
                            <i className="fa-solid fa-rocket"></i> Chiến lược vận hành Facebook Reels
                        </div>
                        <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">KẾ HOẠCH PHÁT TRIỂN KÊNH "MÈO THÔNG THÁI"</h1>
                        <p className="mt-2 text-white/90 text-sm md:text-base font-normal">
                            Xây dựng thương hiệu nhân vật mèo hoạt hình thông minh, ứng dụng 100% quy trình AI & CapCut tối ưu hóa lưu lượng tự nhiên.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3 text-xs">
                            <span className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-1.5"><i className="fa-regular fa-calendar"></i> 16/10/2026</span>
                            <span className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-1.5"><i className="fa-brands fa-facebook-f"></i> Facebook Reels</span>
                            <a href="https://www.facebook.com/profile.php?id=61595217965373" target="_blank" className="bg-white text-brand-orange font-bold px-3 py-1.5 rounded-lg hover:bg-slate-100 transition inline-flex items-center gap-1.5">
                                <i className="fa-solid fa-arrow-up-right-from-square"></i> Ghé thăm Fanpage
                            </a>
                        </div>
                    </div>
                </div>

                {/* MỤC 1: THÔNG TIN DỰ ÁN */}
                <section id="section-1" className="scroll-mt-6">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="w-8 h-8 rounded-xl bg-brand-orange/10 text-brand-orange font-bold flex items-center justify-center text-sm">01</span>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Thông Tin Dự Án</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Overview Card */}
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition">
                            <div className="text-brand-orange text-lg mb-2"><i className="fa-solid fa-circle-info"></i> Tong Quan</div>
                            <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-300">
                                <li><strong className="text-slate-800 dark:text-slate-100">Tên trang:</strong> Mèo Thông Thái</li>
                                <li><strong className="text-slate-800 dark:text-slate-100">Nền tảng chính:</strong> Facebook (Tập trung Reels)</li>
                                <li><strong className="text-slate-800 dark:text-slate-100">Định hướng:</strong> Giải trí + Kiến thức + Mẹo hữu ích</li>
                            </ul>
                        </div>

                        {/* Goal Card */}
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition">
                            <div className="text-brand-teal text-lg mb-2"><i className="fa-solid fa-bullseye"></i> Mục Tiêu Dự Án</div>
                            <div className="space-y-2 text-xs">
                                <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg text-emerald-800 dark:text-emerald-300">
                                    <strong>Ngắn hạn:</strong> Tăng views, followers, xây dựng nhận diện thương hiệu.
                                </div>
                                <div className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded-lg text-blue-800 dark:text-blue-300">
                                    <strong>Dài hạn:</strong> Cộng đồng người xem trung thành, bật kiếm tiền Reels/In-stream.
                                </div>
                            </div>
                        </div>

                        {/* Method & Challenges */}
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition md:col-span-2 lg:col-span-1">
                            <div className="text-purple-500 text-lg mb-2"><i className="fa-solid fa-microchip"></i> Sản Xuất & Thách Thức</div>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">
                                <strong>Phương pháp:</strong> Ảnh AI + Giọng đọc AI Tiếng Việt + Dựng CapCut.
                            </p>
                            <div className="text-xs bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-lg border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-300">
                                <i className="fa-solid fa-triangle-exclamation mr-1"></i> <strong>Giải quyết bài toán:</strong> Không cần lộ mặt quay phim, tối ưu hóa ý tưởng sáng tạo bằng AI.
                            </div>
                        </div>
                    </div>
                </section>

                {/* MỤC 2: ĐỊNH VỊ THƯƠNG HIỆU */}
                <section id="section-2" className="scroll-mt-6">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="w-8 h-8 rounded-xl bg-brand-orange/10 text-brand-orange font-bold flex items-center justify-center text-sm">02</span>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Định Vị Thương Hiệu & Nhân Vật</h2>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                            {/* Character Avatar Mockup */}
                            <div className="md:col-span-4 flex flex-col items-center text-center p-6 bg-gradient-to-b from-orange-50 to-amber-50 dark:from-slate-800 dark:to-slate-800/50 rounded-2xl border border-orange-100 dark:border-slate-700">
                                <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-brand-orange via-brand-warm to-brand-teal p-1 shadow-xl mb-4 relative">
                                    <div className="w-full h-full bg-white dark:bg-slate-900 rounded-full flex items-center justify-center text-6xl">
                                        🐱
                                    </div>
                                    <span className="absolute bottom-1 right-1 bg-brand-teal text-white p-1 rounded-full text-lg shadow">👓</span>
                                </div>
                                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Mèo Thông Thái</h3>
                                <p className="text-xs text-brand-orange font-medium mt-1">Linh vật hoạt hình 3D độc quyền</p>
                                <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                                    <span className="px-2 py-1 bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 text-[10px] font-semibold rounded-md">Mèo mướp cam</span>
                                    <span className="px-2 py-1 bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-[10px] font-semibold rounded-md">Kính tròn</span>
                                    <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold rounded-md">Nơ xanh ngọc</span>
                                </div>
                            </div>

                            {/* Visual Guidelines */}
                            <div className="md:col-span-8 space-y-4 text-xs">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                                        <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1"><i className="fa-solid fa-face-smile text-amber-500 mr-1.5"></i>Tính cách:</span>
                                        Thông minh, vui vẻ, tò mò, biến điều phức tạp thành cực kỳ dễ hiểu.
                                    </div>
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                                        <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1"><i className="fa-solid fa-palette text-brand-orange mr-1.5"></i>Phong cách hình ảnh:</span>
                                        Hoạt hình 3D chất lượng cao, ánh sáng ấm. Tone chủ đạo: Cam – Kem – Xanh ngọc.
                                    </div>
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                                        <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1"><i className="fa-solid fa-microphone text-brand-teal mr-1.5"></i>Giọng đọc AI:</span>
                                        Giọng Nam Tiếng Việt, ấm áp, rõ ràng, tự nhiên, nhịp điệu gần gũi.
                                    </div>
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                                        <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1"><i className="fa-solid fa-closed-captioning text-indigo-500 mr-1.5"></i>Định dạng Video:</span>
                                        Tỷ lệ dọc 9:16 (1080x1920), phụ đề lớn nổi bật, nhấn mạnh từ khóa chính. Thời lượng 30-40s.
                                    </div>
                                </div>
                                <div className="p-3 bg-orange-50/70 dark:bg-orange-950/20 border border-orange-200/60 dark:border-orange-900/40 rounded-xl text-orange-900 dark:text-orange-200">
                                    🎯 <strong>Mục tiêu nhận diện:</strong> Người xem chỉ cần lướt qua 1-2 giây trên Reels là nhận diện ngay video thuộc kênh "Mèo Thông Thái".
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* MỤC 3: NHÓM NỘI DUNG CHÍNH */}
                <section id="section-3" className="scroll-mt-6">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="w-8 h-8 rounded-xl bg-brand-orange/10 text-brand-orange font-bold flex items-center justify-center text-sm">03</span>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Các Nhóm Nội Dung Trọng Tâm</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Group A */}
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-bl-full pointer-events-none"></div>
                            <div className="flex justify-between items-start mb-3">
                                <span className="px-2.5 py-1 bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300 rounded-lg text-xs font-bold">NHÓM A (Chủ đạo)</span>
                                <i className="fa-solid fa-compass text-brand-orange text-xl"></i>
                            </div>
                            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">Khám Phá Kiến Thức Thú Vị</h3>
                            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 mb-4 list-disc pl-4">
                                <li>Hiện tượng tâm lý học quen thuộc hằng ngày.</li>
                                <li>Sự thật kỳ lạ về động vật & khoa học đời sống.</li>
                                <li>Những điều tưởng đúng nhưng lại sai lầm.</li>
                            </ul>
                            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-xs space-y-1 border border-slate-100 dark:border-slate-700/50">
                                <div className="font-semibold text-slate-700 dark:text-slate-300">Ví dụ tiêu biểu:</div>
                                <p className="text-slate-500 dark:text-slate-400">💡 <em>"Vì sao mèo luôn tiếp đất bằng chân?", "Vì sao ngáp lại lây truyền?"</em></p>
                            </div>
                        </div>

                        {/* Group B */}
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-bl-full pointer-events-none"></div>
                            <div className="flex justify-between items-start mb-3">
                                <span className="px-2.5 py-1 bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300 rounded-lg text-xs font-bold">NHÓM B</span>
                                <i className="fa-solid fa-wand-magic-sparkles text-brand-teal text-xl"></i>
                            </div>
                            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">Mẹo Đời Sống Hữu Ích</h3>
                            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 mb-4 list-disc pl-4">
                                <li>Mẹo sử dụng & bảo quản vật dụng gia đình.</li>
                                <li>Sắp xếp không gian nhỏ, vệ sinh nhanh gọn.</li>
                                <li>Giải pháp đơn giản cho sự cố hàng ngày.</li>
                            </ul>
                            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-xs space-y-1 border border-slate-100 dark:border-slate-700/50">
                                <div className="font-semibold text-slate-700 dark:text-slate-300">Ví dụ tiêu biểu:</div>
                                <p className="text-slate-500 dark:text-slate-400">💡 <em>"3 công dụng không ngờ của vật dụng quen thuộc trong bếp"</em></p>
                            </div>
                        </div>

                        {/* Group C */}
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full pointer-events-none"></div>
                            <div className="flex justify-between items-start mb-3">
                                <span className="px-2.5 py-1 bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 rounded-lg text-xs font-bold">NHÓM C</span>
                                <i className="fa-solid fa-mobile-screen-button text-blue-500 text-xl"></i>
                            </div>
                            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">Mẹo Công Nghệ & AI</h3>
                            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 mb-4 list-disc pl-4">
                                <li>Tính năng ẩn trên iPhone/Android ít người biết.</li>
                                <li>Ứng dụng AI giúp làm việc, học tập nhanh gấp 2 lần.</li>
                                <li>Mẹo bảo mật & tối ưu thiết bị cá nhân.</li>
                            </ul>
                            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-xs space-y-1 border border-slate-100 dark:border-slate-700/50">
                                <div className="font-semibold text-slate-700 dark:text-slate-300">Ví dụ tiêu biểu:</div>
                                <p className="text-slate-500 dark:text-slate-400">💡 <em>"3 cài đặt điện thoại cần bật ngay để bảo vệ pin"</em></p>
                            </div>
                        </div>

                        {/* Group D */}
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-full pointer-events-none"></div>
                            <div className="flex justify-between items-start mb-3">
                                <span className="px-2.5 py-1 bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 rounded-lg text-xs font-bold">NHÓM D</span>
                                <i className="fa-solid fa-puzzle-piece text-purple-500 text-xl"></i>
                            </div>
                            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">Câu Đố & Tương Tác</h3>
                            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 mb-4 list-disc pl-4">
                                <li>Thử thách tinh mắt, tìm điểm khác biệt.</li>
                                <li>Đoán kết quả trước khi xem lời giải.</li>
                                <li>Bình chọn giữa 2 phương án gây tranh cãi nhẹ.</li>
                            </ul>
                            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-xs space-y-1 border border-slate-100 dark:border-slate-700/50">
                                <div className="font-semibold text-slate-700 dark:text-slate-300">Mục tiêu:</div>
                                <p className="text-slate-500 dark:text-slate-400">🔥 Kích thích lượt comment, share và giữ chân khán giả.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* MỤC 4 & MỤC 7: CÔNG THỨC REELS VÀ MÔ PHỎNG PHONE PREVIEW */}
                <section id="section-4" className="scroll-mt-6">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="w-8 h-8 rounded-xl bg-brand-orange/10 text-brand-orange font-bold flex items-center justify-center text-sm">04 & 07</span>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Cấu Trúc Video Reels Standard & Video Mẫu</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Formula Timeline Breakdown */}
                        <div className="lg:col-span-7 space-y-3">
                            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                                <h3 className="font-bold text-slate-900 dark:text-white text-base mb-4 flex items-center gap-2">
                                    <i className="fa-solid fa-stopwatch text-brand-orange"></i>
                                    Công Thức Đỉnh Cao Cho Video 35–40s
                                </h3>

                                <div className="space-y-3">
                                    {/* Part 1 */}
                                    <div className="p-3 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 dark:from-slate-800 dark:to-slate-800/80 border-l-4 border-red-500">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-bold text-xs text-red-600 dark:text-red-400">PHẦN 1: HOOK GIỮ CHÂN</span>
                                            <span className="text-[11px] font-mono bg-white dark:bg-slate-900 px-2 py-0.5 rounded shadow-sm">0s - 3s</span>
                                        </div>
                                        <p className="text-xs text-slate-700 dark:text-slate-300">Đặt câu hỏi bất ngờ hoặc tình huống tò mò. Tốc độ nói nhanh, rõ.</p>
                                    </div>

                                    {/* Part 2 */}
                                    <div className="p-3 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-slate-800 dark:to-slate-800/80 border-l-4 border-amber-500">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-bold text-xs text-amber-600 dark:text-amber-400">PHẦN 2: ĐẶT VẤN ĐỀ</span>
                                            <span className="text-[11px] font-mono bg-white dark:bg-slate-900 px-2 py-0.5 rounded shadow-sm">3s - 8s</span>
                                        </div>
                                        <p className="text-xs text-slate-700 dark:text-slate-300">Đưa ra góc nhìn độc đáo hoặc mâu thuẫn cần giải quyết.</p>
                                    </div>

                                    {/* Part 3 */}
                                    <div className="p-3 rounded-xl bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-slate-800 dark:to-slate-800/80 border-l-4 border-teal-500">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-bold text-xs text-teal-600 dark:text-teal-400">PHẦN 3: GIẢI THÍCH CHÍNH</span>
                                            <span className="text-[11px] font-mono bg-white dark:bg-slate-900 px-2 py-0.5 rounded shadow-sm">8s - 25s</span>
                                        </div>
                                        <p className="text-xs text-slate-700 dark:text-slate-300">Hình ảnh AI thay đổi mỗi 3s. Lời giải thích súc tích, phụ đề bôi đậm từ khóa.</p>
                                    </div>

                                    {/* Part 4 */}
                                    <div className="p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/80 border-l-4 border-blue-500">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-bold text-xs text-blue-600 dark:text-blue-400">PHẦN 4: KẾT LUẬN GIÁ TRỊ</span>
                                            <span className="text-[11px] font-mono bg-white dark:bg-slate-900 px-2 py-0.5 rounded shadow-sm">25s - 35s</span>
                                        </div>
                                        <p className="text-xs text-slate-700 dark:text-slate-300">Tóm tắt lại bài học hoặc sự thật cốt lõi nhất.</p>
                                    </div>

                                    {/* Part 5 */}
                                    <div className="p-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-800/80 border-l-4 border-purple-500">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-bold text-xs text-purple-600 dark:text-purple-400">PHẦN 5: CALL TO ACTION (CTA)</span>
                                            <span className="text-[11px] font-mono bg-white dark:bg-slate-900 px-2 py-0.5 rounded shadow-sm">35s - 40s</span>
                                        </div>
                                        <p className="text-xs text-slate-700 dark:text-slate-300">"Theo dõi Mèo Thông Thái để thông minh hơn mỗi ngày!"</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Phone Preview Mockup (Mục 7) */}
                        <div id="section-7" className="lg:col-span-5 flex justify-center">
                            <div className="w-full max-w-[300px] h-[580px] bg-slate-900 rounded-[40px] p-3 border-4 border-slate-700 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                                {/* Camera Notch */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5 bg-slate-900 rounded-b-xl z-30"></div>

                                {/* Screen Content */}
                                <div className="relative w-full h-full rounded-[30px] overflow-hidden bg-gradient-to-b from-slate-800 to-amber-950 flex flex-col justify-between p-4 text-white">
                                    {/* Background Simulated AI Image */}
                                    <div className="absolute inset-0 opacity-40 flex items-center justify-center text-8xl">
                                        🐱
                                    </div>

                                    {/* Top Controls */}
                                    <div className="relative z-10 flex justify-between items-center pt-3 text-xs font-semibold">
                                        <span className="bg-black/40 px-2.5 py-1 rounded-full backdrop-blur">
                                            <i className="fa-solid fa-bolt text-amber-400 mr-1"></i> FB Reels
                                        </span>
                                        <i className="fa-solid fa-ellipsis"></i>
                                    </div>

                                    {/* Subtitle Overlay Simulation */}
                                    <div className="relative z-10 my-auto text-center px-2">
                                        <span className="inline-block bg-black/60 backdrop-blur text-amber-300 font-extrabold text-sm px-3 py-1.5 rounded-lg border border-amber-400/30 shadow-lg leading-snug">
                                            "Vì sao mèo luôn tiếp đất bằng chân?" 🐾
                                        </span>
                                        <p className="text-[10px] text-slate-300 mt-2">Cảnh 2/4: Phản xạ tự xoay người của mèo trong không trung</p>
                                    </div>

                                    {/* Bottom Info & Interactive Buttons */}
                                    <div className="relative z-10 flex justify-between items-end">
                                        <div className="space-y-2 max-w-[180px]">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-7 h-7 rounded-full bg-brand-orange flex items-center justify-center text-xs">🐱</div>
                                                <span className="text-xs font-bold">Mèo Thông Thái</span>
                                                <span className="text-[10px] bg-brand-teal px-1.5 py-0.5 rounded text-white font-semibold">Theo dõi</span>
                                            </div>
                                            <p className="text-[11px] line-clamp-2 text-slate-200">
                                                Bí mật về khả năng siêu phàm của các "hoàng thượng"! #meothongthai #kienthuc #meo
                                            </p>
                                            <div className="text-[10px] text-amber-300 flex items-center gap-1">
                                                <i className="fa-solid fa-music text-[8px]"></i> Âm thanh gốc - Mèo Thông Thái
                                            </div>
                                        </div>

                                        {/* Like / Comment Action Stack */}
                                        <div className="flex flex-col items-center space-y-3 text-sm">
                                            <div className="flex flex-col items-center">
                                                <i className="fa-solid fa-heart text-red-500 text-lg"></i>
                                                <span className="text-[10px]">12.5k</span>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <i className="fa-solid fa-comment text-lg"></i>
                                                <span className="text-[10px]">482</span>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <i className="fa-solid fa-share text-lg"></i>
                                                <span className="text-[10px]">1.2k</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* MỤC 5: QUY TRÌNH SẢN XUẤT BẰNG AI (8 BƯỚC) */}
                <section id="section-5" className="scroll-mt-6">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="w-8 h-8 rounded-xl bg-brand-orange/10 text-brand-orange font-bold flex items-center justify-center text-sm">05</span>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Quy Trình Sản Xuất 8 Bước Tự Động Hóa Với AI</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Step 1 */}
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm relative hover:-translate-y-1 transition duration-200">
                            <div className="text-xs font-bold text-brand-orange mb-1">BƯỚC 01</div>
                            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-2"><i className="fa-solid fa-lightbulb text-amber-500 mr-1.5"></i>Chọn Chủ Đề</h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400">Chọn 1 câu hỏi cụ thể, hấp dẫn, có thể giải thích gọn gàng trong 30-40 giây.</p>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm relative hover:-translate-y-1 transition duration-200">
                            <div className="text-xs font-bold text-brand-orange mb-1">BƯỚC 02</div>
                            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-2"><i className="fa-solid fa-magnifying-glass-check text-blue-500 mr-1.5"></i>Kiểm Chứng</h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400">Xác minh nguồn tin cậy. Phân biệt rõ giả thuyết và sự thật khoa học đã chứng minh.</p>
                        </div>

                        {/* Step 3 */}
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm relative hover:-translate-y-1 transition duration-200">
                            <div className="text-xs font-bold text-brand-orange mb-1">BƯỚC 03</div>
                            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-2"><i className="fa-solid fa-pen-nib text-indigo-500 mr-1.5"></i>Viết Kịch Bản</h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400">Viết khoảng 70-100 từ tiếng Việt. Đảm bảo có hook mạnh, nội dung ngắn gọn và kết thúc súc tích.</p>
                        </div>

                        {/* Step 4 */}
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm relative hover:-translate-y-1 transition duration-200">
                            <div className="text-xs font-bold text-brand-orange mb-1">BƯỚC 04</div>
                            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-2"><i className="fa-solid fa-table-cells text-purple-500 mr-1.5"></i>Phân Cảnh & Prompt</h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400">Chia 4-6 cảnh. Chuẩn bị prompt AI chi tiết giữ vững hình tượng Mèo Cam Kính Tròn Nơ Xanh.</p>
                        </div>

                        {/* Step 5 */}
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm relative hover:-translate-y-1 transition duration-200">
                            <div className="text-xs font-bold text-brand-teal mb-1">BƯỚC 05</div>
                            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-2"><i className="fa-solid fa-image text-emerald-500 mr-1.5"></i>Tạo Ảnh AI</h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400">Xuất ảnh tỷ lệ 9:16 dọc. Không tạo chữ trực tiếp trên ảnh AI (thêm chữ ở CapCut).</p>
                        </div>

                        {/* Step 6 */}
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm relative hover:-translate-y-1 transition duration-200">
                            <div className="text-xs font-bold text-brand-teal mb-1">BƯỚC 06</div>
                            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-2"><i className="fa-solid fa-headset text-rose-500 mr-1.5"></i>Tạo Giọng AI</h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400">Chuyển kịch bản thành giọng Nam ấm áp (dùng Viettel AI hoặc công cụ TTS tiếng Việt tốt nhất).</p>
                        </div>

                        {/* Step 7 */}
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm relative hover:-translate-y-1 transition duration-200">
                            <div className="text-xs font-bold text-brand-teal mb-1">BƯỚC 07</div>
                            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-2"><i className="fa-solid fa-scissors text-brand-orange mr-1.5"></i>Dựng CapCut</h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400">Khớp ảnh theo voice, thêm hiệu ứng Zoom/Pan, tạo auto caption bôi đậm word, ghép nhạc nền nhẹ.</p>
                        </div>

                        {/* Step 8 */}
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm relative hover:-translate-y-1 transition duration-200">
                            <div className="text-xs font-bold text-brand-teal mb-1">BƯỚC 08</div>
                            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-2"><i className="fa-solid fa-chart-line text-sky-500 mr-1.5"></i>Đăng & Theo Dõi</h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400">Đăng khung giờ vàng (11h30 / 20h00), đo lường thời gian xem trung bình và tỷ lệ xem hết.</p>
                        </div>
                    </div>
                </section>

                {/* MỤC 6: LỊCH ĐĂNG NỘI DUNG THỬ NGHIỆM (CALENDAR VIEW) */}
                <section id="section-6" className="scroll-mt-6">
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                        <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-xl bg-brand-orange/10 text-brand-orange font-bold flex items-center justify-center text-sm">06</span>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Lịch Đăng Nội Dung Thử Nghiệm Tuần</h2>
                        </div>
                        <div className="text-xs text-slate-500 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                            🎯 Mục tiêu: 1 Reels/ngày + 3-4 Infographics + 2 Quiz/Meme
                        </div>
                    </div>

                    {/* Interactive Schedule Table / Grid */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-x-auto shadow-sm">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                                    <th className="p-3.5 font-bold">Thứ / Ngày</th>
                                    <th className="p-3.5 font-bold">Reels Chính (Video)</th>
                                    <th className="p-3.5 font-bold">Nội Dung Bổ Sung</th>
                                    <th className="p-3.5 font-bold text-center">Khung Giờ Đăng</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                                <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">Thứ 2</td>
                                    <td className="p-3.5"><span className="px-2 py-0.5 rounded bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300 font-semibold text-[10px] mr-1.5">Nhóm A</span> Sự thật thú vị khoa học</td>
                                    <td className="p-3.5">Infographic tóm tắt 3 ý chính</td>
                                    <td className="p-3.5 text-center font-mono">11:30 / 20:00</td>
                                </tr>
                                <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">Thứ 3</td>
                                    <td className="p-3.5"><span className="px-2 py-0.5 rounded bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300 font-semibold text-[10px] mr-1.5">Nhóm B</span> Mẹo hay cuộc sống gia đình</td>
                                    <td className="p-3.5">Câu hỏi tương tác dạng bình chọn A/B</td>
                                    <td className="p-3.5 text-center font-mono">11:30 / 20:00</td>
                                </tr>
                                <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">Thứ 4</td>
                                    <td className="p-3.5"><span className="px-2 py-0.5 rounded bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300 font-semibold text-[10px] mr-1.5">Nhóm A</span> Giải thích hiện tượng tâm lý</td>
                                    <td className="p-3.5">Infographic hình ảnh sinh động</td>
                                    <td className="p-3.5 text-center font-mono">11:30 / 20:00</td>
                                </tr>
                                <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">Thứ 5</td>
                                    <td className="p-3.5"><span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-semibold text-[10px] mr-1.5">Nhóm C</span> Mẹo công nghệ & cài đặt AI</td>
                                    <td className="p-3.5">Câu đố ngắn tinh mắt / tư duy</td>
                                    <td className="p-3.5 text-center font-mono">11:30 / 20:00</td>
                                </tr>
                                <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">Thứ 6</td>
                                    <td className="p-3.5"><span className="px-2 py-0.5 rounded bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300 font-semibold text-[10px] mr-1.5">Nhóm A</span> Điều kỳ lạ về thế giới động vật</td>
                                    <td className="p-3.5">Infographic so sánh trực quan</td>
                                    <td className="p-3.5 text-center font-mono">11:30 / 20:00</td>
                                </tr>
                                <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">Thứ 7</td>
                                    <td className="p-3.5"><span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-semibold text-[10px] mr-1.5">Nhóm D</span> Những điều tưởng đúng nhưng lại sai</td>
                                    <td className="p-3.5">Meme / Hình ảnh hài hước từ Mèo Cam</td>
                                    <td className="p-3.5 text-center font-mono">11:30 / 20:00</td>
                                </tr>
                                <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 bg-orange-50/30 dark:bg-orange-950/10">
                                    <td className="p-3.5 font-bold text-brand-orange">Chủ Nhật</td>
                                    <td className="p-3.5"><span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 font-semibold text-[10px] mr-1.5">Tổng hợp</span> Re-cap kiến thức hay nhất tuần</td>
                                    <td className="p-3.5">Bình chọn chủ đề tuần tới theo yêu cầu</td>
                                    <td className="p-3.5 text-center font-mono">11:30 / 20:00</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* MỤC 8 & 9: NGUYÊN TẮC THU HÚT & BẢN QUYỀN KIẾM TIỀN */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Mục 8 */}
                    <section id="section-8" className="scroll-mt-6">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="w-8 h-8 rounded-xl bg-brand-orange/10 text-brand-orange font-bold flex items-center justify-center text-sm">08</span>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Nguyên Tắc Thu Hút Khán Giả</h2>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3 text-xs shadow-sm h-full">
                            <div className="flex items-start gap-2.5">
                                <i className="fa-solid fa-check-circle text-emerald-500 mt-0.5"></i>
                                <p><strong>Mở đầu trực diện:</strong> Đi thẳng vào câu hỏi hoặc hình ảnh gây tò mò trong 2 giây đầu, bỏ qua lời chào hỏi dài dòng.</p>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <i className="fa-solid fa-check-circle text-emerald-500 mt-0.5"></i>
                                <p><strong>Tập trung đơn điểm:</strong> Mỗi video chỉ truyền tải đúng 1 kiến thức hoặc 1 mẹo chính duy nhất.</p>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <i className="fa-solid fa-check-circle text-emerald-500 mt-0.5"></i>
                                <p><strong>Nhịp chuyển cảnh nhanh:</strong> Đổi hình ảnh/góc máy mỗi 2.5–3.5s để chống nhàm chán thị giác.</p>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <i className="fa-solid fa-check-circle text-emerald-500 mt-0.5"></i>
                                <p><strong>Xây dựng chuỗi (Series):</strong> Đặt tên chuỗi cố định như <em>"Mèo Giải Mã"</em>, <em>"Mẹo Hay 30s"</em> để tạo thói quen theo dõi.</p>
                            </div>
                        </div>
                    </section>

                    {/* Mục 9 */}
                    <section id="section-9" className="scroll-mt-6">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="w-8 h-8 rounded-xl bg-brand-orange/10 text-brand-orange font-bold flex items-center justify-center text-sm">09</span>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Bản Quyền & An Toàn Kiếm Tiền</h2>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3 text-xs shadow-sm h-full">
                            <div className="p-2.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 rounded-xl text-rose-800 dark:text-rose-300">
                                <strong>⚠️ 100% Original Content:</strong> Chỉ sử dụng kịch bản tự viết, ảnh AI tự sinh và âm thanh không vi phạm bản quyền Meta Sound Collection.
                            </div>
                            <p className="text-slate-600 dark:text-slate-300">
                                🚫 <strong>Tuyệt đối KHÔNG:</strong> Lấy lại video từ TikTok/Douyin rồi thêm sub/voice AI. Facebook đánh giá phạt "Reused Content" rất nặng.
                            </p>
                            <p className="text-slate-600 dark:text-slate-300">
                                ✅ <strong>Tuân thủ tiêu chuẩn cộng đồng:</strong> Luôn kiểm tra điều kiện bật kiếm tiền Reels Ads / In-stream Ads định kỳ.
                            </p>
                        </div>
                    </section>
                </div>

                {/* MỤC 10: KẾ HOẠCH TRIỂN KHAI 30 NGÀY (TIMELINE) */}
                <section id="section-10" className="scroll-mt-6">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="w-8 h-8 rounded-xl bg-brand-orange/10 text-brand-orange font-bold flex items-center justify-center text-sm">10</span>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Lộ Trình Triển Khai 30 Ngày Đầu Tiên</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Week 1 */}
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border-t-4 border-t-brand-orange border-x border-b border-slate-200/80 dark:border-slate-800 shadow-sm relative">
                            <span className="px-2.5 py-0.5 bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300 rounded text-[10px] font-extrabold uppercase">Tuần 1</span>
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm my-2">Xây Nền Tảng</h3>
                            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-disc pl-4">
                                <li>Hoàn thiện bộ nhận diện chuẩn Mèo Cam.</li>
                                <li>Sản xuất & đăng 7 Reels đầu tiên.</li>
                                <li>Thử nghiệm 3 nhóm chủ đề khác nhau.</li>
                                <li>Tối ưu quy trình AI + CapCut.</li>
                            </ul>
                        </div>

                        {/* Week 2 */}
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border-t-4 border-t-brand-warm border-x border-b border-slate-200/80 dark:border-slate-800 shadow-sm relative">
                            <span className="px-2.5 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 rounded text-[10px] font-extrabold uppercase">Tuần 2</span>
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm my-2">Đo Lường Phản Ứng</h3>
                            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-disc pl-4">
                                <li>Tiếp tục duy trì 1 video/ngày.</li>
                                <li>Thử 3 dạng Hook mở đầu khác nhau.</li>
                                <li>Theo dõi chỉ số Retention Rate (tỷ lệ giữ chân).</li>
                                <li>Lọc các chủ đề có tín hiệu viral.</li>
                            </ul>
                        </div>

                        {/* Week 3 */}
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border-t-4 border-t-brand-teal border-x border-b border-slate-200/80 dark:border-slate-800 shadow-sm relative">
                            <span className="px-2.5 py-0.5 bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300 rounded text-[10px] font-extrabold uppercase">Tuần 3</span>
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm my-2">Phát Triển Series</h3>
                            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-disc pl-4">
                                <li>Đóng gói các video theo tập (Ep 1, Ep 2...).</li>
                                <li>Đẩy mạnh Infographic bổ trợ.</li>
                                <li>Tăng cường tương tác bình luận với khán giả.</li>
                            </ul>
                        </div>

                        {/* Week 4 */}
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border-t-4 border-t-indigo-500 border-x border-b border-slate-200/80 dark:border-slate-800 shadow-sm relative">
                            <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 rounded text-[10px] font-extrabold uppercase">Tuần 4</span>
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm my-2">Đánh Giá & Tối Ưu</h3>
                            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-disc pl-4">
                                <li>Tổng hợp số liệu từ Bảng Analytics.</li>
                                <li>Loại bỏ nhóm nội dung hiệu quả thấp.</li>
                                <li>Lên kế hoạch sản xuất hàng loạt cho Tháng 2.</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* MỤC 11: BẢNG ĐO LƯỜNG CHỈ SỐ INTERACTIVE (ANALYTICS TRACKER) */}
                <section id="section-11" className="scroll-mt-6">
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                        <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-xl bg-brand-orange/10 text-brand-orange font-bold flex items-center justify-center text-sm">11</span>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Bảng Quản Lý & Đo Lường Chỉ Số (Analytics Tracker)</h2>
                        </div>
                        <button id="addRowBtn" className="px-3 py-1.5 bg-brand-orange hover:bg-brand-warm text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5">
                            <i className="fa-solid fa-plus"></i> Thêm Video Mới
                        </button>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-x-auto shadow-sm p-4">
                        <table className="w-full text-left text-xs border-collapse" id="trackerTable">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                                    <th className="p-2.5 font-bold">Ngày</th>
                                    <th className="p-2.5 font-bold">Tên Chủ Đề</th>
                                    <th className="p-2.5 font-bold">Nhóm</th>
                                    <th className="p-2.5 font-bold">Lượt Xem (Views)</th>
                                    <th className="p-2.5 font-bold">Lượt Share</th>
                                    <th className="p-2.5 font-bold">Follows Mới</th>
                                    <th className="p-2.5 font-bold text-center">Đánh Giá</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300" id="trackerTableBody">
                                {/* Sample Row 1 */}
                                <tr>
                                    <td className="p-2.5">16/10/2026</td>
                                    <td className="p-2.5 font-medium text-slate-800 dark:text-slate-200">Vì sao mèo tiếp đất bằng chân?</td>
                                    <td className="p-2.5"><span className="px-2 py-0.5 bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300 rounded font-semibold text-[10px]">A</span></td>
                                    <td className="p-2.5 font-mono">15,400</td>
                                    <td className="p-2.5 font-mono">342</td>
                                    <td className="p-2.5 font-mono text-emerald-600 font-bold">+120</td>
                                    <td className="p-2.5 text-center"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 rounded font-semibold text-[10px]">Tốt</span></td>
                                </tr>
                                {/* Sample Row 2 */}
                                <tr>
                                    <td className="p-2.5">17/10/2026</td>
                                    <td className="p-2.5 font-medium text-slate-800 dark:text-slate-200">3 Mẹo bảo quản đồ bếp inox</td>
                                    <td className="p-2.5"><span className="px-2 py-0.5 bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300 rounded font-semibold text-[10px]">B</span></td>
                                    <td className="p-2.5 font-mono">4,200</td>
                                    <td className="p-2.5 font-mono">45</td>
                                    <td className="p-2.5 font-mono text-emerald-600 font-bold">+18</td>
                                    <td className="p-2.5 text-center"><span className="px-2 py-0.5 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded font-semibold text-[10px]">Trung bình</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* MỤC 12: MỤC TIÊU DÀI HẠN */}
                <section id="section-12" className="scroll-mt-6 pb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="w-8 h-8 rounded-xl bg-brand-orange/10 text-brand-orange font-bold flex items-center justify-center text-sm">12</span>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Mục Tiêu Dài Hạn & Tầm Nhìn</h2>
                    </div>

                    <div className="bg-gradient-to-br from-slate-900 to-brand-dark text-white p-6 md:p-8 rounded-3xl shadow-xl space-y-6">
                        <div className="max-w-2xl">
                            <h3 className="text-lg md:text-xl font-extrabold text-brand-warm mb-2">Thương Hiệu Nội Dung AI Hàng Đầu Cho Giới Trẻ</h3>
                            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                                Xây dựng "Mèo Thông Thái" thành linh vật tri thức đại diện cho sự tò mò, hóm hỉnh và tin cậy trên nền tảng Facebook Reels và các kênh video ngắn.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-800 pt-6 text-center">
                            <div className="p-3 bg-white/5 rounded-2xl backdrop-blur">
                                <div className="text-2xl font-extrabold text-brand-teal mb-1">100K+</div>
                                <div className="text-[11px] text-slate-400">Người theo dõi trung thành</div>
                            </div>
                            <div className="p-3 bg-white/5 rounded-2xl backdrop-blur">
                                <div className="text-2xl font-extrabold text-brand-orange mb-1">100%</div>
                                <div className="text-[11px] text-slate-400">Nội dung nguyên bản (Original AI)</div>
                            </div>
                            <div className="p-3 bg-white/5 rounded-2xl backdrop-blur">
                                <div className="text-2xl font-extrabold text-amber-400 mb-1">Đủ Điều Kiện</div>
                                <div className="text-[11px] text-slate-400">Bật kiếm tiền Reels Ads & Sponsor</div>
                            </div>
                        </div>

                        <div className="text-center pt-2">
                            <span className="inline-block text-xs font-semibold text-brand-warm bg-brand-warm/10 px-4 py-2 rounded-full border border-brand-warm/20">
                                🌟 "Mỗi video đem lại ít nhất 1 điều đáng nhớ hoặc 1 nụ cười"
                            </span>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    </>
  )
}

const script = `
tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        brand: {
                            orange: '#FF6B35',
                            warm: '#F77F00',
                            teal: '#2EC4B6',
                            tealDark: '#0FA3B1',
                            dark: '#011627',
                            cream: '#FFF8F0',
                            lightBg: '#F8FAF9'
                        }
                    },
                    fontFamily: {
                        sans: ['"Be Vietnam Pro"', 'sans-serif'],
                    }
                }
            }
        }
`

const CSS = `
/* Custom Scrollbar */
        ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        ::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.03);
        }
        ::-webkit-scrollbar-thumb {
            background: #CBD5E1;
            border-radius: 9999px;
        }
        .dark ::-webkit-scrollbar-thumb {
            background: #334155;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #FF6B35;
        }
        .glass-card {
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(12px);
        }
        .dark .glass-card {
            background: rgba(15, 23, 42, 0.85);
            backdrop-filter: blur(12px);
        }
`
