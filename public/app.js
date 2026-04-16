/* ============================================================
   NexaStudio — Agency Website JS
   ============================================================ */

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
