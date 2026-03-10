const slides = Array.from(document.querySelectorAll('.slide'));
const dotsContainer = document.getElementById('dots');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');
const counter = document.getElementById('slideCounter');
const slideTitle = document.getElementById('slideTitle');
const progressFill = document.getElementById('progressFill');
const sparklesLayer = document.getElementById('sparkles');
const conceptNodes = Array.from(document.querySelectorAll('.concept-node'));
const conceptPanels = Array.from(document.querySelectorAll('.concept-panel'));
const fullscreenBtn = document.getElementById('fullscreenBtn');

let current = 0;
let touchStartX = 0;
let touchEndX = 0;
let lastDirection = 'next';

const formatIndex = (index) => String(index + 1).padStart(2, '0');

const renderDots = () => {
  if (!dotsContainer) return;

  dotsContainer.innerHTML = '';
  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = index === current ? 'dot active' : 'dot';
    dot.setAttribute('aria-label', `Ir a diapositiva ${index + 1}`);
    dot.addEventListener('click', () => showSlide(index));
    dotsContainer.appendChild(dot);
  });
};

const showSlide = (index) => {
  if (!slides.length) return;

  const previous = current;

  if (index < 0) index = slides.length - 1;
  if (index >= slides.length) index = 0;
  current = index;

  lastDirection = current >= previous ? 'next' : 'prev';

  slides.forEach((slide, idx) => {
    slide.dataset.enter = lastDirection;
    slide.classList.toggle('active', idx === current);
  });

  if (counter) {
    counter.textContent = `${formatIndex(current)} / ${formatIndex(slides.length - 1)}`;
  }

  if (slideTitle) {
    slideTitle.textContent = slides[current].dataset.title || `Diapositiva ${current + 1}`;
  }

  if (progressFill) {
    const progress = ((current + 1) / slides.length) * 100;
    progressFill.style.width = `${progress}%`;
  }

  renderDots();
};

const next = () => showSlide(current + 1);
const prev = () => showSlide(current - 1);

if (nextBtn) nextBtn.addEventListener('click', next);
if (prevBtn) prevBtn.addEventListener('click', prev);
if (restartBtn) restartBtn.addEventListener('click', () => showSlide(0));

window.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight' || event.key === ' ') {
    event.preventDefault();
    next();
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    prev();
  }

  if (event.key === 'Home') {
    event.preventDefault();
    showSlide(0);
  }

  if (event.key === 'End') {
    event.preventDefault();
    showSlide(slides.length - 1);
  }
});

window.addEventListener('touchstart', (event) => {
  touchStartX = event.changedTouches[0].screenX;
});

window.addEventListener('touchend', (event) => {
  touchEndX = event.changedTouches[0].screenX;
  const delta = touchEndX - touchStartX;

  if (Math.abs(delta) < 45) return;
  if (delta < 0) next();
  if (delta > 0) prev();
});

const createSparkles = () => {
  if (!sparklesLayer) return;

  const total = 30;
  for (let i = 0; i < total; i += 1) {
    const sparkle = document.createElement('span');
    sparkle.className = 'sparkle';
    sparkle.style.left = `${Math.random() * 100}%`;
    sparkle.style.top = `${Math.random() * 100}%`;
    sparkle.style.animationDelay = `${Math.random() * 4}s`;
    sparkle.style.animationDuration = `${3.6 + Math.random() * 3.4}s`;
    sparklesLayer.appendChild(sparkle);
  }
};

createSparkles();

const isFullscreen = () => Boolean(document.fullscreenElement);

const updateFullscreenButton = () => {
  if (!fullscreenBtn) return;
  fullscreenBtn.textContent = isFullscreen() ? 'Salir de pantalla completa' : 'Pantalla completa';
};

if (fullscreenBtn) {
  fullscreenBtn.addEventListener('click', async () => {
    try {
      if (!isFullscreen()) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (_) {
      // Ignore browsers blocking fullscreen without user gesture.
    }
    updateFullscreenButton();
  });
}

document.addEventListener('fullscreenchange', updateFullscreenButton);
updateFullscreenButton();

conceptNodes.forEach((node) => {
  node.addEventListener('click', () => {
    const target = node.dataset.target;
    if (!target) return;

    conceptNodes.forEach((item) => item.classList.remove('active'));
    conceptPanels.forEach((panel) => panel.classList.remove('active'));

    node.classList.add('active');
    const panel = document.getElementById(target);
    if (panel) panel.classList.add('active');
  });
});

showSlide(0);
