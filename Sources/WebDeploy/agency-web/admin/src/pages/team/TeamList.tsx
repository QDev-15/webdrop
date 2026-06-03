import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Member { id: number; name: string; position: string; avatar: string; sort_order: number; status: string }

export default function TeamList() {
  const [items, setItems] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const load = () => { setLoading(true); api.get<Member[]>('/team-members').then(setItems).catch(() => {}).finally(() => setLoading(false)) }
  useEffect(load, [])
  const del = async (id: number) => { if (!confirm('Xóa thành viên?')) return; await api.delete(`/team-members/${id}`); load() }

  return (
    <>
      <div className="page-hd">
        <div><h1 className="page-hd-title">Đội ngũ</h1></div>
        <Link to="/team/new" className="btn btn-primary">+ Thêm thành viên</Link>
      </div>
      <div className="card">
        {loading ? <p className="text-muted">Đang tải...</p> : (
          <div className="tbl-wrap">
            <table>
              <thead><tr><th>#</th><th>Avatar</th><th>Tên</th><th>Chức vụ</th><th>Thứ tự</th><th>Trạng thái</th><th></th></tr></thead>
              <tbody>
                {items.map(m => (
                  <tr key={m.id}>
                    <td>{m.id}</td>
                    <td>{m.avatar && <img src={m.avatar} alt="" className="img-preview" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />}</td>
                    <td className="td-name">{m.name}</td>
                    <td>{m.position}</td>
                    <td>{m.sort_order}</td>
                    <td><span className={`badge badge-${m.status}`}>{m.status}</span></td>
                    <td>
                      <div className="d-flex gap-2">
                        <Link to={`/team/${m.id}/edit`} className="btn btn-ghost btn-sm">Sửa</Link>
                        <button onClick={() => del(m.id)} className="btn btn-danger btn-sm">Xóa</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!items.length && <tr><td colSpan={7} className="text-center text-muted" style={{ padding: '32px' }}>Chưa có thành viên.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
