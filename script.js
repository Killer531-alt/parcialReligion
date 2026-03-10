const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const revealItems = document.querySelectorAll('.reveal');
const printBtn = document.getElementById('printBtn');
const practiceBtn = document.getElementById('practiceBtn');
const practiceTimer = document.getElementById('practiceTimer');
const accordionButtons = document.querySelectorAll('.accordion-btn');
const quickLinks = document.querySelectorAll('.quick-nav a');
const durationButtons = document.querySelectorAll('.duration-btn');
const thesisScripts = document.querySelectorAll('.thesis-script');
const thesisTimerEl = document.getElementById('thesisTimer');
const thesisTimerBtn = document.getElementById('thesisTimerBtn');
const nextQuestionBtn = document.getElementById('nextQuestionBtn');
const showAnswerBtn = document.getElementById('showAnswerBtn');
const simQuestion = document.getElementById('simQuestion');
const simAnswer = document.getElementById('simAnswer');
const posturaInput = document.getElementById('posturaInput');
const savePosturaBtn = document.getElementById('savePosturaBtn');
const resetPosturaBtn = document.getElementById('resetPosturaBtn');
const posturaStatus = document.getElementById('posturaStatus');

for (const btn of tabButtons) {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;

    for (const button of tabButtons) {
      button.classList.remove('active');
      button.setAttribute('aria-selected', 'false');
    }

    for (const panel of tabContents) {
      panel.classList.remove('active');
    }

    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    const targetPanel = document.getElementById(target);
    if (targetPanel) {
      targetPanel.classList.add('active');
    }
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.12 }
);

for (const item of revealItems) {
  observer.observe(item);
}

for (const link of quickLinks) {
  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;

    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

for (const button of accordionButtons) {
  button.addEventListener('click', () => {
    const currentOpen = button.getAttribute('aria-expanded') === 'true';
    const panel = button.nextElementSibling;

    for (const btn of accordionButtons) {
      btn.setAttribute('aria-expanded', 'false');
      const btnPanel = btn.nextElementSibling;
      if (btnPanel) {
        btnPanel.classList.remove('open');
      }
    }

    if (!currentOpen) {
      button.setAttribute('aria-expanded', 'true');
      if (panel) {
        panel.classList.add('open');
      }
    }
  });
}

if (printBtn) {
  printBtn.addEventListener('click', () => {
    document.body.classList.toggle('presentation-mode');
    if (document.body.classList.contains('presentation-mode')) {
      printBtn.textContent = 'Salir de modo exposición';
    } else {
      printBtn.textContent = 'Modo exposición (pantalla limpia)';
    }
  });
}

let timerId = null;
let totalSeconds = 7 * 60;

const renderTime = (seconds) => {
  if (!practiceTimer) return;
  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  practiceTimer.textContent = `Temporizador: ${mins}:${secs}`;
};

renderTime(totalSeconds);

if (practiceBtn) {
  practiceBtn.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
      totalSeconds = 7 * 60;
      renderTime(totalSeconds);
      practiceBtn.textContent = 'Iniciar práctica de 7 min';
      return;
    }

    practiceBtn.textContent = 'Reiniciar práctica';
    timerId = setInterval(() => {
      totalSeconds -= 1;
      renderTime(totalSeconds);

      if (totalSeconds <= 0) {
        clearInterval(timerId);
        timerId = null;
        practiceBtn.textContent = 'Iniciar práctica de 7 min';
        if (practiceTimer) {
          practiceTimer.textContent = 'Temporizador: 00:00 - tiempo cumplido';
        }
      }
    }, 1000);
  });
}

let thesisSelectedMinutes = 20;
let thesisTimerId = null;
let thesisSeconds = 20 * 60;

const renderThesisTime = (seconds) => {
  if (!thesisTimerEl) return;
  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  thesisTimerEl.textContent = `Temporizador tesis: ${mins}:${secs}`;
};

for (const btn of durationButtons) {
  btn.addEventListener('click', () => {
    const minutes = Number(btn.dataset.duration);
    if (!Number.isFinite(minutes)) return;

    thesisSelectedMinutes = minutes;
    thesisSeconds = minutes * 60;
    renderThesisTime(thesisSeconds);

    for (const button of durationButtons) {
      button.classList.remove('active');
    }
    btn.classList.add('active');

    for (const block of thesisScripts) {
      block.classList.remove('active');
    }
    const target = document.getElementById(`thesis-${minutes}`);
    if (target) target.classList.add('active');

    if (thesisTimerId) {
      clearInterval(thesisTimerId);
      thesisTimerId = null;
      if (thesisTimerBtn) thesisTimerBtn.textContent = 'Iniciar temporizador';
    }
  });
}

