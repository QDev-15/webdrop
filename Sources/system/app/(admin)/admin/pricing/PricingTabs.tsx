'use client'
import Link from 'next/link'
import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface GroupItem {
  id: number; slug: string; title: string; titleEm: string
  type: string; bg: string; status: string; plansCount: number
  bgLabel: string; typeLabel: string
}
interface FaqItem { id: number; question: string; answer: string; status: string }

export default function PricingTabs({
  initialGroups, initialFaqs,
}: { initialGroups: GroupItem[]; initialFaqs: FaqItem[] }) {
  const searchParams = useSearchParams()
  const [tab, setTab] = useState<'groups' | 'faqs'>(() =>
    searchParams.get('tab') === 'faqs' ? 'faqs' : 'groups'
  )
  const [groups, setGroups] = useState(initialGroups)
  const [faqs, setFaqs] = useState(initialFaqs)

  // FAQ inline add
  const [addingFaq, setAddingFaq] = useState(false)
  const [faqQ, setFaqQ] = useState('')
  const [faqA, setFaqA] = useState('')
  // FAQ inline edit
  const [editingFaq, setEditingFaq] = useState<number | null>(null)
  const [editQ, setEditQ] = useState('')
  const [editA, setEditA] = useState('')

  const [, startTransition] = useTransition()
  const router = useRouter()

  function handleTab(t: 'groups' | 'faqs') {
    setTab(t)
    router.replace(`/admin/pricing?tab=${t}`, { scroll: false })
  }

  const inputCls: React.CSSProperties = {
    width: '100%', padding: '8px 11px', borderRadius: 7,
    border: '1px solid var(--border)', background: 'var(--bg)',
    fontSize: 13, fontFamily: 'var(--sans)', outline: 'none', color: 'var(--text)',
    boxSizing: 'border-box',
  }

  // ── Groups ──────────────────────────────────────────────────
  async function moveGroup(idx: number, dir: -1 | 1) {
    const newList = [...groups]
    const swapIdx = idx + dir
    if (swapIdx < 0 || swapIdx >= newList.length) return
    ;[newList[idx], newList[swapIdx]] = [newList[swapIdx], newList[idx]]
    setGroups(newList)
    await fetch('/api/admin/pricing/groups/reorder', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: newList.map(g => g.id) }),
    })
  }

  async function deleteGroup(id: number, title: string) {
    if (!confirm(`Xóa nhóm "${title}"? Tất cả thẻ giá trong nhóm cũng sẽ bị xóa.`)) return
    await fetch(`/api/admin/pricing/groups/${id}`, { method: 'DELETE' })
    setGroups(prev => prev.filter(g => g.id !== id))
    startTransition(() => router.refresh())
  }

  // ── FAQs ─────────────────────────────────────────────────────
  async function moveFaq(idx: number, dir: -1 | 1) {
    const newList = [...faqs]
    const swapIdx = idx + dir
    if (swapIdx < 0 || swapIdx >= newList.length) return
    ;[newList[idx], newList[swapIdx]] = [newList[swapIdx], newList[idx]]
    setFaqs(newList)
    await fetch('/api/admin/pricing/faqs/reorder', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: newList.map(f => f.id) }),
    })
  }

  async function addFaq() {
    if (!faqQ.trim() || !faqA.trim()) return
    const res = await fetch('/api/admin/pricing/faqs', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: faqQ.trim(), answer: faqA.trim() }),
    })
    const data = await res.json()
    setFaqs(prev => [...prev, { id: data.faq.id, question: data.faq.question, answer: data.faq.answer, status: data.faq.status }])
    setFaqQ(''); setFaqA(''); setAddingFaq(false)
  }

  async function saveEditFaq(id: number) {
    const res = await fetch(`/api/admin/pricing/faqs/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: editQ.trim(), answer: editA.trim() }),
    })
    const data = await res.json()
    setFaqs(prev => prev.map(f => f.id === id ? { ...f, question: data.faq.question, answer: data.faq.answer } : f))
    setEditingFaq(null)
  }

  async function deleteFaq(id: number) {
    if (!confirm('Xóa câu hỏi này?')) return
    await fetch(`/api/admin/pricing/faqs/${id}`, { method: 'DELETE' })
    setFaqs(prev => prev.filter(f => f.id !== id))
  }

  const tabBtnStyle = (active: boolean): React.CSSProperties => ({
    padding: '8px 20px', borderRadius: 8, fontSize: 13, fontWeight: active ? 600 : 400,
    background: active ? 'var(--text)' : 'transparent',
    color: active ? '#fff' : 'var(--text-2)',
    border: active ? 'none' : '1px solid var(--border)',
    cursor: 'pointer', fontFamily: 'var(--sans)',
  })

  return (
    <div className="p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-0 fw-600">Bảng Giá</h4>
          <p className="text-muted small mb-0">Quản lý nhóm giá, thẻ giá và FAQ</p>
        </div>
        {tab === 'groups' && (
          <Link href="/admin/pricing/new"
            style={{ padding: '8px 18px', background: 'var(--text)', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
            + Thêm nhóm
          </Link>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <button style={tabBtnStyle(tab === 'groups')} onClick={() => handleTab('groups')}>📦 Nhóm giá ({groups.length})</button>
        <button style={tabBtnStyle(tab === 'faqs')} onClick={() => handleTab('faqs')}>❓ FAQ ({faqs.length})</button>
      </div>

      {/* ── Groups tab ── */}
      {tab === 'groups' && (
        groups.length === 0 ? (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '48px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>💰</div>
            <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text)', marginBottom: 8 }}>Chưa có nhóm giá nào</div>
            <Link href="/admin/pricing/new" style={{ padding: '10px 24px', background: 'var(--accent)', color: '#fff', borderRadius: 8, fontSize: 13, textDecoration: 'none' }}>Tạo nhóm đầu tiên</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {groups.map((g, idx) => (
              <div key={g.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                {/* Reorder */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <button onClick={() => moveGroup(idx, -1)} disabled={idx === 0} style={{ width: 24, height: 22, border: '1px solid var(--border)', borderRadius: 5, background: 'var(--bg)', cursor: idx === 0 ? 'not-allowed' : 'pointer', fontSize: 11, opacity: idx === 0 ? .4 : 1 }}>▲</button>
                  <button onClick={() => moveGroup(idx, 1)} disabled={idx === groups.length - 1} style={{ width: 24, height: 22, border: '1px solid var(--border)', borderRadius: 5, background: 'var(--bg)', cursor: idx === groups.length - 1 ? 'not-allowed' : 'pointer', fontSize: 11, opacity: idx === groups.length - 1 ? .4 : 1 }}>▼</button>
                </div>
                <div style={{ width: 26, height: 26, borderRadius: 7, background: 'var(--warm)', fontSize: 11, fontWeight: 700, color: 'var(--text-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{idx + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                      {g.title}{g.titleEm ? <em style={{ color: 'var(--accent)', fontWeight: 300 }}> {g.titleEm}</em> : ''}
                    </span>
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: 'var(--warm)', color: 'var(--text-3)', border: '1px solid var(--border)' }}>{g.typeLabel}</span>
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: g.bg === 'dark' ? '#1a1917' : g.bg === 'warm' ? '#f5f0e8' : 'var(--surface)', color: g.bg === 'dark' ? '#fff' : 'var(--text-2)', border: '1px solid var(--border)' }}>Nền {g.bgLabel}</span>
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: g.status === 'published' ? 'var(--accent-light)' : 'var(--warm)', color: g.status === 'published' ? 'var(--accent)' : 'var(--text-3)' }}>
                      {g.status === 'published' ? 'Hiển thị' : 'Ẩn'}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)' }}>/{g.slug} · {g.plansCount} thẻ giá</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Link href={`/admin/pricing/${g.id}/edit`} style={{ padding: '6px 14px', border: '1px solid var(--border)', borderRadius: 7, fontSize: 12, color: 'var(--text-2)', textDecoration: 'none' }}>Chỉnh sửa</Link>
                  <button onClick={() => deleteGroup(g.id, g.title)} style={{ padding: '6px 12px', border: '1px solid #fecaca', borderRadius: 7, fontSize: 12, color: '#dc2626', background: '#fef2f2', cursor: 'pointer' }}>Xóa</button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* ── FAQs tab ── */}
      {tab === 'faqs' && (
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
            {faqs.map((f, idx) => (
              <div key={f.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
                {editingFaq === f.id ? (
                  <div style={{ padding: '14px 16px', background: 'var(--accent-light)' }}>
                    <input style={{ ...inputCls, marginBottom: 8 }} value={editQ} onChange={e => setEditQ(e.target.value)} placeholder="Câu hỏi" autoFocus />
                    <textarea rows={3} style={{ ...inputCls, resize: 'vertical', marginBottom: 8 }} value={editA} onChange={e => setEditA(e.target.value)} placeholder="Câu trả lời" />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => saveEditFaq(f.id)} style={{ flex: 1, padding: '7px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 7, fontSize: 12, cursor: 'pointer' }}>Lưu</button>
                      <button onClick={() => setEditingFaq(null)} style={{ padding: '7px 14px', border: '1px solid var(--border)', background: 'var(--surface)', borderRadius: 7, fontSize: 12, cursor: 'pointer' }}>Hủy</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 }}>
                      <button onClick={() => moveFaq(idx, -1)} disabled={idx === 0} style={{ width: 22, height: 20, border: '1px solid var(--border)', borderRadius: 4, background: 'var(--bg)', cursor: idx === 0 ? 'not-allowed' : 'pointer', fontSize: 10, opacity: idx === 0 ? .4 : 1 }}>▲</button>
                      <button onClick={() => moveFaq(idx, 1)} disabled={idx === faqs.length - 1} style={{ width: 22, height: 20, border: '1px solid var(--border)', borderRadius: 4, background: 'var(--bg)', cursor: idx === faqs.length - 1 ? 'not-allowed' : 'pointer', fontSize: 10, opacity: idx === faqs.length - 1 ? .4 : 1 }}>▼</button>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{f.question}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6 }}>{f.answer}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      <button onClick={() => { setEditingFaq(f.id); setEditQ(f.question); setEditA(f.answer) }} style={{ padding: '4px 10px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 11, cursor: 'pointer', background: 'var(--bg)', color: 'var(--text-2)' }}>Sửa</button>
                      <button onClick={() => deleteFaq(f.id)} style={{ padding: '4px 8px', border: '1px solid #fecaca', borderRadius: 6, fontSize: 11, cursor: 'pointer', color: '#dc2626', background: '#fef2f2' }}>✕</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {faqs.length === 0 && !addingFaq && (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>Chưa có câu hỏi nào</div>
            )}
          </div>

          {addingFaq ? (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px' }}>
              <input style={{ ...inputCls, marginBottom: 8 }} value={faqQ} onChange={e => setFaqQ(e.target.value)} placeholder="Câu hỏi *" autoFocus />
              <textarea rows={3} style={{ ...inputCls, resize: 'vertical', marginBottom: 8 }} value={faqA} onChange={e => setFaqA(e.target.value)} placeholder="Câu trả lời *" />
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={addFaq} disabled={!faqQ.trim() || !faqA.trim()} style={{ flex: 1, padding: '8px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 7, fontSize: 12, cursor: 'pointer', opacity: faqQ.trim() && faqA.trim() ? 1 : .5 }}>+ Thêm câu hỏi</button>
                <button onClick={() => { setAddingFaq(false); setFaqQ(''); setFaqA('') }} style={{ padding: '8px 14px', border: '1px solid var(--border)', background: 'var(--surface)', borderRadius: 7, fontSize: 12, cursor: 'pointer' }}>Hủy</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setAddingFaq(true)} style={{ width: '100%', padding: '10px', border: '1px dashed var(--border)', borderRadius: 10, fontSize: 13, color: 'var(--text-2)', background: 'transparent', cursor: 'pointer' }}>
              + Thêm câu hỏi FAQ
            </button>
          )}
        </div>
      )}
    </div>
  )
}
