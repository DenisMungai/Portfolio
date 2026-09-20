// Dynamic Year
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Mobile Drawer Navigation (Half-screen menu with backdrop)
const burgerBtn = document.getElementById('burgerBtn');
const closeMenuBtn = document.getElementById('closeMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const drawerBackdrop = document.getElementById('drawerBackdrop');

function openMenu() {
  if (!mobileMenu || !burgerBtn) return;
  mobileMenu.classList.add('open');
  mobileMenu.setAttribute('aria-hidden', 'false');
  if (drawerBackdrop) drawerBackdrop.classList.add('open');
  burgerBtn.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';

  const focusable = mobileMenu.querySelectorAll('button, a[href]');
  if (focusable.length > 0) {
    focusable[0].focus();
  }
}

function closeMenu() {
  if (!mobileMenu || !burgerBtn) return;
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  if (drawerBackdrop) drawerBackdrop.classList.remove('open');
  burgerBtn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  burgerBtn.focus();
}

if (burgerBtn && mobileMenu) {
  burgerBtn.addEventListener('click', openMenu);
}

if (closeMenuBtn) {
  closeMenuBtn.addEventListener('click', closeMenu);
}

if (drawerBackdrop) {
  drawerBackdrop.addEventListener('click', closeMenu);
}

if (mobileMenu) {
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  // Trap focus and handle Escape key inside mobile menu
  mobileMenu.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenu();
      return;
    }

    if (e.key === 'Tab') {
      const focusableEls = mobileMenu.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusableEls.length === 0) return;
      const firstEl = focusableEls[0];
      const lastEl = focusableEls[focusableEls.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    }
  });
}

// Global escape key listener
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('open')) {
    closeMenu();
  }
});

// Scroll Reveal Animations
const revealEls = document.querySelectorAll('.reveal');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  revealEls.forEach(el => el.classList.add('in'));
} else {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  revealEls.forEach(el => revealObserver.observe(el));
}

// Project Filter Buttons
const filterPills = document.querySelectorAll('.filter-pill');
const workCards = document.querySelectorAll('#projectsGrid .work-card');

filterPills.forEach(pill => {
  pill.addEventListener('click', () => {
    filterPills.forEach(p => {
      p.classList.remove('active');
      p.setAttribute('aria-pressed', 'false');
    });
    pill.classList.add('active');
    pill.setAttribute('aria-pressed', 'true');

    const filter = pill.getAttribute('data-filter');

    workCards.forEach(card => {
      const isFeatured = card.getAttribute('data-featured') === 'true';
      const category = card.getAttribute('data-cat');

      let show = false;
      if (filter === 'featured') {
        show = isFeatured;
      } else if (filter === 'all') {
        show = true;
      } else {
        show = category === filter;
      }

      if (show) {
        card.style.display = 'flex';
        setTimeout(() => card.classList.add('in'), 50);
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// Active Navigation link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links .nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  const scrollY = window.pageYOffset;

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    const sectionHeight = section.offsetHeight;
    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}, { passive: true });

// Contact form - AJAX submit with FormSubmit.co
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const submitBtn = document.getElementById('submitBtn');
  const submitBtnText = document.getElementById('submitBtnText');
  const formStatus = document.getElementById('formStatus');

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtnText.textContent = 'SENDING...';
    formStatus.textContent = '';
    formStatus.style.color = '';

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(contactForm)
      });

      if (response.ok) {
        formStatus.textContent = 'Message sent! I will get back to you within 24 hours.';
        formStatus.style.color = '#4ADE80';
        contactForm.reset();
      } else {
        formStatus.textContent = 'Something went wrong. Please try again or email mungaidenis45@gmail.com directly.';
        formStatus.style.color = '#F87171';
      }
    } catch (err) {
      formStatus.textContent = 'Something went wrong. Please try again or email mungaidenis45@gmail.com directly.';
      formStatus.style.color = '#F87171';
    } finally {
      submitBtn.disabled = false;
      submitBtnText.textContent = 'SEND MESSAGE';
    }
  });
}
