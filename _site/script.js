'use strict';

// Ensure the following CSS is defined:
// .carousel-images img { display: none; }
// .carousel-images img.active { display: block; }

// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {
  initializeWebsite();
  setupCarousel();
});

/**
 * Initialize the website with all necessary functionality
 */
function initializeWebsite() {
  setupHamburgerMenu();
  setupScrollAnimations();
  setupInitialAnimations();
  setupSmoothScrolling();
}

/**
 * Setup initial animations for elements that should animate on page load
 */
function setupInitialAnimations() {
  // No longer animating text elements, so this function can be empty or removed
}

/**
 * Intersection Observer for fade-in animations on scroll
 */
function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  };

  // Observer for staggered block images
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
      }
    });
  }, observerOptions);

  // Observer for general fade-slide elements in content sections
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
      }
    });
  }, observerOptions);

  // Observe staggered block images only
  document.querySelectorAll('.staggered-block img.fade-slide').forEach(img => {
    imageObserver.observe(img);
  });

  // Observe fade-slide elements in about section (but not welcome section or gallery header)
  document.querySelectorAll('#about .fade-slide').forEach(element => {
    fadeObserver.observe(element);
  });
}

/**
 * Hamburger menu functionality with accessibility
 */
function setupHamburgerMenu() {
  const hamburgerButton = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');

  if (hamburgerButton && navMenu) {
    // Toggle menu on hamburger click
    hamburgerButton.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });

    // Close menu when clicking outside of it
    document.addEventListener('click', (event) => {
      if (!hamburgerButton.contains(event.target) && !navMenu.contains(event.target)) {
        closeMobileMenu();
      }
    });

    // Close menu when pressing Escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && navMenu.classList.contains('show')) {
        closeMobileMenu();
        hamburgerButton.focus(); // Return focus to hamburger button
      }
    });

    // Close menu when clicking on navigation links (mobile)
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });
  }
}

/**
 * Toggle mobile menu visibility
 */
function toggleMobileMenu() {
  const navMenu = document.getElementById('nav-menu');
  const hamburgerButton = document.getElementById('hamburger');
  
  if (navMenu && hamburgerButton) {
    const isOpen = navMenu.classList.contains('show');
    
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }
}

/**
 * Open mobile menu
 */
function openMobileMenu() {
  const navMenu = document.getElementById('nav-menu');
  const hamburgerButton = document.getElementById('hamburger');
  
  if (navMenu && hamburgerButton) {
    navMenu.classList.add('show');
    hamburgerButton.setAttribute('aria-expanded', 'true');
    
    // Focus first menu item for keyboard navigation
    const firstLink = navMenu.querySelector('a');
    if (firstLink) {
      setTimeout(() => firstLink.focus(), 100);
    }
  }
}

/**
 * Close mobile menu
 */
function closeMobileMenu() {
  const navMenu = document.getElementById('nav-menu');
  const hamburgerButton = document.getElementById('hamburger');
  
  if (navMenu && hamburgerButton) {
    navMenu.classList.remove('show');
    hamburgerButton.setAttribute('aria-expanded', 'false');
  }
}

/**
 * Setup smooth scrolling for anchor links
 */
function setupSmoothScrolling() {
  // Handle smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        // Close mobile menu if open
        closeMobileMenu();
        
        // Smooth scroll to target
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Update focus for accessibility
        targetElement.focus({ preventScroll: true });
      }
    });
  });
}

/**
 * Utility function to check if an element is in viewport
 */
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Add loading states for images to improve user experience
 */
function setupImageLoading() {
  const images = document.querySelectorAll('img');
  
  images.forEach(img => {
    // Add loading class
    img.classList.add('loading');
    
    // Remove loading class when image loads
    img.addEventListener('load', () => {
      img.classList.remove('loading');
      img.classList.add('loaded');
    });
    
    // Handle error states
    img.addEventListener('error', () => {
      img.classList.remove('loading');
      img.classList.add('error');
    });
  });
}

// Initialize image loading on DOM ready
document.addEventListener('DOMContentLoaded', setupImageLoading);

// Handle page visibility changes to pause/resume animations if needed
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Page is hidden, could pause animations here if needed
  } else {
    // Page is visible again, could resume animations here if needed
  }
});

// Debounced resize handler for responsive adjustments
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    // Handle any resize-specific logic here
    // For example, recalculating positions or closing mobile menu on larger screens
    if (window.innerWidth > 768) {
      closeMobileMenu();
    }
  }, 150);
});

function setupCarousel() {
  const carousel = document.querySelector('.carousel');
  if (!carousel || !window.location.pathname.includes('gallery')) {
    return;
  }

  const images = carousel.querySelectorAll('.carousel-images img');
  const leftArrow = carousel.querySelector('.carousel-arrow.left');
  const rightArrow = carousel.querySelector('.carousel-arrow.right');
  const indicators = carousel.querySelector('.carousel-indicators');
  let current = 0;

  function showImage(index) {
    images.forEach((img, i) => {
      img.classList.toggle('active', i === index);
      img.setAttribute('tabindex', '-1');
    });
    Array.from(indicators.children).forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
      dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });
    current = index;
  }

  // Create indicator dots
  indicators.innerHTML = '';
  images.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Go to image ${i + 1}`);
    dot.setAttribute('role', 'button');
    dot.setAttribute('tabindex', '-1');
    dot.setAttribute('aria-selected', 'false');
    dot.addEventListener('click', () => showImage(i));
    indicators.appendChild(dot);
  });

  leftArrow.addEventListener('click', () => {
    showImage((current - 1 + images.length) % images.length);
  });
  rightArrow.addEventListener('click', () => {
    showImage((current + 1) % images.length);
  });

  // Keyboard navigation
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      showImage((current - 1 + images.length) % images.length);
    } else if (e.key === 'ArrowRight') {
      showImage((current + 1) % images.length);
    }
  });
  carousel.tabIndex = 0;

  // Ensure first image is visible initially
  if (images.length > 0) {
    images[0].classList.add('active');
    if (indicators.children.length > 0) {
      indicators.children[0].classList.add('active');
    }
  }

  // Show the first image
  showImage(0);

  setInterval(() => {
    showImage((current + 1) % images.length);
  }, 5000); // autoplay every 5 seconds
}