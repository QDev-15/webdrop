---
description: Component library chính thức — button, card, badge, pill, form input cho webdrop.vn
globs: "*.html,*.css,*.tsx,*.jsx"
alwaysApply: false
---

# Component Library

## Buttons

```css
/* Base structure chung */
.btn-primary, .btn-accent, .btn-outline, .btn-ghost {
  padding: 12px 24px; border-radius: 9px;
  font-size: 13.5px; font-weight: 500; font-family: var(--sans);
  border: none; cursor: pointer; transition: all 0.2s;
  display: inline-flex; align-items: center; gap: 7px;
}

/* Dark */
.btn-primary { background: var(--text); color: #fff; }
.btn-primary:hover { background: #3f3f46; transform: translateY(-1px); }

/* Accent Green */
.btn-accent { background: var(--accent); color: #fff; }
.btn-accent:hover { background: var(--accent-h); transform: translateY(-1px); }

/* Outline */
.btn-outline { background: transparent; color: var(--text); border: 1px solid var(--border); }
.btn-outline:hover { background: var(--warm); }

/* Ghost — dùng trên dark background */
.btn-ghost { background: transparent; color: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.2); }
.btn-ghost:hover { border-color: rgba(255,255,255,0.6); color: #fff; }
```

## Cards

```css
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 24px;
  transition: transform 0.28s cubic-bezier(0.16,1,0.3,1),
              box-shadow 0.28s, border-color 0.2s;
}
.card:hover {
  transform: translateY(-7px);
  box-shadow: 0 20px 52px rgba(0,0,0,0.10);
  border-color: transparent;
}
```

## Badges & Tags

```css
/* Badge nhỏ (eyebrow area) */
.badge {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 11px; font-weight: 500;
  padding: 3px 10px; border-radius: 20px;
}
.badge-green { background: var(--accent-light); color: var(--accent); }
.badge-dark  { background: var(--text); color: #fff; }

/* Pill / Filter tag */
.pill {
  font-size: 12.5px; padding: 7px 16px;
  border-radius: 20px; border: 1px solid var(--border);
  background: var(--surface); color: var(--text-2);
  cursor: pointer; transition: all 0.15s;
}
.pill.active { background: var(--text); color: #fff; border-color: var(--text); }
.pill:hover:not(.active) { border-color: var(--text-2); color: var(--text); }
```

## Form Elements

```css
.input {
  height: 40px; border: 1px solid var(--border);
  border-radius: 8px; padding: 0 12px;
  font-size: 14px; font-family: var(--sans);
  background: var(--surface); color: var(--text);
  transition: border-color 0.15s, box-shadow 0.15s;
  outline: none; width: 100%;
}
.input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(26,107,82,0.08);
}
.input.error {
  border-color: #e24b4a;
  box-shadow: 0 0 0 3px rgba(226,75,74,0.08);
}
.input::placeholder { color: var(--text-3); }
```
