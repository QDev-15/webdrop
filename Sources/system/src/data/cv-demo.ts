import type { CvDataType } from '@/types/cv'

export interface CvDemoProfile {
  id: string
  label: string
  icon: string
  industry: string
  data: CvDataType
}

const productManager: CvDataType = {
  fullName: 'Nguyễn Minh Tuấn',
  jobTitle: 'Senior Product Manager',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face&auto=format&q=80',
  email: 'tuan.nguyen@example.com',
  phone: '0901 234 567',
  location: 'TP. Hồ Chí Minh',
  website: 'tuannguyen.dev',
  linkedin: 'linkedin.com/in/tuannm',
  github: 'github.com/tuannm',
  summary: 'Product Manager với 7 năm kinh nghiệm trong lĩnh vực fintech và e-commerce. Có khả năng phân tích dữ liệu, xây dựng roadmap sản phẩm và dẫn dắt cross-functional teams. Đã deliver nhiều sản phẩm đến hàng triệu người dùng tại Việt Nam.',
  experience: [
    { id: '1', company: 'Tiki Corporation', role: 'Senior Product Manager', startDate: '2021-03', endDate: '', isCurrent: true, description: 'Phụ trách product line Checkout & Payment với team 12 người. Tăng conversion rate từ 72% lên 89% trong 18 tháng. Triển khai tính năng BNPL giúp tăng AOV 34%.' },
    { id: '2', company: 'VNG Corporation', role: 'Product Manager', startDate: '2019-01', endDate: '2021-02', isCurrent: false, description: 'Quản lý product ZaloPay Business với 5 triệu MAU. Xây dựng hệ thống Merchant Portal từ 0, tích hợp với 200+ đối tác.' },
    { id: '3', company: 'FPT Software', role: 'Business Analyst', startDate: '2017-06', endDate: '2018-12', isCurrent: false, description: 'Phân tích yêu cầu nghiệp vụ cho khách hàng Nhật Bản & Úc. Viết PRD, User Story và phối hợp với đội dev Agile.' },
  ],
  education: [
    { id: '1', school: 'Đại học Bách Khoa TP.HCM', degree: 'Kỹ sư', field: 'Công nghệ Thông tin', startDate: '2013', endDate: '2017', gpa: '3.6/4.0' },
  ],
  skills: [
    { id: '1', name: 'Product Strategy', level: 5, category: 'Product' },
    { id: '2', name: 'SQL / Data Analysis', level: 4, category: 'Technical' },
    { id: '3', name: 'Figma / Prototyping', level: 4, category: 'Design' },
    { id: '4', name: 'Agile / Scrum', level: 5, category: 'Method' },
    { id: '5', name: 'A/B Testing & CRO', level: 4, category: 'Analytics' },
    { id: '6', name: 'Stakeholder Management', level: 5, category: 'Soft Skill' },
  ],
  projects: [
    { id: '1', name: 'One-Click Checkout', description: 'Redesign luồng thanh toán, giảm từ 5 bước xuống 2 bước, tăng conversion 18%.', tech: ['React', 'Node.js', 'Mixpanel', 'VietQR'] },
    { id: '2', name: 'Merchant Loyalty Program', description: 'Xây dựng hệ thống điểm thưởng cho 50,000+ merchants. Tăng retention 3 tháng lên 78%.', tech: ['Gamification', 'Push Notification', 'Analytics'] },
  ],
  certifications: [
    { id: '1', name: 'Google Project Management Certificate', issuer: 'Google / Coursera', date: '2022-08' },
    { id: '2', name: 'AWS Cloud Practitioner', issuer: 'Amazon Web Services', date: '2023-03' },
  ],
  languages: [
    { id: '1', language: 'Tiếng Việt', level: 'native' },
    { id: '2', language: 'Tiếng Anh', level: 'fluent' },
    { id: '3', language: 'Tiếng Nhật (N3)', level: 'intermediate' },
  ],
}

