const projectsData = {
  'cloud-resume': {
    title: {
      tr: 'Cloud Resume',
      en: 'Cloud Resume'
    },
    description: {
      tr: 'Bu web sayfası, Oracle Cloud Infrastructure (OCI) üzerinde tamamen serverless (sunucusuz) bir mimari kullanılarak geliştirilmiş dinamik bir kişisel CV ve portfolio sitesidir. Proje, modern bulut teknolojileri ve DevOps süreçlerini kapsayan end-to-end (uçtan uca) bir uygulama olarak tasarlanmıştır. Sistem, ziyaretçi etkileşimlerini gerçek zamanlı olarak izleyen benzersiz bir sayaç mekanizması, otomatik günlük raporlama özelliği ve kullanıcı dostu bir deneyim sunan çok dilli destek içermektedir.',
      en: 'This web page is a dynamic personal CV and portfolio site developed using a completely serverless architecture on Oracle Cloud Infrastructure (OCI). The project was designed as an end-to-end application that encompasses modern cloud technologies and DevOps processes. The system includes a unique visitor counter mechanism that tracks visitor interactions in real-time, an automated daily reporting feature, and multi-language support providing a user-friendly experience.'
    },
    link: 'https://github.com/ynsergull/cloud-resume',
    skills: [
      'OCI Functions', 
      'OCI API Gateway', 
      'Object Storage', 
      'OCI Notifications', 
      'GitHub Actions', 
      'JavaScript',
      'Python',
      'TailwindCSS',
      'Cloudflare Pages',
      'OCI IAM',
      'Dynamic Groups',
      'Resource Principal',
      'Docker',
      'Fn CLI'
    ],
    details: {
      tr: `
        <ul class="space-y-2 pl-5 list-disc">
          <li>Dinamik ziyaretçi sayacı: Toplam ve benzersiz ziyaretçi istatistikleri</li>
          <li>Oracle Functions ile Python tabanlı serverless backend API'leri</li>
          <li>GitHub Actions ile tam otomatik CI/CD pipeline</li>
          <li>Cloudflare Pages ile global CDN dağıtımı</li>
          <li>OCI Notifications ile günlük otomatik e-posta raporlama</li>
          <li>Çok dilli destek (Türkçe/İngilizce) ve responsive tasarım</li>
          <li>Resource Principal authentication ile güvenli erişim yönetimi</li>
          <li>ETag mekanizması ile concurrent yazma işlemlerinin yönetimi</li>
          <li>Oracle Object Storage'da JSON tabanlı state yönetimi</li>
        </ul>
      `,
      en: `
        <ul class="space-y-2 pl-5 list-disc">
          <li>Dynamic visitor counter: Total and unique visitor statistics</li>
          <li>Python-based serverless backend APIs with Oracle Functions</li>
          <li>Fully automated CI/CD pipeline with GitHub Actions</li>
          <li>Global CDN deployment with Cloudflare Pages</li>
          <li>Daily automated email reporting with OCI Notifications</li>
          <li>Multi-language support (Turkish/English) and responsive design</li>
          <li>Secure access management with Resource Principal authentication</li>
          <li>Concurrent write operations management with ETag mechanism</li>
          <li>JSON-based state management in Oracle Object Storage</li>
        </ul>
      `
    }
  }
  // Diğer projeleri buraya ekleyebilirsiniz
};