// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile menu
const burgerBtn = document.getElementById('burgerBtn');
const closeMenuBtn = document.getElementById('closeMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

burgerBtn.addEventListener('click', () => {
  mobileMenu.classList.add('open');
  burgerBtn.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
});

function closeMenu() {
  mobileMenu.classList.remove('open');
  burgerBtn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

closeMenuBtn.addEventListener('click', closeMenu);
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

// Close mobile menu on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
    closeMenu();
    burgerBtn.focus();
  }
});

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  // Show everything immediately if user prefers reduced motion
  revealEls.forEach(el => el.classList.add('in'));
} else {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealEls.forEach(el => revealObserver.observe(el));
}

// Project filter
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('#projectsGrid .project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');
    projectCards.forEach(card => {
      const show = filter === 'all' || card.getAttribute('data-cat') === filter;
      card.style.display = show ? '' : 'none';
    });
  });
});

// Contact form — AJAX submit
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const submitBtn = document.getElementById('submitBtn');
  const submitBtnText = document.getElementById('submitBtnText');
  const formStatus = document.getElementById('formStatus');

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtnText.textContent = 'Sending\u2026';
    formStatus.textContent = '';
    formStatus.style.color = '';

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(contactForm)
      });

      if (response.ok) {
        formStatus.textContent = 'Message sent \u2014 I\u2019ll get back to you within 24 hours.';
        formStatus.style.color = '#4ADE80';
        contactForm.reset();
      } else {
        formStatus.textContent = 'Something went wrong. Please try again or email me directly.';
        formStatus.style.color = '#F87171';
      }
    } catch (err) {
      formStatus.textContent = 'Something went wrong. Please try again or email me directly.';
      formStatus.style.color = '#F87171';
    } finally {
      submitBtn.disabled = false;
      submitBtnText.textContent = 'Send Message';
    }
  });
}
