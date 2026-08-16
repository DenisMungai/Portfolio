  // Year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Mobile menu
  const burgerBtn = document.getElementById('burgerBtn');
  const closeMenuBtn = document.getElementById('closeMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  burgerBtn.addEventListener('click', () => {
    mobileMenu.classList.add('open');
    burgerBtn.setAttribute('aria-expanded','true');
  });
  closeMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burgerBtn.setAttribute('aria-expanded','false');
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burgerBtn.setAttribute('aria-expanded','false');
  }));

  // Reveal on scroll
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObserver.observe(el));

  // Stat counters
  const statEls = document.querySelectorAll('.stat-num');
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 40));
        const timer = setInterval(() => {
          current += step;
          if(current >= target){ current = target; clearInterval(timer); }
          el.textContent = current;
        }, 35);
        statObserver.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  statEls.forEach(el => statObserver.observe(el));

  // Skill bar fills
  const fillEls = document.querySelectorAll('.skill-fill');
  const fillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.style.width = entry.target.getAttribute('data-fill') + '%';
        fillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  fillEls.forEach(el => fillObserver.observe(el));

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
        card.style.display = show ? 'flex' : 'none';
      });
    });
  });


  // Contact form — AJAX submit (no captcha redirect, inline success/failure feedback)
  const contactForm = document.getElementById('contactForm');
  if(contactForm){
    const submitBtn = document.getElementById('submitBtn');
    const submitBtnText = document.getElementById('submitBtnText');
    const formStatus = document.getElementById('formStatus');

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      submitBtn.disabled = true;
      submitBtnText.textContent = 'Sending…';
      formStatus.textContent = '';
      formStatus.style.color = '';

      try{
        const response = await fetch(contactForm.action, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(contactForm)
        });

        if(response.ok){
          formStatus.textContent = 'Submitted successfully — I\u2019ll get back to you within 24 hours.';
          formStatus.style.color = '#4ADE80';
          contactForm.reset();
        } else {
          formStatus.textContent = 'Failed to submit. Please try again or email me directly.';
          formStatus.style.color = '#F87171';
        }
      } catch(err){
        formStatus.textContent = 'Failed to submit. Please try again or email me directly.';
        formStatus.style.color = '#F87171';
      } finally {
        submitBtn.disabled = false;
        submitBtnText.textContent = 'Send Message';
      }
    });
  }