const frontendDev: CvDataType = {
  fullName: 'Trần Quốc Huy',
  jobTitle: 'Frontend Developer',
  avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face&auto=format&q=80',
  email: 'huy.tran@example.com',
  phone: '0912 345 678',
  location: 'Hà Nội',
  website: 'huytran.dev',
  linkedin: 'linkedin.com/in/huytq',
  github: 'github.com/huytq',
  summary: 'Frontend Developer 5 năm kinh nghiệm chuyên React, TypeScript và performance optimization. Đam mê xây dựng giao diện người dùng mượt mà, accessible và đẹp. Từng làm việc tại các startup và công ty product lớn.',
  experience: [
    { id: '1', company: 'Momo E-wallet', role: 'Senior Frontend Developer', startDate: '2022-01', endDate: '', isCurrent: true, description: 'Xây dựng giao diện React cho siêu app 30M+ người dùng. Tối ưu Core Web Vitals đạt LCP < 1.5s. Mentoring 3 junior devs. Tech lead team UI Component Library.' },
    { id: '2', company: 'Base.vn', role: 'Frontend Developer', startDate: '2020-03', endDate: '2021-12', isCurrent: false, description: 'Phát triển module CRM & HRM cho 2,000+ doanh nghiệp. Migrate từ jQuery sang React, giảm bundle size 45%. Implement SSR với Next.js cho landing pages.' },
    { id: '3', company: 'Freelance', role: 'Web Developer', startDate: '2019-01', endDate: '2020-02', isCurrent: false, description: 'Nhận dự án web cho SMB: landing page, e-commerce, portfolio. Hoàn thành 20+ dự án với 5★ feedback.' },
  ],
  education: [
    { id: '1', school: 'Đại học Công nghệ — ĐHQGHN', degree: 'Cử nhân', field: 'Khoa học Máy tính', startDate: '2015', endDate: '2019', gpa: '3.4/4.0' },
  ],
  skills: [
    { id: '1', name: 'React / Next.js', level: 5, category: 'Frontend' },
    { id: '2', name: 'TypeScript', level: 5, category: 'Language' },
    { id: '3', name: 'Tailwind CSS', level: 5, category: 'Styling' },
    { id: '4', name: 'Performance Optimization', level: 4, category: 'Frontend' },
    { id: '5', name: 'Node.js / Express', level: 3, category: 'Backend' },
    { id: '6', name: 'Git / CI/CD', level: 4, category: 'DevOps' },
  ],
  projects: [
    { id: '1', name: 'UI Component Library', description: 'Xây dựng thư viện 60+ component cho Momo, dùng Storybook, đạt WCAG 2.1 AA, giảm dev time 40%.', tech: ['React', 'TypeScript', 'Storybook', 'Radix UI'] },
    { id: '2', name: 'E-commerce Platform', description: 'Nền tảng bán hàng cho 500+ merchant, hỗ trợ multi-tenant, realtime inventory, tích hợp VNPay.', tech: ['Next.js', 'Zustand', 'TanStack Query', 'Socket.io'] },
  ],
  certifications: [
    { id: '1', name: 'Meta Frontend Developer Professional Certificate', issuer: 'Meta / Coursera', date: '2023-01' },
  ],
  languages: [
    { id: '1', language: 'Tiếng Việt', level: 'native' },
    { id: '2', language: 'Tiếng Anh', level: 'fluent' },
  ],
}

const uxDesigner: CvDataType = {
  fullName: 'Lê Phương Linh',
  jobTitle: 'UI/UX Designer',
  avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face&auto=format&q=80',
  email: 'linh.le@example.com',
  phone: '0938 456 789',
  location: 'TP. Hồ Chí Minh',
  website: 'linhledesign.com',
  linkedin: 'linkedin.com/in/linhldesign',
  github: '',
  summary: 'UI/UX Designer với 6 năm kinh nghiệm thiết kế sản phẩm số. Chuyên về research, information architecture và design system. Từng thiết kế cho sản phẩm hàng triệu người dùng trong lĩnh vực fintech, healthtech và edtech.',
  experience: [
    { id: '1', company: 'VNPAY', role: 'Lead UX Designer', startDate: '2021-06', endDate: '', isCurrent: true, description: 'Dẫn dắt team 4 designer cho app VNPAY 10M+ người dùng. Định nghĩa Design System 200+ components. Tăng NPS từ 52 lên 71 sau rebrand 2023. Phối hợp với PM & Dev trong sprint Agile.' },
    { id: '2', company: 'Topica Edtech Group', role: 'Product Designer', startDate: '2019-02', endDate: '2021-05', isCurrent: false, description: 'Thiết kế trải nghiệm học online cho 500k+ học viên. Nghiên cứu người dùng (interview, usability test) → tăng completion rate khóa học 28%.' },
    { id: '3', company: 'Designveloper', role: 'UI Designer', startDate: '2018-01', endDate: '2019-01', isCurrent: false, description: 'Thiết kế giao diện mobile app và web cho khách hàng Mỹ, Úc. Sản xuất 5 ứng dụng được publish App Store & Google Play.' },
  ],
  education: [
    { id: '1', school: 'Đại học Kiến trúc TP.HCM', degree: 'Cử nhân', field: 'Thiết kế Đồ họa', startDate: '2014', endDate: '2018', gpa: '' },
  ],
  skills: [
    { id: '1', name: 'Figma', level: 5, category: 'Design Tool' },
    { id: '2', name: 'User Research', level: 5, category: 'UX Method' },
    { id: '3', name: 'Design System', level: 5, category: 'UX Method' },
    { id: '4', name: 'Prototyping', level: 4, category: 'UX Method' },
    { id: '5', name: 'Adobe Illustrator', level: 4, category: 'Design Tool' },
    { id: '6', name: 'HTML / CSS cơ bản', level: 3, category: 'Technical' },
  ],
  projects: [
    { id: '1', name: 'VNPAY App Redesign 2023', description: 'Toàn diện rebrand app: nghiên cứu 500 người dùng, thiết kế lại 80+ màn hình, tăng session time 22%.', tech: ['Figma', 'Maze', 'Hotjar', 'Zeroheight'] },
    { id: '2', name: 'Topica Learning App', description: 'Thiết kế luồng học Microlearning cho mobile, giảm thời gian onboarding từ 8 phút xuống 90 giây.', tech: ['Figma', 'Principle', 'Miro', 'UserTesting'] },
  ],
  certifications: [
    { id: '1', name: 'Google UX Design Professional Certificate', issuer: 'Google / Coursera', date: '2021-03' },
    { id: '2', name: 'Certified Usability Analyst (CUA)', issuer: 'Human Factors International', date: '2022-11' },
  ],
  languages: [
    { id: '1', language: 'Tiếng Việt', level: 'native' },
    { id: '2', language: 'Tiếng Anh', level: 'fluent' },
  ],
}

