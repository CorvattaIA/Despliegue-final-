// script.js – Lógica unificada para ÉticaIA

document.addEventListener('DOMContentLoaded', () => {
  // Elementos globales
  const questionnaireContainer     = document.querySelector('.questionnaire-container');
  const evaluationSection          = document.getElementById('evaluacion');
  const resultsSection             = document.getElementById('resultados');
  const currentQuestionNumberSpan  = document.getElementById('current-question-number');
  const totalQuestionsSpan         = document.getElementById('total-questions');
  const selectedSectorNameSpan     = document.getElementById('selected-sector-name');
  const riskLevelBar               = document.getElementById('risk-level-bar');
  const riskLevelLabel             = document.getElementById('risk-level-label');
  const opportunityLevelBar        = document.getElementById('opportunity-level-bar');
  const opportunityLevelLabel      = document.getElementById('opportunity-level-label');
  const recommendedServicesContainer = document.getElementById('recommended-services-container');
  const menuBtn                    = document.getElementById('mobile-menu-btn');
  const mobileMenu                 = document.getElementById('mobile-menu');
  const headerNavLinks             = document.querySelectorAll('header nav a[href^="#"]');
  const mobileNavLinks             = document.querySelectorAll('#mobile-menu a[href^="#"]');
  const sections                   = document.querySelectorAll('main section[id]');
  const yearSpan                   = document.getElementById('current-year');

  // Estado
  let currentQuestionIndex = 0;
  let answers              = {};
  let selectedSector       = '';

  // Preguntas
  const questions = [
    { id: 'risk1', text: '¿Qué tipo de datos utiliza o utilizaría su sistema de IA?', type: 'risk', options: [
        { text: 'Datos públicos y abiertos sin información personal', value: 1 },
        { text: 'Datos agregados con información demográfica general', value: 2 },
        { text: 'Datos con información personal pero no sensible', value: 3 },
        { text: 'Datos con información personal sensible (salud, finanzas, etc.)', value: 4 },
        { text: 'Datos biométricos o de categorías especiales', value: 5 }
    ] },
    { id: 'risk2', text: '¿Qué nivel de autonomía tendría el sistema de IA en la toma de decisiones?', type: 'risk', options: [
        { text: 'Solo asistencia informativa, decisión humana final', value: 1 },
        { text: 'Recomendaciones con supervisión humana constante', value: 2 },
        { text: 'Decisiones automatizadas con posibilidad de intervención humana', value: 3 },
        { text: 'Decisiones automatizadas con supervisión humana periódica', value: 4 },
        { text: 'Decisiones completamente automatizadas sin supervisión humana', value: 5 }
    ] },
    { id: 'risk3', text: '¿Qué impacto potencial podrían tener las decisiones del sistema de IA?', type: 'risk', options: [
        { text: 'Impacto mínimo, sin consecuencias significativas', value: 1 },
        { text: 'Impacto bajo, afecta experiencias pero no derechos', value: 2 },
        { text: 'Impacto moderado, puede afectar oportunidades', value: 3 },
        { text: 'Impacto alto, afecta acceso a servicios esenciales', value: 4 },
        { text: 'Impacto crítico, puede afectar derechos fundamentales', value: 5 }
    ] },
    { id: 'opportunity1', text: '¿Qué nivel de mejora en eficiencia espera obtener con la implementación de IA?', type: 'opportunity', options: [
        { text: 'Mejora mínima (menos del 10%)', value: 1 },
        { text: 'Mejora baja (10-25%)', value: 2 },
        { text: 'Mejora moderada (25-50%)', value: 3 },
        { text: 'Mejora alta (50-100%)', value: 4 },
        { text: 'Mejora transformadora (más del 100%)', value: 5 }
    ] },
    { id: 'opportunity2', text: '¿Qué nivel de innovación representaría la IA en su sector específico?', type: 'opportunity', options: [
        { text: 'Tecnología ya común en el sector', value: 1 },
        { text: 'Mejora incremental sobre soluciones existentes', value: 2 },
        { text: 'Aplicación novedosa de tecnologías probadas', value: 3 },
        { text: 'Innovación significativa en el sector', value: 4 },
        { text: 'Transformación disruptiva del sector', value: 5 }
    ] },
    { id: 'opportunity3', text: '¿Qué impacto tendría la IA en la experiencia de sus clientes o usuarios?', type: 'opportunity', options: [
        { text: 'Impacto mínimo, apenas perceptible', value: 1 },
        { text: 'Mejora leve en algunos aspectos', value: 2 },
        { text: 'Mejora notable en la experiencia general', value: 3 },
        { text: 'Transformación significativa de la experiencia', value: 4 },
        { text: 'Creación de experiencias completamente nuevas', value: 5 }
    ] }
  ];

  // Servicios para recomendaciones
  const allServices = [
    { id: 'diag', name: 'Diagnóstico de Riesgos Éticos', desc: 'Evaluación exhaustiva de riesgos éticos con recomendaciones específicas.' },
    { id: 'estr', name: 'Diseño de Estrategias Éticas',   desc: 'Desarrollo de estrategias personalizadas para integrar principios éticos.' },
    { id: 'anal', name: 'Análisis Ético de la IA',         desc: 'Evaluación integral de sistemas existentes o en desarrollo.' },
    { id: 'capa', name: 'Capacitación en Ética para IA',   desc: 'Programas de formación para su equipo sobre principios éticos.' }
  ];

  // Mostrar total de preguntas
  if (totalQuestionsSpan) {
    totalQuestionsSpan.textContent = questions.length;
  }

  // Render de una pregunta
  function renderQuestion(index) {
    if (!questionnaireContainer 
        || index < 0 
        || index >= questions.length) return;

    const q = questions[index];
    currentQuestionIndex = index;
    currentQuestionNumberSpan.textContent = index + 1;

    const optionsHtml = q.options
      .map(o => `<button class="option-btn" data-value="${o.value}">${o.text}</button>`)
      .join('');

    const isLast = index === questions.length - 1;
    const navHtml = `
      <div class="navigation-buttons">
        <button class="btn btn-secondary prev-btn" ${index === 0 ? 'disabled' : ''}>Anterior</button>
        <button class="btn btn-primary ${isLast ? 'finish-btn' : 'next-btn'}" ${!answers[q.id] ? 'disabled' : ''}>
          ${isLast ? 'Finalizar' : 'Siguiente'}
        </button>
      </div>`;

    questionnaireContainer.innerHTML = `
      <div class="question-card" data-question="${q.id}">
        <h3 class="text-xl font-semibold mb-6">${q.text}</h3>
        <div class="options-container">${optionsHtml}</div>
        ${navHtml}
      </div>`;

    // Si ya hay respuesta, marcar opción
    if (answers[q.id]) {
      const sel = questionnaireContainer.querySelector(`.option-btn[data-value="${answers[q.id]}"]`);
      if (sel) sel.classList.add('selected');
    }

    // Listeners
    questionnaireContainer
      .querySelectorAll('.option-btn')
      .forEach(btn => btn.addEventListener('click', handleOptionSelect));

    const nextBtn   = questionnaireContainer.querySelector('.next-btn');
    const prevBtn   = questionnaireContainer.querySelector('.prev-btn');
    const finishBtn = questionnaireContainer.querySelector('.finish-btn');

    if (nextBtn)   nextBtn.addEventListener('click', () => renderQuestion(currentQuestionIndex + 1));
    if (prevBtn)   prevBtn.addEventListener('click', () => renderQuestion(currentQuestionIndex - 1));
    if (finishBtn) finishBtn.addEventListener('click', finishQuestionnaire);
  }

  // Selección de opción
  function handleOptionSelect(e) {
    const value = parseInt(e.target.dataset.value, 10);
    const qid   = questions[currentQuestionIndex].id;
    answers[qid] = value;

    questionnaireContainer
      .querySelectorAll('.option-btn')
      .forEach(b => b.classList.remove('selected'));

    e.target.classList.add('selected');

    // Habilitar navegación
    const nextBtn   = questionnaireContainer.querySelector('.next-btn');
    const finishBtn = questionnaireContainer.querySelector('.finish-btn');
    if (nextBtn)   nextBtn.disabled = false;
    if (finishBtn) finishBtn.disabled = false;
  }

  // Finalizar cuestionario
  function finishQuestionnaire() {
    const riskScore = calculateScore('risk');
    const oppScore  = calculateScore('opportunity');
    displayResults(riskScore, oppScore);

    evaluationSection?.classList.add('hidden');
    if (resultsSection) {
      resultsSection.style.display = 'block';
      resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Cálculo de puntaje (%)
  function calculateScore(type) {
    let total = 0, count = 0;
    questions.forEach(q => {
      if (q.type === type && answers[q.id]) {
        total += answers[q.id];
        count++;
      }
    });
    if (count === 0) return 0;
    const max = count * 5, min = count * 1;
    return Math.round(((total - min) / (max - min)) * 100);
  }

  // Mostrar resultados y recomendaciones
  function displayResults(riskScore, oppScore) {
    if (riskLevelBar && opportunityLevelBar && riskLevelLabel && opportunityLevelLabel) {
      riskLevelBar.style.width        = `${riskScore}%`;
      opportunityLevelBar.style.width = `${oppScore}%`;
      riskLevelLabel.textContent      = getLevelLabel(riskScore);
      opportunityLevelLabel.textContent = getLevelLabel(oppScore);
      renderRecommendedServices(riskScore, oppScore);
    }
  }

  // Etiqueta de nivel
  function getLevelLabel(score) {
    if (score < 25) return `Bajo (${score}%)`;
    if (score < 50) return `Moderado (${score}%)`;
    if (score < 75) return `Alto (${score}%)`;
    return `Muy Alto (${score}%)`;
  }

  // Generar tarjetas de servicios recomendados
  function renderRecommendedServices(riskScore, oppScore) {
    if (!recommendedServicesContainer) return;
    recommendedServicesContainer.innerHTML = '';
    let rec = [];

    if (riskScore >= 75) {
      rec.push(allServices.find(s => s.id === 'anal'));
      rec.push(allServices.find(s => s.id === 'diag'));
    } else if (riskScore >= 50) {
      rec.push(allServices.find(s => s.id === 'diag'));
      rec.push(allServices.find(s => s.id === 'estr'));
    } else if (riskScore >= 25) {
      rec.push(allServices.find(s => s.id === 'estr'));
    }

    if (oppScore >= 50 && !rec.some(s => s?.id === 'estr')) {
      rec.push(allServices.find(s => s.id === 'estr'));
    }

    if ((riskScore >= 25 || oppScore >= 50) && !rec.some(s => s?.id === 'capa')) {
      rec.push(allServices.find(s => s.id === 'capa'));
    }

    rec = [...new Set(rec.filter(s => s))];
    if (rec.length === 0) {
      recommendedServicesContainer.innerHTML = `
        <p class="text-gray-600 md:col-span-2 lg:col-span-3 text-center">
          No se requieren servicios específicos basados en esta evaluación inicial, pero siempre recomendamos buenas prácticas.
        </p>`;
      return;
    }

    rec.forEach(s => {
      const div = document.createElement('div');
      div.className = 'bg-white p-6 rounded-lg shadow-md';
      div.innerHTML = `
        <h4 class="text-lg font-semibold mb-2 text-blue-600">${s.name}</h4>
        <p class="text-gray-600 text-sm">${s.desc}</p>
        <a href="#contacto" class="text-blue-500 hover:underline text-sm mt-3 inline-block">
          Solicitar más info
        </a>`;
      recommendedServicesContainer.appendChild(div);
    });
  }

  // Botones "Evaluar mi negocio"
  document.querySelectorAll('.evaluate-sector-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const card = e.target.closest('.sector-card');
      if (!card) return;
      selectedSector = card.dataset.sector;
      const nameEl = card.querySelector('h3');
      selectedSectorNameSpan.textContent = nameEl?.textContent || 'Desconocido';

      answers = {};
      currentQuestionIndex = 0;
      resultsSection && (resultsSection.style.display = 'none');
      evaluationSection?.classList.remove('hidden');
      renderQuestion(0);
      evaluationSection?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Menú móvil
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      const icon = menuBtn.querySelector('i');
      icon?.classList.toggle('fa-times');
      icon?.classList.toggle('fa-bars');
    });
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        const icon = menuBtn.querySelector('i');
        icon?.classList.remove('fa-times');
        icon?.classList.add('fa-bars');
      });
    });
  }

  // Año dinámico en footer
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Scrollspy para resaltar sección activa
  if (sections.length && headerNavLinks.length) {
    const observer = new IntersectionObserver((entries) => {
      let activeId = null;
      entries.forEach(entry => {
        if (entry.isIntersecting) activeId = entry.target.id;
      });
      if (!activeId) {
        let closest = null, minDist = Infinity;
        sections.forEach(sec => {
          if (sec.offsetParent !== null) {
            const dist = Math.abs(sec.getBoundingClientRect().top - window.innerHeight / 2);
            if (dist < minDist) {
              minDist = dist;
              closest = sec;
            }
          }
        });
        activeId = closest?.id || 'inicio';
      }
      headerNavLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`));
      mobileNavLinks.forEach(link => {
        const isActive = link.getAttribute('href') === `#${activeId}`;
        link.classList.toggle('active', isActive);
        link.classList.toggle('bg-blue-100', isActive);
        link.classList.toggle('text-blue-700', isActive);
      });
    }, { rootMargin: '-50% 0px -50% 0px' });

    sections.forEach(sec => {
      if (!sec.classList.contains('hidden') && sec.id !== 'resultados') {
        observer.observe(sec);
      }
    });

    // Detectar cambios dinámicos
    if (evaluationSection) {
      new MutationObserver(muts => {
        muts.forEach(m => {
          if (m.attributeName === 'class') {
            const hidden = evaluationSection.classList.contains('hidden');
            hidden ? observer.unobserve(evaluationSection) : observer.observe(evaluationSection);
          }
        });
      }).observe(evaluationSection, { attributes: true });
    }
    if (resultsSection) {
      new MutationObserver(muts => {
        muts.forEach(m => {
          if (m.attributeName === 'style') {
            const hidden = resultsSection.style.display === 'none';
            hidden ? observer.unobserve(resultsSection) : observer.observe(resultsSection);
          }
        });
      }).observe(resultsSection, { attributes: true });
    }

    // Forzar estado inicial
    setTimeout(() => observer.takeRecords(), 100);
  }
});
