'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { useState, useCallback, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'

const UnsplashPicker = dynamic(() => import('./UnsplashPicker'), { ssr: false })

interface Props {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}

/* ── Toolbar button ── */
function Btn({
  active, disabled, onClick, title, children,
}: {
  active?: boolean; disabled?: boolean; onClick: () => void; title?: string; children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        padding: '4px 8px', minWidth: 30, height: 30, border: 'none', borderRadius: 5,
        background: active ? 'var(--accent-light)' : 'transparent',
        color: active ? 'var(--accent)' : disabled ? 'var(--text-3)' : 'var(--text-2)',
        fontFamily: 'var(--sans)', fontSize: 13, fontWeight: active ? 600 : 400,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all .12s', lineHeight: 1,
      }}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <div style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 3px', alignSelf: 'center' }} />
}

/* ── Link dialog ── */
function LinkDialog({ onConfirm, onCancel, initial }: { onConfirm: (url: string) => void; onCancel: () => void; initial: string }) {
  const [url, setUrl] = useState(initial)
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => { inputRef.current?.focus(); inputRef.current?.select() }, [])
  return (
    <div style={{
      position: 'fixed', zIndex: 9000,
      background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10,
      padding: '12px 14px', boxShadow: '0 8px 24px rgba(0,0,0,.15)', width: 320,
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-2)' }}>URL đường dẫn</label>
      <input
        ref={inputRef}
        value={url}
        onChange={e => setUrl(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); onConfirm(url) } if (e.key === 'Escape') onCancel() }}
        placeholder="https://..."
        style={{ padding: '7px 10px', borderRadius: 7, border: '1px solid var(--border)', background: 'var(--bg)', fontSize: 13, fontFamily: 'var(--sans)', outline: 'none', color: 'var(--text)' }}
      />
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button type="button" onClick={onCancel} style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', fontSize: 12, cursor: 'pointer', color: 'var(--text-2)', fontFamily: 'var(--sans)' }}>Huỷ</button>
        <button type="button" onClick={() => onConfirm(url)} style={{ padding: '6px 14px', borderRadius: 6, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--sans)' }}>Chèn</button>
      </div>
    </div>
  )
}

