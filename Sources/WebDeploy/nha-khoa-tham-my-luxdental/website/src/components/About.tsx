// USP Feature-Icon-Row section
export default function About() {
  const feats = [
    {
      icon: '🦷',
      title: 'Công nghệ CAD/CAM hiện đại',
      desc: 'Thiết kế và chế tác veneer, mão sứ bằng máy CAD/CAM — độ chính xác tuyệt đối, màu sắc tự nhiên tương đương răng thật.',
    },
    {
      icon: '🔬',
      title: 'Vật liệu sứ nhập khẩu',
      desc: 'Chỉ sử dụng sứ Lithium Disilicate (E.max) và Zirconia từ Đức, Mỹ — độ bền tối đa, không ố vàng theo thời gian.',
    },
    {
      icon: '👨‍⚕️',
      title: 'Đội ngũ bác sĩ đầu ngành',
      desc: 'Bác sĩ chuyên khoa II, thạc sĩ thẩm mỹ nha khoa với hơn 10 năm kinh nghiệm và hàng nghìn ca thực hiện thành công.',
    },
    {
      icon: '🎨',
      title: 'Thiết kế nụ cười cá nhân hóa',
      desc: 'Mỗi nụ cười được thiết kế riêng dựa trên khuôn mặt, màu da, tỷ lệ vàng — không cắt sẵn theo khuôn mẫu.',
    },
    {
      icon: '🛡️',
      title: 'Bảo hành & hậu mãi trọn đời',
      desc: 'Bảo hành kết quả điều trị, kiểm tra định kỳ miễn phí, cam kết đồng hành lâu dài cùng sức khỏe nụ cười của bạn.',
    },
    {
      icon: '🏆',
      title: 'Cơ sở vật chất 5 sao',
      desc: 'Phòng khám thiết kế sang trọng, vô trùng chuẩn bệnh viện quốc tế — mang lại sự thoải mái và an tâm tuyệt đối.',
    },
  ]

  return (
    <section className="sec-pad">
      <div className="wd-container">
        <div className="row gy-4">
          <div className="col-lg-4" data-reveal>
            <div className="lx-eyebrow">Tại sao chọn LuxDental</div>
            <h2 className="lx-title">Chuẩn mực<br /><em>Thẩm mỹ</em><br />Quốc tế</h2>
            <p className="lx-sub" style={{ marginTop: 16 }}>
              Chúng tôi không chỉ điều trị — chúng tôi tạo ra những nụ cười thay đổi cuộc đời, được thực hiện bởi những chuyên gia hàng đầu.
            </p>
            <div className="lx-divider" style={{ marginTop: 28 }} />
          </div>

          <div className="col-lg-8">
            <div className="row gy-3">
              {feats.map((f, i) => (
                <div key={i} className="col-12" data-reveal data-delay={String((i % 3) + 1)}>
                  <div className="lx-feat">
                    <div className="lx-feat-row">
                      <div className="lx-feat-icon" aria-hidden="true">{f.icon}</div>
                      <div>
                        <div className="lx-feat-title">{f.title}</div>
                        <div className="lx-feat-desc">{f.desc}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
