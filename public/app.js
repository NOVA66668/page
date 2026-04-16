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
    'tools.tag':'تقنياتنا','tools.title':'أدوات وتقنيات نبني بها مواقعك',
    'tools.sub':'نستخدم أحدث المنصات والأدوات لضمان موقع سريع وآمن وقابل للتطوير',
    'tool.wp':'WordPress','tool.wc':'WooCommerce','tool.sh':'Shopify',
    'tool.ga':'Google Ads','tool.fb':'Facebook Ads','tool.mc':'Mailchimp',
    'tool.wa':'WhatsApp API','tool.an':'Google Analytics','tool.re':'React / Next.js',
    'tool.js':'JavaScript','tool.dk':'Docker / Cloud','tool.cf':'Cloudflare',
    'pkg.tag':'الباقات','pkg.title':'اختر الباقة المناسبة لعملك',
    'pkg.sub':'كل باقة مخصصة — أخبرنا عن مشروعك وسنقترح الأنسب لك',
    'pkg.popular':'الأكثر طلباً','pkg.cta':'احصل على عرض',
    'pkg.note':'* عرض مخصص مجاني حسب احتياجات مشروعك — تواصل معنا الآن',
    'pkg1.name':'الأساسية','pkg1.desc':'مثالية للأعمال الناشئة والمحلات الصغيرة',
    'pkg1.f1':'✓ موقع 5 صفحات','pkg1.f2':'✓ تصميم متجاوب','pkg1.f3':'✓ SSL مجاني',
    'pkg1.f4':'✓ نموذج تواصل','pkg1.f5':'✓ تحسين SEO أساسي','pkg1.f6':'✗ لوحة تحكم CMS','pkg1.f7':'✗ إيميل ماركتينغ',
    'pkg2.name':'الاحترافية','pkg2.desc':'للأعمال المتوسطة والنامية',
    'pkg2.f1':'✓ صفحات غير محدودة','pkg2.f2':'✓ لوحة تحكم CMS كاملة',
    'pkg2.f3':'✓ إيميل ماركتينغ أساسي','pkg2.f4':'✓ ربط السوشيال ميديا',
    'pkg2.f5':'✓ تحسين SEO متقدم','pkg2.f6':'✓ تقارير تحليلية','pkg2.f7':'✗ متجر إلكتروني',
    'pkg3.name':'المتكاملة','pkg3.desc':'للمتاجر والأعمال الكبيرة',
    'pkg3.f1':'✓ كل ما في الاحترافية','pkg3.f2':'✓ متجر إلكتروني كامل',
    'pkg3.f3':'✓ إدارة المخزون','pkg3.f4':'✓ بوابات دفع متعددة',
    'pkg3.f5':'✓ إيميل ماركتينغ متقدم','pkg3.f6':'✓ مراقبة المنافسين','pkg3.f7':'✓ دعم تقني 6 أشهر',
    'form.budgetPh':'اختر ميزانيتك',
  },
  fr: {
    'nav.services':'Services','nav.tools':'Nos Outils','nav.pricing':'Formules',
    'nav.testi':'Avis Clients','nav.cta':'Devis Gratuit',
    'hero.badge':'Agence digitale leader au Maroc',
    'hero.title1':'Nous construisons','hero.title2':'votre présence digitale','hero.title3':'avec les dernières technologies',
    'hero.sub':'Des sites professionnels avec CMS aux boutiques en ligne et solutions d\'emailing — nous créons tout ce dont votre entreprise a besoin.',
    'hero.cta1':'Démarrez votre projet','hero.cta2':'Découvrir nos services',
    'hero.stat1':'projets réalisés','hero.stat2':'satisfaction client','hero.stat3':'années d\'expérience',
    'tools.tag':'Nos Technologies','tools.title':'Outils & technologies que nous utilisons',
    'tools.sub':'Nous utilisons les meilleures plateformes pour un site rapide, sécurisé et évolutif',
    'tool.wp':'WordPress','tool.wc':'WooCommerce','tool.sh':'Shopify',
    'tool.ga':'Google Ads','tool.fb':'Facebook Ads','tool.mc':'Mailchimp',
    'tool.wa':'WhatsApp API','tool.an':'Google Analytics','tool.re':'React / Next.js',
    'tool.js':'JavaScript','tool.dk':'Docker / Cloud','tool.cf':'Cloudflare',
    'pkg.tag':'Formules','pkg.title':'Choisissez la formule adaptée',
    'pkg.sub':'Chaque projet est unique — contactez-nous pour un devis personnalisé',
    'pkg.popular':'La plus demandée','pkg.cta':'Obtenir un devis',
    'pkg.note':'* Devis personnalisé gratuit selon vos besoins — contactez-nous',
    'pkg1.name':'Essentielle','pkg1.desc':'Idéale pour les petites entreprises',
    'pkg1.f1':'✓ Site 5 pages','pkg1.f2':'✓ Design responsive','pkg1.f3':'✓ SSL gratuit',
    'pkg1.f4':'✓ Formulaire de contact','pkg1.f5':'✓ SEO de base','pkg1.f6':'✗ CMS / Back-office','pkg1.f7':'✗ Email marketing',
    'pkg2.name':'Professionnelle','pkg2.desc':'Pour les entreprises en croissance',
    'pkg2.f1':'✓ Pages illimitées','pkg2.f2':'✓ CMS complet',
    'pkg2.f3':'✓ Email marketing','pkg2.f4':'✓ Intégration réseaux sociaux',
    'pkg2.f5':'✓ SEO avancé','pkg2.f6':'✓ Rapports analytiques','pkg2.f7':'✗ Boutique en ligne',
    'pkg3.name':'Intégrale','pkg3.desc':'Pour les boutiques et grandes entreprises',
    'pkg3.f1':'✓ Tout de la Pro','pkg3.f2':'✓ Boutique en ligne complète',
    'pkg3.f3':'✓ Gestion des stocks','pkg3.f4':'✓ Paiement multi-devises',
    'pkg3.f5':'✓ Email marketing avancé','pkg3.f6':'✓ Veille concurrentielle','pkg3.f7':'✓ Support technique 6 mois',
    'form.budgetPh':'Choisissez votre budget',
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
