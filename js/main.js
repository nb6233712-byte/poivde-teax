/**
 * PIVOT AIDE TAX — MAIN JAVASCRIPT
 * Handles mobile navigation, header scroll effects, active states,
 * and global modals.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initHeaderScroll();
  initModals();
  initOwlTracking();
});

function initNavigation() {
  const toggleBtn = document.getElementById('nav-toggle');
  const drawer = document.getElementById('mobile-drawer');

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggleBtn.innerHTML = isOpen
        ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 18L18 6M6 6l12 12"/></svg>`
        : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`;
    });

    // Close on link click inside drawer
    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`;
      });
    });
  }

  // Highlight active nav item based on URL
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav.main-nav a, .mobile-drawer a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

function initHeaderScroll() {
  const topbar = document.querySelector('.topbar');
  if (!topbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      topbar.classList.add('scrolled');
    } else {
      topbar.classList.remove('scrolled');
    }
  }, { passive: true });
}

function initModals() {
  // Global modal opener triggers
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-modal]');
    if (trigger) {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-modal');
      openModal(modalId);
    }

    const closeBtn = e.target.closest('.modal-close, [data-modal-close]');
    if (closeBtn) {
      e.preventDefault();
      const modal = closeBtn.closest('.modal-backdrop');
      if (modal) closeModal(modal);
    }
  });

  // Close on backdrop click
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openModalEl = document.querySelector('.modal-backdrop.open');
      if (openModalEl) closeModal(openModalEl);
    }
  });
}

window.openModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    const firstInput = modal.querySelector('input, select, textarea, button:not(.modal-close)');
    if (firstInput) firstInput.focus();
  }
};

window.closeModal = function(modal) {
  if (typeof modal === 'string') {
    modal = document.getElementById(modal);
  }
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
};

function initOwlTracking() {
  const owlSvg = document.getElementById('hero-owl-svg');
  const leftPupil = document.getElementById('owl-pupil-left');
  const rightPupil = document.getElementById('owl-pupil-right');

  if (!owlSvg || !leftPupil || !rightPupil) return;

  const maxRadius = 5.5; // Max pixel displacement inside eye white

  const handlePointerMove = (e) => {
    const rect = owlSvg.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    // Center of the owl in screen coordinates
    const owlCenterX = rect.left + rect.width * 0.5;
    const owlCenterY = rect.top + rect.height * 0.41; // eye level is at ~41% from top

    const deltaX = e.clientX - owlCenterX;
    const deltaY = e.clientY - owlCenterY;

    const angle = Math.atan2(deltaY, deltaX);
    const distance = Math.hypot(deltaX, deltaY);

    // Smooth scaling factor based on pointer distance
    const factor = Math.min(distance / 450, 1.0);
    const moveX = Math.cos(angle) * maxRadius * factor;
    const moveY = Math.sin(angle) * maxRadius * factor;

    leftPupil.style.transform = `translate(${moveX.toFixed(1)}px, ${moveY.toFixed(1)}px)`;
    rightPupil.style.transform = `translate(${moveX.toFixed(1)}px, ${moveY.toFixed(1)}px)`;
  };

  const handlePointerLeave = () => {
    leftPupil.style.transform = 'translate(0px, 0px)';
    rightPupil.style.transform = 'translate(0px, 0px)';
  };

  window.addEventListener('mousemove', handlePointerMove, { passive: true });
  document.addEventListener('mouseleave', handlePointerLeave);
}