/* ── Image dialog ── */
function ImageDialog({ onInsert, onCancel, onUnsplash }: { onInsert: (url: string) => void; onCancel: () => void; onUnsplash: () => void }) {
  const [url,         setUrl]         = useState('')
  const [uploading,   setUploading]   = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [dragOver,    setDragOver]    = useState(false)
  const inputRef     = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  useEffect(() => { inputRef.current?.focus() }, [])

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) { setUploadError('Chỉ hỗ trợ file ảnh.'); return }
    setUploading(true); setUploadError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res  = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload thất bại')
      onInsert(data.url as string)
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Upload thất bại')
      setUploading(false)
    }
  }, [onInsert])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file?.type.startsWith('image/')) { handleFile(file); return }
    const urlData = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain')
    if (urlData) setUrl(urlData)
  }, [handleFile])

  return (
    <div style={{
      position: 'fixed', zIndex: 9000,
      background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10,
      padding: '14px 16px', boxShadow: '0 8px 24px rgba(0,0,0,.15)', width: 340,
      display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)' }}>🖼 Chèn ảnh</div>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        style={{
          border: `2px dashed ${dragOver ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: 8, padding: '14px', textAlign: 'center', fontSize: 12,
          color: 'var(--text-3)', background: dragOver ? 'var(--accent-light)' : 'var(--warm)',
          transition: 'all .15s',
        }}
      >
        {uploading ? (
          <div style={{ color: 'var(--accent)', fontSize: 13 }}>⏳ Đang upload...</div>
        ) : (
          <>
            <div style={{ fontSize: 22, marginBottom: 4 }}>⬆️</div>
            <div style={{ fontSize: 12 }}>
              Kéo file ảnh vào đây hoặc{' '}
              <button type="button" onClick={() => fileInputRef.current?.click()}
                style={{ background: 'none', border: 'none', padding: 0, color: 'var(--accent)', cursor: 'pointer', fontSize: 12, fontFamily: 'var(--sans)', textDecoration: 'underline' }}>
                chọn file
              </button>
            </div>
            <div style={{ marginTop: 6, color: 'var(--text-3)', fontSize: 11 }}>
              hoặc{' '}
              <button type="button" onClick={onUnsplash}
                style={{ background: 'none', border: 'none', padding: 0, color: 'var(--accent)', cursor: 'pointer', fontSize: 11, fontFamily: 'var(--sans)', textDecoration: 'underline' }}>
                tìm ảnh Unsplash miễn phí
              </button>
            </div>
          </>
        )}
      </div>

      {uploadError && (
        <div style={{ fontSize: 11, color: 'var(--danger)', padding: '5px 8px', background: '#fef2f2', borderRadius: 6, border: '1px solid #fecaca' }}>
          {uploadError}
        </div>
      )}

      {/* URL input */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          ref={inputRef}
          value={url}
          onChange={e => setUrl(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (url) onInsert(url) } if (e.key === 'Escape') onCancel() }}
          placeholder="Hoặc paste URL ảnh trực tiếp..."
          style={{ flex: 1, padding: '7px 10px', borderRadius: 7, border: '1px solid var(--border)', background: 'var(--bg)', fontSize: 12, fontFamily: 'var(--sans)', outline: 'none', color: 'var(--text)' }}
        />
        <button type="button" disabled={!url} onClick={() => url && onInsert(url)}
          style={{ padding: '7px 12px', borderRadius: 7, border: 'none', background: url ? 'var(--accent)' : 'var(--warm2)', color: url ? '#fff' : 'var(--text-3)', fontSize: 12, cursor: url ? 'pointer' : 'not-allowed', fontFamily: 'var(--sans)', flexShrink: 0 }}>
          Chèn
        </button>
      </div>

      <button type="button" onClick={onCancel} style={{ padding: '5px', borderRadius: 6, border: 'none', background: 'transparent', fontSize: 12, cursor: 'pointer', color: 'var(--text-3)', fontFamily: 'var(--sans)', textAlign: 'left' }}>← Huỷ</button>

      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }} />
    </div>
  )
}

/* ── Anchored dialog wrapper — positions dialog below a ref button ── */
function AnchoredDialog({ anchorRef, children, onClose }: {
  anchorRef: React.RefObject<HTMLDivElement | null>
  children: React.ReactNode
  onClose: () => void
}) {
  const [pos, setPos] = useState({ top: 0, left: 0 })

  useEffect(() => {
    const el = anchorRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const dialogWidth = 340
    let left = rect.left
    if (left + dialogWidth > window.innerWidth - 16) left = rect.right - dialogWidth
    setPos({ top: rect.bottom + 6, left: Math.max(8, left) })
  }, [anchorRef])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (anchorRef.current && !anchorRef.current.contains(e.target as Node)) onClose()
    }
    setTimeout(() => document.addEventListener('mousedown', handler), 0)
    return () => document.removeEventListener('mousedown', handler)
  }, [anchorRef, onClose])

  return (
    <div style={{ position: 'fixed', top: pos.top, left: pos.left, zIndex: 9000 }}>
      {children}
    </div>
  )
}

/* ── Main RichEditor ── */
export default function RichEditor({ value, onChange, placeholder }: Props) {
  const [htmlMode, setHtmlMode]         = useState(false)
  const [htmlSource, setHtmlSource]     = useState(value)
  const [showLink, setShowLink]         = useState(false)
  const [showImage, setShowImage]       = useState(false)
  const [showUnsplash, setShowUnsplash] = useState(false)
  const linkBtnRef  = useRef<HTMLDivElement>(null)
  const imageBtnRef = useRef<HTMLDivElement>(null)

  // Always-fresh onChange ref — prevents stale closure in onUpdate
  const onChangeRef = useRef(onChange)
  useEffect(() => { onChangeRef.current = onChange }, [onChange])

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false, autolink: true }),
      Image.configure({ inline: false, allowBase64: false }),
      Placeholder.configure({ placeholder: placeholder || 'Viết nội dung bài viết...' }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChangeRef.current(editor.getHTML())
    },
    editorProps: {
      attributes: { class: 'rich-editor-content' },
    },
    immediatelyRender: false,
  })

  // Sync when value prop changes externally (e.g. load edit data)
  const prevValueRef = useRef(value)
  useEffect(() => {
    if (!editor || value === prevValueRef.current) return
    prevValueRef.current = value
    setHtmlSource(value)
    if (editor.getHTML() !== value) editor.commands.setContent(value)
  }, [editor, value])

  const enterHtmlMode = useCallback(() => {
    if (!editor) return
    const html = editor.getHTML()
    setHtmlSource(html)
    setHtmlMode(true)
  }, [editor])

  const exitHtmlMode = useCallback(() => {
    if (!editor) return
    editor.commands.setContent(htmlSource)
    onChangeRef.current(htmlSource)
    setHtmlMode(false)
  }, [editor, htmlSource])

  const insertLink = useCallback((url: string) => {
    if (!editor) return
    const href = url.trim()
    if (!href) { editor.chain().focus().unsetLink().run() }
    else { editor.chain().focus().setLink({ href }).run() }
    setShowLink(false)
  }, [editor])

  const insertImage = useCallback((url: string) => {
    if (!editor || !url.trim()) return
    editor.chain().focus().setImage({ src: url.trim() }).run()
    setShowImage(false)
    setShowUnsplash(false)
  }, [editor])

  // Loading placeholder
  if (!editor) {
    return (
      <div style={{ border: '1px solid var(--border)', borderRadius: 10, background: 'var(--surface)' }}>
        <div style={{ height: 42, background: 'var(--bg)', borderRadius: '10px 10px 0 0', borderBottom: '1px solid var(--border)' }} />
        <div style={{ minHeight: 360, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 13, color: 'var(--text-3)' }}>Đang tải editor...</span>
        </div>
      </div>
    )
  }

  const isActive = (name: string, attrs?: Record<string, unknown>) => editor.isActive(name, attrs)
  const currentLink = editor.getAttributes('link').href || ''
  const canUndo = editor.can().undo()
  const canRedo = editor.can().redo()

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'visible', background: 'var(--surface)' }}>

      {/* Toolbar */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, padding: '6px 10px',
        borderBottom: '1px solid var(--border)', background: 'var(--bg)', borderRadius: '10px 10px 0 0',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <Btn active={isActive('bold')}      onClick={() => editor.chain().focus().toggleBold().run()}      title="Bold (Ctrl+B)"><strong>B</strong></Btn>
        <Btn active={isActive('italic')}    onClick={() => editor.chain().focus().toggleItalic().run()}    title="Italic (Ctrl+I)"><em>I</em></Btn>
        <Btn active={isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline (Ctrl+U)"><u>U</u></Btn>
        <Btn active={isActive('strike')}    onClick={() => editor.chain().focus().toggleStrike().run()}    title="Strikethrough"><s>S</s></Btn>
        <Btn active={isActive('code')}      onClick={() => editor.chain().focus().toggleCode().run()}      title="Inline code">`</Btn>

        <Divider />

        <Btn active={isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} title="Heading 1">H1</Btn>
        <Btn active={isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Heading 2">H2</Btn>
        <Btn active={isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="Heading 3">H3</Btn>

        <Divider />

        <Btn active={isActive('bulletList')}  onClick={() => editor.chain().focus().toggleBulletList().run()}  title="Bullet list">• —</Btn>
        <Btn active={isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Ordered list">1.—</Btn>

        <Divider />

        <Btn active={isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Blockquote">&ldquo;</Btn>
        <Btn active={isActive('codeBlock')}  onClick={() => editor.chain().focus().toggleCodeBlock().run()}  title="Code block">{'{ }'}</Btn>
        <Btn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal rule">—</Btn>

        <Divider />

        {/* Link */}
        <div ref={linkBtnRef} style={{ position: 'relative' }}>
          <Btn active={isActive('link')} onClick={() => { setShowImage(false); setShowLink(v => !v) }} title="Insert link">🔗</Btn>
        </div>

        {/* Image */}
        <div ref={imageBtnRef} style={{ position: 'relative' }}>
          <Btn onClick={() => { setShowLink(false); setShowImage(v => !v) }} title="Insert image">🖼</Btn>
        </div>

        <Divider />

        <Btn disabled={!canUndo} onClick={() => editor.chain().focus().undo().run()} title="Undo (Ctrl+Z)">↩</Btn>
        <Btn disabled={!canRedo} onClick={() => editor.chain().focus().redo().run()} title="Redo (Ctrl+Y)">↪</Btn>

        <Divider />

        <Btn active={htmlMode} onClick={htmlMode ? exitHtmlMode : enterHtmlMode} title="Xem/sửa HTML nguồn">{'</>'}</Btn>
      </div>

      {/* Editor area */}
      {htmlMode ? (
        <textarea
          value={htmlSource}
          onChange={e => { setHtmlSource(e.target.value); onChangeRef.current(e.target.value) }}
          style={{
            width: '100%', minHeight: 360, padding: '16px',
            border: 'none', outline: 'none', resize: 'vertical',
            fontFamily: 'monospace', fontSize: 12, lineHeight: 1.7,
            background: '#1e1e1e', color: '#d4d4d4',
            borderRadius: '0 0 10px 10px', boxSizing: 'border-box',
          }}
          spellCheck={false}
        />
      ) : (
        <EditorContent editor={editor} />
      )}

      {/* Anchored dialogs */}
      {showLink && (
        <AnchoredDialog anchorRef={linkBtnRef} onClose={() => setShowLink(false)}>
          <LinkDialog initial={currentLink} onConfirm={insertLink} onCancel={() => setShowLink(false)} />
        </AnchoredDialog>
      )}
      {showImage && (
        <AnchoredDialog anchorRef={imageBtnRef} onClose={() => setShowImage(false)}>
          <ImageDialog
            onInsert={insertImage}
            onCancel={() => setShowImage(false)}
            onUnsplash={() => { setShowImage(false); setShowUnsplash(true) }}
          />
        </AnchoredDialog>
      )}

      {showUnsplash && (
        <UnsplashPicker
          onSelect={url => insertImage(url)}
          onClose={() => setShowUnsplash(false)}
        />
      )}

      {/* React 19 deduped style */}
      <style href="rich-editor-styles" precedence="default">{`
        .rich-editor-content {
          min-height: 360px;
          padding: 20px 24px;
          outline: none;
          font-family: var(--sans);
          font-size: 15px;
          line-height: 1.75;
          color: var(--text);
          border-radius: 0 0 10px 10px;
        }
        .rich-editor-content p { margin: 0 0 12px; }
        .rich-editor-content p:last-child { margin-bottom: 0; }
        .rich-editor-content h1 { font-size: 28px; font-weight: 700; margin: 28px 0 12px; letter-spacing: -.4px; }
        .rich-editor-content h2 { font-size: 22px; font-weight: 600; margin: 24px 0 10px; }
        .rich-editor-content h3 { font-size: 17px; font-weight: 600; margin: 20px 0 8px; }
        .rich-editor-content ul, .rich-editor-content ol { padding-left: 24px; margin: 0 0 12px; }
        .rich-editor-content li { margin: 4px 0; }
        .rich-editor-content blockquote {
          border-left: 3px solid var(--accent); margin: 16px 0;
          padding: 8px 16px; background: var(--accent-light);
          border-radius: 0 8px 8px 0; color: var(--text-2); font-style: italic;
        }
        .rich-editor-content code {
          background: var(--warm2); color: var(--accent);
          padding: 2px 6px; border-radius: 4px; font-size: 13px; font-family: monospace;
        }
        .rich-editor-content pre {
          background: #1e1e1e; color: #d4d4d4; padding: 16px 20px;
          border-radius: 8px; overflow-x: auto; margin: 16px 0; font-size: 13px;
        }
        .rich-editor-content pre code { background: none; color: inherit; padding: 0; }
        .rich-editor-content a { color: var(--accent); text-decoration: underline; }
        .rich-editor-content img { max-width: 100%; border-radius: 8px; margin: 12px 0; display: block; }
        .rich-editor-content hr { border: none; border-top: 2px solid var(--border); margin: 24px 0; }
        .rich-editor-content strong { font-weight: 600; }
        .rich-editor-content .is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left; color: var(--text-3); pointer-events: none; height: 0;
        }
      `}</style>
    </div>
  )
}