const marketingManager: CvDataType = {
  fullName: 'Phạm Thu Hương',
  jobTitle: 'Digital Marketing Manager',
  avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face&auto=format&q=80',
  email: 'huong.pham@example.com',
  phone: '0905 567 890',
  location: 'Hà Nội',
  website: '',
  linkedin: 'linkedin.com/in/huongphammarketing',
  github: '',
  summary: 'Digital Marketing Manager 8 năm kinh nghiệm trong lĩnh vực FMCG và e-commerce. Thành thạo performance marketing, SEO/SEM, content strategy và brand building. Quản lý ngân sách marketing lên đến 5 tỷ VNĐ/năm.',
  experience: [
    { id: '1', company: 'Shopee Vietnam', role: 'Marketing Manager', startDate: '2020-09', endDate: '', isCurrent: true, description: 'Quản lý team 8 người phụ trách category Marketing & Health. Tăng GMV category 3.2x trong 3 năm. Lập kế hoạch và thực thi chiến dịch 9.9, 11.11, 12.12 đạt 150% target.' },
    { id: '2', company: 'Unilever Vietnam', role: 'Brand Manager', startDate: '2017-06', endDate: '2020-08', isCurrent: false, description: 'Quản lý brand Dove & POND\'S tại thị trường VN. Tăng market share Dove từ 18% lên 23%. Chạy chiến dịch TVC đạt 50M+ views trên YouTube.' },
    { id: '3', company: 'Golden Gate Group', role: 'Digital Marketing Executive', startDate: '2015-07', endDate: '2017-05', isCurrent: false, description: 'Phụ trách digital cho 10+ thương hiệu nhà hàng. Tăng đặt bàn online 300% qua Facebook Ads và Google Ads.' },
  ],
  education: [
    { id: '1', school: 'Đại học Ngoại thương Hà Nội', degree: 'Cử nhân', field: 'Marketing', startDate: '2011', endDate: '2015', gpa: '3.5/4.0' },
  ],
  skills: [
    { id: '1', name: 'Performance Marketing', level: 5, category: 'Digital' },
    { id: '2', name: 'SEO / SEM', level: 4, category: 'Digital' },
    { id: '3', name: 'Data Analytics (GA4)', level: 4, category: 'Analytics' },
    { id: '4', name: 'Content Strategy', level: 5, category: 'Marketing' },
    { id: '5', name: 'Brand Management', level: 5, category: 'Marketing' },
    { id: '6', name: 'Team Leadership', level: 4, category: 'Management' },
  ],
  projects: [
    { id: '1', name: 'Shopee 11.11 Mega Sale 2023', description: 'Lên kế hoạch & thực thi chiến dịch lớn nhất năm, đạt 185% target GMV với ngân sách hiệu quả hơn 20% năm trước.', tech: ['Meta Ads', 'Google Ads', 'TikTok Ads', 'Influencer'] },
    { id: '2', name: 'Dove Real Beauty Campaign', description: 'Chiến dịch digital viral đạt 50M+ reach organic, PR value ước tính 8 tỷ VNĐ, tăng brand awareness 12 điểm.', tech: ['TVC', 'YouTube', 'Facebook', 'KOL/KOC'] },
  ],
  certifications: [
    { id: '1', name: 'Google Analytics 4 Certification', issuer: 'Google', date: '2023-04' },
    { id: '2', name: 'Meta Blueprint — Media Planning Professional', issuer: 'Meta', date: '2022-09' },
  ],
  languages: [
    { id: '1', language: 'Tiếng Việt', level: 'native' },
    { id: '2', language: 'Tiếng Anh', level: 'fluent' },
  ],
}

