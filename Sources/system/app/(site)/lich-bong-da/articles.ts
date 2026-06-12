export interface Article {
  slug: string
  title: string
  excerpt: string
  content: string
  thumbnail: string
  thumbnailAlt: string
  category: string
  readTime: number
  publishedAt: string
  views: number
  author: string
}

export const ARTICLES: Article[] = [
  {
    slug: 'ung-vien-vo-dich-wc-2026',
    title: 'Top 5 ứng viên sáng giá nhất cho ngôi vô địch World Cup 2026',
    excerpt: 'Phân tích chi tiết 5 đội bóng có cơ hội cao nhất đăng quang tại giải đấu 48 đội đầu tiên trong lịch sử, tổ chức tại Bắc Mỹ.',
    thumbnail: 'https://images.unsplash.com/photo-1574629810-c1bff4c64edc?w=800&q=80',
    thumbnailAlt: 'Các ứng viên vô địch World Cup 2026',
    category: 'Dự đoán',
    readTime: 7,
    publishedAt: '2026-06-10',
    views: 18540,
    author: 'Ban Biên Tập',
    content: `
<h2>Cuộc chiến vương quyền trên đất Bắc Mỹ</h2>
<p>World Cup 2026 — giải đấu lớn nhất hành tinh với 48 đội tham dự lần đầu tiên trong lịch sử — đang bước vào giai đoạn cao điểm trên các sân vận động trải dài từ Canada qua Mỹ đến Mexico. Dù bất ngờ luôn là đặc sản của World Cup, giới chuyên môn vẫn nhận định 5 đội sau đây sẽ là những ứng viên nặng ký nhất cho ngôi quán quân.</p>

<h3>1. Pháp — Ứng viên số 1 của giới chuyên môn</h3>
<p>Les Bleus sở hữu thế hệ cầu thủ vàng hiếm có: Kylian Mbappé (27 tuổi) đang ở đỉnh phong độ tại Real Madrid, Antoine Griezmann vẫn là bộ não của hàng công, còn thế hệ trẻ như Bradley Barcola và Mike Maignan đang nổi lên mạnh mẽ. Hàng thủ Pháp với Dayot Upamecano và William Saliba được đánh giá là bộ đôi trung vệ tốt nhất thế giới hiện tại. Chỉ có sự thiếu ổn định tâm lý trong các trận đấu lớn mới là điểm yếu duy nhất của đoàn quân HLV Didier Deschamps.</p>

<h3>2. Brazil — Cơn khát 24 năm</h3>
<p>Kể từ lần cuối vô địch năm 2002, Brazil đã trải qua quá nhiều nỗi đau: thảm bại 1–7 trước Đức năm 2014 ngay trên sân nhà, liên tiếp thất bại ở tứ kết và bán kết các kỳ sau đó. WC 2026 được kỳ vọng là thời điểm Vinicius Jr., Rodrygo và Endrick cùng nhau viết nên lịch sử. Nếu cỗ máy tấn công của Seleção vào guồng, đây sẽ là đội nguy hiểm nhất giải đấu.</p>

<h3>3. Tây Ban Nha — Lò đào tạo vô địch liên tiếp</h3>
<p>Sau chức vô địch Euro 2024, La Roja đang trong giai đoạn hưng thịnh nhất kể từ thời Iniesta–Xavi. Lamine Yamal (18 tuổi) đã trưởng thành vượt bậc, Pedri và Fabián Ruiz kiểm soát nhịp chơi tuyệt đối, trong khi Álvaro Morata vẫn là mũi nhọn tin cậy trên hàng công. Lối chơi tikitaka hiện đại của HLV Luis de la Fuente khó bị bắt bài.</p>

<h3>4. Anh — 60 năm chờ đợi</h3>
<p>Jude Bellingham, Harry Kane, Bukayo Saka và Phil Foden tạo thành bộ tứ tấn công đáng sợ nhất mà người Anh từng có. Sau lần đứng thứ 4 tại WC 2018 và á quân Euro 2020, 2024, "đội tuyển của bóng đá" đang gõ cửa ngôi vương. Áp lực từ 60 năm chờ đợi kể từ 1966 đang là con dao hai lưỡi.</p>

<h3>5. Argentina — Nhà vô địch bảo vệ ngôi báu</h3>
<p>Dù Lionel Messi đã ở cuối sự nghiệp quốc tế, Argentina vẫn là đội không thể xem thường. Julian Álvarez đã trưởng thành trở thành trung phong đẳng cấp thế giới, Rodrigo De Paul kiểm soát trung tuyến đẳng cấp, còn thủ thành Emiliano Martínez vẫn là bức tường thành vững chắc nhất thế giới. Đương kim vô địch luôn nguy hiểm.</p>
    `,
  },
  {
    slug: 'kylian-mbappe-qua-bong-vang',
    title: 'Kylian Mbappé — Siêu sao người Pháp và giấc mơ Quả Bóng Vàng',
    excerpt: 'Ở tuổi 27, Mbappé đang trong giai đoạn chín nhất của sự nghiệp. World Cup 2026 là sân khấu hoàn hảo để anh ghi tên vào lịch sử.',
    thumbnail: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800&q=80',
    thumbnailAlt: 'Kylian Mbappé World Cup 2026',
    category: 'Cầu thủ',
    readTime: 5,
    publishedAt: '2026-06-09',
    views: 16780,
    author: 'Phòng Thể Thao',
    content: `
<h2>Hành trình từ thiên tài trẻ đến hoàng đế bóng đá</h2>
<p>Kylian Mbappé bước vào World Cup 2026 với tư cách là cầu thủ xuất sắc nhất thế giới. Sau khi chuyển từ PSG sang Real Madrid vào năm 2024, anh đã có mùa giải bùng nổ với 35 bàn tại La Liga và giúp Los Blancos bảo vệ chức vô địch Champions League. Nhưng điều mà Mbappé khao khát nhất vẫn là danh hiệu World Cup thứ hai cùng tuyển Pháp.</p>

<h3>Hành trình World Cup của Mbappé</h3>
<p>Năm 2018 tại Nga, Mbappé (19 tuổi) đã trở thành người trẻ thứ hai trong lịch sử sau Pelé ghi bàn tại chung kết World Cup. Tại Qatar 2022, dù Pháp thua Argentina trên chấm phạt đền, Mbappé vẫn ghi 8 bàn và nhận giải Vua phá lưới. Bây giờ, ở tuổi 27, với kinh nghiệm dày dạn và phong độ đỉnh cao tại Real Madrid, đây là thời điểm tốt nhất của anh.</p>

<h3>Tại sao Mbappé là ứng viên số 1 Quả Bóng Vàng?</h3>
<p>Quả Bóng Vàng từ trước đến nay luôn ưu tiên những cầu thủ tỏa sáng tại World Cup. Nếu Mbappé dẫn dắt Pháp vô địch và giành danh hiệu Vua phá lưới, không có gì có thể ngăn anh đoạt danh hiệu cao quý nhất làng túc cầu lần thứ hai sau 2024. Tốc độ, kỹ thuật và khả năng quyết định trong những khoảnh khắc quan trọng làm cho anh trở thành cầu thủ hoàn hảo nhất cho những giải đấu lớn.</p>

<h3>Thách thức từ các đối thủ</h3>
<p>Mbappé sẽ phải cạnh tranh quyết liệt với Vinicius Jr. của Brazil — người đang có phong độ bùng nổ tại Real Madrid, cùng Lamine Yamal của Tây Ban Nha — thần đồng 18 tuổi đang làm mưa làm gió trên các sân cỏ châu Âu. Cuộc chiến Quả Bóng Vàng 2026 hứa hẹn là một trong những cuộc đua hấp dẫn nhất lịch sử.</p>
    `,
  },
  {
    slug: 'vinicius-jr-brazil-wc-2026',
    title: 'Vinicius Jr. và áp lực gánh trên vai cả một đế chế Brazil',
    excerpt: 'Cầu thủ xuất sắc nhất Nam Mỹ đang mang trên vai kỳ vọng của 215 triệu người Brazil. WC 2026 là sân khấu để anh chứng tỏ đẳng cấp world class.',
    thumbnail: 'https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?w=800&q=80',
    thumbnailAlt: 'Vinicius Jr. Brazil World Cup 2026',
    category: 'Cầu thủ',
    readTime: 5,
    publishedAt: '2026-06-08',
    views: 14230,
    author: 'Phòng Thể Thao',
    content: `
<h2>Ngôi sao của Seleção trong kỳ World Cup lịch sử</h2>
<p>Vinicius Jr. (25 tuổi) đang ở trong thời kỳ đỉnh cao của sự nghiệp. Cầu thủ người Brazil tại Real Madrid này đã giành Quả Bóng Vàng năm 2024, trở thành người Brazil đầu tiên đoạt giải thưởng danh giá này sau Ronaldo (R9) năm 2002. Nhưng một thứ vẫn còn thiếu trong bộ sưu tập danh hiệu của anh: chức vô địch World Cup cùng Seleção.</p>

<h3>Từ thiếu niên Flamengo đến siêu sao thế giới</h3>
<p>Vinicius gia nhập Real Madrid năm 17 tuổi với giá 45 triệu euro — con số mà nhiều người cho là đắt. Nhưng sau 7 năm, anh đã trả lời bằng 2 danh hiệu Champions League, 2 La Liga và Quả Bóng Vàng đầu tiên. Sự kết hợp giữa tốc độ chóng mặt, kỹ thuật điêu luyện và khả năng dứt điểm ngày càng sắc bén của anh khiến hàng thủ đối phương bất lực.</p>

<h3>Brazil cần Vinicius gánh vác như thế nào?</h3>
<p>Kể từ thảm họa 1–7 trước Đức năm 2014, Brazil liên tục thất bại khi về đích mà không có danh hiệu. Cỗ máy tấn công gồm Vinicius–Rodrygo–Endrick được kỳ vọng sẽ phá vỡ lời nguyền này. Đặc biệt, WC 2026 diễn ra tại Bắc Mỹ — không phải sân nhà nhưng cũng không phải đất khách hoàn toàn với hàng triệu kiều bào Brazil tại Mỹ.</p>

<h3>Ứng viên Quả Bóng Vàng 2026</h3>
<p>Nếu Brazil vô địch và Vinicius tỏa sáng xuyên suốt, anh gần như chắc chắn sẽ đoạt Quả Bóng Vàng lần thứ hai. Lịch sử cho thấy không có gì thay thế được một chức vô địch World Cup trong mắt Hội đồng bình chọn France Football. Đây là lý do tại sao mùa hè 2026 có thể là thời điểm quyết định sự nghiệp của Vinicius Jr.</p>
    `,
  },
  {
    slug: 'lamine-yamal-than-dong-tay-ban-nha',
    title: 'Lamine Yamal — Thần đồng 18 tuổi và sứ mệnh lịch sử cùng La Roja',
    excerpt: 'Sinh năm 2007, Yamal là cầu thủ trẻ nhất từng thi đấu tại Euro và ghi bàn tại giải đấu này. WC 2026 là chặng tiếp theo trong hành trình huyền thoại.',
    thumbnail: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&q=80',
    thumbnailAlt: 'Lamine Yamal Tây Ban Nha World Cup 2026',
    category: 'Cầu thủ',
    readTime: 4,
    publishedAt: '2026-06-07',
    views: 13890,
    author: 'Phòng Thể Thao',
    content: `
<h2>Cậu bé sinh năm 2007 đang thay đổi bóng đá thế giới</h2>
<p>Lamine Yamal bước vào World Cup 2026 ở tuổi 18 — cùng độ tuổi Pelé vô địch World Cup 1958 và Kylian Mbappé vô địch World Cup 2018. Sự so sánh này không phải ngẫu nhiên: cậu thiếu niên người Maroc-Tây Ban Nha đang được xem là tài năng hiếm có nhất từ thời Messi và Ronaldo nổi lên ở đầu thế kỷ 21.</p>

<h3>Những kỷ lục đã phá vỡ</h3>
<p>Yamal trở thành cầu thủ trẻ nhất ghi bàn tại Euro trong kỳ Euro 2024 — khi đó chỉ vừa tròn 17 tuổi. Anh cũng là cầu thủ trẻ nhất ra sân cho Tây Ban Nha ở giải đấu cấp ĐTQG. Tại Barcelona, mùa giải 2025–26, anh đã ghi 22 bàn và kiến tạo 18 bàn tại La Liga — số liệu ngang bằng những siêu sao dày dặn kinh nghiệm.</p>

<h3>Phong cách chơi bóng hút mắt</h3>
<p>Yamal là tiền vệ cánh phải nhưng không ngại đảo cánh hoặc vào trung lộ. Kỹ thuật bóng cực kỳ điêu luyện, khả năng rê bóng tốc độ cao, và đặc biệt là tư duy bóng đá đẳng cấp giúp anh tạo ra những tình huống không thể dự đoán trước. Chân trái của Yamal được mệnh danh là "chân phép thuật" trên các mặt báo Tây Ban Nha.</p>

<h3>Tây Ban Nha cần anh thế nào?</h3>
<p>La Roja đang trong thời kỳ hưng thịnh nhất kể từ kỷ nguyên Xavi–Iniesta. Với Yamal ở cánh phải, Pedri ở giữa sân và Morata dứt điểm trên hàng công, Tây Ban Nha có cỗ máy tấn công hoàn hảo. Nếu World Cup 2026 là của Tây Ban Nha, Yamal sẽ là người ghi danh vào lịch sử như người trẻ nhất vô địch giải đấu này.</p>
    `,
  },
  {
    slug: 'jude-bellingham-hy-vong-nuoc-anh',
    title: 'Jude Bellingham — Ngôi sao của nước Anh và 60 năm chờ đợi',
    excerpt: 'Sau 1966, nước Anh chưa bao giờ chạm đến chức vô địch World Cup. Bellingham (22 tuổi) là hy vọng lớn nhất để thay đổi lịch sử.',
    thumbnail: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80',
    thumbnailAlt: 'Jude Bellingham tuyển Anh World Cup 2026',
    category: 'Cầu thủ',
    readTime: 5,
    publishedAt: '2026-06-06',
    views: 11670,
    author: 'Phòng Thể Thao',
    content: `
<h2>Thế hệ vàng và áp lực lịch sử</h2>
<p>Jude Bellingham (22 tuổi) đang bước vào World Cup 2026 với vị thế cầu thủ hay nhất nước Anh kể từ thời Paul Gascoigne và Steven Gerrard. Tiền vệ của Real Madrid này đã chứng minh mình là cầu thủ hoàn chỉnh nhất thế hệ: biết ghi bàn, biết kiến tạo, biết phòng thủ, và quan trọng nhất — luôn sẵn sàng lãnh đạo trong những khoảnh khắc quyết định.</p>

<h3>Mùa giải đáng nhớ tại Real Madrid</h3>
<p>Kể từ khi chuyển từ Dortmund về Madrid năm 2023, Bellingham liên tục là nhân tố chủ chốt trong những chiến thắng quan trọng nhất của Los Blancos. Mùa 2025–26, anh ghi 24 bàn và kiến tạo 16 bàn — con số thuần túy của một tiền đạo cắm, chứ không phải tiền vệ. Khả năng ghi bàn trong những trận chung kết và tứ kết đã tạo nên danh tiếng "người hùng ở những trận quan trọng".</p>

<h3>Tuyển Anh — Đội hình mạnh nhất trong lịch sử?</h3>
<p>Bên cạnh Bellingham, tuyển Anh còn có Harry Kane ở trung phong, Bukayo Saka và Phil Foden ở hai cánh — một hàng công mà bất kỳ HLV nào cũng mơ ước. Hàng thủ với Trent Alexander-Arnold, Kyle Walker và John Stones cũng thuộc hàng tốt nhất châu Âu. Câu hỏi lớn nhất là liệu tuyển Anh có vượt qua được "lời nguyền" thua trên chấm phạt đền trong các vòng loại trực tiếp hay không.</p>

<h3>60 năm — Đã đến lúc chưa?</h3>
<p>Kể từ năm 1966, nước Anh đã tham dự 12 kỳ World Cup mà không thể lặp lại kỳ tích tổ chức. Những lần thất bại đau nhất: bán kết 1990, tứ kết 2018, và hai lần á quân Euro 2020 và 2024. Bellingham và đồng đội không muốn để World Cup 2026 trở thành cơ hội bị bỏ lỡ thứ ba tại Euro. Đây là thế hệ đặt áp lực "bây giờ hoặc không bao giờ".</p>
    `,
  },
  {
    slug: 'phap-doi-bong-ung-vien-so-1',
    title: 'Tuyển Pháp 2026 — Đội hình hoàn hảo hay quá nhiều ngôi sao?',
    excerpt: 'Les Bleus có thể là đội bóng toàn diện nhất tại WC 2026, nhưng lịch sử cho thấy đội bóng có nhiều siêu sao nhất không phải lúc nào cũng vô địch.',
    thumbnail: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80',
    thumbnailAlt: 'Tuyển Pháp World Cup 2026',
    category: 'Đội bóng',
    readTime: 6,
    publishedAt: '2026-06-05',
    views: 15230,
    author: 'Phòng Thể Thao',
    content: `
<h2>Đế chế Pháp trong kỷ nguyên Mbappé</h2>
<p>Tuyển Pháp bước vào World Cup 2026 với danh hiệu ứng viên số 1 từ hầu hết các chuyên gia bóng đá. Đây là lần đầu tiên kể từ kỷ nguyên Zidane mà nước Pháp sở hữu một đội hình đồng đều và chất lượng như vậy: từ hàng thủ đến tấn công, mỗi vị trí đều có cầu thủ đẳng cấp thế giới hoặc tốp châu Âu.</p>

<h3>Phân tích sức mạnh từng tuyến</h3>
<p><strong>Hàng thủ:</strong> Dayot Upamecano và William Saliba — hai trung vệ trụ cột của Bayern và Arsenal — tạo thành cặp đôi kiên cố bậc nhất thế giới. Mike Maignan trong khung gỗ là thủ thành đang trên đà trở thành hay nhất châu Âu. <strong>Trung tuyến:</strong> Aurélien Tchouaméni và Adrien Rabiot kiểm soát tốt nhịp điệu trận đấu, đủ sức đối đầu bất kỳ đội bóng nào. <strong>Hàng công:</strong> Mbappé–Griezmann–Dembélé tạo nên bộ ba tấn công đáng sợ nhất mà Les Bleus từng có.</p>

<h3>Điểm yếu tiềm ẩn</h3>
<p>Paradox của tuyển Pháp là có quá nhiều ngôi sao. Mỗi kỳ World Cup, câu hỏi về ai đá chính, ai đá dự bị lại gây ra những mâu thuẫn âm ỉ trong phòng thay đồ. Năm 2022, cuộc khủng hoảng giữa Mbappé và Griezmann về quyền thực hiện phạt đền, hay căng thẳng với Benzema đã cho thấy việc quản lý những cá tính lớn không phải chuyện đơn giản.</p>

<h3>HLV Deschamps — Người biết cách vô địch World Cup</h3>
<p>Didier Deschamps là một trong số ít người vô địch World Cup với tư cách vừa là cầu thủ (1998) vừa là HLV (2018). Sự thực dụng và kỷ luật chiến thuật của ông là chìa khóa để khai thác tối đa tiềm năng của đội bóng. Nếu Pháp vô địch lần thứ ba, Deschamps sẽ trở thành HLV vĩ đại nhất lịch sử Les Bleus.</p>
    `,
  },
  {
    slug: 'brazil-khát-voc-dich-24-nam',
    title: 'Brazil 2026 — Cơn khát vô địch 24 năm và sứ mệnh của Vinicius',
    excerpt: 'Kể từ 2002, Brazil đã trải qua quá nhiều thất vọng tại World Cup. Liệu WC 2026 có là thời điểm Seleção tái lập vương triều?',
    thumbnail: 'https://images.unsplash.com/photo-1518091043644-c1d4457317f4?w=800&q=80',
    thumbnailAlt: 'Brazil World Cup 2026',
    category: 'Đội bóng',
    readTime: 6,
    publishedAt: '2026-06-04',
    views: 12450,
    author: 'Phòng Thể Thao',
    content: `
<h2>Từ thảm họa Mineirasso đến hy vọng phục hưng</h2>
<p>Ngày 8 tháng 7 năm 2014 — ngày mà người Brazil gọi là "Mineirazo" — tuyển Đức hủy diệt Brazil 7–1 ngay tại Belo Horizonte. Đó là đêm kinh hoàng nhất lịch sử bóng đá Brazil, một vết thương chưa bao giờ lành hẳn trong lòng 215 triệu người dân xứ Samba. 12 năm sau, World Cup 2026 là cơ hội để gột rửa nỗi nhục lịch sử đó.</p>

<h3>Thế hệ trẻ của Seleção — Đủ chất lượng chưa?</h3>
<p>Brazil 2026 không còn dựa vào những huyền thoại như Ronaldinho hay Neymar. Thay vào đó là một thế hệ cầu thủ trẻ đang thi đấu tại những CLB hàng đầu châu Âu: Vinicius Jr. (Real Madrid), Rodrygo (Real Madrid), Endrick (Real Madrid — vẫn còn trẻ và đang phát triển), Gabriel Martinelli (Arsenal), Lucas Paquetá (West Ham). Đây là thế hệ cầu thủ được đào tạo bài bản nhất trong lịch sử bóng đá Brazil.</p>

<h3>Thách thức từ lịch sử gần đây</h3>
<p>Những kỳ World Cup gần nhất của Brazil: tứ kết 2022 (thua Croatia trên penalty), tứ kết 2018 (thua Bỉ 1–2), thảm bại 2014. Pattern thất bại ở tứ kết hoặc bán kết đã trở thành "lời nguyền" mà HLV hiện tại phải phá bỏ. Vấn đề không phải thiếu tài năng — mà là thiếu một cấu trúc chiến thuật vững chắc để bảo vệ tài năng đó.</p>

<h3>Dự đoán: Brazil có thể đi xa đến đâu?</h3>
<p>Nếu Vinicius Jr. vào được phong độ tốt nhất của mình, cộng thêm hàng thủ được tổ chức tốt hơn, Brazil hoàn toàn có thể vào đến chung kết. Sự kết hợp giữa kinh nghiệm (Casemiro, Thiago Silva nếu còn thi đấu) và sức trẻ bùng nổ là vũ khí lớn nhất của Seleção. World Cup 2026 — khả năng vô địch: 20-25% theo các nhà cái.</p>
    `,
  },
  {
    slug: '10-cau-thu-xem-wc-2026',
    title: 'Top 10 cầu thủ cần theo dõi tại World Cup 2026',
    excerpt: 'Danh sách những cầu thủ hứa hẹn sẽ tạo nên những khoảnh khắc lịch sử tại World Cup 2026, từ siêu sao đến những ngôi sao đang trỗi dậy.',
    thumbnail: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80',
    thumbnailAlt: 'Các cầu thủ nổi bật World Cup 2026',
    category: 'Phân tích',
    readTime: 8,
    publishedAt: '2026-06-03',
    views: 9870,
    author: 'Ban Biên Tập',
    content: `
<h2>Những ngôi sao sẽ làm nên World Cup 2026</h2>
<p>World Cup 2026 với 48 đội và 104 trận đấu sẽ là sân khấu cho hàng trăm cầu thủ xuất sắc. Nhưng trong số đó, có những cái tên mà bạn không thể bỏ lỡ — những người có khả năng thay đổi cục diện trong một cú chạm bóng, một pha rê dắt, hoặc một bàn thắng bằng vàng.</p>

<h3>Nhóm siêu sao đã khẳng định đẳng cấp</h3>
<p><strong>1. Kylian Mbappé (Pháp)</strong> — Ứng viên Quả Bóng Vàng, Vua phá lưới tiềm năng. Tốc độ và khả năng kết thúc tình huống là vũ khí hủy diệt nhất giải đấu.</p>
<p><strong>2. Vinicius Jr. (Brazil)</strong> — Quả Bóng Vàng 2024. Cầu thủ nguy hiểm nhất khi cầm bóng ở biên trái thế giới hiện tại.</p>
<p><strong>3. Erling Haaland (Na Uy)</strong> — Cỗ máy ghi bàn không ngừng nghỉ. Nếu Na Uy vượt qua vòng bảng, đây là người đe dọa kỷ lục bàn thắng tại một kỳ WC.</p>
<p><strong>4. Rodri (Tây Ban Nha)</strong> — Tiền vệ phòng thủ tốt nhất thế giới. Quả Bóng Vàng 2024. Không có Rodri, không có Tây Ban Nha.</p>

<h3>Thế hệ trẻ sẽ làm ngỡ ngàng</h3>
<p><strong>5. Lamine Yamal (Tây Ban Nha)</strong> — 18 tuổi nhưng không hề trẻ người non dạ. Đã ghi bàn tại Euro 2024, sẵn sàng làm điều tương tự tại WC.</p>
<p><strong>6. Jude Bellingham (Anh)</strong> — Tiền vệ hoàn chỉnh nhất thế hệ. Biết ghi bàn, biết phòng thủ, biết lãnh đạo.</p>
<p><strong>7. Endrick (Brazil)</strong> — Mới 19 tuổi nhưng đã được so sánh với Ronaldo Béo. Khả năng dứt điểm bằng cả hai chân đáng sợ.</p>

<h3>Những cái tên ít được chú ý hơn nhưng đáng xem</h3>
<p><strong>8. Pedri (Tây Ban Nha)</strong> — Khi khỏe mạnh, đây là tiền vệ sáng tạo nhất thế giới. WC 2026 là sân khấu đầy đủ đầu tiên của anh.</p>
<p><strong>9. Federico Valverde (Uruguay)</strong> — Động cơ không mệt mỏi của Real Madrid và Uruguay. Cú sút xa của anh là vũ khí bí mật.</p>
<p><strong>10. Khvicha Kvaratskhelia (Georgia/PSG)</strong> — Nếu Georgia vượt qua vòng bảng, Kvara sẽ là cầu thủ được nói đến nhiều nhất giải đấu. Kỹ thuật đỉnh cao của dải đất Kavkaz.</p>
    `,
  },
]
