// ══ shop-ruou-vang — dữ liệu sản phẩm mock (RETRO-BOLD variant, prefix rv-) ══
// 48 sản phẩm — đủ 4 trang phân trang (PER_PAGE = 12)
// Ảnh: Unsplash hotlink đã verify HTTP 200 qua curl trước khi đưa vào (xem báo cáo build)

const PRODUCTS = [
  {
    id: 1,
    name: 'Château Rousillon Bordeaux 2018',
    slug: 'chateau-rousillon-bordeaux-2018-1',
    price: 620000,
    salePrice: null,
    category: 'vang-do',
    theme: [
      'ban-chay'
    ],
    origin: 'phap',
    originLabel: 'Pháp',
    abv: 13.5,
    volume: 750,
    occasion: [
      'qua-tang',
      'tiec-tung'
    ],
    rating: 4.3,
    sold: 29,
    stock: true,
    badge: null,
    image: 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 2,
    name: 'Domaine Lefèvre Pinot Noir 2020',
    slug: 'domaine-lefevre-pinot-noir-2020-2',
    price: 540000,
    salePrice: 459000,
    category: 'vang-do',
    theme: [
      'moi-ve'
    ],
    origin: 'phap',
    originLabel: 'Pháp',
    abv: 13,
    volume: 750,
    occasion: [
      'khai-vi',
      'hang-ngay'
    ],
    rating: 4,
    sold: 66,
    stock: true,
    badge: 'sale',
    image: 'https://images.unsplash.com/photo-1562601579-599dec564e06?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 3,
    name: 'Château Maubec Saint-Émilion Grand Cru 2017',
    slug: 'chateau-maubec-saint-emilion-grand-cru-2017-3',
    price: 1850000,
    salePrice: null,
    category: 'vang-do',
    theme: [
      'cao-cap'
    ],
    origin: 'phap',
    originLabel: 'Pháp',
    abv: 14,
    volume: 750,
    occasion: [
      'suu-tam',
      'qua-tang'
    ],
    rating: 4.7,
    sold: 103,
    stock: true,
    badge: null,
    image: 'https://images.unsplash.com/photo-1578911373434-0cb395d2cbfb?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 4,
    name: 'Domaine Charnier Côtes du Rhône 2019',
    slug: 'domaine-charnier-cotes-du-rhone-2019-4',
    price: 385000,
    salePrice: null,
    category: 'vang-do',
    theme: [],
    origin: 'phap',
    originLabel: 'Pháp',
    abv: 13.5,
    volume: 750,
    occasion: [
      'hang-ngay'
    ],
    rating: 4.4,
    sold: 140,
    stock: true,
    badge: null,
    image: 'https://images.unsplash.com/photo-1610631787813-9eeb1a2386cc?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 5,
    name: 'Château Vasseur Médoc 2016',
    slug: 'chateau-vasseur-medoc-2016-5',
    price: 1450000,
    salePrice: null,
    category: 'vang-do',
    theme: [
      'cao-cap'
    ],
    origin: 'phap',
    originLabel: 'Pháp',
    abv: 13.5,
    volume: 750,
    occasion: [
      'suu-tam',
      'qua-tang'
    ],
    rating: 4.1,
    sold: 177,
    stock: true,
    badge: null,
    image: 'https://images.unsplash.com/photo-1611575189074-9dfbbceb258a?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 6,
    name: 'Domaine Bellevue Bourgogne Rouge 2021',
    slug: 'domaine-bellevue-bourgogne-rouge-2021-6',
    price: 610000,
    salePrice: 519000,
    category: 'vang-do',
    theme: [
      'moi-ve'
    ],
    origin: 'phap',
    originLabel: 'Pháp',
    abv: 13,
    volume: 750,
    occasion: [
      'tiec-tung'
    ],
    rating: 4.8,
    sold: 214,
    stock: true,
    badge: 'sale',
    image: 'https://images.unsplash.com/photo-1600320183466-7198f22d3c8a?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 7,
    name: 'Château Delacroix Margaux 2015',
    slug: 'chateau-delacroix-margaux-2015-7',
    price: 3200000,
    salePrice: null,
    category: 'vang-do',
    theme: [
      'cao-cap'
    ],
    origin: 'phap',
    originLabel: 'Pháp',
    abv: 14,
    volume: 750,
    occasion: [
      'suu-tam'
    ],
    rating: 4.5,
    sold: 251,
    stock: true,
    badge: null,
    image: 'https://images.unsplash.com/photo-1592119748016-a61c40a44320?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 8,
    name: 'Domaine Fontenay Beaujolais 2022',
    slug: 'domaine-fontenay-beaujolais-2022-8',
    price: 345000,
    salePrice: null,
    category: 'vang-do',
    theme: [
      'moi-ve'
    ],
    origin: 'phap',
    originLabel: 'Pháp',
    abv: 12.5,
    volume: 750,
    occasion: [
      'hang-ngay'
    ],
    rating: 4.2,
    sold: 288,
    stock: true,
    badge: 'new',
    image: 'https://images.unsplash.com/photo-1697115355209-46e7bce340fb?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 9,
    name: 'Villa Rosso Chianti Classico Riserva 2018',
    slug: 'villa-rosso-chianti-classico-riserva-2018-9',
    price: 580000,
    salePrice: null,
    category: 'vang-do',
    theme: [
      'ban-chay'
    ],
    origin: 'y',
    originLabel: 'Ý',
    abv: 13.5,
    volume: 750,
    occasion: [
      'tiec-tung',
      'qua-tang'
    ],
    rating: 4.9,
    sold: 325,
    stock: true,
    badge: null,
    image: 'https://images.unsplash.com/photo-1611571940159-425a28706d6f?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 10,
    name: 'Casa Toscana Brunello di Montalcino 2017',
    slug: 'casa-toscana-brunello-di-montalcino-2017-10',
    price: 1980000,
    salePrice: 1683000,
    category: 'vang-do',
    theme: [
      'cao-cap'
    ],
    origin: 'y',
    originLabel: 'Ý',
    abv: 14,
    volume: 750,
    occasion: [
      'suu-tam',
      'qua-tang'
    ],
    rating: 4.6,
    sold: 362,
    stock: true,
    badge: 'sale',
    image: 'https://images.unsplash.com/photo-1632928945607-e4f8c7524707?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 11,
    name: 'Tenuta Alba Barolo 2016',
    slug: 'tenuta-alba-barolo-2016-11',
    price: 2350000,
    salePrice: null,
    category: 'vang-do',
    theme: [
      'cao-cap'
    ],
    origin: 'y',
    originLabel: 'Ý',
    abv: 14,
    volume: 750,
    occasion: [
      'suu-tam'
    ],
    rating: 4.3,
    sold: 399,
    stock: true,
    badge: 'hot',
    image: 'https://images.unsplash.com/photo-1592845148519-b0d41df97ac2?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 12,
    name: 'Cantina Verona Amarone della Valpolicella 2019',
    slug: 'cantina-verona-amarone-della-valpolicella-2019-12',
    price: 1690000,
    salePrice: null,
    category: 'vang-do',
    theme: [
      'cao-cap'
    ],
    origin: 'y',
    originLabel: 'Ý',
    abv: 15,
    volume: 750,
    occasion: [
      'suu-tam',
      'qua-tang'
    ],
    rating: 4,
    sold: 436,
    stock: true,
    badge: 'hot',
    image: 'https://images.unsplash.com/photo-1638186095900-179bc805de09?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 13,
    name: 'Borgo Antico Nero d’Avola 2021',
    slug: 'borgo-antico-nero-davola-2021-13',
    price: 395000,
    salePrice: null,
    category: 'vang-do',
    theme: [],
    origin: 'y',
    originLabel: 'Ý',
    abv: 13,
    volume: 750,
    occasion: [
      'hang-ngay'
    ],
    rating: 4.7,
    sold: 43,
    stock: true,
    badge: null,
    image: 'https://images.unsplash.com/photo-1700893417209-18dc88c989a0?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 14,
    name: 'Villa Marchetti Montepulciano d’Abruzzo 2020',
    slug: 'villa-marchetti-montepulciano-dabruzzo-2020-14',
    price: 420000,
    salePrice: 357000,
    category: 'vang-do',
    theme: [],
    origin: 'y',
    originLabel: 'Ý',
    abv: 13,
    volume: 750,
    occasion: [
      'hang-ngay',
      'khai-vi'
    ],
    rating: 4.4,
    sold: 80,
    stock: true,
    badge: 'sale',
    image: 'https://images.unsplash.com/photo-1628187832510-94b4d90445af?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 15,
    name: 'Viña del Sol Cabernet Sauvignon Reserva 2021',
    slug: 'vina-del-sol-cabernet-sauvignon-reserva-2021-15',
    price: 455000,
    salePrice: null,
    category: 'vang-do',
    theme: [
      'ban-chay'
    ],
    origin: 'chile',
    originLabel: 'Chile',
    abv: 13.5,
    volume: 750,
    occasion: [
      'tiec-tung'
    ],
    rating: 4.1,
    sold: 117,
    stock: true,
    badge: null,
    image: 'https://images.unsplash.com/photo-1695634580213-c384a6201eee?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 16,
    name: 'Viña Andina Carmenère 2020',
    slug: 'vina-andina-carmenere-2020-16',
    price: 410000,
    salePrice: null,
    category: 'vang-do',
    theme: [
      'moi-ve'
    ],
    origin: 'chile',
    originLabel: 'Chile',
    abv: 13,
    volume: 750,
    occasion: [
      'hang-ngay'
    ],
    rating: 4.8,
    sold: 154,
    stock: true,
    badge: 'new',
    image: 'https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 17,
    name: 'Bodega Cordillera Merlot 2022',
    slug: 'bodega-cordillera-merlot-2022-17',
    price: 320000,
    salePrice: null,
    category: 'vang-do',
    theme: [],
    origin: 'chile',
    originLabel: 'Chile',
    abv: 13,
    volume: 750,
    occasion: [
      'hang-ngay'
    ],
    rating: 4.5,
    sold: 191,
    stock: true,
    badge: null,
    image: 'https://images.unsplash.com/photo-1642340828763-822a676c1da3?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 18,
    name: 'Viña Pacífico Cabernet Sauvignon 2019',
    slug: 'vina-pacifico-cabernet-sauvignon-2019-18',
    price: 289000,
    salePrice: 246000,
    category: 'vang-do',
    theme: [],
    origin: 'chile',
    originLabel: 'Chile',
    abv: 13.5,
    volume: 750,
    occasion: [
      'hang-ngay'
    ],
    rating: 4.2,
    sold: 228,
    stock: true,
    badge: 'sale',
    image: 'https://images.unsplash.com/photo-1534655882117-f9eff36a1574?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 19,
    name: 'Bodega del Rey Rioja Reserva 2018',
    slug: 'bodega-del-rey-rioja-reserva-2018-19',
    price: 495000,
    salePrice: null,
    category: 'vang-do',
    theme: [
      'ban-chay'
    ],
    origin: 'tay-ban-nha',
    originLabel: 'Tây Ban Nha',
    abv: 13.5,
    volume: 750,
    occasion: [
      'tiec-tung',
      'qua-tang'
    ],
    rating: 4.9,
    sold: 265,
    stock: true,
    badge: null,
    image: 'https://images.unsplash.com/photo-1536583308396-5e8dd8dff017?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 20,
    name: 'Finca Real Ribera del Duero 2019',
    slug: 'finca-real-ribera-del-duero-2019-20',
    price: 660000,
    salePrice: null,
    category: 'vang-do',
    theme: [],
    origin: 'tay-ban-nha',
    originLabel: 'Tây Ban Nha',
    abv: 14,
    volume: 750,
    occasion: [
      'qua-tang'
    ],
    rating: 4.6,
    sold: 302,
    stock: true,
    badge: null,
    image: 'https://images.unsplash.com/photo-1609238000857-303bf54099b1?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 21,
    name: 'Finca Andina Malbec Reserva 2020',
    slug: 'finca-andina-malbec-reserva-2020-21',
    price: 470000,
    salePrice: null,
    category: 'vang-do',
    theme: [
      'ban-chay'
    ],
    origin: 'argentina',
    originLabel: 'Argentina',
    abv: 14,
    volume: 750,
    occasion: [
      'tiec-tung'
    ],
    rating: 4.3,
    sold: 339,
    stock: true,
    badge: null,
    image: 'https://images.unsplash.com/photo-1529060532150-a0c935a6d6e5?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 22,
    name: 'Barossa Peak Shiraz 2019',
    slug: 'barossa-peak-shiraz-2019-22',
    price: 585000,
    salePrice: 497000,
    category: 'vang-do',
    theme: [
      'moi-ve'
    ],
    origin: 'uc',
    originLabel: 'Úc',
    abv: 14.5,
    volume: 750,
    occasion: [
      'tiec-tung',
      'qua-tang'
    ],
    rating: 4,
    sold: 376,
    stock: true,
    badge: 'sale',
    image: 'https://images.unsplash.com/photo-1615780324244-29b71ae12f7d?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 23,
    name: 'Domaine Clairvaux Chablis 2021',
    slug: 'domaine-clairvaux-chablis-2021-23',
    price: 590000,
    salePrice: null,
    category: 'vang-trang',
    theme: [
      'moi-ve'
    ],
    origin: 'phap',
    originLabel: 'Pháp',
    abv: 12.5,
    volume: 750,
    occasion: [
      'khai-vi'
    ],
    rating: 4.7,
    sold: 413,
    stock: true,
    badge: 'new',
    image: 'https://images.unsplash.com/photo-1516154767575-2146adebdf32?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 24,
    name: 'Château Sauvage Sauvignon Blanc 2022',
    slug: 'chateau-sauvage-sauvignon-blanc-2022-24',
    price: 365000,
    salePrice: null,
    category: 'vang-trang',
    theme: [],
    origin: 'phap',
    originLabel: 'Pháp',
    abv: 12.5,
    volume: 750,
    occasion: [
      'hang-ngay'
    ],
    rating: 4.4,
    sold: 20,
    stock: true,
    badge: null,
    image: 'https://images.unsplash.com/photo-1561955147-e9083536e573?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 25,
    name: 'Villa Chiara Pinot Grigio 2022',
    slug: 'villa-chiara-pinot-grigio-2022-25',
    price: 335000,
    salePrice: null,
    category: 'vang-trang',
    theme: [
      'ban-chay'
    ],
    origin: 'y',
    originLabel: 'Ý',
    abv: 12,
    volume: 750,
    occasion: [
      'khai-vi',
      'hang-ngay'
    ],
    rating: 4.1,
    sold: 57,
    stock: true,
    badge: null,
    image: 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 26,
    name: 'Casa Toscana Vermentino 2021',
    slug: 'casa-toscana-vermentino-2021-26',
    price: 355000,
    salePrice: 302000,
    category: 'vang-trang',
    theme: [],
    origin: 'y',
    originLabel: 'Ý',
    abv: 12.5,
    volume: 750,
    occasion: [
      'hang-ngay'
    ],
    rating: 4.8,
    sold: 94,
    stock: true,
    badge: 'sale',
    image: 'https://images.unsplash.com/photo-1562601579-599dec564e06?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 27,
    name: 'Viña del Sol Sauvignon Blanc 2022',
    slug: 'vina-del-sol-sauvignon-blanc-2022-27',
    price: 275000,
    salePrice: null,
    category: 'vang-trang',
    theme: [],
    origin: 'chile',
    originLabel: 'Chile',
    abv: 12.5,
    volume: 750,
    occasion: [
      'khai-vi'
    ],
    rating: 4.5,
    sold: 131,
    stock: true,
    badge: null,
    image: 'https://images.unsplash.com/photo-1578911373434-0cb395d2cbfb?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 28,
    name: 'Viña Andina Chardonnay 2021',
    slug: 'vina-andina-chardonnay-2021-28',
    price: 310000,
    salePrice: null,
    category: 'vang-trang',
    theme: [
      'moi-ve'
    ],
    origin: 'chile',
    originLabel: 'Chile',
    abv: 13,
    volume: 750,
    occasion: [
      'tiec-tung'
    ],
    rating: 4.2,
    sold: 168,
    stock: true,
    badge: 'new',
    image: 'https://images.unsplash.com/photo-1610631787813-9eeb1a2386cc?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 29,
    name: 'Barossa Peak Riesling 2021',
    slug: 'barossa-peak-riesling-2021-29',
    price: 420000,
    salePrice: null,
    category: 'vang-trang',
    theme: [],
    origin: 'uc',
    originLabel: 'Úc',
    abv: 11.5,
    volume: 750,
    occasion: [
      'khai-vi'
    ],
    rating: 4.9,
    sold: 205,
    stock: true,
    badge: null,
    image: 'https://images.unsplash.com/photo-1611575189074-9dfbbceb258a?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 30,
    name: 'Bodega del Rey Albariño 2022',
    slug: 'bodega-del-rey-albarino-2022-30',
    price: 380000,
    salePrice: 323000,
    category: 'vang-trang',
    theme: [
      'moi-ve'
    ],
    origin: 'tay-ban-nha',
    originLabel: 'Tây Ban Nha',
    abv: 12.5,
    volume: 750,
    occasion: [
      'khai-vi'
    ],
    rating: 4.6,
    sold: 242,
    stock: true,
    badge: 'sale',
    image: 'https://images.unsplash.com/photo-1600320183466-7198f22d3c8a?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 31,
    name: 'Weingut Rhein Riesling Kabinett 2021',
    slug: 'weingut-rhein-riesling-kabinett-2021-31',
    price: 530000,
    salePrice: null,
    category: 'vang-trang',
    theme: [
      'cao-cap'
    ],
    origin: 'duc',
    originLabel: 'Đức',
    abv: 9.5,
    volume: 750,
    occasion: [
      'khai-vi',
      'qua-tang'
    ],
    rating: 4.3,
    sold: 279,
    stock: true,
    badge: null,
    image: 'https://images.unsplash.com/photo-1592119748016-a61c40a44320?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 32,
    name: 'Finca Andina Torrontés 2022',
    slug: 'finca-andina-torrontes-2022-32',
    price: 295000,
    salePrice: null,
    category: 'vang-trang',
    theme: [],
    origin: 'argentina',
    originLabel: 'Argentina',
    abv: 13,
    volume: 750,
    occasion: [
      'hang-ngay'
    ],
    rating: 4,
    sold: 316,
    stock: true,
    badge: null,
    image: 'https://images.unsplash.com/photo-1697115355209-46e7bce340fb?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 33,
    name: 'Sonoma Ridge Chardonnay 2020',
    slug: 'sonoma-ridge-chardonnay-2020-33',
    price: 640000,
    salePrice: null,
    category: 'vang-trang',
    theme: [
      'ban-chay'
    ],
    origin: 'my',
    originLabel: 'Mỹ',
    abv: 13.5,
    volume: 750,
    occasion: [
      'tiec-tung',
      'qua-tang'
    ],
    rating: 4.7,
    sold: 353,
    stock: true,
    badge: null,
    image: 'https://images.unsplash.com/photo-1611571940159-425a28706d6f?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 34,
    name: 'Cape Winelands Chenin Blanc 2021',
    slug: 'cape-winelands-chenin-blanc-2021-34',
    price: 285000,
    salePrice: 242000,
    category: 'vang-trang',
    theme: [],
    origin: 'nam-phi',
    originLabel: 'Nam Phi',
    abv: 12.5,
    volume: 750,
    occasion: [
      'hang-ngay'
    ],
    rating: 4.4,
    sold: 390,
    stock: true,
    badge: 'sale',
    image: 'https://images.unsplash.com/photo-1632928945607-e4f8c7524707?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 35,
    name: 'Maison Dubois Champagne Brut',
    slug: 'maison-dubois-champagne-brut-35',
    price: 1250000,
    salePrice: null,
    category: 'vang-sui',
    theme: [
      'cao-cap',
      'ban-chay'
    ],
    origin: 'phap',
    originLabel: 'Pháp',
    abv: 12,
    volume: 750,
    occasion: [
      'tiec-tung',
      'qua-tang'
    ],
    rating: 4.1,
    sold: 427,
    stock: true,
    badge: 'hot',
    image: 'https://images.unsplash.com/photo-1580657274234-7339717f4541?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 36,
    name: 'Maison Dubois Champagne Rosé Brut',
    slug: 'maison-dubois-champagne-rose-brut-36',
    price: 1450000,
    salePrice: null,
    category: 'vang-sui',
    theme: [
      'cao-cap'
    ],
    origin: 'phap',
    originLabel: 'Pháp',
    abv: 12,
    volume: 750,
    occasion: [
      'tiec-tung',
      'qua-tang'
    ],
    rating: 4.8,
    sold: 34,
    stock: true,
    badge: null,
    image: 'https://images.unsplash.com/photo-1588138678946-fae725e0b6e1?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 37,
    name: 'Château Rousillon Crémant de Bourgogne',
    slug: 'chateau-rousillon-cremant-de-bourgogne-37',
    price: 495000,
    salePrice: null,
    category: 'vang-sui',
    theme: [
      'moi-ve'
    ],
    origin: 'phap',
    originLabel: 'Pháp',
    abv: 12,
    volume: 750,
    occasion: [
      'tiec-tung'
    ],
    rating: 4.5,
    sold: 71,
    stock: true,
    badge: 'new',
    image: 'https://images.unsplash.com/photo-1628336707631-68131ca720c3?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 38,
    name: 'Villa Rosso Prosecco Extra Dry',
    slug: 'villa-rosso-prosecco-extra-dry-38',
    price: 295000,
    salePrice: 251000,
    category: 'vang-sui',
    theme: [
      'ban-chay'
    ],
    origin: 'y',
    originLabel: 'Ý',
    abv: 11,
    volume: 750,
    occasion: [
      'tiec-tung',
      'hang-ngay'
    ],
    rating: 4.2,
    sold: 108,
    stock: true,
    badge: 'sale',
    image: 'https://images.unsplash.com/photo-1580657264608-44775e61c0a1?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 39,
    name: 'Casa Toscana Prosecco Rosé',
    slug: 'casa-toscana-prosecco-rose-39',
    price: 320000,
    salePrice: null,
    category: 'vang-sui',
    theme: [
      'moi-ve'
    ],
    origin: 'y',
    originLabel: 'Ý',
    abv: 11.5,
    volume: 750,
    occasion: [
      'tiec-tung'
    ],
    rating: 4.9,
    sold: 145,
    stock: true,
    badge: 'new',
    image: 'https://images.unsplash.com/photo-1597075759290-5c29a23c8a16?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 40,
    name: 'Bodega del Rey Cava Brut Nature',
    slug: 'bodega-del-rey-cava-brut-nature-40',
    price: 265000,
    salePrice: null,
    category: 'vang-sui',
    theme: [],
    origin: 'tay-ban-nha',
    originLabel: 'Tây Ban Nha',
    abv: 11.5,
    volume: 750,
    occasion: [
      'tiec-tung'
    ],
    rating: 4.6,
    sold: 182,
    stock: true,
    badge: null,
    image: 'https://images.unsplash.com/photo-1546567075-d7113bee3c4a?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 41,
    name: 'Sonoma Ridge Sparkling Brut',
    slug: 'sonoma-ridge-sparkling-brut-41',
    price: 540000,
    salePrice: null,
    category: 'vang-sui',
    theme: [],
    origin: 'my',
    originLabel: 'Mỹ',
    abv: 12,
    volume: 750,
    occasion: [
      'tiec-tung',
      'qua-tang'
    ],
    rating: 4.3,
    sold: 219,
    stock: true,
    badge: null,
    image: 'https://images.unsplash.com/photo-1669067166035-7e37abaecec8?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 42,
    name: 'Viña del Sol Espumante Brut',
    slug: 'vina-del-sol-espumante-brut-42',
    price: 245000,
    salePrice: 208000,
    category: 'vang-sui',
    theme: [],
    origin: 'chile',
    originLabel: 'Chile',
    abv: 11.5,
    volume: 750,
    occasion: [
      'hang-ngay',
      'tiec-tung'
    ],
    rating: 4,
    sold: 256,
    stock: true,
    badge: 'sale',
    image: 'https://images.unsplash.com/photo-1643618829236-a23857519fb6?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 43,
    name: 'Château Provence Rosé 2022',
    slug: 'chateau-provence-rose-2022-43',
    price: 450000,
    salePrice: null,
    category: 'vang-hong',
    theme: [
      'ban-chay'
    ],
    origin: 'phap',
    originLabel: 'Pháp',
    abv: 12.5,
    volume: 750,
    occasion: [
      'tiec-tung',
      'khai-vi'
    ],
    rating: 4.7,
    sold: 293,
    stock: true,
    badge: null,
    image: 'https://images.unsplash.com/photo-1592845148519-b0d41df97ac2?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 44,
    name: 'Villa Rosso Rosé di Puglia 2022',
    slug: 'villa-rosso-rose-di-puglia-2022-44',
    price: 310000,
    salePrice: null,
    category: 'vang-hong',
    theme: [],
    origin: 'y',
    originLabel: 'Ý',
    abv: 12,
    volume: 750,
    occasion: [
      'khai-vi'
    ],
    rating: 4.4,
    sold: 330,
    stock: true,
    badge: null,
    image: 'https://images.unsplash.com/photo-1638186095900-179bc805de09?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 45,
    name: 'Viña Andina Rosé 2022',
    slug: 'vina-andina-rose-2022-45',
    price: 265000,
    salePrice: null,
    category: 'vang-hong',
    theme: [],
    origin: 'chile',
    originLabel: 'Chile',
    abv: 12,
    volume: 750,
    occasion: [
      'hang-ngay'
    ],
    rating: 4.1,
    sold: 367,
    stock: true,
    badge: null,
    image: 'https://images.unsplash.com/photo-1700893417209-18dc88c989a0?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 46,
    name: 'Bodega del Rey Rosado 2022',
    slug: 'bodega-del-rey-rosado-2022-46',
    price: 290000,
    salePrice: 247000,
    category: 'vang-hong',
    theme: [],
    origin: 'tay-ban-nha',
    originLabel: 'Tây Ban Nha',
    abv: 12.5,
    volume: 750,
    occasion: [
      'tiec-tung'
    ],
    rating: 4.8,
    sold: 404,
    stock: true,
    badge: 'sale',
    image: 'https://images.unsplash.com/photo-1628187832510-94b4d90445af?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 47,
    name: 'Set quà tặng Vang Đỏ Pháp – Hộp gỗ 2 chai',
    slug: 'set-qua-tang-vang-do-phap-hop-go-2-chai-47',
    price: 1350000,
    salePrice: null,
    category: 'qua-tang-set',
    theme: [
      'cao-cap'
    ],
    origin: 'phap',
    originLabel: 'Pháp',
    abv: 13.5,
    volume: 1500,
    occasion: [
      'qua-tang'
    ],
    rating: 4.5,
    sold: 441,
    stock: true,
    badge: 'hot',
    image: 'https://images.unsplash.com/photo-1592903297149-37fb25202dfa?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 48,
    name: 'Hộp quà Sưu tầm Vang Ý – 3 chai cao cấp',
    slug: 'hop-qua-suu-tam-vang-y-3-chai-cao-cap-48',
    price: 2450000,
    salePrice: null,
    category: 'qua-tang-set',
    theme: [
      'cao-cap'
    ],
    origin: 'y',
    originLabel: 'Ý',
    abv: 13.5,
    volume: 2250,
    occasion: [
      'qua-tang',
      'suu-tam'
    ],
    rating: 4.2,
    sold: 48,
    stock: true,
    badge: null,
    image: 'https://images.unsplash.com/photo-1625552186152-668cd2f0b707?w=600&auto=format&fit=crop&q=80'
  }
];

// Khoảng giá tối đa dùng cho price-range slider
const MAX_PRICE = Math.max(...PRODUCTS.map(p => p.price));