const accountant: CvDataType = {
  fullName: 'Ngô Thị Bích Vân',
  jobTitle: 'Kế Toán Trưởng',
  avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face&auto=format&q=80',
  email: 'van.ngo@example.com',
  phone: '0978 678 901',
  location: 'TP. Hồ Chí Minh',
  website: '',
  linkedin: 'linkedin.com/in/vanngo-accounting',
  github: '',
  summary: 'Kế Toán Trưởng với 10 năm kinh nghiệm tại doanh nghiệp FDI và công ty cổ phần. Thành thạo kế toán tổng hợp, lập báo cáo tài chính theo VAS & IFRS, quản lý dòng tiền và tối ưu thuế. Từng làm việc với Big4 trong kiểm toán.',
  experience: [
    { id: '1', company: 'Công ty TNHH Samsung HCMC CE Complex', role: 'Kế Toán Trưởng', startDate: '2019-04', endDate: '', isCurrent: true, description: 'Quản lý team kế toán 5 người, doanh thu 2,000 tỷ/năm. Lập báo cáo tài chính hợp nhất theo IFRS. Giảm thời gian close sổ từ 10 ngày xuống 4 ngày. Phối hợp với auditor PwC.' },
    { id: '2', company: 'Công ty CP Đầu tư Nam Long', role: 'Kế Toán Tổng Hợp', startDate: '2016-01', endDate: '2019-03', isCurrent: false, description: 'Hạch toán toàn bộ nghiệp vụ tài chính dự án BĐS. Lập hồ sơ quyết toán thuế, tờ khai thuế GTGT, TNDN. Phối hợp kiểm toán Deloitte hàng năm.' },
    { id: '3', company: 'KPMG Vietnam', role: 'Kiểm Toán Viên', startDate: '2014-09', endDate: '2015-12', isCurrent: false, description: 'Kiểm toán báo cáo tài chính cho 8 khách hàng ngành sản xuất và bất động sản. Phát hiện và báo cáo rủi ro sai lệch trọng yếu.' },
  ],
  education: [
    { id: '1', school: 'Đại học Kinh tế TP.HCM', degree: 'Cử nhân', field: 'Kế toán — Kiểm toán', startDate: '2010', endDate: '2014', gpa: '3.7/4.0' },
  ],
  skills: [
    { id: '1', name: 'Kế toán tổng hợp (VAS)', level: 5, category: 'Accounting' },
    { id: '2', name: 'IFRS / Báo cáo hợp nhất', level: 4, category: 'Accounting' },
    { id: '3', name: 'SAP FI Module', level: 4, category: 'Software' },
    { id: '4', name: 'Excel / Power Query', level: 5, category: 'Tool' },
    { id: '5', name: 'Quản lý dòng tiền', level: 5, category: 'Finance' },
    { id: '6', name: 'Luật Thuế (GTGT, TNDN)', level: 5, category: 'Tax' },
  ],
  projects: [
    { id: '1', name: 'Triển khai SAP S/4HANA', description: 'Tham gia dự án triển khai ERP mới cho toàn công ty, phụ trách module FI, đào tạo 8 user kế toán.', tech: ['SAP S/4HANA', 'SAP FI/CO', 'Power BI'] },
  ],
  certifications: [
    { id: '1', name: 'Chứng chỉ Kế toán trưởng', issuer: 'Bộ Tài chính Việt Nam', date: '2017-06' },
    { id: '2', name: 'ACCA — F7 Financial Reporting (pass)', issuer: 'ACCA Global', date: '2020-03' },
  ],
  languages: [
    { id: '1', language: 'Tiếng Việt', level: 'native' },
    { id: '2', language: 'Tiếng Anh', level: 'intermediate' },
  ],
}

const hrManager: CvDataType = {
  fullName: 'Đặng Minh Châu',
  jobTitle: 'HR Manager',
  avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face&auto=format&q=80',
  email: 'chau.dang@example.com',
  phone: '0966 789 012',
  location: 'Hà Nội',
  website: '',
  linkedin: 'linkedin.com/in/chaudang-hr',
  github: '',
  summary: 'HR Manager 9 năm kinh nghiệm tại tập đoàn đa quốc gia và startup tăng trưởng nhanh. Chuyên tuyển dụng IT/Tech, xây dựng culture, hệ thống đánh giá KPI và lộ trình phát triển nhân viên. Đã scale team từ 50 lên 500 người.',
  experience: [
    { id: '1', company: 'KMS Technology Vietnam', role: 'HR Manager', startDate: '2020-07', endDate: '', isCurrent: true, description: 'Quản lý HR cho 800 kỹ sư phần mềm. Xây dựng employer branding → giảm thời gian tuyển dụng 35%. Thiết kế career framework và lộ trình IC/Manager. Triển khai hệ thống performance review bán niên.' },
    { id: '2', company: 'VNG Corporation', role: 'Senior HR Business Partner', startDate: '2017-03', endDate: '2020-06', isCurrent: false, description: 'HRBP cho 3 business unit (600 người). Dẫn dắt dự án survey engagement, cải thiện eNPS từ 28 lên 47. Phối hợp Talent Acquisition tuyển 150 engineer/năm.' },
    { id: '3', company: 'Navigos Group', role: 'Recruitment Consultant', startDate: '2015-06', endDate: '2017-02', isCurrent: false, description: 'Headhunting cấp C-suite và Senior Manager cho khách hàng FDI lĩnh vực IT, banking. Đạt 118% quota 2016.' },
  ],
  education: [
    { id: '1', school: 'Đại học Kinh tế Quốc dân', degree: 'Cử nhân', field: 'Quản trị Nhân lực', startDate: '2011', endDate: '2015', gpa: '3.6/4.0' },
  ],
  skills: [
    { id: '1', name: 'Talent Acquisition', level: 5, category: 'HR' },
    { id: '2', name: 'HR Business Partner', level: 5, category: 'HR' },
    { id: '3', name: 'Performance Management', level: 5, category: 'HR' },
    { id: '4', name: 'Compensation & Benefits', level: 4, category: 'HR' },
    { id: '5', name: 'Workday HCM', level: 4, category: 'Tool' },
    { id: '6', name: 'Data-driven HR', level: 4, category: 'Analytics' },
  ],
  projects: [
    { id: '1', name: 'Scale Engineering Team x10', description: 'Xây dựng pipeline tuyển dụng mở rộng team kỹ thuật từ 80 lên 800 người trong 3 năm, cost per hire giảm 40%.', tech: ['LinkedIn Recruiter', 'Workday', 'HackerRank', 'Greenhouse'] },
    { id: '2', name: 'Culture & Engagement Program', description: 'Thiết kế chương trình Recognition & Reward, cải thiện retention 6 tháng đầu từ 68% lên 87%.', tech: ['Survey', 'OKR', 'Pulse Check', 'Town Hall'] },
  ],
  certifications: [
    { id: '1', name: 'SHRM — Senior Certified Professional (SHRM-SCP)', issuer: 'SHRM', date: '2021-05' },
    { id: '2', name: 'Certified Workday HCM Professional', issuer: 'Workday', date: '2022-02' },
  ],
  languages: [
    { id: '1', language: 'Tiếng Việt', level: 'native' },
    { id: '2', language: 'Tiếng Anh', level: 'fluent' },
  ],
}

