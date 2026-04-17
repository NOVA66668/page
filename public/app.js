/* ============================================================
   NexaStudio — Agency Website JS
   ============================================================ */

/* ============================================================
   TRANSLATIONS  AR / FR
   ============================================================ */
const T = {
  ar: {
    'nav.services':'الخدمات','nav.tools':'أدواتنا','nav.pricing':'الباقات',
    'nav.testi':'آراء العملاء','nav.cta':'احصل على عرض مجاني',
    'hero.badge':'وكالة رقمية رائدة في المغرب',
    'hero.title1':'نبني','hero.title2':'حضورك الرقمي','hero.title3':'بأحدث التقنيات',
    'hero.sub':'من المواقع الاحترافية مع لوحة التحكم إلى المتاجر الإلكترونية وحلول الإيميل ماركتينغ — نصمم كل ما يحتاجه عملك للنجاح.',
    'hero.cta1':'ابدأ مشروعك الآن','hero.cta2':'اكتشف خدماتنا',
    'hero.stat1':'مشروع منجز','hero.stat2':'رضا العملاء','hero.stat3':'سنوات خبرة',
    'svc.tag':'خدماتنا','svc.title':'حلول رقمية لكل نوع عمل','svc.sub':'نقدم باقة متكاملة من الخدمات الرقمية المصممة لتنمية عملك',
    's1.h':'موقع مع لوحة تحكم','s1.p':'موقع احترافي كامل مع CMS سهل الاستخدام تدير به المحتوى بدون أي خبرة تقنية',
    's1.l1':'تصميم عصري ومتجاوب','s1.l2':'لوحة تحكم بالعربية','s1.l3':'سرعة تحميل فائقة','s1.l4':'SSL وحماية كاملة','s1.price':'على حسب المشروع',
    's2.h':'متجر إلكتروني متكامل','s2.p':'منصة تجارة إلكترونية احترافية مع إدارة المخزون والطلبات وبوابات الدفع',
    's2.l1':'إدارة المنتجات والمخزون','s2.l2':'بوابات دفع متعددة','s2.l3':'تقارير المبيعات','s2.l4':'نسخة موبايل سلسة','s2.price':'على حسب المشروع',
    's3.h':'إيميل ماركتينغ','s3.p':'حملات بريد إلكتروني آلية وذكية تبقيك على تواصل مستمر مع عملائك',
    's3.l1':'حملات تلقائية ذكية','s3.l2':'قوالب احترافية','s3.l3':'تتبع وتحليل النتائج','s3.l4':'تقسيم قوائم العملاء','s3.price':'على حسب المشروع',
    's4.h':'مواقع المقاولين','s4.p':'موقع متخصص لشركات البناء والمقاولة يجلب الزبائن ويدير الإعلانات ويراقب المنافسين',
    's4.l1':'عرض المشاريع والأعمال','s4.l2':'إدارة الإعلانات المدفوعة','s4.l3':'مراقبة المنافسين','s4.l4':'نموذج طلب عروض الأسعار','s4.price':'على حسب المشروع',
    's5.h':'إدارة الإعلانات','s5.p':'إدارة احترافية لحملاتك الإعلانية على Google وMeta لتحقيق أفضل عائد على الاستثمار',
    's5.l1':'Google Ads متقدم','s5.l2':'Facebook / Instagram Ads','s5.l3':'تحسين معدل التحويل','s5.l4':'تقارير أداء شهرية','s5.price':'على حسب المشروع',
    's6.h':'مراقبة المنافسين','s6.p':'نظام متكامل لتحليل منافسيك ومعرفة استراتيجياتهم لتبقى دائماً في المقدمة',
    's6.l1':'تحليل مواقع المنافسين','s6.l2':'تتبع الكلمات المفتاحية','s6.l3':'تقارير أسبوعية','s6.l4':'فرص النمو والتميز','s6.price':'على حسب المشروع',
    'why.tag':'لماذا نكسا ستوديو؟','why.title':'نبني أكثر من مجرد موقع','why.sub':'نحن لا نصمم مواقع فحسب — نبني أدوات نمو حقيقية تساعد عملك على جذب الزبائن وزيادة الأرباح.',
    'why.h1':'تسليم سريع','why.p1':'نلتزم بالمواعيد ونسلّم مشروعك في الوقت المحدد',
    'why.h2':'تصميم موجّه للنتائج','why.p2':'كل قرار تصميمي مبني على تحسين معدلات التحويل والمبيعات',
    'why.h3':'دعم تقني مستمر','why.p3':'فريقنا متاح دائماً لحل أي مشكلة أو تعديل فوري',
    'why.h4':'خبرة في السوق المغربي','why.p4':'نفهم طبيعة الزبون المغربي ونصمم حلولاً تناسبه',
    'why.s1':'مشروع منجز','why.s2':'رضا العملاء','why.s3':'رد خلال','why.s4':'سنوات خبرة',
    'proc.tag':'كيف نعمل','proc.title':'من الفكرة إلى الإطلاق','proc.sub':'عملية واضحة وشفافة من أول تواصل حتى التسليم النهائي',
    'proc.h1':'الاستشارة المجانية','proc.p1':'نتحدث عن مشروعك ونفهم احتياجاتك وأهدافك بالكامل',
    'proc.h2':'العرض والتصميم','proc.p2':'نقدم عرضاً مفصلاً ونبدأ بتصميم هوية موقعك الخاصة',
    'proc.h3':'التطوير والبناء','proc.p3':'نبني موقعك بأحدث التقنيات مع متابعتك في كل خطوة',
    'proc.h4':'الإطلاق والدعم','proc.p4':'نطلق موقعك ونضمن دعماً تقنياً مستمراً بعد التسليم',
    'tools.tag':'تقنياتنا','tools.title':'أدوات وتقنيات نبني بها مواقعك','tools.sub':'نستخدم أحدث المنصات والأدوات لضمان موقع سريع وآمن وقابل للتطوير',
    'tool.wp':'WordPress','tool.wc':'WooCommerce','tool.sh':'Shopify','tool.ga':'Google Ads','tool.fb':'Facebook Ads','tool.mc':'Mailchimp',
    'tool.wa':'WhatsApp API','tool.an':'Google Analytics','tool.re':'React / Next.js','tool.js':'JavaScript','tool.dk':'Docker / Cloud','tool.cf':'Cloudflare',
    'pkg.tag':'الباقات','pkg.title':'اختر الباقة المناسبة لعملك','pkg.sub':'كل باقة مخصصة — أخبرنا عن مشروعك وسنقترح الأنسب لك',
    'pkg.popular':'الأكثر طلباً','pkg.cta':'احصل على عرض','pkg.note':'* عرض مخصص مجاني حسب احتياجات مشروعك — تواصل معنا الآن',
    'pkg1.name':'الأساسية','pkg1.desc':'مثالية للأعمال الناشئة والمحلات الصغيرة',
    'pkg1.f1':'✓ موقع 5 صفحات','pkg1.f2':'✓ تصميم متجاوب','pkg1.f3':'✓ SSL مجاني','pkg1.f4':'✓ نموذج تواصل','pkg1.f5':'✓ تحسين SEO أساسي','pkg1.f6':'✗ لوحة تحكم CMS','pkg1.f7':'✗ إيميل ماركتينغ',
    'pkg2.name':'الاحترافية','pkg2.desc':'للأعمال المتوسطة والنامية',
    'pkg2.f1':'✓ صفحات غير محدودة','pkg2.f2':'✓ لوحة تحكم CMS كاملة','pkg2.f3':'✓ إيميل ماركتينغ أساسي','pkg2.f4':'✓ ربط السوشيال ميديا','pkg2.f5':'✓ تحسين SEO متقدم','pkg2.f6':'✓ تقارير تحليلية','pkg2.f7':'✗ متجر إلكتروني',
    'pkg3.name':'المتكاملة','pkg3.desc':'للمتاجر والأعمال الكبيرة',
    'pkg3.f1':'✓ كل ما في الاحترافية','pkg3.f2':'✓ متجر إلكتروني كامل','pkg3.f3':'✓ إدارة المخزون','pkg3.f4':'✓ بوابات دفع متعددة','pkg3.f5':'✓ إيميل ماركتينغ متقدم','pkg3.f6':'✓ مراقبة المنافسين','pkg3.f7':'✓ دعم تقني 6 أشهر',
    'tst.tag':'آراء عملائنا','tst.title':'ماذا يقول من عملوا معنا',
    'tst.q1':'"نكسا ستوديو غيّرت وجه أعمالي. الموقع جلب لي زبائن جدد كل أسبوع والإيميل ماركتينغ يعمل تلقائياً بدون تدخل مني."',
    'tst.r1':'مقاول — الدار البيضاء',
    'tst.q2':'"أنجزوا متجري الإلكتروني في أسبوعين مع لوحة تحكم سهلة جداً. مبيعاتي ارتفعت بـ 40% في أول شهر!"',
    'tst.r2':'متجر أزياء — مراكش',
    'tst.q3':'"خدمة ممتازة بأسعار معقولة. بنوا موقع عيادتي مع نظام الحجز وأصبح 80% من مرضاي يحجزون عبر الإنترنت."',
    'tst.r3':'طبيب أسنان — الرباط',
    'ct.tag':'تواصل معنا','ct.title':'احصل على عرض مجاني','ct.sub':'أخبرنا عن مشروعك وسنرسل لك عرضاً مفصّلاً خلال 24 ساعة',
    'ct.c1':'واتساب','ct.c2':'البريد الإلكتروني','ct.c3':'الموقع',
    'ct.t1':'⚡ رد خلال 24 ساعة','ct.t2':'🔒 معلوماتك محمية','ct.t3':'✅ استشارة مجانية',
    'form.name':'الاسم الكامل','form.phone':'رقم الهاتف','form.email':'البريد الإلكتروني',
    'form.biz':'نوع نشاطك التجاري','form.bizPh':'اختر نوع عملك','form.svcs':'الخدمات التي تحتاجها',
    'form.budget':'الميزانية المتاحة','form.budgetPh':'اختر ميزانيتك',
    'form.desc':'وصف مختصر للمشروع','form.send':'إرسال طلبك الآن',
    'form.ok1':'تم إرسال طلبك بنجاح!','form.ok2':'سيتواصل معك فريقنا خلال 24 ساعة لمناقشة مشروعك وتقديم عرض مخصص.','form.ok3':'تصفح خدماتنا',
    'ft.about':'وكالة رقمية متكاملة متخصصة في بناء المواقع والمتاجر الإلكترونية والتسويق الرقمي في المغرب.',
    'ft.h1':'خدماتنا','ft.h2':'روابط سريعة',
    'ft.s1':'مواقع مع لوحة تحكم','ft.s2':'متاجر إلكترونية','ft.s3':'إيميل ماركتينغ','ft.s4':'مواقع المقاولين','ft.s5':'إدارة الإعلانات',
  },
  fr: {
    'nav.services':'Services','nav.tools':'Nos Outils','nav.pricing':'Formules',
    'nav.testi':'Avis Clients','nav.cta':'Devis Gratuit',
    'hero.badge':'Agence digitale leader au Maroc',
    'hero.title1':'Nous construisons','hero.title2':'votre présence digitale','hero.title3':'avec les dernières technologies',
    'hero.sub':'Des sites professionnels avec CMS aux boutiques en ligne et l\'email marketing — nous créons tout ce dont votre entreprise a besoin.',
    'hero.cta1':'Démarrez maintenant','hero.cta2':'Découvrir nos services',
    'hero.stat1':'projets réalisés','hero.stat2':'satisfaction client','hero.stat3':'années d\'expérience',
    'svc.tag':'Nos Services','svc.title':'Solutions digitales pour chaque activité','svc.sub':'Nous proposons une gamme complète de services digitaux conçus pour développer votre entreprise',
    's1.h':'Site avec back-office','s1.p':'Un site professionnel complet avec un CMS facile à utiliser pour gérer votre contenu sans compétences techniques',
    's1.l1':'Design moderne & responsive','s1.l2':'Back-office en français','s1.l3':'Chargement ultra-rapide','s1.l4':'SSL & sécurité complète','s1.price':'Sur devis',
    's2.h':'Boutique en ligne complète','s2.p':'Plateforme e-commerce professionnelle avec gestion des stocks, commandes et paiements',
    's2.l1':'Gestion produits & stocks','s2.l2':'Passerelles de paiement','s2.l3':'Rapports de ventes','s2.l4':'Version mobile fluide','s2.price':'Sur devis',
    's3.h':'Email Marketing','s3.p':'Campagnes d\'emailing automatisées et intelligentes pour rester en contact avec vos clients',
    's3.l1':'Campagnes automatiques','s3.l2':'Templates professionnels','s3.l3':'Suivi & analyse des résultats','s3.l4':'Segmentation des listes','s3.price':'Sur devis',
    's4.h':'Sites pour entrepreneurs','s4.p':'Site spécialisé pour les entreprises de BTP qui attire des clients et gère les publicités',
    's4.l1':'Vitrine de projets réalisés','s4.l2':'Gestion des publicités payantes','s4.l3':'Veille concurrentielle','s4.l4':'Formulaire de demande de devis','s4.price':'Sur devis',
    's5.h':'Gestion des publicités','s5.p':'Gestion professionnelle de vos campagnes Google et Meta pour le meilleur retour sur investissement',
    's5.l1':'Google Ads avancé','s5.l2':'Facebook / Instagram Ads','s5.l3':'Optimisation du taux de conversion','s5.l4':'Rapports de performance mensuels','s5.price':'Sur devis',
    's6.h':'Veille concurrentielle','s6.p':'Système complet d\'analyse de vos concurrents pour toujours rester en tête du marché',
    's6.l1':'Analyse des sites concurrents','s6.l2':'Suivi des mots-clés','s6.l3':'Rapports hebdomadaires','s6.l4':'Opportunités de croissance','s6.price':'Sur devis',
    'why.tag':'Pourquoi NexaStudio ?','why.title':'Nous construisons plus qu\'un simple site','why.sub':'Nous ne faisons pas que des sites — nous créons de vrais outils de croissance pour attirer des clients et augmenter vos revenus.',
    'why.h1':'Livraison rapide','why.p1':'Nous respectons les délais et livrons votre projet à temps',
    'why.h2':'Design orienté résultats','why.p2':'Chaque décision de design vise à améliorer vos taux de conversion',
    'why.h3':'Support technique continu','why.p3':'Notre équipe est toujours disponible pour résoudre tout problème',
    'why.h4':'Expertise du marché marocain','why.p4':'Nous comprenons le client marocain et concevons des solutions adaptées',
    'why.s1':'projets réalisés','why.s2':'satisfaction client','why.s3':'réponse en','why.s4':'années d\'expérience',
    'proc.tag':'Notre méthode','proc.title':'De l\'idée au lancement','proc.sub':'Un processus clair et transparent du premier contact jusqu\'à la livraison finale',
    'proc.h1':'Consultation gratuite','proc.p1':'Nous discutons de votre projet et comprenons vos besoins et objectifs',
    'proc.h2':'Devis & design','proc.p2':'Nous proposons un devis détaillé et commençons à concevoir votre identité visuelle',
    'proc.h3':'Développement','proc.p3':'Nous construisons votre site avec les dernières technologies en vous tenant informé à chaque étape',
    'proc.h4':'Lancement & support','proc.p4':'Nous lançons votre site et garantissons un support technique continu après livraison',
    'tools.tag':'Nos Technologies','tools.title':'Outils & technologies que nous utilisons','tools.sub':'Nous utilisons les meilleures plateformes pour un site rapide, sécurisé et évolutif',
    'tool.wp':'WordPress','tool.wc':'WooCommerce','tool.sh':'Shopify','tool.ga':'Google Ads','tool.fb':'Facebook Ads','tool.mc':'Mailchimp',
    'tool.wa':'WhatsApp API','tool.an':'Google Analytics','tool.re':'React / Next.js','tool.js':'JavaScript','tool.dk':'Docker / Cloud','tool.cf':'Cloudflare',
    'pkg.tag':'Nos Formules','pkg.title':'Choisissez la formule adaptée','pkg.sub':'Chaque projet est unique — contactez-nous pour un devis personnalisé',
    'pkg.popular':'La plus demandée','pkg.cta':'Obtenir un devis','pkg.note':'* Devis personnalisé gratuit selon vos besoins — contactez-nous maintenant',
    'pkg1.name':'Essentielle','pkg1.desc':'Idéale pour les petites entreprises',
    'pkg1.f1':'✓ Site 5 pages','pkg1.f2':'✓ Design responsive','pkg1.f3':'✓ SSL gratuit','pkg1.f4':'✓ Formulaire de contact','pkg1.f5':'✓ SEO de base','pkg1.f6':'✗ CMS / Back-office','pkg1.f7':'✗ Email marketing',
    'pkg2.name':'Professionnelle','pkg2.desc':'Pour les entreprises en croissance',
    'pkg2.f1':'✓ Pages illimitées','pkg2.f2':'✓ CMS complet','pkg2.f3':'✓ Email marketing','pkg2.f4':'✓ Intégration réseaux sociaux','pkg2.f5':'✓ SEO avancé','pkg2.f6':'✓ Rapports analytiques','pkg2.f7':'✗ Boutique en ligne',
    'pkg3.name':'Intégrale','pkg3.desc':'Pour les boutiques et grandes entreprises',
    'pkg3.f1':'✓ Tout de la Professionnelle','pkg3.f2':'✓ Boutique en ligne complète','pkg3.f3':'✓ Gestion des stocks','pkg3.f4':'✓ Paiement multi-devises','pkg3.f5':'✓ Email marketing avancé','pkg3.f6':'✓ Veille concurrentielle','pkg3.f7':'✓ Support technique 6 mois',
    'tst.tag':'Avis de nos clients','tst.title':'Ce que disent ceux qui ont travaillé avec nous',
    'tst.q1':'"NexaStudio a transformé mon activité. Le site m\'apporte de nouveaux clients chaque semaine et l\'email marketing fonctionne automatiquement."',
    'tst.r1':'Entrepreneur BTP — Casablanca',
    'tst.q2':'"Ils ont réalisé ma boutique en ligne en deux semaines avec un back-office très facile. Mes ventes ont augmenté de 40% le premier mois !"',
    'tst.r2':'Boutique mode — Marrakech',
    'tst.q3':'"Service excellent. Ils ont créé mon site de cabinet avec le système de réservation et maintenant 80% de mes patients réservent en ligne."',
    'tst.r3':'Dentiste — Rabat',
    'ct.tag':'Contactez-nous','ct.title':'Obtenez un devis gratuit','ct.sub':'Parlez-nous de votre projet et nous vous enverrons une offre détaillée dans les 24 heures',
    'ct.c1':'WhatsApp','ct.c2':'Email','ct.c3':'Adresse',
    'ct.t1':'⚡ Réponse en 24h','ct.t2':'🔒 Données protégées','ct.t3':'✅ Consultation gratuite',
    'form.name':'Nom complet','form.phone':'Numéro de téléphone','form.email':'Adresse email',
    'form.biz':'Type d\'activité','form.bizPh':'Choisissez votre secteur','form.svcs':'Services souhaités',
    'form.budget':'Budget disponible','form.budgetPh':'Choisissez votre budget',
    'form.desc':'Description du projet','form.send':'Envoyer ma demande',
    'form.ok1':'Demande envoyée avec succès !','form.ok2':'Notre équipe vous contactera dans les 24 heures pour discuter de votre projet.','form.ok3':'Voir nos services',
    'ft.about':'Agence digitale spécialisée dans la création de sites web, boutiques en ligne et marketing digital au Maroc.',
    'ft.h1':'Nos Services','ft.h2':'Liens rapides',
    'ft.s1':'Sites avec back-office','ft.s2':'Boutiques en ligne','ft.s3':'Email marketing','ft.s4':'Sites entrepreneurs','ft.s5':'Gestion des publicités',
  }
};

