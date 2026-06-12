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
    thumbnail: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800&q=80',
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
    thumbnail: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=800&q=80',
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
    thumbnail: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=800&q=80',
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
  {
    slug: 'argentina-bao-ve-ngoi-vo-dich',
    title: 'Argentina 2026 — Đương kim vô địch và hành trình bảo vệ ngôi báu',
    excerpt: 'Sau kỳ tích lịch sử tại Qatar 2022, La Albiceleste bước vào WC 2026 với quyết tâm chứng minh đẳng cấp nhà vô địch — dù kỷ nguyên Messi đang dần khép lại.',
    thumbnail: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=800&q=80',
    thumbnailAlt: 'Argentina World Cup 2026',
    category: 'Đội bóng',
    readTime: 6,
    publishedAt: '2026-06-02',
    views: 13670,
    author: 'Phòng Thể Thao',
    content: `
<h2>Nhà vô địch không bao giờ dễ bị đánh bại</h2>
<p>Lịch sử World Cup cho thấy đương kim vô địch thường gặp khó khăn trong kỳ tiếp theo — Brazil (2006), Ý (2010), Tây Ban Nha (2014), Đức (2018), Pháp (2022) đều bị loại sớm. Nhưng Argentina 2026 có một lợi thế mà những đội đó không có: họ vẫn giữ được phần lớn bộ khung của đội hình vô địch 2022.</p>

<h3>Kế thừa sau Messi — Thách thức lớn nhất</h3>
<p>Lionel Messi (38 tuổi tại WC 2026) có thể là kỳ World Cup cuối cùng của anh, nhưng Argentina không còn phụ thuộc hoàn toàn vào siêu sao này nữa. Julian Álvarez (26 tuổi) đã trưởng thành vượt bậc tại Atlético Madrid, trở thành trung phong đẳng cấp thế giới. Alexis Mac Allister kiểm soát trung tuyến hoàn hảo, trong khi Enzo Fernández ngày càng tỏa sáng tại Chelsea.</p>

<h3>Vũ khí bí mật: Emiliano Martínez</h3>
<p>Không đội bóng nào tại WC 2026 sở hữu một thủ thành hay hơn "Dibu" Martínez. Phản xạ xuất thần, khả năng cứu thua trong những khoảnh khắc quyết định — và đặc biệt là tâm lý thép trong loạt đá phạt đền — là những yếu tố biến Argentina thành đội không thể loại trong các trận đấu cân bằng.</p>

<h3>Dự đoán cho WC 2026</h3>
<p>Argentina được đặt cược ở tỉ lệ vô địch 12–15% — thấp hơn Pháp và Brazil nhưng đủ để lọt tốp 3 ứng viên. Nếu Messi tìm lại phong độ tốt nhất và Álvarez tiếp tục nổi bật, không thể loại trừ khả năng Argentina lần thứ hai liên tiếp đăng quang — điều chưa từng xảy ra kể từ Brazil 1958–1962.</p>
    `,
  },
  {
    slug: 'duc-hanh-trinh-phuc-hung',
    title: 'Đức 2026 — Từ thảm họa Qatar đến hành trình phục hưng tại Bắc Mỹ',
    excerpt: 'Sau hai kỳ World Cup thất bại (vòng bảng 2018 và 2022), Die Mannschaft đang trong giai đoạn tái thiết toàn diện. Liệu 2026 có là thời điểm trở lại?',
    thumbnail: 'https://images.unsplash.com/photo-1522778526097-ce0a22ceb253?w=800&q=80',
    thumbnailAlt: 'Đức World Cup 2026',
    category: 'Đội bóng',
    readTime: 5,
    publishedAt: '2026-06-01',
    views: 10340,
    author: 'Phòng Thể Thao',
    content: `
<h2>Từ đỉnh cao 2014 đến vực sâu 2018–2022</h2>
<p>Chỉ 4 năm sau kỳ tích vô địch World Cup 2014 tại Brazil, Đức bị loại ngay vòng bảng ở Russia 2018 — cú sốc lớn nhất lịch sử bóng đá Đức. Bốn năm sau, lịch sử lặp lại tại Qatar 2022. HLV Hansi Flick bị sa thải, HLV Julian Nagelsmann tiếp quản với nhiệm vụ không thể nặng nề hơn: khôi phục danh tiếng của một đế chế bóng đá.</p>

<h3>Cuộc cách mạng thế hệ</h3>
<p>Nagelsmann đã dũng cảm loại bỏ những tên tuổi lão làng và xây dựng đội hình mới xung quanh lứa cầu thủ sinh từ 2000 trở đi. Florian Wirtz (22 tuổi) là trái tim của đội tuyển — tiền vệ tấn công tài năng nhất châu Âu thế hệ trẻ với kỹ thuật điêu luyện và tầm nhìn chiến thuật vượt tuổi. Jamal Musiala (23 tuổi) song hành với Wirtz tạo nên cặp đôi sáng tạo đáng sợ nhất giải.</p>

<h3>Điểm mạnh và điểm yếu</h3>
<p>Hàng công với Wirtz–Musiala–Kai Havertz là bộ ba đẳng cấp cao. Nhưng hàng thủ vẫn còn những dấu hỏi — đặc biệt về khả năng đối phó với các đội tấn công tốc độ cao như Pháp hay Brazil. Manuel Neuer (40 tuổi) có thể là kỳ WC cuối cùng trong sự nghiệp huyền thoại của anh.</p>

<h3>Kỳ vọng thực tế cho 2026</h3>
<p>Các chuyên gia đặt Đức trong nhóm "dark horse" — đủ tài năng để gây bất ngờ nhưng chưa đủ ổn định để vô địch. Vào bán kết là mục tiêu thực tế, vô địch là giấc mơ. Nhưng với bóng đá, giấc mơ đôi khi trở thành sự thật — đặc biệt khi tên đội là Đức.</p>
    `,
  },
  {
    slug: 'harry-kane-co-hoi-cuoi',
    title: 'Harry Kane — Cơ hội cuối cùng để điền tên vào lịch sử bóng đá Anh',
    excerpt: 'Ở tuổi 32, Kane đang chứng kiến thế hệ trẻ nước Anh bùng nổ. Nhưng chỉ một danh hiệu lớn mới có thể hoàn thiện di sản của chân sút vĩ đại nhất lịch sử đội tuyển Anh.',
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    thumbnailAlt: 'Harry Kane tuyển Anh World Cup 2026',
    category: 'Cầu thủ',
    readTime: 5,
    publishedAt: '2026-05-30',
    views: 9450,
    author: 'Phòng Thể Thao',
    content: `
<h2>Chân sút vĩ đại nhất mà không có danh hiệu</h2>
<p>Harry Kane là câu chuyện bi thương và hùng tráng nhất của bóng đá Anh thế kỷ 21. Vua phá lưới mọi thời đại của đội tuyển Anh với hơn 70 bàn quốc tế, vua phá lưới Premier League nhiều lần — nhưng tủ danh hiệu vẫn trống. Không có Premier League với Tottenham, không có Champions League, không có danh hiệu cấp ĐTQG.</p>

<h3>Bayern Munich và cú đặt cược cuối</h3>
<p>Kane rời Tottenham năm 2023 để đến Bayern Munich, nơi anh kỳ vọng cuối cùng cũng giành được danh hiệu cấp CLB. Dù ghi bàn đều như máy (40+ bàn/mùa), Bayern vẫn chưa đoạt Champions League hay Bundesliga dưới thời anh. Điều đó đặt ra câu hỏi: có lẽ Kane sinh ra không phải để giành trophies, mà để để lại di sản qua những con số?</p>

<h3>Vai trò tại WC 2026 — Đại thụ hay người nhường sân?</h3>
<p>Ở tuổi 32, Kane vẫn là trung phong đẳng cấp cao với khả năng ghi bàn và xuống tổ chức xuất sắc. Nhưng câu hỏi thực sự là: liệu Bellingham, Saka, Foden có cần một "số 9 truyền thống" như Kane, hay họ cần một trung phong linh hoạt hơn? Câu trả lời của HLV sẽ quyết định di sản cuối cùng của Kane ở đội tuyển.</p>

<h3>Điều Kane cần để đi vào lịch sử</h3>
<p>Nếu Anh vô địch World Cup 2026 và Kane đóng vai trò quan trọng — kể cả là người xuất phát từ băng ghế dự bị — anh sẽ được nhớ đến như một huyền thoại. Chỉ cần một khoảnh khắc lịch sử có sự hiện diện của anh, tất cả những trophies thiếu hụt trong sự nghiệp sẽ trở nên ít quan trọng hơn.</p>
    `,
  },
  {
    slug: 'ngua-o-bat-ngo-wc-2026',
    title: 'Những "ngựa ô" có thể gây sốc tại World Cup 2026',
    excerpt: 'Mỗi kỳ World Cup luôn có những đội bóng vô danh làm kinh ngạc thế giới. Đây là những ứng viên "ngựa ô" đáng theo dõi nhất tại WC 2026.',
    thumbnail: 'https://images.unsplash.com/photo-1565130838609-c3a86655db61?w=800&q=80',
    thumbnailAlt: 'Ngựa ô bất ngờ World Cup 2026',
    category: 'Dự đoán',
    readTime: 6,
    publishedAt: '2026-05-28',
    views: 11890,
    author: 'Ban Biên Tập',
    content: `
<h2>Lịch sử World Cup luôn có chỗ cho bất ngờ</h2>
<p>Croatia (1998, 2018), Hàn Quốc (2002), Ghana (2010), Iceland (2018), Morocco (2022) — mỗi kỳ World Cup đều có những đội bóng tưởng chừng vô danh bước ra ánh đèn và làm chấn động thế giới. WC 2026 với 48 đội tham dự sẽ mở ra cơ hội lớn hơn bao giờ hết cho những "ngựa ô".</p>

<h3>Morocco — Từ tứ kết 2022 đến cao hơn?</h3>
<p>Đội bóng Bắc Phi đã làm cả thế giới ngỡ ngàng tại Qatar 2022 khi lọt vào bán kết — thành tích tốt nhất của một đội châu Phi trong lịch sử World Cup. Với thế hệ cầu thủ đang độ sung sức như Achraf Hakimi, Hakim Ziyech và Sofyan Amrabat, Morocco hoàn toàn có thể tiến xa hơn nữa.</p>

<h3>Nhật Bản — Đội bóng châu Á mạnh nhất mọi thời đại</h3>
<p>J.League ngày càng sản sinh ra những cầu thủ đẳng cấp châu Âu: Takefusa Kubo (Real Sociedad), Ritsu Doan (Freiburg), Kaoru Mitoma (Brighton). Lối chơi kỷ luật, sức chạy vô hạn và khả năng tổ chức phòng thủ kiên cố của Nhật Bản đã từng loại Đức và Tây Ban Nha tại Qatar 2022.</p>

<h3>Senegal và Ecuador — Hai ẩn số nguy hiểm</h3>
<p>Senegal sở hữu Sadio Mané (nếu còn ở phong độ tốt), hàng thủ dày dạn kinh nghiệm và đội tuyển có chiều sâu nhất lịch sử châu Phi. Ecuador với Enner Valencia và một thế hệ trẻ đang trỗi dậy mạnh mẽ là ứng viên gây sốc đến từ Nam Mỹ. Cả hai đều đủ sức gây khó dễ cho bất kỳ đội Top 10 nào.</p>

<h3>Lời khuyên: Đừng bỏ qua các trận vòng bảng</h3>
<p>Với 48 đội, WC 2026 có 3 bảng gồm 4 đội thay vì 8 bảng như trước — điều này tạo ra nhiều trận "chung kết vòng bảng" hơn và cơ hội cho các đội nhỏ hơn. Hãy theo dõi kỹ các bảng có Morocco, Nhật Bản, Iran, Úc — đây là những bảng dễ có bất ngờ nhất.</p>
    `,
  },
  {
    slug: 'san-van-dong-wc-2026',
    title: 'Những sân vận động WC 2026 — Kiến trúc hoành tráng trải dài Bắc Mỹ',
    excerpt: 'Từ MetLife Stadium ở New York đến Estadio Azteca ở Mexico City, WC 2026 diễn ra trên 16 sân vận động lớn nhất châu Mỹ. Khám phá những công trình ấn tượng nhất.',
    thumbnail: 'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=800&q=80',
    thumbnailAlt: 'Sân vận động World Cup 2026',
    category: 'Phân tích',
    readTime: 5,
    publishedAt: '2026-05-25',
    views: 8760,
    author: 'Ban Biên Tập',
    content: `
<h2>16 sân vận động, 3 quốc gia, 1 giải đấu lịch sử</h2>
<p>World Cup 2026 là giải đấu đầu tiên được tổ chức tại 3 quốc gia — Mỹ (11 sân), Canada (2 sân) và Mexico (3 sân). Với sức chứa trung bình hơn 70.000 chỗ ngồi mỗi sân, đây sẽ là World Cup có quy mô khán giả lớn nhất lịch sử. Tổng cộng hơn 5,5 triệu vé được phân phối trên toàn cầu.</p>

<h3>MetLife Stadium — Nơi diễn ra trận chung kết</h3>
<p>MetLife Stadium tại East Rutherford, New Jersey (gần New York) được chọn làm địa điểm tổ chức trận chung kết ngày 19/7/2026. Với sức chứa 82.500 chỗ ngồi, đây là sân vận động NFL lớn nhất ở Đông Bắc nước Mỹ. Sân không có mái che — một thách thức với thời tiết New York tháng 7 có thể bất ổn.</p>

<h3>Estadio Azteca — Thánh đường bóng đá huyền thoại</h3>
<p>Mexico City mang lại sân Azteca — công trình đã chứng kiến Maradona "Bàn tay của Chúa" năm 1986, Pelé vô địch WC 1970, và nay sẽ tiếp đón các trận đấu WC 2026. Độ cao 2.240m so với mực nước biển khiến cầu thủ dễ mệt hơn, tạo lợi thế tự nhiên cho các đội Nam Mỹ quen với điều kiện này.</p>

<h3>SoFi Stadium — Công trình hiện đại nhất giải đấu</h3>
<p>SoFi Stadium tại Inglewood, Los Angeles là sân vận động đắt tiền nhất trong lịch sử — xây dựng với 5,5 tỉ USD. Mái vòm kính trong suốt, công nghệ màn hình LED 360 độ và hệ thống âm thanh đỉnh cao tạo nên trải nghiệm xem bóng đá chưa từng có. Sân sẽ tổ chức 8 trận đấu, bao gồm cả trận bán kết.</p>

<h3>Thành phố đáng đến nhất</h3>
<p>Ngoài bóng đá, WC 2026 còn là cơ hội du lịch tuyệt vời. New York, Los Angeles, Miami, Dallas, Seattle ở Mỹ; Toronto, Vancouver ở Canada; Mexico City và Guadalajara ở Mexico — mỗi thành phố đều có văn hóa và ẩm thực đặc sắc riêng để khám phá song song với những trận cầu hấp dẫn.</p>
    `,
  },
  {
    slug: 'cap-dau-dang-mong-doi-wc-2026',
    title: 'Top 5 cặp đấu đáng mong đợi nhất tại World Cup 2026',
    excerpt: 'Từ những trận cầu kinh điển tái hiện trong lịch sử đến những đối đầu mới giữa thế hệ siêu sao hiện tại — đây là 5 trận đấu mà fan bóng đá không thể bỏ lỡ.',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    thumbnailAlt: 'Các cặp đấu hấp dẫn World Cup 2026',
    category: 'Dự đoán',
    readTime: 5,
    publishedAt: '2026-05-22',
    views: 14560,
    author: 'Ban Biên Tập',
    content: `
<h2>Những trận đấu làm nên lịch sử</h2>
<p>Nếu bốc thăm may mắn (hoặc kém may mắn), một số cặp đấu tiềm năng tại WC 2026 có thể trở thành những khoảnh khắc bóng đá được nhắc mãi. Đây là 5 cặp đấu mà chúng tôi đặc biệt mong đợi nhất — dù là ở vòng bảng, tứ kết hay chung kết.</p>

<h3>1. Pháp vs Brazil — Tái hiện tứ kết 2006</h3>
<p>Nếu hai đội này gặp nhau ở vòng loại trực tiếp, đây sẽ là trận đấu được kỳ vọng nhất của WC 2026. Mbappé đối đầu Vinicius — hai người đồng đội tại Real Madrid nhưng đối nghịch hoàn toàn ở đây. Tây Ban Nha vs Brazil cũng là cặp đấu tương tự nếu đoạt giải khu vực.</p>

<h3>2. Anh vs Argentina — 40 năm vẫn chưa nguội</h3>
<p>Cuộc đối đầu giữa Anh và Argentina luôn mang theo hơi thở của lịch sử — từ "Bàn tay của Chúa" 1986, đến loạt penalty kịch tính 1998. Bellingham vs Álvarez, Kane vs Otamendi — những cuộc đối đầu trực tiếp trong trận này sẽ là đề tài bàn luận cả giải đấu.</p>

<h3>3. Tây Ban Nha vs Đức — Trận derby châu Âu</h3>
<p>Yamal và Wirtz — hai tài năng trẻ nhất và xuất sắc nhất châu Âu đối đầu trực tiếp. Tây Ban Nha từng giành ngôi vô địch nhờ đè bẹp Đức 1–0 ở bán kết Euro 2008. Lịch sử có thể lặp lại theo một cách khác.</p>

<h3>4. Brazil vs Argentina — Siêu kinh điển Nam Mỹ</h3>
<p>Một cặp đấu mà người hâm mộ toàn thế giới đã chờ đợi từ vòng tứ kết. Vinicius vs Álvarez, Endrick vs Messi (nếu còn thi đấu) — đây là trận đấu vượt ra ngoài bóng đá, là cuộc chiến của hai nền văn hóa, hai triết lý và hàng thế kỷ kình địch.</p>

<h3>5. Nhật Bản vs bất kỳ đội lớn nào ở vòng 1/8</h3>
<p>Nhật Bản đã loại Đức và Tây Ban Nha tại Qatar 2022 một cách đầy bất ngờ. Nếu Samurai Blue lại rơi vào bảng với "ông lớn" và lặp lại kỳ tích, đó sẽ là khoảnh khắc bóng đá được nhắc đến lâu nhất trong lịch sử giải đấu.</p>
    `,
  },
  {
    slug: 'haaland-na-uy-world-cup',
    title: 'Erling Haaland — Cỗ máy ghi bàn đến từ xứ sở Viking',
    excerpt: 'Haaland có thể là trung phong nguy hiểm nhất thế giới hiện tại. Nhưng không có Messi hay Ronaldo bên cạnh, anh phải một mình gánh Na Uy vào sâu.',
    thumbnail: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&q=80',
    thumbnailAlt: 'Erling Haaland Na Uy World Cup 2026',
    category: 'Cầu thủ',
    readTime: 5,
    publishedAt: '2026-05-20',
    views: 12340,
    author: 'Phòng Thể Thao',
    content: `
<h2>Người đàn ông sinh ra để ghi bàn</h2>
<p>Erling Haaland (25 tuổi) đang trong thời điểm sung mãn nhất sự nghiệp. Tại Manchester City, anh đã phá vỡ mọi kỷ lục ghi bàn Premier League, giành Champions League và trở thành tiền đạo nguy hiểm nhất thế giới. Nhưng ở đấu trường quốc tế — nơi màu áo Na Uy — câu chuyện lại hoàn toàn khác.</p>

<h3>Na Uy — Đội hình mạnh mẽ hơn bao giờ hết</h3>
<p>Na Uy bước vào WC 2026 với thế hệ cầu thủ tốt nhất lịch sử: ngoài Haaland, còn có Martin Ødegaard (Arsenal) điều phối trung tuyến, Alexander Sørloth ở hàng công, và một hệ thống phòng thủ kỷ luật. Đây là lần đầu Na Uy có đội hình đủ chiều sâu để cạnh tranh ở vòng loại trực tiếp — chứ không chỉ để vào vòng bảng.</p>

<h3>Thống kê gây ngợp của Haaland</h3>
<p>Tại WC 2026, tất cả hàng thủ đối phương đều biết Haaland sẽ nhận bóng ở đâu — nhưng vẫn không ngăn được anh. Sức mạnh thể chất vượt trội (cao 1.94m, tốc độ 37km/h), khả năng đánh đầu kinh hãi và tốc độ rút chân dứt điểm ở cự ly gần khiến bất kỳ hậu vệ nào cũng phải dè chừng từ xa.</p>

<h3>Bức tường kiến tạo — Na Uy cần Ødegaard tỏa sáng</h3>
<p>Nếu Haaland là mũi tên, thì Ødegaard là cánh cung. Tiền vệ Arsenal đang là một trong những cầu thủ kiến tạo hay nhất Premier League, với khả năng chuyền bóng chính xác và tầm nhìn chiến thuật vượt trội. Khi cả hai cùng vào guồng, Na Uy trở thành một đội bóng hoàn toàn khác.</p>
    `,
  },
  {
    slug: 'qua-bong-vang-2026-du-doan',
    title: 'Quả Bóng Vàng 2026 — Cuộc đua nghẹt thở giữa 5 ứng viên đỉnh cao',
    excerpt: 'Ai sẽ là người cầm trên tay Quả Bóng Vàng sau World Cup 2026? Phân tích chi tiết 5 ứng viên hàng đầu và cơ hội thực sự của từng người.',
    thumbnail: 'https://images.unsplash.com/photo-1587329310686-91414b8e3cb7?w=800&q=80',
    thumbnailAlt: 'Quả Bóng Vàng 2026',
    category: 'Dự đoán',
    readTime: 7,
    publishedAt: '2026-05-18',
    views: 16230,
    author: 'Ban Biên Tập',
    content: `
<h2>Danh hiệu cá nhân cao quý nhất làng túc cầu</h2>
<p>Quả Bóng Vàng — giải thưởng cá nhân danh giá nhất bóng đá thế giới — luôn được quyết định phần lớn bởi thành tích tại World Cup. Năm 2026, với cả một kỳ giải đấu lớn nhất hành tinh diễn ra, cuộc đua cho chiếc cúp vàng hứa hẹn nghẹt thở hơn bất kỳ năm nào.</p>

<h3>Kylian Mbappé — Ứng viên số 1 theo thị trường cá cược</h3>
<p>Tỉ lệ cá cược cho Mbappé đoạt Quả Bóng Vàng 2026 dao động từ 2.5:1 đến 3:1 — phản ánh niềm tin của thị trường vào khả năng anh dẫn dắt Pháp vô địch và đoạt Vua phá lưới. Nếu kịch bản này xảy ra, sẽ không có bất kỳ lập luận nào đủ mạnh để ngăn Mbappé đoạt danh hiệu lần thứ hai.</p>

<h3>Vinicius Jr. — Nhà đương kim vô địch muốn bảo vệ</h3>
<p>Vinicius đã giành Quả Bóng Vàng 2024 nhờ phong độ bùng nổ tại Real Madrid. Để đoạt lần thứ hai, anh cần dẫn dắt Brazil vô địch World Cup — điều mà không cầu thủ Brazil nào làm được kể từ Ronaldo (R9) năm 2002. Nếu Vinicius làm điều đó, đây sẽ là Quả Bóng Vàng không thể tranh cãi nhất lịch sử.</p>

<h3>Lamine Yamal — Ứng viên bất ngờ nhất</h3>
<p>Chưa bao giờ trong lịch sử Quả Bóng Vàng một cầu thủ 18 tuổi giành giải. Nhưng nếu Yamal dẫn dắt Tây Ban Nha vô địch World Cup với màn trình diễn tỏa sáng xuyên suốt (ít nhất 3-4 bàn và 5+ kiến tạo), quy tắc không thành văn về "độ tuổi chín muồi" có thể bị phá vỡ lần đầu.</p>

<h3>Jude Bellingham và Rodri — Hai ứng viên từ đội Anh và Tây Ban Nha</h3>
<p>Bellingham cần Anh vô địch và ghi bàn thêm 5-6 bàn tại WC để có cơ hội. Rodri — đã giành Quả Bóng Vàng 2024 — sẽ là ứng viên nếu anh tiếp tục là nhân tố không thể thiếu trong chức vô địch của Tây Ban Nha. Tiền vệ phòng thủ hiếm khi thắng giải này (Makelele chưa bao giờ đoạt), nhưng Rodri là ngoại lệ.</p>

<h3>Dự đoán cuối cùng</h3>
<p>Dự đoán của chúng tôi: Nếu Pháp vô địch → Mbappé; Nếu Brazil vô địch → Vinicius; Nếu Tây Ban Nha vô địch → Yamal hoặc Pedri; Nếu Anh vô địch → Bellingham. Kịch bản bất ngờ: Argentina vô địch → Álvarez hoặc Messi lần cuối.</p>
    `,
  },
  {
    slug: 'lich-su-wc-bac-my-1994',
    title: 'World Cup 1994 và ký ức huy hoàng của bóng đá tại Bắc Mỹ',
    excerpt: 'WC 2026 không phải lần đầu Bắc Mỹ đăng cai giải đấu lớn nhất thế giới. Nhìn lại WC 1994 — giải đấu phá vỡ mọi kỷ lục khán giả và thay đổi bóng đá Mỹ mãi mãi.',
    thumbnail: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&q=80',
    thumbnailAlt: 'Lịch sử World Cup 1994 Bắc Mỹ',
    category: 'Phân tích',
    readTime: 6,
    publishedAt: '2026-05-15',
    views: 7890,
    author: 'Ban Biên Tập',
    content: `
<h2>1994 — Kỳ World Cup làm thay đổi nước Mỹ</h2>
<p>Khi FIFA trao quyền đăng cai World Cup 1994 cho Mỹ — quốc gia mà bóng đá khi đó vẫn là môn thể thao thứ yếu sau NFL, NBA và baseball — cả thế giới nghi ngờ. Nhưng World Cup 1994 đã trở thành giải đấu thành công nhất lịch sử tính về khán giả: trung bình 68.991 người/trận, kỷ lục chưa bị phá tính đến 2026.</p>

<h3>Brazil vô địch — Romário và Bebeto huyền thoại</h3>
<p>Đội tuyển Brazil của HLV Carlos Alberto Parreira với bộ đôi tiền đạo Romário–Bebeto đã đăng quang lần thứ tư tại Rose Bowl, Pasadena. Trận chung kết Brazil–Ý kết thúc 0–0 sau 120 phút và lần đầu trong lịch sử World Cup phải phân định thắng thua qua loạt penalty. Roberto Baggio — người Ý vĩ đại nhất thế hệ — đá hỏng quả cuối. Khoảnh khắc đó đi vào lịch sử.</p>

<h3>Maradona và vụ doping chấn động</h3>
<p>Diego Maradona trở lại World Cup sau 4 năm và ghi bàn tuyệt đẹp trước Hy Lạp — mừng bàn thắng với những tiếng gào thét điên cuồng vào camera như muốn nổ tung. Rồi vài ngày sau, bị loại vì dùng doping (ephedrine). Kỳ World Cup của Maradona kết thúc trong nước mắt và tranh cãi không hồi kết.</p>

<h3>Di sản của WC 1994 với bóng đá Mỹ</h3>
<p>World Cup 1994 trực tiếp tạo ra Major League Soccer (MLS) năm 1996 — giải VĐQG chuyên nghiệp đầu tiên của Mỹ. 32 năm sau, MLS đã trở thành một trong những giải đấu phát triển nhanh nhất thế giới với những siêu sao như Messi (Inter Miami), Riqui Puig và nhiều cầu thủ châu Âu về "cuối sự nghiệp". WC 2026 sẽ lại là cú hích tiếp theo cho bóng đá Bắc Mỹ.</p>
    `,
  },
  {
    slug: 'tay-ban-nha-doi-hinh-hoan-hao',
    title: 'Tây Ban Nha 2026 — Đội hình hoàn hảo nhất và lối chơi tương lai của bóng đá',
    excerpt: 'Sau Euro 2024, La Roja đang xây dựng một triều đại mới. Với Yamal, Pedri, Morata và Rodri, đây có thể là đội bóng đẹp nhất kể từ thời Xavi–Iniesta.',
    thumbnail: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&q=80',
    thumbnailAlt: 'Tây Ban Nha World Cup 2026',
    category: 'Đội bóng',
    readTime: 6,
    publishedAt: '2026-05-12',
    views: 11450,
    author: 'Phòng Thể Thao',
    content: `
<h2>Kế thừa triết lý tiqui-taca cho thế kỷ 21</h2>
<p>Tây Ban Nha dưới thời HLV Luis de la Fuente đã trở lại với triết lý bóng đá kiểm soát bóng đặc trưng — nhưng hiện đại hơn, nhanh hơn và nguy hiểm hơn phiên bản 2008–2012. Euro 2024 là bằng chứng rõ nhất: La Roja vô địch với lối chơi đẹp mắt, hiệu quả và thuyết phục tuyệt đối.</p>

<h3>Bộ đôi sáng tạo trẻ nhất thế giới: Yamal–Pedri</h3>
<p>Lamine Yamal (18 tuổi) và Pedri (23 tuổi) là cặp đôi cánh phải–tiền vệ trung tâm có sự phối hợp ăn ý nhất trong bóng đá quốc tế hiện tại. Pedri đã trải qua giai đoạn chấn thương kéo dài nhưng đang trở lại với phong độ tốt nhất. Khi cả hai cùng khỏe, Tây Ban Nha có bộ não sáng tạo không đội nào sánh bằng.</p>

<h3>Rodri — Trụ cột không thể thiếu</h3>
<p>Nếu có một cầu thủ mà Tây Ban Nha không thể thiếu ở WC 2026, đó là Rodri. Tiền vệ phòng thủ của Man City là người lọc bóng, định hướng nhịp chơi và bảo vệ hàng thủ — tất cả trong cùng một cầu thủ. Rodri bị chấn thương trong mùa 2024–25 là tin tồi nhất cho La Roja, nhưng anh đã hồi phục và sẵn sàng cho WC 2026.</p>

<h3>Điểm yếu duy nhất: Trung phong đẳng cấp thực sự</h3>
<p>Álvaro Morata là trung phong chính nhưng không phải dạng "số 9 thuần" hoàn hảo. Ferran Torres và Mikel Oyarzabal là những lựa chọn thay thế tốt, nhưng không ai trong số họ có sức dứt điểm ổn định như Kane hay Haaland. Đây là điểm yếu duy nhất mà đối phương sẽ cố khai thác trong các trận đấu lớn.</p>
    `,
  },
]
