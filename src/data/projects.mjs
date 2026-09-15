// Work samples and personal projects are deliberately labelled separately.
export const projects = [
  {
    id: 'kiraladik', category: 'work', visual: 'commerce', number: '01',
    title: { tr: 'Kiraladık.com', en: 'Kiraladik.com' },
    type: { tr: 'Profesyonel çalışma · Fonksiyonel Holding', en: 'Professional work · Fonksiyonel Holding' },
    description: {
      tr: 'Bir kiralama platformunun arkasındaki sistemler: ödeme, abonelik, e-fatura ve operasyon. Gereksinimden canlıya, uçtan uca geliştirme.',
      en: 'The systems behind a rental platform: payments, subscriptions, e-invoicing and operations. End-to-end development, from requirements to production.',
    },
    stack: ['Laravel', 'React', 'MySQL', 'Pest'],
    sections: {
      tr: [
        ['İhtiyaç', 'Kiralama işlemlerinin ödeme, abonelik ve operasyon süreçlerini tutarlı bir platformda bir araya getirmek.'],
        ['Katkım', 'Gereksinimlerin netleştirilmesi, sistem ve veri modeli tasarımı, backend ve frontend geliştirme, testler ve canlıya alma süreçlerini üstleniyorum.'],
        ['Teknik yaklaşım', 'Ödeme sağlayıcılarını ortak bir gateway arayüzünün arkasında topluyorum. Zamanlanmış tahsilatları, iadeleri ve e-fatura işlemlerini idempotent tasarlayarak tekrarlanan tetiklemelerin mükerrer işleme dönüşmesini önlüyorum.'],
        ['Kalite', 'Pest/PHPUnit ile kritik senaryoları regresyon testlerine bağlıyorum. Üretimde kuyruk işçilerini, zamanlanmış görevleri ve Cloudflare arkasındaki güvenlik ayarlarını takip ediyorum.'],
      ],
      en: [
        ['The need', 'Bring the payment, subscription and operational processes of a rental marketplace into a consistent platform.'],
        ['My contribution', 'I own requirements refinement, system and data design, backend and frontend development, testing and production releases.'],
        ['Technical approach', 'Payment providers sit behind a shared gateway interface. Scheduled charges, refunds and invoice processing are idempotent so repeated triggers do not create duplicate transactions.'],
        ['Quality', 'Critical scenarios are covered by Pest/PHPUnit regression tests. I monitor production queue workers, scheduled jobs and security settings behind Cloudflare.'],
      ],
    },
  },
  {
    id: 'erp', category: 'work', visual: 'erp', number: '02',
    title: { tr: 'ERP & pazaryeri entegrasyonları', en: 'ERP & marketplace integrations' },
    type: { tr: 'Profesyonel çalışma · Delta Servis', en: 'Professional work · Delta Servis' },
    description: {
      tr: 'Yenilenmiş cihazların yaşam döngüsünü yöneten ERP modülleri. Ürün, stok ve siparişleri birbirine bağlayan entegrasyonlar.',
      en: 'ERP modules for the lifecycle of refurbished devices. Integrations connecting products, inventory and orders across systems.',
    },
    stack: ['Laravel', 'MySQL', 'Redis', 'REST API'],
    sections: {
      tr: [
        ['İhtiyaç', 'Cihaz kabulünden satış ve iadeye uzanan operasyonları yönetmek; ERP ile harici servisler arasında tutarlı veri akışı sağlamak.'],
        ['Katkım', 'ERP modülleri ve finans altyapısı geliştirdim. Pazaryeri ürün, stok ve sipariş senkronizasyonu için RESTful API katmanında çalıştım.'],
        ['Teknik yaklaşım', 'E-fatura, kargo ve SMS entegrasyonlarında kimlik doğrulama, yeniden deneme ve hata kurtarma senaryolarını ele aldım. Redis ve kuyrukları kullandım, çoklu veritabanı üzerinde raporlama sorguları geliştirdim.'],
      ],
      en: [
        ['The need', 'Manage operations from device intake to sales and returns, while maintaining consistent data flows between the ERP and external services.'],
        ['My contribution', 'Developed ERP modules and finance infrastructure. Worked on the RESTful API layer for marketplace product, stock and order synchronisation.'],
        ['Technical approach', 'Handled authentication, retries and recovery in invoice, shipping and SMS integrations. Used Redis and queues, and built reporting queries across multiple databases.'],
      ],
    },
  },
  {
    id: 'cloud-resume', category: 'personal', visual: 'cloud', number: '03',
    title: { tr: 'Cloud Resume', en: 'Cloud Resume' },
    type: { tr: 'Kişisel proje · Cloud & serverless', en: 'Personal project · Cloud & serverless' },
    description: {
      tr: 'Şu an gezdiğin kişisel portfolyo. OCI ile ziyaretçi sayacı ve otomatik raporlamayı deneyimlemek için başladığım iki dilli web projesi.',
      en: 'The portfolio you are browsing. A bilingual web project I started to explore an OCI visitor counter and automated reporting.',
    },
    stack: ['OCI', 'Python', 'GitHub Actions', 'Cloudflare'],
    link: 'https://github.com/ynsergull/cloud-resume',
    sections: {
      tr: [
        ['Amaç', 'Kişisel CV sayfasını, bulut servislerini uygulayarak öğrenebileceğim bir projeye dönüştürmek.'],
        ['İlk mimari', 'Cloudflare üzerinden yayınlanan arayüz; OCI API Gateway ve Python Functions ile ziyaretçi sayacı; Object Storage üzerinde JSON veri saklama; Notifications ve GitHub Actions ile günlük rapor tetikleme.'],
        ['Öğrendiklerim', 'Resource Principal ile servis kimlik doğrulaması, IAM izinleri, ETag ile eşzamanlı yazma kontrolü ve tarayıcı kimliğinin hashlenmesi.'],
        ['Mevcut aşama', 'Tasarım ve içerik yenileniyor. OCI sayaç ve raporlama entegrasyonu sonraki geliştirme aşamasında yeniden ele alınacak.'],
      ],
      en: [
        ['The goal', 'Turn a personal résumé into a practical project for learning cloud services.'],
        ['Original architecture', 'A Cloudflare-hosted frontend; OCI API Gateway and Python Functions for the visitor counter; JSON storage in Object Storage; daily report triggers using Notifications and GitHub Actions.'],
        ['What I learned', 'Resource Principal authentication, IAM permissions, ETag-based concurrent writes and hashing browser identifiers.'],
        ['Current phase', 'The design and content are being refreshed. The OCI counter and reporting integration will be revisited in the next development phase.'],
      ],
    },
  },
  {
    id: 'transcriber', category: 'personal', visual: 'audio', number: '04',
    title: { tr: 'YouTube Transcriber', en: 'YouTube Transcriber' },
    type: { tr: 'Kişisel proje · Python & AI', en: 'Personal project · Python & AI' },
    description: {
      tr: 'Videodaki konuşmadan düzenli bir metne. Çok dilli transkripsiyon, otomatik özetleme ve PDF çıktısı sunan masaüstü uygulaması.',
      en: 'From spoken video to structured text. A desktop application with multilingual transcription, automatic summaries and PDF export.',
    },
    stack: ['Python', 'Whisper', 'Tkinter', 'yt-dlp'],
    sections: {
      tr: [
        ['Amaç', 'YouTube videolarındaki konuşmaları okunabilir, yeniden kullanılabilir metinlere dönüştürmek.'],
        ['Uygulama', 'Tkinter arayüzüyle çalışan Python masaüstü uygulaması. yt-dlp ile alınan video sesi, OpenAI Whisper ile birden fazla dilde metne dönüştürülüyor.'],
        ['Özellikler', 'Otomatik özetleme ve PDF dışa aktarma, çıktının not alma ve arşivleme amacıyla kullanılmasını sağlıyor.'],
      ],
      en: [
        ['The goal', 'Turn speech in YouTube videos into readable, reusable text.'],
        ['The application', 'A Python desktop application with a Tkinter interface. Audio retrieved with yt-dlp is transcribed in multiple languages using OpenAI Whisper.'],
        ['Features', 'Automatic summarisation and PDF export make the output useful for note-taking and archiving.'],
      ],
    },
  },
];
