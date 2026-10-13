'use client'


export default function MeoThongThaiContentPage() {
  return (
    <>
      <title>Chiến Lược Nội Dung & Lịch Đăng Bài</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet"></link>
      <style>{CSS}</style>

      <main className="bg-slate-50 text-slate-800 antialiased p-4 sm:p-8">
        <div className="max-w-5xl mx-auto space-y-8">
    
        <header className="text-center space-y-3 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-semibold">
            <i className="fa-solid fa-cat"></i> Mèo Thông Thái
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Chiến Lược Nội Dung & Lịch Đăng Bài</h1>
        <p className="text-slate-500 max-w-2xl mx-auto">Kế hoạch tối ưu hóa lượt tương tác và thu hút người theo dõi mới trên Facebook</p>
        </header>

        {/* <!-- Part 1: Content Types Grid --> */}
        <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <i className="fa-solid fa-layer-group text-indigo-600"></i> Các Dạng Nội Dung Chính
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Video Reels */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                <span className="p-3 rounded-xl bg-rose-50 text-rose-600 text-xl font-bold">
                    <i className="fa-solid fa-clapperboard"></i>
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-100 text-rose-700">1 bài / ngày</span>
                </div>
                <div>
                <h3 className="text-lg font-bold text-slate-900">1. Video Reels</h3>
                <p className="text-xs text-rose-600 font-medium mt-1">Nội dung cốt lõi • Thu hút follower mới</p>
                </div>
                <p className="text-sm text-slate-600">Dạng bài quan trọng nhất để tận dụng thuật toán đề xuất của Facebook.</p>
                
                <hr className="border-slate-100"/>

                <div className="space-y-3 text-sm">
                <div>
                    <span className="font-semibold text-slate-800 block mb-1"><i className="fa-solid fa-house text-slate-400 mr-1"></i> Mẹo gia đình & Cuộc sống:</span>
                    <ul className="list-disc list-inside text-slate-600 space-y-1 pl-1 text-xs">
                    <li>3 mẹo bảo quản thực phẩm tươi lâu gấp đôi.</li>
                    <li>Tẩy vết mực/dầu mỡ trên áo trắng cực nhanh.</li>
                    </ul>
                </div>

                <div>
                    <span className="font-semibold text-slate-800 block mb-1"><i className="fa-solid fa-mobile-screen text-slate-400 mr-1"></i> Mẹo công nghệ:</span>
                    <ul className="list-disc list-inside text-slate-600 space-y-1 pl-1 text-xs">
                    <li>Bật tính năng ngắt theo dõi & tiết kiệm 30% pin.</li>
                    <li>Mẹo tìm lại file Word/Excel chưa kịp lưu.</li>
                    </ul>
                </div>

                <div>
                    <span className="font-semibold text-slate-800 block mb-1"><i className="fa-solid fa-newspaper text-slate-400 mr-1"></i> Giải mã & Drama hot:</span>
                    <ul className="list-disc list-inside text-slate-600 space-y-1 pl-1 text-xs">
                    <li>Tại sao ngáp lại dễ "lây"? Mèo giải mã!</li>
                    <li>Tóm tắt vụ việc hot trong 30 giây.</li>
                    </ul>
                </div>
                </div>
            </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                <span className="p-3 rounded-xl bg-blue-50 text-blue-600 text-xl font-bold">
                    <i className="fa-solid fa-file-image"></i>
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">3 - 4 bài / tuần</span>
                </div>
                <div>
                <h3 className="text-lg font-bold text-slate-900">2. Bài Viết Hình Ảnh</h3>
                <p className="text-xs text-blue-600 font-medium mt-1">Infographic • Tăng lượt Chia sẻ (Share)</p>
                </div>
                <p className="text-sm text-slate-600">Giữ chân người xem lâu hơn trên trang và thúc đẩy tính lan truyền.</p>
                
                <hr className="border-slate-100"/>

                <div className="space-y-3 text-sm">
                <div>
                    <span className="font-semibold text-slate-800 block mb-1"><i className="fa-solid fa-images text-slate-400 mr-1"></i> Bộ thẻ slide tổng hợp:</span>
                    <p className="text-xs text-slate-600">Tạo ảnh chú mèo đứng góc kèm khung tranh: <i>"Top 5 mẹo tiết kiệm điện"</i>, <i>"4 thói quen tàn phá điện thoại"</i>.</p>
                </div>

                <div>
                    <span className="font-semibold text-slate-800 block mb-1"><i className="fa-solid fa-right-left text-slate-400 mr-1"></i> So sánh Đúng vs Sai:</span>
                    <p className="text-xs text-slate-600">Một bên là thói quen thông thường (Sai), một bên là mẹo của Mèo Thông Thái (Đúng).</p>
                </div>
                </div>
            </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                <span className="p-3 rounded-xl bg-amber-50 text-amber-600 text-xl font-bold">
                    <i className="fa-solid fa-comments"></i>
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">2 bài / tuần</span>
                </div>
                <div>
                <h3 className="text-lg font-bold text-slate-900">3. Tương Tác & Meme</h3>
                <p className="text-xs text-amber-600 font-medium mt-1">Tăng Comment / Like • Tăng Chỉ số trang</p>
                </div>
                <p className="text-sm text-slate-600">Giúp Facebook đánh giá cao tần suất hoạt động tích cực của Fanpage.</p>
                
                <hr className="border-slate-100"/>

                <div className="space-y-3 text-sm">
                <div>
                    <span className="font-semibold text-slate-800 block mb-1"><i className="fa-solid fa-puzzle-piece text-slate-400 mr-1"></i> Đố vui & Câu đố mẹo:</span>
                    <p className="text-xs text-slate-600">Mèo Sherlock Holmes ngẫm nghĩ: <i>"Cái gì càng lau càng bẩn? 5 giây đoán thử dưới comment!"</i></p>
                </div>

                <div>
                    <span className="font-semibold text-slate-800 block mb-1"><i className="fa-solid fa-face-laugh-squint text-slate-400 mr-1"></i> Meme nhận diện:</span>
                    <p className="text-xs text-slate-600">Biểu cảm chú mèo kèm caption bắt trend: <i>"Khi bạn phát hiện ra mẹo này lúc 2 giờ sáng..."</i></p>
                </div>
                </div>
            </div>
            </div>

        </div>
        </section>

        <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <i className="fa-solid fa-calendar-days text-indigo-600"></i> Lịch Đăng Bài Gợi Ý Trong Tuần
            </h2>
            <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
            <i className="fa-regular fa-clock"></i> Khung giờ vàng: <span className="text-indigo-900 font-bold">11:30</span> & <span className="text-indigo-900 font-bold">20:00</span>
            </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-bold text-slate-500 tracking-wider">
                    <th className="py-4 px-6">Thứ</th>
                    <th className="py-4 px-6">Khung Giờ</th>
                    <th className="py-4 px-6">Định Dạng</th>
                    <th className="py-4 px-6">Chủ Đề Chi Tiết</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">Thứ 2</td>
                    <td className="py-4 px-6 text-slate-600"><span className="px-2 py-1 bg-slate-100 rounded font-mono text-xs">11:30</span></td>
                    <td className="py-4 px-6"><span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">Reels</span></td>
                    <td className="py-4 px-6 text-slate-700">Mẹo vặt khởi đầu tuần mới (Mẹo tập trung, làm việc nhanh).</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">Thứ 3</td>
                    <td className="py-4 px-6 text-slate-600"><span className="px-2 py-1 bg-slate-100 rounded font-mono text-xs">20:00</span></td>
                    <td className="py-4 px-6"><span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">Bài ảnh</span></td>
                    <td className="py-4 px-6 text-slate-700">Infographic: Top 3 mẹo bảo quản đồ dùng gia đình.</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">Thứ 4</td>
                    <td className="py-4 px-6 text-slate-600"><span className="px-2 py-1 bg-slate-100 rounded font-mono text-xs">11:30</span></td>
                    <td className="py-4 px-6"><span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">Reels</span></td>
                    <td className="py-4 px-6 text-slate-700">Mẹo công nghệ / Mẹo dùng điện thoại thông minh.</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">Thứ 5</td>
                    <td className="py-4 px-6 text-slate-600"><span className="px-2 py-1 bg-slate-100 rounded font-mono text-xs">20:00</span></td>
                    <td className="py-4 px-6"><span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">Bài đố vui</span></td>
                    <td className="py-4 px-6 text-slate-700">Đố mẹo / Thử thách trí tuệ cùng Mèo Thông Thái.</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">Thứ 6</td>
                    <td className="py-4 px-6 text-slate-600"><span className="px-2 py-1 bg-slate-100 rounded font-mono text-xs">11:30</span></td>
                    <td className="py-4 px-6"><span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">Reels</span></td>
                    <td className="py-4 px-6 text-slate-700">Giải mã 1 hiện tượng thú vị trong cuộc sống.</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">Thứ 7</td>
                    <td className="py-4 px-6 text-slate-600"><span className="px-2 py-1 bg-slate-100 rounded font-mono text-xs">20:00</span></td>
                    <td className="py-4 px-6"><span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">Reels</span></td>
                    <td className="py-4 px-6 text-slate-700">Tin hot / Drama tuần qua tóm tắt hài hước.</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">Chủ Nhật</td>
                    <td className="py-4 px-6 text-slate-600"><span className="px-2 py-1 bg-slate-100 rounded font-mono text-xs">11:30</span></td>
                    <td className="py-4 px-6"><span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">Meme / Ảnh</span></td>
                    <td className="py-4 px-6 text-slate-700">Góc thư giãn: Meme chú Mèo + Lời chúc tuần mới.</td>
                </tr>
                </tbody>
            </table>
            </div>
        </div>
        </section>

    </div>
      </main>
    </>
  )
}


const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
`