renderThesisTime(thesisSeconds);

if (thesisTimerBtn) {
  thesisTimerBtn.addEventListener('click', () => {
    if (thesisTimerId) {
      clearInterval(thesisTimerId);
      thesisTimerId = null;
      thesisSeconds = thesisSelectedMinutes * 60;
      renderThesisTime(thesisSeconds);
      thesisTimerBtn.textContent = 'Iniciar temporizador';
      return;
    }

    thesisTimerBtn.textContent = 'Reiniciar temporizador';
    thesisTimerId = setInterval(() => {
      thesisSeconds -= 1;
      renderThesisTime(thesisSeconds);
      if (thesisSeconds <= 0) {
        clearInterval(thesisTimerId);
        thesisTimerId = null;
        if (thesisTimerEl) {
          thesisTimerEl.textContent = 'Temporizador tesis: 00:00 - tiempo cumplido';
        }
        thesisTimerBtn.textContent = 'Iniciar temporizador';
      }
    }, 1000);
  });
}

const qaBank = [
  {
    q: 'Si hubo conflictos, por que no decir simplemente que ciencia y religion son enemigas?',
    a: 'Porque la evidencia historica muestra tambien cooperacion institucional, cientificos creyentes y etapas de dialogo. Un solo patron no explica todo.'
  },
  {
    q: 'Que diferencia hay entre criticar una institucion religiosa y criticar la fe?',
    a: 'Una institucion actua en contextos politicos concretos; la fe es una experiencia y marco de sentido mas amplio. No son exactamente lo mismo.'
  },
  {
    q: 'El caso Galileo invalida todos los aportes religiosos a la ciencia?',
    a: 'No. Es un caso clave de conflicto, pero no borra universidades, observatorios ni aportes de cientificos religiosos en siglos distintos.'
  },
  {
    q: 'Por que hablar de matices y no tomar una postura radical?',
    a: 'Porque una postura historica rigurosa trabaja con fuentes comparadas y cronologias. Las posturas radicales suelen ignorar evidencia relevante.'
  },
  {
    q: 'Puede una persona creyente hacer ciencia de alto nivel?',
    a: 'Si. La validez cientifica depende del metodo, la evidencia y la replicabilidad, no de la creencia personal del investigador.'
  },
  {
    q: 'Que aporta hoy este debate a problemas actuales?',
    a: 'Aporta marcos para discutir bioetica, inteligencia artificial y dignidad humana integrando datos, filosofia y responsabilidad social.'
  },
  {
    q: 'Como responderias a quien dice que religion frena el progreso?',
    a: 'Diria que en algunos contextos lo dificulto y en otros lo impulso. La historia comparada muestra ambos fenomenos, no uno solo.'
  },
  {
    q: 'Cual es tu conclusion personal en una frase?',
    a: 'Ciencia y fe no fueron enemigas permanentes: su relacion historica fue variable, y solo se entiende con contexto y evidencia.'
  }
];

let currentQa = null;

if (nextQuestionBtn && simQuestion && simAnswer) {
  nextQuestionBtn.addEventListener('click', () => {
    const random = qaBank[Math.floor(Math.random() * qaBank.length)];
    currentQa = random;
    simQuestion.textContent = random.q;
    simAnswer.textContent = random.a;
    simAnswer.classList.remove('show');
  });
}

if (showAnswerBtn && simAnswer) {
  showAnswerBtn.addEventListener('click', () => {
    if (!currentQa) return;
    simAnswer.classList.add('show');
  });
}

const posturaKey = 'ciencia-fe-postura-personal';
const defaultPostura = posturaInput ? posturaInput.value : '';

if (posturaInput) {
  const saved = localStorage.getItem(posturaKey);
  if (saved) {
    posturaInput.value = saved;
    if (posturaStatus) posturaStatus.textContent = 'Estado: postura recuperada desde guardado local.';
  }
}

if (savePosturaBtn && posturaInput) {
  savePosturaBtn.addEventListener('click', () => {
    localStorage.setItem(posturaKey, posturaInput.value);
    if (posturaStatus) posturaStatus.textContent = 'Estado: postura guardada correctamente.';
  });
}

if (resetPosturaBtn && posturaInput) {
  resetPosturaBtn.addEventListener('click', () => {
    posturaInput.value = defaultPostura;
    localStorage.removeItem(posturaKey);
    if (posturaStatus) posturaStatus.textContent = 'Estado: texto base restaurado.';
  });
}