let currentLang = 'ar';

function applyLang(lang) {
  currentLang = lang;
  const isAr = lang === 'ar';
  document.documentElement.lang = lang;
  document.documentElement.dir = isAr ? 'rtl' : 'ltr';

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (T[lang] && T[lang][key]) el.textContent = T[lang][key];
  });

  document.getElementById('btnAr').classList.toggle('active', isAr);
  document.getElementById('btnFr').classList.toggle('active', !isAr);
}

document.getElementById('btnAr').addEventListener('click', () => applyLang('ar'));
document.getElementById('btnFr').addEventListener('click', () => applyLang('fr'));

/* ---------- Navbar scroll effect ---------- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

/* ---------- Mobile menu ---------- */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ---------- Counter animation ---------- */
function animateCounter(el) {
  const target = parseInt(el.dataset.to, 10);
  const duration = 1800;
  const step = 16;
  const increment = target / (duration / step);
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current);
    }
  }, step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

/* ---------- Scroll reveal ---------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.svc-card, .port-card, .price-card, .testi-card, .proc-step, .sc-card, .why-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  revealObserver.observe(el);
});

document.addEventListener('animationend', () => {}, { once: true });

const styleTag = document.createElement('style');
styleTag.textContent = `.revealed { opacity: 1 !important; transform: translateY(0) !important; }`;
document.head.appendChild(styleTag);

/* ---------- Smooth scroll for anchor links ---------- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - offset,
      behavior: 'smooth'
    });
  });
});

/* ---------- Active nav link on scroll ---------- */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => activeObserver.observe(s));

