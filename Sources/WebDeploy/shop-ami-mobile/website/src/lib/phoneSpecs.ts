// Port nguyên vẹn từ PHONE_PROFILES trong chi-tiet-san-pham.html (template gốc) —
// giữ đúng toàn bộ nội dung thông số kỹ thuật thật, không rút gọn / không bịa thêm.
export type SpecTabKey = 'manHinh' | 'camera' | 'hieuNang' | 'pin' | 'ketNoi'

export const SPEC_TABS: SpecTabKey[] = ['manHinh', 'camera', 'hieuNang', 'pin', 'ketNoi']
export const SPEC_TAB_LABEL: Record<SpecTabKey, string> = {
  manHinh: 'Màn hình', camera: 'Camera', hieuNang: 'Hiệu năng', pin: 'Pin & Sạc', ketNoi: 'Kết nối & Thiết kế',
}

type SpecPairs = [string, string][]
interface PhoneProfile {
  test: (name: string) => boolean
  specs: Record<SpecTabKey, SpecPairs>
}

export function storageOf(name: string): string {
  const m = name.match(/(\d+)\s?(GB|TB)/i)
  return m ? m[1] + m[2].toUpperCase() : '128GB'
}

const PHONE_PROFILES: PhoneProfile[] = [
  { test: n => n.includes('16 Pro Max'), specs: {
    manHinh: [['Kích thước', '6.9 inch Super Retina XDR OLED'], ['Độ phân giải', '2868 × 1320 px'], ['Tần số quét', '120Hz ProMotion'], ['Độ sáng tối đa', '2000 nits']],
    camera: [['Camera sau', 'Chính 48MP + Góc siêu rộng 48MP + Tele 12MP (zoom quang 5x)'], ['Camera trước', '12MP TrueDepth'], ['Quay video', '4K Dolby Vision đến 120fps'], ['Tính năng', 'Camera Control, chụp đêm, chân dung thông minh']],
    hieuNang: [['Chip xử lý', 'Apple A18 Pro (6 nhân CPU, 6 nhân GPU)'], ['RAM', '8GB'], ['Bộ nhớ trong', '{STORAGE}'], ['Hệ điều hành', 'iOS 18']],
    pin: [['Dung lượng', '~4685 mAh'], ['Sạc có dây', 'Đến 27W, MagSafe 25W'], ['Sạc không dây', 'Qi2 25W'], ['Thời lượng video', 'Đến 33 giờ']],
    ketNoi: [['Cổng kết nối', 'USB-C (USB 3)'], ['Kết nối không dây', '5G, Wi-Fi 7, Bluetooth 5.3, NFC'], ['Chất liệu khung', 'Titanium cấp độ 5'], ['Chống nước bụi', 'IP68 (6m/30 phút)']],
  } },
  { test: n => n.includes('16 Pro'), specs: {
    manHinh: [['Kích thước', '6.3 inch Super Retina XDR OLED'], ['Độ phân giải', '2622 × 1206 px'], ['Tần số quét', '120Hz ProMotion'], ['Độ sáng tối đa', '2000 nits']],
    camera: [['Camera sau', 'Chính 48MP + Góc siêu rộng 48MP + Tele 12MP (zoom quang 5x)'], ['Camera trước', '12MP TrueDepth'], ['Quay video', '4K Dolby Vision đến 120fps'], ['Tính năng', 'Camera Control, chụp đêm, chân dung thông minh']],
    hieuNang: [['Chip xử lý', 'Apple A18 Pro (6 nhân CPU, 6 nhân GPU)'], ['RAM', '8GB'], ['Bộ nhớ trong', '{STORAGE}'], ['Hệ điều hành', 'iOS 18']],
    pin: [['Dung lượng', '~3582 mAh'], ['Sạc có dây', 'Đến 27W, MagSafe 25W'], ['Sạc không dây', 'Qi2 25W'], ['Thời lượng video', 'Đến 27 giờ']],
    ketNoi: [['Cổng kết nối', 'USB-C (USB 3)'], ['Kết nối không dây', '5G, Wi-Fi 7, Bluetooth 5.3, NFC'], ['Chất liệu khung', 'Titanium cấp độ 5'], ['Chống nước bụi', 'IP68 (6m/30 phút)']],
  } },
  { test: n => n.includes('16 Plus'), specs: {
    manHinh: [['Kích thước', '6.7 inch Super Retina XDR OLED'], ['Độ phân giải', '2796 × 1290 px'], ['Tần số quét', '60Hz'], ['Độ sáng tối đa', '2000 nits']],
    camera: [['Camera sau', 'Fusion 48MP chính + 12MP góc siêu rộng'], ['Camera trước', '12MP TrueDepth'], ['Quay video', '4K Dolby Vision đến 60fps'], ['Tính năng', 'Chụp đêm, chân dung thông minh']],
    hieuNang: [['Chip xử lý', 'Apple A18 (6 nhân CPU, 5 nhân GPU)'], ['RAM', '8GB'], ['Bộ nhớ trong', '{STORAGE}'], ['Hệ điều hành', 'iOS 18']],
    pin: [['Dung lượng', '~4674 mAh'], ['Sạc có dây', 'Đến 20W, MagSafe 25W'], ['Sạc không dây', 'Qi2 15W'], ['Thời lượng video', 'Đến 32 giờ']],
    ketNoi: [['Cổng kết nối', 'USB-C (USB 2)'], ['Kết nối không dây', '5G, Wi-Fi 7, Bluetooth 5.3, NFC'], ['Chất liệu khung', 'Nhôm cấp độ hàng không'], ['Chống nước bụi', 'IP68 (6m/30 phút)']],
  } },
  { test: n => n.includes('iPhone 16'), specs: {
    manHinh: [['Kích thước', '6.1 inch Super Retina XDR OLED'], ['Độ phân giải', '2556 × 1179 px'], ['Tần số quét', '60Hz'], ['Độ sáng tối đa', '2000 nits']],
    camera: [['Camera sau', 'Fusion 48MP chính + 12MP góc siêu rộng'], ['Camera trước', '12MP TrueDepth'], ['Quay video', '4K Dolby Vision đến 60fps'], ['Tính năng', 'Chụp đêm, chân dung thông minh']],
    hieuNang: [['Chip xử lý', 'Apple A18 (6 nhân CPU, 5 nhân GPU)'], ['RAM', '8GB'], ['Bộ nhớ trong', '{STORAGE}'], ['Hệ điều hành', 'iOS 18']],
    pin: [['Dung lượng', '~3561 mAh'], ['Sạc có dây', 'Đến 20W, MagSafe 25W'], ['Sạc không dây', 'Qi2 15W'], ['Thời lượng video', 'Đến 22 giờ']],
    ketNoi: [['Cổng kết nối', 'USB-C (USB 2)'], ['Kết nối không dây', '5G, Wi-Fi 7, Bluetooth 5.3, NFC'], ['Chất liệu khung', 'Nhôm cấp độ hàng không'], ['Chống nước bụi', 'IP68 (6m/30 phút)']],
  } },
  { test: n => n.includes('15 Pro'), specs: {
    manHinh: [['Kích thước', '6.1 inch Super Retina XDR OLED'], ['Độ phân giải', '2556 × 1179 px'], ['Tần số quét', '120Hz ProMotion'], ['Độ sáng tối đa', '2000 nits']],
    camera: [['Camera sau', 'Chính 48MP + Góc siêu rộng 12MP + Tele 12MP (zoom quang 3x)'], ['Camera trước', '12MP TrueDepth'], ['Quay video', '4K Dolby Vision đến 60fps'], ['Tính năng', 'Nút Action, chụp đêm']],
    hieuNang: [['Chip xử lý', 'Apple A17 Pro (6 nhân CPU, 6 nhân GPU)'], ['RAM', '8GB'], ['Bộ nhớ trong', '{STORAGE}'], ['Hệ điều hành', 'iOS 17 (nâng cấp iOS 18)']],
    pin: [['Dung lượng', '~3274 mAh'], ['Sạc có dây', 'Đến 20W, MagSafe 15W'], ['Sạc không dây', 'Qi2 15W'], ['Thời lượng video', 'Đến 23 giờ']],
    ketNoi: [['Cổng kết nối', 'USB-C (USB 3)'], ['Kết nối không dây', '5G, Wi-Fi 6E, Bluetooth 5.3, NFC'], ['Chất liệu khung', 'Titanium cấp độ 5'], ['Chống nước bụi', 'IP68 (6m/30 phút)']],
  } },
  { test: n => n.includes('15 Plus'), specs: {
    manHinh: [['Kích thước', '6.7 inch Super Retina XDR OLED'], ['Độ phân giải', '2796 × 1290 px'], ['Tần số quét', '60Hz'], ['Tính năng', 'Dynamic Island']],
    camera: [['Camera sau', '48MP chính + 12MP góc siêu rộng'], ['Camera trước', '12MP TrueDepth'], ['Quay video', '4K Dolby Vision đến 60fps'], ['Tính năng', 'Chụp đêm, chân dung thông minh']],
    hieuNang: [['Chip xử lý', 'Apple A16 Bionic'], ['RAM', '6GB'], ['Bộ nhớ trong', '{STORAGE}'], ['Hệ điều hành', 'iOS 17 (nâng cấp iOS 18)']],
    pin: [['Dung lượng', '~4383 mAh'], ['Sạc có dây', 'Đến 20W, MagSafe 15W'], ['Sạc không dây', 'Qi 15W'], ['Thời lượng video', 'Đến 26 giờ']],
    ketNoi: [['Cổng kết nối', 'Lightning'], ['Kết nối không dây', '5G, Wi-Fi 6, Bluetooth 5.3, NFC'], ['Chất liệu khung', 'Nhôm & kính'], ['Chống nước bụi', 'IP68 (6m/30 phút)']],
  } },
  { test: n => n.includes('iPhone 15'), specs: {
    manHinh: [['Kích thước', '6.1 inch Super Retina XDR OLED'], ['Độ phân giải', '2556 × 1179 px'], ['Tần số quét', '60Hz'], ['Tính năng', 'Dynamic Island']],
    camera: [['Camera sau', '48MP chính + 12MP góc siêu rộng'], ['Camera trước', '12MP TrueDepth'], ['Quay video', '4K Dolby Vision đến 60fps'], ['Tính năng', 'Chụp đêm, chân dung thông minh']],
    hieuNang: [['Chip xử lý', 'Apple A16 Bionic'], ['RAM', '6GB'], ['Bộ nhớ trong', '{STORAGE}'], ['Hệ điều hành', 'iOS 17 (nâng cấp iOS 18)']],
    pin: [['Dung lượng', '~3349 mAh'], ['Sạc có dây', 'Đến 20W, MagSafe 15W'], ['Sạc không dây', 'Qi 15W'], ['Thời lượng video', 'Đến 20 giờ']],
    ketNoi: [['Cổng kết nối', 'Lightning'], ['Kết nối không dây', '5G, Wi-Fi 6, Bluetooth 5.3, NFC'], ['Chất liệu khung', 'Nhôm & kính'], ['Chống nước bụi', 'IP68 (6m/30 phút)']],
  } },
  { test: n => n.includes('14 Plus'), specs: {
    manHinh: [['Kích thước', '6.7 inch Super Retina XDR OLED'], ['Độ phân giải', '2778 × 1284 px'], ['Tần số quét', '60Hz'], ['Tính năng', 'Notch tai thỏ']],
    camera: [['Camera sau', 'Kép 12MP chính + 12MP góc siêu rộng'], ['Camera trước', '12MP TrueDepth'], ['Quay video', '4K HDR đến 60fps'], ['Tính năng', 'Chụp đêm, Photonic Engine']],
    hieuNang: [['Chip xử lý', 'Apple A15 Bionic (5 nhân GPU)'], ['RAM', '6GB'], ['Bộ nhớ trong', '{STORAGE}'], ['Hệ điều hành', 'iOS 16 (nâng cấp iOS 18)']],
    pin: [['Dung lượng', '~4325 mAh'], ['Sạc có dây', 'Đến 20W, MagSafe 15W'], ['Sạc không dây', 'Qi 7.5W'], ['Thời lượng video', 'Đến 26 giờ']],
    ketNoi: [['Cổng kết nối', 'Lightning'], ['Kết nối không dây', '5G, Wi-Fi 6, Bluetooth 5.3, NFC'], ['Chất liệu khung', 'Nhôm & kính'], ['Chống nước bụi', 'IP68 (6m/30 phút)']],
  } },
  { test: n => n.includes('iPhone 14'), specs: {
    manHinh: [['Kích thước', '6.1 inch Super Retina XDR OLED'], ['Độ phân giải', '2532 × 1170 px'], ['Tần số quét', '60Hz'], ['Tính năng', 'Notch tai thỏ']],
    camera: [['Camera sau', 'Kép 12MP chính + 12MP góc siêu rộng'], ['Camera trước', '12MP TrueDepth'], ['Quay video', '4K HDR đến 60fps'], ['Tính năng', 'Chụp đêm, Photonic Engine']],
    hieuNang: [['Chip xử lý', 'Apple A15 Bionic (5 nhân GPU)'], ['RAM', '6GB'], ['Bộ nhớ trong', '{STORAGE}'], ['Hệ điều hành', 'iOS 16 (nâng cấp iOS 18)']],
    pin: [['Dung lượng', '~3279 mAh'], ['Sạc có dây', 'Đến 20W, MagSafe 15W'], ['Sạc không dây', 'Qi 7.5W'], ['Thời lượng video', 'Đến 20 giờ']],
    ketNoi: [['Cổng kết nối', 'Lightning'], ['Kết nối không dây', '5G, Wi-Fi 6, Bluetooth 5.3, NFC'], ['Chất liệu khung', 'Nhôm & kính'], ['Chống nước bụi', 'IP68 (6m/30 phút)']],
  } },
  { test: n => n.includes('iPhone SE'), specs: {
    manHinh: [['Kích thước', '4.7 inch Retina IPS LCD'], ['Độ phân giải', '1334 × 750 px'], ['Tần số quét', '60Hz'], ['Bảo mật', 'Touch ID (nút Home)']],
    camera: [['Camera sau', 'Đơn 12MP'], ['Camera trước', '7MP'], ['Quay video', '4K HDR đến 30fps'], ['Tính năng', 'Photonic Engine, chân dung']],
    hieuNang: [['Chip xử lý', 'Apple A15 Bionic (4 nhân GPU)'], ['RAM', '4GB'], ['Bộ nhớ trong', '{STORAGE}'], ['Hệ điều hành', 'iOS 15 (nâng cấp iOS 18)']],
    pin: [['Dung lượng', '~2018 mAh'], ['Sạc có dây', 'Đến 20W'], ['Sạc không dây', 'Qi 7.5W'], ['Thời lượng video', 'Đến 15 giờ']],
    ketNoi: [['Cổng kết nối', 'Lightning'], ['Kết nối không dây', '5G, Wi-Fi 6, Bluetooth 5.0, NFC'], ['Chất liệu khung', 'Nhôm & kính'], ['Chống nước bụi', 'IP67']],
  } },
  { test: n => n.includes('iPhone 13'), specs: {
    manHinh: [['Kích thước', '6.1 inch Super Retina XDR OLED'], ['Độ phân giải', '2532 × 1170 px'], ['Tần số quét', '60Hz'], ['Tính năng', 'Notch tai thỏ']],
    camera: [['Camera sau', 'Kép 12MP chính + 12MP góc siêu rộng'], ['Camera trước', '12MP TrueDepth'], ['Quay video', '4K HDR đến 60fps'], ['Tính năng', 'Chế độ điện ảnh (Cinematic)']],
    hieuNang: [['Chip xử lý', 'Apple A15 Bionic'], ['RAM', '4GB'], ['Bộ nhớ trong', '{STORAGE}'], ['Hệ điều hành', 'iOS 15 (nâng cấp iOS 18)']],
    pin: [['Dung lượng', '~3227 mAh'], ['Sạc có dây', 'Đến 20W, MagSafe 15W'], ['Sạc không dây', 'Qi 7.5W'], ['Thời lượng video', 'Đến 19 giờ']],
    ketNoi: [['Cổng kết nối', 'Lightning'], ['Kết nối không dây', '5G, Wi-Fi 6, Bluetooth 5.0, NFC'], ['Chất liệu khung', 'Nhôm & kính'], ['Chống nước bụi', 'IP68 (6m/30 phút)']],
  } },
  { test: n => n.includes('S24 Ultra'), specs: {
    manHinh: [['Kích thước', '6.8 inch Dynamic AMOLED 2X phẳng'], ['Độ phân giải', '3120 × 1440 px (QHD+)'], ['Tần số quét', '120Hz thích ứng'], ['Mặt kính', 'Corning Gorilla Armor chống chói']],
    camera: [['Camera sau', '200MP chính + 50MP Tele 5x + 10MP Tele 3x + 12MP góc siêu rộng'], ['Camera trước', '12MP'], ['Quay video', '8K đến 30fps'], ['Tính năng', 'Kèm bút S Pen, Galaxy AI']],
    hieuNang: [['Chip xử lý', 'Snapdragon 8 Gen 3 for Galaxy'], ['RAM', '12GB'], ['Bộ nhớ trong', '{STORAGE}'], ['Hệ điều hành', 'Android 14, One UI 6.1']],
    pin: [['Dung lượng', '5000 mAh'], ['Sạc có dây', '45W'], ['Sạc không dây', '15W, sạc ngược 4.5W'], ['Thời lượng', 'Cả ngày sử dụng liên tục']],
    ketNoi: [['Cổng kết nối', 'USB-C 3.2'], ['Kết nối không dây', '5G, Wi-Fi 7, Bluetooth 5.3, NFC, UWB'], ['Chất liệu khung', 'Titanium'], ['Chống nước bụi', 'IP68']],
  } },
  { test: n => n.includes('S24+'), specs: {
    manHinh: [['Kích thước', '6.7 inch Dynamic AMOLED 2X'], ['Độ phân giải', '3120 × 1440 px (QHD+)'], ['Tần số quét', '120Hz thích ứng'], ['Mặt kính', 'Corning Gorilla Victus 2']],
    camera: [['Camera sau', '50MP chính + 10MP Tele 3x + 12MP góc siêu rộng'], ['Camera trước', '12MP'], ['Quay video', '8K đến 30fps'], ['Tính năng', 'Galaxy AI, chụp đêm']],
    hieuNang: [['Chip xử lý', 'Snapdragon 8 Gen 3 for Galaxy'], ['RAM', '12GB'], ['Bộ nhớ trong', '{STORAGE}'], ['Hệ điều hành', 'Android 14, One UI 6.1']],
    pin: [['Dung lượng', '4900 mAh'], ['Sạc có dây', '45W'], ['Sạc không dây', '15W, sạc ngược 4.5W'], ['Thời lượng', 'Cả ngày sử dụng liên tục']],
    ketNoi: [['Cổng kết nối', 'USB-C 3.2'], ['Kết nối không dây', '5G, Wi-Fi 7, Bluetooth 5.3, NFC'], ['Chất liệu khung', 'Nhôm Armor'], ['Chống nước bụi', 'IP68']],
  } },
  { test: n => n.includes('Galaxy S24'), specs: {
    manHinh: [['Kích thước', '6.2 inch Dynamic AMOLED 2X'], ['Độ phân giải', '2340 × 1080 px (FHD+)'], ['Tần số quét', '120Hz thích ứng'], ['Mặt kính', 'Corning Gorilla Victus 2']],
    camera: [['Camera sau', '50MP chính + 10MP Tele 3x + 12MP góc siêu rộng'], ['Camera trước', '12MP'], ['Quay video', '8K đến 30fps'], ['Tính năng', 'Galaxy AI, chụp đêm']],
    hieuNang: [['Chip xử lý', 'Snapdragon 8 Gen 3 for Galaxy'], ['RAM', '8GB'], ['Bộ nhớ trong', '{STORAGE}'], ['Hệ điều hành', 'Android 14, One UI 6.1']],
    pin: [['Dung lượng', '4000 mAh'], ['Sạc có dây', '25W'], ['Sạc không dây', '15W, sạc ngược 4.5W'], ['Thời lượng', 'Cả ngày sử dụng liên tục']],
    ketNoi: [['Cổng kết nối', 'USB-C 3.2'], ['Kết nối không dây', '5G, Wi-Fi 7, Bluetooth 5.3, NFC'], ['Chất liệu khung', 'Nhôm Armor'], ['Chống nước bụi', 'IP68']],
  } },
  { test: n => n.includes('Z Fold'), specs: {
    manHinh: [['Màn hình chính', '7.6 inch Dynamic AMOLED 2X gập, 120Hz'], ['Màn hình phụ', '6.3 inch Dynamic AMOLED 2X, 120Hz'], ['Độ phân giải', '2160 × 1856 px (màn chính)'], ['Mặt kính', 'Gorilla Glass Victus 2 (mặt ngoài)']],
    camera: [['Camera sau', '50MP chính + 10MP Tele 3x + 12MP góc siêu rộng'], ['Camera trước', 'Camera dưới màn 4MP + 10MP màn phụ'], ['Quay video', '8K đến 30fps'], ['Tính năng', 'Hỗ trợ bút S Pen rời']],
    hieuNang: [['Chip xử lý', 'Snapdragon 8 Gen 3 for Galaxy'], ['RAM', '12GB'], ['Bộ nhớ trong', '{STORAGE}'], ['Hệ điều hành', 'Android 14, One UI 6.1.1']],
    pin: [['Dung lượng', '4400 mAh'], ['Sạc có dây', '25W'], ['Sạc không dây', '15W, sạc ngược 4.5W'], ['Thời lượng', 'Cả ngày sử dụng liên tục']],
    ketNoi: [['Cổng kết nối', 'USB-C 3.2'], ['Kết nối không dây', '5G, Wi-Fi 7, Bluetooth 5.3, NFC'], ['Chất liệu khung', 'Armor Aluminum, bản lề Titanium'], ['Chống nước bụi', 'IP48']],
  } },
  { test: n => n.includes('Z Flip'), specs: {
    manHinh: [['Màn hình chính', '6.7 inch Dynamic AMOLED 2X gập, 120Hz'], ['Màn hình phụ', '3.4 inch Flex Window'], ['Độ phân giải', '2640 × 1080 px (màn chính)'], ['Mặt kính', 'Gorilla Glass Victus 2']],
    camera: [['Camera sau', 'Kép 50MP chính + 12MP góc siêu rộng'], ['Camera trước', '10MP'], ['Quay video', '4K đến 60fps'], ['Tính năng', 'FlexCam tự chụp bằng màn phụ']],
    hieuNang: [['Chip xử lý', 'Snapdragon 8 Gen 3 for Galaxy'], ['RAM', '12GB'], ['Bộ nhớ trong', '{STORAGE}'], ['Hệ điều hành', 'Android 14, One UI 6.1.1']],
    pin: [['Dung lượng', '4000 mAh'], ['Sạc có dây', '25W'], ['Sạc không dây', '15W, sạc ngược 4.5W'], ['Thời lượng', 'Cả ngày sử dụng liên tục']],
    ketNoi: [['Cổng kết nối', 'USB-C 3.2'], ['Kết nối không dây', '5G, Wi-Fi 7, Bluetooth 5.3, NFC'], ['Chất liệu khung', 'Armor Aluminum'], ['Chống nước bụi', 'IP48']],
  } },
  { test: n => n.includes('A55'), specs: {
    manHinh: [['Kích thước', '6.6 inch Super AMOLED phẳng'], ['Độ phân giải', '1080 × 2340 px (FHD+)'], ['Tần số quét', '120Hz'], ['Mặt kính', 'Gorilla Glass Victus+']],
    camera: [['Camera sau', '50MP chính OIS + 12MP góc siêu rộng + 5MP Macro'], ['Camera trước', '32MP'], ['Quay video', '4K đến 30fps'], ['Tính năng', 'Nightography chụp đêm']],
    hieuNang: [['Chip xử lý', 'Exynos 1480'], ['RAM', '8GB'], ['Bộ nhớ trong', '{STORAGE}'], ['Hệ điều hành', 'Android 14, One UI 6.1']],
    pin: [['Dung lượng', '5000 mAh'], ['Sạc có dây', '25W'], ['Sạc không dây', 'Không hỗ trợ'], ['Thời lượng', '~2 ngày sử dụng vừa']],
    ketNoi: [['Cổng kết nối', 'USB-C 2.0'], ['Kết nối không dây', '5G, Wi-Fi 6, Bluetooth 5.3, NFC'], ['Chất liệu khung', 'Khung nhôm'], ['Chống nước bụi', 'IP67']],
  } },
  { test: n => n.includes('A35'), specs: {
    manHinh: [['Kích thước', '6.6 inch Super AMOLED phẳng'], ['Độ phân giải', '1080 × 2340 px (FHD+)'], ['Tần số quét', '120Hz'], ['Mặt kính', 'Gorilla Glass Victus+']],
    camera: [['Camera sau', '50MP chính OIS + 8MP góc siêu rộng + 5MP Macro'], ['Camera trước', '13MP'], ['Quay video', '4K đến 30fps'], ['Tính năng', 'Nightography chụp đêm']],
    hieuNang: [['Chip xử lý', 'Exynos 1380'], ['RAM', '8GB'], ['Bộ nhớ trong', '{STORAGE}'], ['Hệ điều hành', 'Android 14, One UI 6.1']],
    pin: [['Dung lượng', '5000 mAh'], ['Sạc có dây', '25W'], ['Sạc không dây', 'Không hỗ trợ'], ['Thời lượng', '~2 ngày sử dụng vừa']],
    ketNoi: [['Cổng kết nối', 'USB-C 2.0'], ['Kết nối không dây', '5G, Wi-Fi 5, Bluetooth 5.3, NFC'], ['Chất liệu khung', 'Nhựa viền nhôm'], ['Chống nước bụi', 'IP67']],
  } },
  { test: n => n.includes('M55'), specs: {
    manHinh: [['Kích thước', '6.7 inch Super AMOLED phẳng'], ['Độ phân giải', '1080 × 2340 px (FHD+)'], ['Tần số quét', '120Hz'], ['Mặt kính', 'Gorilla Glass Victus']],
    camera: [['Camera sau', '50MP chính OIS + 8MP góc siêu rộng + 2MP Macro'], ['Camera trước', '50MP'], ['Quay video', '4K đến 30fps'], ['Tính năng', 'Nightography chụp đêm']],
    hieuNang: [['Chip xử lý', 'Snapdragon 7 Gen 1'], ['RAM', '8GB'], ['Bộ nhớ trong', '{STORAGE}'], ['Hệ điều hành', 'Android 14, One UI 6.1']],
    pin: [['Dung lượng', '5000 mAh'], ['Sạc có dây', '45W siêu nhanh'], ['Sạc không dây', 'Không hỗ trợ'], ['Thời lượng', '~2 ngày sử dụng vừa']],
    ketNoi: [['Cổng kết nối', 'USB-C 2.0'], ['Kết nối không dây', '5G, Wi-Fi 5, Bluetooth 5.3, NFC'], ['Chất liệu khung', 'Khung nhựa'], ['Chống nước bụi', 'Kháng nước nhẹ']],
  } },
  { test: n => n.includes('Xiaomi 14 Ultra'), specs: {
    manHinh: [['Kích thước', '6.73 inch LTPO AMOLED'], ['Độ phân giải', '3200 × 1440 px (2K)'], ['Tần số quét', '120Hz'], ['Độ sáng tối đa', '3000 nits, kính Xiaomi Shield']],
    camera: [['Camera sau', 'Leica 50MP chính + 50MP góc siêu rộng + 50MP Tele 3.2x + 50MP Periscope 5x'], ['Camera trước', '32MP'], ['Quay video', '8K đến 24fps'], ['Tính năng', 'Ống kính Leica Summilux, khẩu độ vật lý thay đổi']],
    hieuNang: [['Chip xử lý', 'Snapdragon 8 Gen 3'], ['RAM', '16GB'], ['Bộ nhớ trong', '{STORAGE}'], ['Hệ điều hành', 'Android 14, HyperOS']],
    pin: [['Dung lượng', '5300 mAh'], ['Sạc có dây', '90W'], ['Sạc không dây', '80W'], ['Thời lượng', 'Cả ngày sử dụng liên tục']],
    ketNoi: [['Cổng kết nối', 'USB-C 3.2'], ['Kết nối không dây', '5G, Wi-Fi 7, Bluetooth 5.4, NFC, hồng ngoại'], ['Chất liệu khung', 'Khung Titan'], ['Chống nước bụi', 'IP68']],
  } },
  { test: n => n.includes('Xiaomi 14'), specs: {
    manHinh: [['Kích thước', '6.36 inch LTPO AMOLED'], ['Độ phân giải', '2670 × 1200 px'], ['Tần số quét', '120Hz'], ['Độ sáng tối đa', '3000 nits']],
    camera: [['Camera sau', 'Leica 50MP chính + 50MP góc siêu rộng + 50MP Tele 3.2x'], ['Camera trước', '32MP'], ['Quay video', '8K đến 24fps'], ['Tính năng', 'Ống kính Leica Summilux']],
    hieuNang: [['Chip xử lý', 'Snapdragon 8 Gen 3'], ['RAM', '12GB'], ['Bộ nhớ trong', '{STORAGE}'], ['Hệ điều hành', 'Android 14, HyperOS']],
    pin: [['Dung lượng', '4610 mAh'], ['Sạc có dây', '90W'], ['Sạc không dây', '50W'], ['Thời lượng', 'Cả ngày sử dụng liên tục']],
    ketNoi: [['Cổng kết nối', 'USB-C 3.2'], ['Kết nối không dây', '5G, Wi-Fi 7, Bluetooth 5.4, NFC, hồng ngoại'], ['Chất liệu khung', 'Nhôm & kính'], ['Chống nước bụi', 'IP68']],
  } },
  { test: n => n.includes('Redmi Note 13 Pro'), specs: {
    manHinh: [['Kích thước', '6.67 inch AMOLED cong'], ['Độ phân giải', '2712 × 1220 px'], ['Tần số quét', '120Hz'], ['Mặt kính', 'Gorilla Glass Victus']],
    camera: [['Camera sau', '200MP chính OIS + 8MP góc siêu rộng + 2MP Macro'], ['Camera trước', '16MP'], ['Quay video', '4K đến 30fps'], ['Tính năng', 'Chụp đêm, HDR10+']],
    hieuNang: [['Chip xử lý', 'Snapdragon 7s Gen 2'], ['RAM', '8GB'], ['Bộ nhớ trong', '{STORAGE}'], ['Hệ điều hành', 'Android 13, MIUI 14']],
    pin: [['Dung lượng', '5100 mAh'], ['Sạc có dây', '67W siêu nhanh'], ['Sạc không dây', 'Không hỗ trợ'], ['Thời lượng', '~2 ngày sử dụng vừa']],
    ketNoi: [['Cổng kết nối', 'USB-C 2.0'], ['Kết nối không dây', '5G, Wi-Fi 5, Bluetooth 5.3, NFC'], ['Chất liệu khung', 'Nhựa viền phẳng'], ['Chống nước bụi', 'IP54']],
  } },
  { test: n => n.includes('Poco X6 Pro'), specs: {
    manHinh: [['Kích thước', '6.67 inch AMOLED phẳng'], ['Độ phân giải', '2712 × 1220 px'], ['Tần số quét', '120Hz'], ['Độ sáng tối đa', '1800 nits']],
    camera: [['Camera sau', '64MP chính OIS + 8MP góc siêu rộng + 2MP Macro'], ['Camera trước', '16MP'], ['Quay video', '4K đến 60fps'], ['Tính năng', 'Chụp đêm, HDR10+']],
    hieuNang: [['Chip xử lý', 'MediaTek Dimensity 8300 Ultra'], ['RAM', '12GB'], ['Bộ nhớ trong', '{STORAGE}'], ['Hệ điều hành', 'Android 14, HyperOS']],
    pin: [['Dung lượng', '5000 mAh'], ['Sạc có dây', '67W siêu nhanh'], ['Sạc không dây', 'Không hỗ trợ'], ['Thời lượng', '~2 ngày sử dụng vừa']],
    ketNoi: [['Cổng kết nối', 'USB-C 2.0'], ['Kết nối không dây', '5G, Wi-Fi 6, Bluetooth 5.4, NFC, hồng ngoại'], ['Chất liệu khung', 'Nhựa viền phẳng'], ['Chống nước bụi', 'IP54']],
  } },
  { test: n => n.includes('Redmi 13'), specs: {
    manHinh: [['Kích thước', '6.79 inch IPS LCD'], ['Độ phân giải', '2460 × 1080 px'], ['Tần số quét', '90Hz'], ['Độ sáng tối đa', '550 nits']],
    camera: [['Camera sau', '108MP chính + 2MP Macro'], ['Camera trước', '13MP'], ['Quay video', '1080p đến 30fps'], ['Tính năng', 'Chế độ chân dung']],
    hieuNang: [['Chip xử lý', 'MediaTek Helio G91 Ultra'], ['RAM', '8GB'], ['Bộ nhớ trong', '{STORAGE}'], ['Hệ điều hành', 'Android 13, MIUI 14']],
    pin: [['Dung lượng', '5030 mAh'], ['Sạc có dây', '33W'], ['Sạc không dây', 'Không hỗ trợ'], ['Thời lượng', '~2 ngày sử dụng vừa']],
    ketNoi: [['Cổng kết nối', 'USB-C 2.0'], ['Kết nối không dây', '4G, Wi-Fi 5, Bluetooth 5.3, hồng ngoại'], ['Chất liệu khung', 'Khung nhựa'], ['Chống nước bụi', 'Kháng bụi nhẹ']],
  } },
  { test: n => n.includes('Find X7 Ultra'), specs: {
    manHinh: [['Kích thước', '6.82 inch LTPO AMOLED'], ['Độ phân giải', '3168 × 1440 px'], ['Tần số quét', '120Hz'], ['Độ sáng tối đa', '4500 nits đỉnh']],
    camera: [['Camera sau', 'Hasselblad 50MP chính + 50MP góc siêu rộng + 50MP Tele 3x + 50MP Periscope 6x'], ['Camera trước', '32MP'], ['Quay video', '4K Dolby Vision'], ['Tính năng', 'Ống kính kép Hasselblad Pro']],
    hieuNang: [['Chip xử lý', 'Snapdragon 8 Gen 3'], ['RAM', '16GB'], ['Bộ nhớ trong', '{STORAGE}'], ['Hệ điều hành', 'Android 14, ColorOS 14']],
    pin: [['Dung lượng', '5000 mAh'], ['Sạc có dây', '100W SuperVOOC'], ['Sạc không dây', '50W AirVOOC'], ['Thời lượng', 'Cả ngày sử dụng liên tục']],
    ketNoi: [['Cổng kết nối', 'USB-C 3.1'], ['Kết nối không dây', '5G, Wi-Fi 7, Bluetooth 5.4, NFC, hồng ngoại'], ['Chất liệu khung', 'Nhôm & kính'], ['Chống nước bụi', 'IP68']],
  } },
  { test: n => n.includes('Reno 12 Pro'), specs: {
    manHinh: [['Kích thước', '6.7 inch AMOLED cong'], ['Độ phân giải', '2772 × 1240 px'], ['Tần số quét', '120Hz'], ['Độ sáng tối đa', '1200 nits']],
    camera: [['Camera sau', '50MP chính OIS + 8MP góc siêu rộng + 2MP Macro AI'], ['Camera trước', '50MP'], ['Quay video', '4K đến 30fps'], ['Tính năng', 'AI Eraser, chân dung AI']],
    hieuNang: [['Chip xử lý', 'MediaTek Dimensity 8350'], ['RAM', '12GB'], ['Bộ nhớ trong', '{STORAGE}'], ['Hệ điều hành', 'Android 14, ColorOS 14']],
    pin: [['Dung lượng', '5000 mAh'], ['Sạc có dây', '80W SuperVOOC'], ['Sạc không dây', 'Không hỗ trợ'], ['Thời lượng', 'Cả ngày sử dụng liên tục']],
    ketNoi: [['Cổng kết nối', 'USB-C 2.0'], ['Kết nối không dây', '5G, Wi-Fi 6, Bluetooth 5.4, NFC'], ['Chất liệu khung', 'Nhôm viền cong'], ['Chống nước bụi', 'IP65']],
  } },
  { test: n => n.includes('OPPO A79'), specs: {
    manHinh: [['Kích thước', '6.72 inch IPS LCD'], ['Độ phân giải', '2400 × 1080 px'], ['Tần số quét', '90Hz'], ['Độ sáng tối đa', '950 nits']],
    camera: [['Camera sau', '50MP chính + 2MP Depth'], ['Camera trước', '8MP'], ['Quay video', '1080p đến 30fps'], ['Tính năng', 'Chân dung AI']],
    hieuNang: [['Chip xử lý', 'MediaTek Dimensity 6020'], ['RAM', '8GB'], ['Bộ nhớ trong', '{STORAGE}'], ['Hệ điều hành', 'Android 13, ColorOS 13.1']],
    pin: [['Dung lượng', '5000 mAh'], ['Sạc có dây', '33W SuperVOOC'], ['Sạc không dây', 'Không hỗ trợ'], ['Thời lượng', '~2 ngày sử dụng vừa']],
    ketNoi: [['Cổng kết nối', 'USB-C 2.0'], ['Kết nối không dây', '5G, Wi-Fi 5, Bluetooth 5.1, NFC'], ['Chất liệu khung', 'Khung nhựa'], ['Chống nước bụi', 'IP54']],
  } },
  { test: n => n.includes('Find N3 Flip'), specs: {
    manHinh: [['Màn hình chính', '6.8 inch AMOLED gập, 120Hz'], ['Màn hình phụ', '3.26 inch cảm ứng đầy đủ'], ['Độ phân giải', '2520 × 1080 px (màn chính)'], ['Mặt kính', 'Kính cường lực chống trầy']],
    camera: [['Camera sau', '50MP chính OIS + 48MP góc siêu rộng + 32MP Tele 2x'], ['Camera trước', '32MP'], ['Quay video', '4K đến 30fps'], ['Tính năng', 'Chụp selfie bằng màn phụ']],
    hieuNang: [['Chip xử lý', 'MediaTek Dimensity 9200'], ['RAM', '12GB'], ['Bộ nhớ trong', '{STORAGE}'], ['Hệ điều hành', 'Android 13, ColorOS 13.2']],
    pin: [['Dung lượng', '4300 mAh'], ['Sạc có dây', '44W SuperVOOC'], ['Sạc không dây', 'Không hỗ trợ'], ['Thời lượng', 'Cả ngày sử dụng liên tục']],
    ketNoi: [['Cổng kết nối', 'USB-C 2.0'], ['Kết nối không dây', '5G, Wi-Fi 6, Bluetooth 5.3, NFC'], ['Chất liệu khung', 'Nhôm hàng không'], ['Chống nước bụi', 'IPX4']],
  } },
  { test: () => true, specs: {
    manHinh: [['Kích thước', '6.5 inch màn hình cảm ứng Full HD+'], ['Tần số quét', '90–120Hz tuỳ phiên bản'], ['Độ sáng', 'Sáng rõ ngoài trời']],
    camera: [['Camera sau', 'Đa ống kính độ phân giải cao'], ['Camera trước', 'Camera selfie hỗ trợ AI'], ['Quay video', 'Full HD/4K tuỳ phiên bản']],
    hieuNang: [['Chip xử lý', 'Chip xử lý thế hệ mới'], ['Bộ nhớ trong', '{STORAGE}'], ['Hệ điều hành', 'Phiên bản mới nhất']],
    pin: [['Dung lượng', 'Pin dung lượng lớn'], ['Sạc', 'Hỗ trợ sạc nhanh']],
    ketNoi: [['Cổng kết nối', 'USB-C'], ['Kết nối không dây', '5G/4G, Wi-Fi, Bluetooth, NFC']],
  } },
]

export function getPhoneSpecs(name: string): Record<SpecTabKey, SpecPairs> {
  const profile = PHONE_PROFILES.find(pr => pr.test(name)) ?? PHONE_PROFILES[PHONE_PROFILES.length - 1]
  const storage = storageOf(name)
  const result = {} as Record<SpecTabKey, SpecPairs>
  for (const key of SPEC_TABS) {
    result[key] = profile.specs[key].map(([label, val]) => [label, val.replace('{STORAGE}', storage)])
  }
  return result
}