const salesExecutive: CvDataType = {
  fullName: 'Hoàng Văn Đức',
  jobTitle: 'Key Account Manager',
  avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face&auto=format&q=80',
  email: 'duc.hoang@example.com',
  phone: '0943 890 123',
  location: 'TP. Hồ Chí Minh',
  website: '',
  linkedin: 'linkedin.com/in/duchvkg',
  github: '',
  summary: 'Key Account Manager B2B với 7 năm kinh nghiệm ngành SaaS và công nghệ. Chuyên phát triển và duy trì quan hệ khách hàng doanh nghiệp, quản lý portfolio 50+ enterprise accounts với tổng ARR 80 tỷ VNĐ.',
  experience: [
    { id: '1', company: 'Base.vn', role: 'Key Account Manager', startDate: '2021-02', endDate: '', isCurrent: true, description: 'Quản lý 35 enterprise accounts (SME & Corp). ARR phụ trách: 45 tỷ, renewal rate 94%. Upsell thêm 2.8 tỷ ARR từ existing accounts năm 2023. Đạt Top KAM of the Year 2023.' },
    { id: '2', company: 'Salesforce Vietnam', role: 'Account Executive', startDate: '2018-06', endDate: '2021-01', isCurrent: false, description: 'Phát triển thị trường SMB tại VN & Campuchia. Đóng 12 new logo enterprise trong năm 2020. Đạt 125% quota 2 năm liên tiếp.' },
    { id: '3', company: 'FPT Telecom', role: 'B2B Sales Executive', startDate: '2016-09', endDate: '2018-05', isCurrent: false, description: 'Bán giải pháp cloud và network cho doanh nghiệp vừa. Quản lý 80+ SME accounts tại TP.HCM.' },
  ],
  education: [
    { id: '1', school: 'Đại học Thương mại', degree: 'Cử nhân', field: 'Kinh doanh Quốc tế', startDate: '2012', endDate: '2016', gpa: '' },
  ],
  skills: [
    { id: '1', name: 'B2B Enterprise Sales', level: 5, category: 'Sales' },
    { id: '2', name: 'Account Management', level: 5, category: 'Sales' },
    { id: '3', name: 'CRM (Salesforce)', level: 4, category: 'Tool' },
    { id: '4', name: 'Negotiation & Closing', level: 5, category: 'Skill' },
    { id: '5', name: 'Solution Selling', level: 5, category: 'Sales' },
    { id: '6', name: 'Presentation / Demo', level: 4, category: 'Skill' },
  ],
  projects: [
    { id: '1', name: 'Enterprise Expansion Q4 2023', description: 'Mở 8 new enterprise account từ 0 trong 1 quý, đóng góp 12 tỷ ARR mới, lớn nhất lịch sử team KAM.', tech: ['Salesforce', 'LinkedIn Sales Navigator', 'Outreach'] },
  ],
  certifications: [
    { id: '1', name: 'Salesforce Certified Sales Cloud Consultant', issuer: 'Salesforce', date: '2020-08' },
    { id: '2', name: 'HubSpot Sales Software Certification', issuer: 'HubSpot Academy', date: '2023-01' },
  ],
  languages: [
    { id: '1', language: 'Tiếng Việt', level: 'native' },
    { id: '2', language: 'Tiếng Anh', level: 'fluent' },
  ],
}