/* ---------- Contact Form Validation & Submit ---------- */
const form        = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

function showErr(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}
function clearErr(id) {
  const el = document.getElementById(id);
  if (el) el.textContent = '';
}
function markField(id, hasError) {
  const field = document.getElementById(id);
  if (field) field.classList.toggle('error', hasError);
}

function validateForm() {
  let valid = true;

  const fname = document.getElementById('fname').value.trim();
  if (fname.length < 2) {
    showErr('fnameErr', 'يرجى إدخال اسمك الكامل');
    markField('fname', true);
    valid = false;
  } else {
    clearErr('fnameErr');
    markField('fname', false);
  }

  const phone = document.getElementById('fphone').value.trim();
  if (phone.length < 8) {
    showErr('fphoneErr', 'يرجى إدخال رقم هاتف صحيح');
    markField('fphone', true);
    valid = false;
  } else {
    clearErr('fphoneErr');
    markField('fphone', false);
  }

  const email = document.getElementById('femail').value.trim();
  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRx.test(email)) {
    showErr('femailErr', 'يرجى إدخال بريد إلكتروني صحيح');
    markField('femail', true);
    valid = false;
  } else {
    clearErr('femailErr');
    markField('femail', false);
  }

  const business = document.getElementById('fbusiness').value;
  if (!business) {
    showErr('fbusinessErr', 'يرجى اختيار نوع نشاطك');
    markField('fbusiness', true);
    valid = false;
  } else {
    clearErr('fbusinessErr');
    markField('fbusiness', false);
  }

  const budget = document.getElementById('fbudget').value;
  if (!budget) {
    showErr('fbudgetErr', 'يرجى اختيار الميزانية');
    markField('fbudget', true);
    valid = false;
  } else {
    clearErr('fbudgetErr');
    markField('fbudget', false);
  }

  return valid;
}

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>جاري الإرسال...</span>';

    await new Promise(r => setTimeout(r, 1200));

    form.style.display = 'none';
    formSuccess.classList.add('visible');

    submitBtn.disabled = false;
    submitBtn.innerHTML = 'إرسال طلبك الآن <span class="btn-arrow">←</span>';
  });

  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => {
      field.classList.remove('error');
      const errId = field.id + 'Err';
      clearErr(errId);
    });
  });
}

/* ---------- Stagger reveal for grids ---------- */
document.querySelectorAll('.services-grid .svc-card, .testi-grid .testi-card, .portfolio-grid-new .pcard').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.08}s`;
});

/* ---------- Portfolio filter ---------- */
const pfBtns  = document.querySelectorAll('.pf-btn');
const pCards  = document.querySelectorAll('.pcard');

pfBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    pfBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    pCards.forEach(card => {
      const match = filter === 'all' || card.dataset.cat === filter;
      card.style.display = match ? '' : 'none';
      if (match) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        requestAnimationFrame(() => {
          card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        });
      }
    });
  });
});
