document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu a');

  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.classList.remove('active');
      mobileMenu.classList.remove('active');
    });
  });

  // Accordion
  const accordions = document.querySelectorAll('.accordion-item');

  accordions.forEach(item => {
    const header = item.querySelector('.accordion-header');

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all others
      accordions.forEach(acc => acc.classList.remove('active'));

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // Cursor Glow
  const cursor = document.querySelector('.cursor-glow');

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });

  // Scroll Animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.section h2, .artist-card, .content-block, .info-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
  });

  // Inject styles for animation
  const style = document.createElement('style');
  style.textContent = `
    .fade-in-up {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);
});

// Artist Carousel
// 3D Artist Carousel
const carouselCards = document.querySelectorAll('.artist-card-3d');
const carouselPrev = document.querySelector('.carousel-prev');
const carouselNext = document.querySelector('.carousel-next');
const artistNameDisplay = document.querySelector('.artist-name-display');
const carouselDots = document.querySelectorAll('.carousel-dots .dot');
let currentIndex = 0;
let autoPlayInterval;

function updateCarousel() {
  const total = carouselCards.length;

  carouselCards.forEach((card, index) => {
    const offset = index - currentIndex;
    let pos = (offset + total) % total;

    // Adjust position to be centered around 0
    if (pos > Math.floor(total / 2)) {
      pos = pos - total;
    }

    const isCenter = pos === 0;
    const isAdjacent = Math.abs(pos) === 1;

    // Calculate styles
    const translateX = pos * 45; // %
    const scale = isCenter ? 1 : isAdjacent ? 0.85 : 0.7;
    const rotateY = pos * -10; // deg
    const zIndex = isCenter ? 10 : isAdjacent ? 5 : 1;
    const opacity = isCenter ? 1 : isAdjacent ? 0.6 : 0;
    const blur = isCenter ? 0 : 4;
    const visibility = Math.abs(pos) > 1 ? 'hidden' : 'visible';

    // Apply styles
    card.style.transform = `translateX(${translateX}%) scale(${scale}) rotateY(${rotateY}deg)`;
    card.style.zIndex = zIndex;
    card.style.opacity = opacity;
    card.style.filter = `blur(${blur}px)`;
    card.style.visibility = visibility;

    // Update Name if center
    if (isCenter && artistNameDisplay) {
      const name = card.getAttribute('data-name');
      artistNameDisplay.textContent = name;
      artistNameDisplay.style.opacity = 0;
      setTimeout(() => {
        artistNameDisplay.style.opacity = 1;
      }, 50);
    }
  });

  // Update Dots
  if (carouselDots.length > 0) {
    carouselDots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % carouselCards.length;
  updateCarousel();
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + carouselCards.length) % carouselCards.length;
  updateCarousel();
}

function startAutoPlay() {
  stopAutoPlay(); // Clear existing interval if any
  autoPlayInterval = setInterval(nextSlide, 4000);
}

function stopAutoPlay() {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval);
  }
}

if (carouselPrev && carouselNext && carouselCards.length > 0) {
  carouselPrev.addEventListener('click', () => {
    prevSlide();
    startAutoPlay(); // Reset timer on interaction
  });

  carouselNext.addEventListener('click', () => {
    nextSlide();
    startAutoPlay(); // Reset timer on interaction
  });

  // Dots Interaction
  if (carouselDots.length > 0) {
    carouselDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        currentIndex = index;
        updateCarousel();
        startAutoPlay();
      });
    });
  }

  // Initialize
  updateCarousel();
  startAutoPlay();

  // Pause on hover
  const carouselWrapper = document.querySelector('.carousel-wrapper');
  if (carouselWrapper) {
    carouselWrapper.addEventListener('mouseenter', stopAutoPlay);
    carouselWrapper.addEventListener('mouseleave', startAutoPlay);
  }
}