const contentWriter: CvDataType = {
  fullName: 'Vũ Ngọc Ánh',
  jobTitle: 'Content Strategist',
  avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=face&auto=format&q=80',
  email: 'anh.vu@example.com',
  phone: '0987 901 234',
  location: 'Hà Nội',
  website: 'anhvu.substack.com',
  linkedin: 'linkedin.com/in/anhvucontent',
  github: '',
  summary: 'Content Strategist 6 năm kinh nghiệm trong lĩnh vực media, tech và tài chính. Từng quản lý editorial team và xây dựng content hub đạt 2M+ lượt đọc/tháng. Chuyên SEO content, brand storytelling và thought leadership.',
  experience: [
    { id: '1', company: 'CafeF (VCCorp)', role: 'Content Strategy Lead', startDate: '2021-01', endDate: '', isCurrent: true, description: 'Dẫn dắt chiến lược nội dung cho CafeF — cổng tài chính lớn nhất VN. Quản lý team 12 editor. Tăng organic traffic 65% qua SEO content strategy. Phát triển newsletter 150,000 subscribers.' },
    { id: '2', company: 'Misa Software', role: 'Content Marketing Manager', startDate: '2019-03', endDate: '2020-12', isCurrent: false, description: 'Xây dựng content hub cho SME market. 180+ bài viết/tháng, đạt 500k visits/tháng từ organic. Tăng lead từ content 200%.' },
    { id: '3', company: 'Vietnamnet', role: 'Phóng viên Kinh tế', startDate: '2017-07', endDate: '2019-02', isCurrent: false, description: 'Viết bài phân tích kinh tế, tài chính doanh nghiệp. Thực hiện 20+ phỏng vấn CEO/CFO. Bài viết đạt 500k+ lượt đọc.' },
  ],
  education: [
    { id: '1', school: 'Học viện Báo chí và Tuyên truyền', degree: 'Cử nhân', field: 'Báo chí', startDate: '2013', endDate: '2017', gpa: '3.8/4.0' },
  ],
  skills: [
    { id: '1', name: 'SEO Content Strategy', level: 5, category: 'Content' },
    { id: '2', name: 'Copywriting / Editing', level: 5, category: 'Content' },
    { id: '3', name: 'Content Management (WordPress)', level: 4, category: 'Tool' },
    { id: '4', name: 'Google Analytics / Search Console', level: 4, category: 'Analytics' },
    { id: '5', name: 'Email Marketing', level: 4, category: 'Marketing' },
    { id: '6', name: 'Team Leadership', level: 4, category: 'Management' },
  ],
  projects: [
    { id: '1', name: 'CafeF SEO Overhaul', description: 'Triển khai chiến lược SEO toàn diện: tối ưu 10,000 bài cũ, xây dựng topical authority → tăng 800k organic sessions/tháng.', tech: ['Ahrefs', 'SEMrush', 'Screaming Frog', 'Google Search Console'] },
    { id: '2', name: 'Newsletter "Tài chính Tuần này"', description: 'Xây dựng từ 0 → 150,000 subscribers trong 18 tháng, open rate 38% (gấp đôi benchmark ngành).', tech: ['Mailchimp', 'Substack', 'Beehiiv'] },
  ],
  certifications: [
    { id: '1', name: 'HubSpot Content Marketing Certification', issuer: 'HubSpot Academy', date: '2022-07' },
    { id: '2', name: 'Google Analytics 4 Certification', issuer: 'Google', date: '2023-06' },
  ],
  languages: [
    { id: '1', language: 'Tiếng Việt', level: 'native' },
    { id: '2', language: 'Tiếng Anh', level: 'fluent' },
  ],
}

const civilEngineer: CvDataType = {
  fullName: 'Bùi Thành Long',
  jobTitle: 'Kỹ Sư Xây Dựng',
  avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face&auto=format&q=80',
  email: 'long.bui@example.com',
  phone: '0354 012 345',
  location: 'TP. Hồ Chí Minh',
  website: '',
  linkedin: 'linkedin.com/in/lonbuithanh',
  github: '',
  summary: 'Kỹ sư Xây dựng 8 năm kinh nghiệm trong lĩnh vực kết cấu và quản lý dự án hạ tầng. Đã tham gia thiết kế và giám sát thi công nhiều dự án lớn từ nhà ở cao tầng đến cầu đường giao thông, tổng giá trị hơn 2,000 tỷ VNĐ.',
  experience: [
    { id: '1', company: 'Coteccons Construction', role: 'Project Manager', startDate: '2020-05', endDate: '', isCurrent: true, description: 'Quản lý dự án The Metropole Thủ Thiêm (30 tầng, 1,200 tỷ). Điều phối 200+ công nhân, 15 nhà thầu phụ. Hoàn thành đúng tiến độ, tiết kiệm 8% chi phí so với dự toán.' },
    { id: '2', company: 'Hòa Bình Construction', role: 'Structural Engineer', startDate: '2017-02', endDate: '2020-04', isCurrent: false, description: 'Thiết kế kết cấu bê tông cốt thép và thép cho 5 tòa nhà 20-25 tầng. Sử dụng ETABS, SAFE, SAP2000. Giám sát thi công nền móng cọc khoan nhồi.' },
    { id: '3', company: 'Viện Khoa học Thủy lợi miền Nam', role: 'Kỹ sư thiết kế', startDate: '2016-01', endDate: '2017-01', isCurrent: false, description: 'Thiết kế công trình thủy lợi: đê, kè, cống điều tiết tại ĐBSCL. Lập hồ sơ BVTC và dự toán công trình.' },
  ],
  education: [
    { id: '1', school: 'Đại học Bách Khoa TP.HCM', degree: 'Kỹ sư', field: 'Kỹ thuật Xây dựng', startDate: '2011', endDate: '2016', gpa: '3.2/4.0' },
  ],
  skills: [
    { id: '1', name: 'ETABS / SAFE / SAP2000', level: 5, category: 'Software' },
    { id: '2', name: 'AutoCAD / Revit', level: 5, category: 'Software' },
    { id: '3', name: 'Quản lý tiến độ (MS Project)', level: 4, category: 'Management' },
    { id: '4', name: 'Kết cấu BTCT & Thép', level: 5, category: 'Engineering' },
    { id: '5', name: 'Dự toán & Đấu thầu', level: 4, category: 'Management' },
    { id: '6', name: 'TCVN / Tiêu chuẩn ACI', level: 5, category: 'Standard' },
  ],
  projects: [
    { id: '1', name: 'The Metropole Thủ Thiêm', description: 'Dự án nhà ở cao cấp 30 tầng, 350 căn hộ. Quản lý từ đào móng đến hoàn thiện, tổng giá trị 1,200 tỷ VNĐ.', tech: ['Revit BIM', 'Primavera P6', 'ETABS', 'AutoCAD'] },
    { id: '2', name: 'Cầu Thị Nghè 2', description: 'Cầu dầm thép nhịp 65m, tải trọng H30-XB80. Phụ trách thiết kế kết cấu và giám sát thi công trụ cầu.', tech: ['SAP2000', 'AutoCAD', 'TCVN 11823'] },
  ],
  certifications: [
    { id: '1', name: 'Chứng chỉ hành nghề Kỹ sư XD hạng I', issuer: 'Bộ Xây dựng Việt Nam', date: '2020-03' },
    { id: '2', name: 'PMP — Project Management Professional', issuer: 'PMI', date: '2022-09' },
  ],
  languages: [
    { id: '1', language: 'Tiếng Việt', level: 'native' },
    { id: '2', language: 'Tiếng Anh', level: 'intermediate' },
  ],
}

