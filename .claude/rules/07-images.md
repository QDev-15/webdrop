---
description: Nguồn ảnh Unsplash, image IDs đang dùng, CSS rules cho ảnh trong webdrop.vn
globs: "*.html,*.css"
alwaysApply: false
---

# Images & Media

## Nguồn Ảnh

**Unsplash** (free, high quality):
```
https://images.unsplash.com/photo-{ID}?w={width}&q=80&auto=format&fit=crop
```

| Vị trí | Query params |
|---|---|
| Hero / fullwidth | `?w=1400&q=70` |
| Section wide | `?w=1200&q=80` |
| Card thumbnail | `?w=600&q=80` |
| Avatar | `?w=100&q=80&fit=crop&crop=face` |

## Image IDs Đang Dùng

| Vị trí | Photo ID | Mô tả |
|---|---|---|
| Slide 1 bg | `1547658719-da2b51169166` | Web design workspace |
| Slide 2 bg | `1460925895917-afdab827c52f` | Analytics screen |
| Slide 3 bg | `1558655146-d09347e92766` | Design tool |
| Slide 4 bg | `1553484771-371a605b060b` | Business planning |
| Slide 5 bg | `1521737711867-e3b97375f902` | Team meeting |
| How it works | `1498050108023-c5249f4df085` | Laptop workspace |
| Card 1 (Cty) | `1467232004584-a241de8bcf5d` | Corporate web |
| Card 2 (Portfolio) | `1545665277-5937489579f2` | Dark portfolio |
| Card 3 (F&B) | `1414235077428-338989a2e8c0` | Restaurant |
| Card 4 (Blog) | `1499750310107-5fef28a66643` | Blog writing |
| Card 5 (Spa) | `1544161515-4ab6ce6db874` | Spa treatment |
| Card 6 (Forum) | `1522202176988-66273c2fd55f` | Team community |
| Why us banner | `1600880292203-757bb62b4baf` | Office team |
| Footer strip | `1497366216548-37526070297c` | Modern office |
| Avatar 1 | `1507003211169-0a1dd7228f2d` | Male portrait |
| Avatar 2 | `1494790108377-be9c29b29330` | Female portrait |
| Avatar 3 | `1472099645785-5658abf4ff4e` | Male casual |

## CSS Image Rules

```css
/* Container cố định — luôn dùng object-fit */
img { display: block; width: 100%; height: 100%; object-fit: cover; }

/* Thumbnail card zoom on hover */
.card-thumb { overflow: hidden; }
.card-thumb img { transition: transform 0.4s ease; }
.card:hover .card-thumb img { transform: scale(1.06); }

/* Avatar tròn */
.avatar img { width: 34px; height: 34px; border-radius: 50%; object-fit: cover; }
```

Không load ảnh quá lớn cho thumbnail. Card 300px không cần ảnh 2000px. Dùng `loading="lazy"` cho ảnh dưới fold.
