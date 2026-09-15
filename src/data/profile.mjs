// Professional facts follow Yunus_Ergul_CV_EN_02.pdf. Keep dates explicit.
export const profile = {
  name: 'Yunus Ergül',
  role: 'Software Engineer',
  focus: 'Backend & Full-Stack',
  email: 'yunus.ergul7@outlook.com',
  github: 'https://github.com/ynsergull',
  linkedin: 'https://www.linkedin.com/in/yunusergul7/',
  resume: '/assets/Yunus_Ergul_CV_EN.pdf',
  certificate: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=82EEB7090EE8378744A5697CF025D367FD55C8807D67A7F6261F2B268B9FBD89',
};

export const experience = [
  {
    id: 'fonksiyonel', company: 'Fonksiyonel Holding', current: true,
    role: { tr: 'Yazılım Mühendisi', en: 'Software Engineer' },
    period: { tr: 'Nis 2026 — Günümüz', en: 'Apr 2026 — Present' },
    summary: {
      tr: 'Kiraladık.com’u sıfırdan geliştiriyorum. Gereksinimler ve sistem tasarımından testlere ve canlıya almaya kadar, kiralama platformunun uçtan uca sorumluluğunu üstleniyorum.',
      en: 'Building Kiraladik.com from the ground up. I own the rental marketplace end to end, from requirements and system design to testing and production release.',
    },
    highlights: {
      tr: [
        'Birden çok ödeme sağlayıcısını ortak bir arayüzde birleştiren; callback, iade ve hata yönetimini kapsayan ödeme altyapısı.',
        'Çift tahsilatı önleyen idempotent abonelik akışları, zamanlanmış ödemeler ve başarısız tahsilatların takibi.',
        'SOAP üzerinden UBL e-fatura senkronizasyonu; yeniden deneme, oturum yenileme ve mükerrer faturayı önleyen işleme.',
        'Sözleşme limitlerini ve fiyat anlık görüntülerini kullanan iptal, iade ve erken fesih hesaplamaları.',
        'Kupon, sepet, stok rezervasyonu ve yetki tabanlı yönetim modülleri; Pest/PHPUnit ile kritik akış testleri.',
      ],
      en: [
        'Unified payment gateway interface across multiple providers, including callbacks, refunds and a shared error model.',
        'Idempotent subscription flows that prevent double charging, with scheduled payments and failed-payment recovery.',
        'SOAP-based UBL invoice synchronisation with retries, session renewal and duplicate-safe processing.',
        'Cancellation, return and early-termination calculations based on price snapshots and contractual limits.',
        'Coupon, cart, stock reservation and permission-based admin modules; critical-flow tests with Pest/PHPUnit.',
      ],
    },
    stack: ['Laravel', 'React', 'MySQL', 'Pest / PHPUnit', 'REST & SOAP'],
  },
  {
    id: 'delta', company: 'Delta Servis', current: false,
    role: { tr: 'Yazılım Mühendisi', en: 'Software Engineer' },
    period: { tr: 'Tem 2024 — Nis 2026', en: 'Jul 2024 — Apr 2026' },
    summary: {
      tr: 'Yenilenmiş mobil cihazların operasyonel yaşam döngüsünü yöneten ERP sisteminde backend, finans ve entegrasyon modülleri geliştirdim.',
      en: 'Developed backend, finance and integration modules for an ERP system managing the operational lifecycle of refurbished mobile devices.',
    },
    highlights: {
      tr: [
        'Kabul, listeleme, onay, iade ve stok sayımı süreçleri için ERP modülleri ve Laravel tabanlı finans altyapısı.',
        'E-fatura, kargo ve SMS servisleriyle entegrasyonlar; kimlik doğrulama, yeniden deneme ve hata kurtarma akışları.',
        'Pazaryerleri için ürün, stok ve sipariş senkronizasyonu; çoklu veritabanı üzerinde performans odaklı SQL raporları.',
        'Yüksek veri hacminde Redis ve kuyruklarla işleme; sprint planlama ve kod incelemelerine aktif katılım.',
      ],
      en: [
        'ERP modules for intake, listing, approval, returns and stock counts, alongside a Laravel-based finance backend.',
        'E-invoicing, shipping and SMS integrations with authentication, retries and error recovery.',
        'Marketplace product, stock and order synchronisation, plus performance-oriented SQL reporting across databases.',
        'Redis and queued processing for high data volumes; active participation in sprint planning and code reviews.',
      ],
    },
    stack: ['PHP', 'Laravel', 'MySQL', 'Redis', 'REST API'],
  },
  {
    id: 'adresgezgini', company: 'Adresgezgini', current: false,
    role: { tr: 'Web Geliştirme Stajyeri', en: 'Web Development Intern' },
    period: { tr: 'Şub 2024 — Haz 2024', en: 'Feb 2024 — Jun 2024' },
    summary: {
      tr: 'İl ve ilçe seçimleriyle Google Ads anahtar kelimeleri üreten etkileşimli Türkiye haritasını geliştirdim. SEO uyumlu kurumsal sitelerin frontend ve backend çalışmalarına katkıda bulundum.',
      en: 'Built an interactive map of Türkiye that generates Google Ads keywords from province and district selections. Contributed to the frontend and backend of SEO-friendly corporate sites.',
    },
    stack: ['PHP', 'JavaScript', 'jQuery', 'MySQL'],
  },
  {
    id: 'unsped', company: 'Ünsped', current: false,
    role: { tr: 'Web Geliştirme Stajyeri', en: 'Web Development Intern' },
    period: { tr: 'Tem 2021 — Eyl 2021', en: 'Jul 2021 — Sep 2021' },
    summary: {
      tr: 'ASP.NET MVC projelerinde frontend ve backend geliştirdim. Entity Framework ve SQL Server ile veri modelledim; müşteri parametrelerine göre kargo maliyeti hesaplayan bir sayfa oluşturdum.',
      en: 'Worked on ASP.NET MVC frontend and backend development. Modelled data with Entity Framework and SQL Server, and built a shipping-cost calculator driven by customer parameters.',
    },
    stack: ['ASP.NET MVC', 'Entity Framework', 'SQL Server'],
  },
];

export const skillGroups = [
  { id: 'backend', icon: 'code', title: { tr: 'Backend & mimari', en: 'Backend & architecture' }, items: ['PHP / Laravel', 'Python', 'RESTful API', 'Eloquent ORM', 'Service layer', 'Dependency Injection', 'PSR'] },
  { id: 'data', icon: 'database', title: { tr: 'Veri & entegrasyon', en: 'Data & integration' }, items: ['MySQL / MariaDB', 'SQL Server', 'Redis', 'Queues & jobs', 'Webhooks', 'REST / SOAP', 'UBL', 'OAuth'] },
  { id: 'frontend', icon: 'layout', title: { tr: 'Frontend', en: 'Frontend' }, items: ['JavaScript', 'React', 'Vite', 'HTML / CSS', 'Tailwind CSS', 'jQuery / AJAX', 'Bootstrap'] },
  { id: 'quality', icon: 'check', title: { tr: 'Kalite & teslimat', en: 'Quality & delivery' }, items: ['Pest / PHPUnit', 'Feature & E2E tests', 'Mocking', 'Docker', 'Git / GitHub Actions', 'Linux', 'OCI'] },
];