const nurse: CvDataType = {
  fullName: 'Nguyễn Thị Thanh Tâm',
  jobTitle: 'Điều Dưỡng Trưởng',
  avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=200&h=200&fit=crop&crop=face&auto=format&q=80',
  email: 'tam.nurse@example.com',
  phone: '0916 123 456',
  location: 'Hà Nội',
  website: '',
  linkedin: '',
  github: '',
  summary: 'Điều Dưỡng Trưởng 12 năm kinh nghiệm tại bệnh viện đa khoa hạng I. Chuyên khoa Nội tim mạch và Cấp cứu. Đã đào tạo hơn 50 điều dưỡng mới và xây dựng quy trình chăm sóc chuẩn hóa giúp giảm biến chứng 30%.',
  experience: [
    { id: '1', company: 'Bệnh viện Bạch Mai', role: 'Điều Dưỡng Trưởng Khoa Tim Mạch', startDate: '2018-03', endDate: '', isCurrent: true, description: 'Quản lý 15 điều dưỡng, chăm sóc 40-50 bệnh nhân/ngày. Xây dựng SOP chăm sóc bệnh nhân NMCT, ĐQNMN. Giảm tỷ lệ biến chứng tại chỗ 30% trong 3 năm. Đào tạo thực hành cho sinh viên ĐD Hà Nội.' },
    { id: '2', company: 'Bệnh viện Việt Đức', role: 'Điều Dưỡng Cấp Cứu', startDate: '2013-07', endDate: '2018-02', isCurrent: false, description: 'Trực cấp cứu 24/7, xử lý ca chấn thương nặng, hỗ trợ phẫu thuật khẩn cấp. Thành thạo đặt nội khí quản, sốc điện, ép tim ngoài lồng ngực.' },
    { id: '3', company: 'Bệnh viện Đa khoa Hà Đông', role: 'Điều Dưỡng Nội trú', startDate: '2012-01', endDate: '2013-06', isCurrent: false, description: 'Thực hiện y lệnh, chăm sóc toàn diện bệnh nhân nội khoa. Tiêm truyền, lấy máu xét nghiệm, theo dõi sinh hiệu.' },
  ],
  education: [
    { id: '1', school: 'Đại học Điều Dưỡng Nam Định', degree: 'Cử nhân', field: 'Điều Dưỡng', startDate: '2008', endDate: '2012', gpa: '3.5/4.0' },
  ],
  skills: [
    { id: '1', name: 'Chăm sóc bệnh nhân Tim mạch', level: 5, category: 'Clinical' },
    { id: '2', name: 'Cấp cứu — BLS / ACLS', level: 5, category: 'Clinical' },
    { id: '3', name: 'Quản lý đội nhóm ĐD', level: 5, category: 'Management' },
    { id: '4', name: 'Kiểm soát nhiễm khuẩn', level: 5, category: 'Clinical' },
    { id: '5', name: 'Phần mềm HIS (His-Pro)', level: 3, category: 'Tool' },
    { id: '6', name: 'Đào tạo & Mentor', level: 4, category: 'Education' },
  ],
  projects: [
    { id: '1', name: 'SOP Chăm sóc NMCT', description: 'Xây dựng bộ quy trình chuẩn hóa 15 SOP cho chăm sóc bệnh nhân nhồi máu cơ tim, được Bộ Y tế phê duyệt ứng dụng toàn viện.', tech: ['Evidence-Based Nursing', 'PDCA', 'QI Tools'] },
  ],
  certifications: [
    { id: '1', name: 'Chứng chỉ hành nghề Điều dưỡng', issuer: 'Bộ Y tế Việt Nam', date: '2012-09' },
    { id: '2', name: 'Advanced Cardiac Life Support (ACLS)', issuer: 'American Heart Association', date: '2023-04' },
    { id: '3', name: 'Điều dưỡng chuyên khoa I — Nội', issuer: 'Đại học Y Hà Nội', date: '2019-12' },
  ],
  languages: [
    { id: '1', language: 'Tiếng Việt', level: 'native' },
    { id: '2', language: 'Tiếng Anh', level: 'basic' },
  ],
}

