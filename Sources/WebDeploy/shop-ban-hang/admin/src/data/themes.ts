// 10 Theme Presets (Identity Tokens) — chỉ đổi màu sắc/hiệu ứng, KHÔNG đổi font/layout.
// Đây là bản sao của website/src/data/themes.ts (2 app build riêng biệt — xem CLAUDE.md).
// Danh sách palette gốc + lý do chọn: xem .claude/rules/design-system.md § "10 Theme Presets".
export interface ThemePreset {
  slug: string
  name: string
  description: string
  vars: Record<string, string>
}

export const THEMES: ThemePreset[] = [
  {
    slug: 'organic-earth',
    name: 'Organic Earth',
    description: 'Terracotta ấm + Sage xanh ô liu — mộc mạc, gần gũi thiên nhiên (mặc định)',
    vars: {
      '--bg': '#f7f3ee', '--surface': '#ffffff', '--dark': '#1e1610', '--dark2': '#2a1e14',
      '--border': '#e8dfd4', '--border-light': '#f0e8df',
      '--text': '#1e1610', '--text-2': '#6a5e52', '--text-3': '#a09384',
      '--accent': '#c4603a', '--accent-h': '#a84e2e', '--accent-light': '#fdf0eb', '--accent-mid': '#d97a58',
      '--sage': '#6b8a7a', '--sage-h': '#557065', '--sage-light': '#edf3f0',
      '--cream-deep': '#f0ebe3', '--terracotta-bg': '#f9e6de',
    },
  },
  {
    slug: 'luxe-dark',
    name: 'Luxe Dark',
    description: 'Nền đen sang trọng + Jade Emerald — cao cấp, huyền bí',
    vars: {
      '--bg': '#0b0d0c', '--surface': '#151815', '--dark': '#000000', '--dark2': '#050605',
      '--border': '#262b26', '--border-light': '#1a1e1b',
      '--text': '#f3f1ed', '--text-2': '#a6a29a', '--text-3': '#6e6b64',
      '--accent': '#0e7c66', '--accent-h': '#0a6552', '--accent-light': '#0f2622', '--accent-mid': '#16a184',
      '--sage': '#c9a24d', '--sage-h': '#a8853d', '--sage-light': '#241d10',
      '--cream-deep': '#191b19', '--terracotta-bg': '#12211d',
    },
  },
  {
    slug: 'soft-pastel',
    name: 'Soft Pastel',
    description: 'Lilac + Mint trên nền trắng ấm — dịu nhẹ, thân thiện',
    vars: {
      '--bg': '#faf8ff', '--surface': '#ffffff', '--dark': '#221b33', '--dark2': '#2c2340',
      '--border': '#e8e2f7', '--border-light': '#f2eefc',
      '--text': '#2a2340', '--text-2': '#6f6685', '--text-3': '#a49bc0',
      '--accent': '#9b7ef0', '--accent-h': '#8464da', '--accent-light': '#f1ecfd', '--accent-mid': '#b39cf5',
      '--sage': '#34c98e', '--sage-h': '#28a475', '--sage-light': '#e6f9f1',
      '--cream-deep': '#f4f1fb', '--terracotta-bg': '#efe9fc',
    },
  },
  {
    slug: 'bold-editorial',
    name: 'Bold Editorial',
    description: 'Scarlet sắc nét trên nền trắng — tương phản cao, phong cách tạp chí',
    vars: {
      '--bg': '#faf9f6', '--surface': '#ffffff', '--dark': '#0f0f0f', '--dark2': '#000000',
      '--border': '#e2e0da', '--border-light': '#eeece6',
      '--text': '#0f0f0f', '--text-2': '#57544d', '--text-3': '#8c8880',
      '--accent': '#d63b1f', '--accent-h': '#b02e16', '--accent-light': '#fceae6', '--accent-mid': '#e2603f',
      '--sage': '#0f0f0f', '--sage-h': '#000000', '--sage-light': '#ececec',
      '--cream-deep': '#f2f0eb', '--terracotta-bg': '#fbe4de',
    },
  },
  {
    slug: 'dark-energy',
    name: 'Dark Energy',
    description: 'Nền tối tuyệt đối + Neon Magenta — trẻ trung, năng lượng cao',
    vars: {
      '--bg': '#0a0710', '--surface': '#150e20', '--dark': '#000000', '--dark2': '#050308',
      '--border': '#2a2038', '--border-light': '#1d1628',
      '--text': '#f4eefb', '--text-2': '#b3a4c9', '--text-3': '#756891',
      '--accent': '#c026d3', '--accent-h': '#9e1cae', '--accent-light': '#241129', '--accent-mid': '#e64fef',
      '--sage': '#7c3aed', '--sage-h': '#5f2bc4', '--sage-light': '#1c1330',
      '--cream-deep': '#120b1a', '--terracotta-bg': '#1f0f27',
    },
  },
  {
    slug: 'clean-corporate',
    name: 'Clean Corporate',
    description: 'Teal/Navy chuyên nghiệp trên nền sáng — đáng tin cậy, chỉn chu',
    vars: {
      '--bg': '#f4f8fb', '--surface': '#ffffff', '--dark': '#0a2129', '--dark2': '#06171d',
      '--border': '#dbe6ec', '--border-light': '#eaf1f5',
      '--text': '#0f2933', '--text-2': '#4d6873', '--text-3': '#8aa0a8',
      '--accent': '#0f6d82', '--accent-h': '#0b5666', '--accent-light': '#e5f2f5', '--accent-mid': '#2e8fa3',
      '--sage': '#0a2129', '--sage-h': '#000000', '--sage-light': '#e1e7ea',
      '--cream-deep': '#eef3f6', '--terracotta-bg': '#dcf0f2',
    },
  },
  {
    slug: 'zen-minimal',
    name: 'Zen Minimal',
    description: 'Sage green tĩnh lặng trên nền warm white — tối giản, thiền định',
    vars: {
      '--bg': '#f7f5f0', '--surface': '#ffffff', '--dark': '#20241f', '--dark2': '#161915',
      '--border': '#e5e1d7', '--border-light': '#efece4',
      '--text': '#20241f', '--text-2': '#66695f', '--text-3': '#9a9c92',
      '--accent': '#6b8067', '--accent-h': '#566853', '--accent-light': '#eaf0e8', '--accent-mid': '#8a9c86',
      '--sage': '#a9906b', '--sage-h': '#8a7355', '--sage-light': '#f2ede4',
      '--cream-deep': '#f0ede4', '--terracotta-bg': '#e4ebe1',
    },
  },
  {
    slug: 'retro-bold',
    name: 'Retro Bold',
    description: 'Teal + Mustard trên nền cream — hoài cổ, cá tính',
    vars: {
      '--bg': '#f5efdd', '--surface': '#fffcf2', '--dark': '#1a2b27', '--dark2': '#101d1a',
      '--border': '#e3d8b8', '--border-light': '#ece3c8',
      '--text': '#1a2b27', '--text-2': '#5c6a5f', '--text-3': '#8f9483',
      '--accent': '#1f7a6b', '--accent-h': '#175f53', '--accent-light': '#e1f0ec', '--accent-mid': '#399685',
      '--sage': '#c98a1f', '--sage-h': '#a86f16', '--sage-light': '#f7ecd6',
      '--cream-deep': '#efe6ca', '--terracotta-bg': '#f2e8c9',
    },
  },
  {
    slug: 'glass-modern',
    name: 'Glass Modern',
    description: 'Xanh dương + tím kiểu glassmorphism — hiện đại, công nghệ',
    vars: {
      '--bg': '#f1f4fd', '--surface': '#ffffff', '--dark': '#161b33', '--dark2': '#0d1022',
      '--border': '#dde3f7', '--border-light': '#eaeefb',
      '--text': '#171b2e', '--text-2': '#565d7d', '--text-3': '#8d92b3',
      '--accent': '#4361ee', '--accent-h': '#3448bf', '--accent-light': '#e8ecfd', '--accent-mid': '#7b8ff5',
      '--sage': '#7209b7', '--sage-h': '#590789', '--sage-light': '#f1e3fb',
      '--cream-deep': '#ecf0fb', '--terracotta-bg': '#e6ecfd',
    },
  },
  {
    slug: 'geometric-modern',
    name: 'Geometric Modern',
    description: 'Cobalt blue có cấu trúc, hình học — mạnh mẽ, hiện đại',
    vars: {
      '--bg': '#f5f7fb', '--surface': '#ffffff', '--dark': '#0a1128', '--dark2': '#050813',
      '--border': '#dde2ee', '--border-light': '#eceff6',
      '--text': '#0a1128', '--text-2': '#4c5570', '--text-3': '#8991a8',
      '--accent': '#1d4fd8', '--accent-h': '#173fac', '--accent-light': '#e7edfc', '--accent-mid': '#4c74e3',
      '--sage': '#0a1128', '--sage-h': '#000000', '--sage-light': '#e4e7ee',
      '--cream-deep': '#eef1f7', '--terracotta-bg': '#dfe7fb',
    },
  },
]

export const DEFAULT_THEME_SLUG = 'organic-earth'
