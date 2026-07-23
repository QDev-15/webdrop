// Toast nhỏ khi thêm vào giỏ — thao tác DOM trực tiếp (giống assets/js/cart-ui.js của bản HTML tĩnh),
// không cần Context/state React riêng vì đây là UI trang trí tạm thời, không thuộc luồng dữ liệu chính.
let hideTimer: ReturnType<typeof setTimeout> | undefined

export function showCartToast(message: string): void {
  let toast = document.querySelector<HTMLDivElement>('.mb-toast')
  if (!toast) {
    toast = document.createElement('div')
    toast.className = 'mb-toast'
    toast.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg><span></span>'
    document.body.appendChild(toast)
  }
  const span = toast.querySelector('span')
  if (span) span.textContent = message
  toast.classList.add('show')
  clearTimeout(hideTimer)
  hideTimer = setTimeout(() => toast?.classList.remove('show'), 2200)
}