const teacher: CvDataType = {
  fullName: 'Trịnh Xuân Bình',
  jobTitle: 'Giáo Viên Toán THPT',
  avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face&auto=format&q=80',
  email: 'binh.trinh@example.com',
  phone: '0975 234 567',
  location: 'Đà Nẵng',
  website: '',
  linkedin: '',
  github: '',
  summary: 'Giáo viên Toán THPT 14 năm kinh nghiệm, chuyên dạy đội tuyển thi học sinh giỏi và luyện thi THPT Quốc gia. Học trò đạt nhiều giải thưởng cấp tỉnh và quốc gia. Yêu nghề, tận tâm và luôn đổi mới phương pháp giảng dạy.',
  experience: [
    { id: '1', company: 'THPT Chuyên Lê Quý Đôn Đà Nẵng', role: 'Giáo viên Toán — Tổ trưởng', startDate: '2015-09', endDate: '', isCurrent: true, description: 'Giảng dạy Toán 11-12 và lớp chuyên Toán. Tổ trưởng tổ Toán 8 giáo viên. 3/5 học sinh đội tuyển đạt giải Quốc gia 2022-2024. Điểm TB Toán THPT QG của trường đạt 8.1 (top 5 tỉnh).' },
    { id: '2', company: 'THPT Phan Châu Trinh Đà Nẵng', role: 'Giáo viên Toán', startDate: '2010-09', endDate: '2015-08', isCurrent: false, description: 'Giảng dạy Toán 10-12 theo chương trình đại trà. Chủ nhiệm 3 lớp. Tỷ lệ học sinh đỗ ĐH-CĐ đạt 92%. Nhận danh hiệu Giáo viên giỏi cấp trường 2013, 2015.' },
  ],
  education: [
    { id: '1', school: 'Đại học Sư phạm Đà Nẵng', degree: 'Cử nhân Sư phạm', field: 'Toán học', startDate: '2006', endDate: '2010', gpa: '3.8/4.0' },
  ],
  skills: [
    { id: '1', name: 'Giảng dạy Toán THPT', level: 5, category: 'Teaching' },
    { id: '2', name: 'Bồi dưỡng HSG Toán', level: 5, category: 'Teaching' },
    { id: '3', name: 'Soạn giáo án & đề kiểm tra', level: 5, category: 'Teaching' },
    { id: '4', name: 'Công nghệ giảng dạy (GeoGebra, PPT)', level: 4, category: 'Tool' },
    { id: '5', name: 'Quản lý lớp học', level: 5, category: 'Management' },
    { id: '6', name: 'Tư vấn hướng nghiệp', level: 4, category: 'Soft Skill' },
  ],
  projects: [
    { id: '1', name: 'Tài liệu Toán nâng cao lớp 12', description: 'Biên soạn bộ tài liệu 400 trang cho ôn thi THPT QG môn Toán, được 5 trường trong tỉnh Đà Nẵng sử dụng.', tech: ['LaTeX', 'GeoGebra', 'Microsoft Word'] },
  ],
  certifications: [
    { id: '1', name: 'Chứng chỉ Nghiệp vụ Sư phạm', issuer: 'Bộ Giáo dục & Đào tạo', date: '2010-07' },
    { id: '2', name: 'Giáo viên dạy giỏi cấp Thành phố', issuer: 'Sở GD&ĐT Đà Nẵng', date: '2019-04' },
  ],
  languages: [
    { id: '1', language: 'Tiếng Việt', level: 'native' },
    { id: '2', language: 'Tiếng Anh', level: 'intermediate' },
  ],
}

export const CV_DEMO_PROFILES: CvDemoProfile[] = [
  { id: 'product-manager',   icon: '📋', label: 'Product Manager',       industry: 'Công nghệ',   data: productManager },
  { id: 'frontend-dev',      icon: '💻', label: 'Frontend Developer',    industry: 'Công nghệ',   data: frontendDev },
  { id: 'ux-designer',       icon: '🎨', label: 'UI/UX Designer',        industry: 'Thiết kế',    data: uxDesigner },
  { id: 'marketing-manager', icon: '📣', label: 'Marketing Manager',     industry: 'Marketing',   data: marketingManager },
  { id: 'accountant',        icon: '📊', label: 'Kế Toán Trưởng',        industry: 'Tài chính',   data: accountant },
  { id: 'hr-manager',        icon: '👥', label: 'HR Manager',            industry: 'Nhân sự',     data: hrManager },
  { id: 'sales-executive',   icon: '🤝', label: 'Key Account Manager',   industry: 'Kinh doanh',  data: salesExecutive },
  { id: 'content-writer',    icon: '✍️', label: 'Content Strategist',    industry: 'Truyền thông',data: contentWriter },
  { id: 'civil-engineer',    icon: '🏗️', label: 'Kỹ Sư Xây Dựng',       industry: 'Kỹ thuật',   data: civilEngineer },
  { id: 'nurse',             icon: '🏥', label: 'Điều Dưỡng Trưởng',    industry: 'Y tế',        data: nurse },
  { id: 'teacher',           icon: '📚', label: 'Giáo Viên Toán THPT',  industry: 'Giáo dục',    data: teacher },
]

// Giữ export cũ cho CvsTemplateGrid
export const CV_DEMO_DATA: CvDataType = productManager
