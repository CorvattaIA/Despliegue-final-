// script.js

// 1. Referencias globales
const sectors = document.querySelectorAll('.evaluate-sector-btn');
const sectionEvaluacion = document.getElementById('evaluacion');
const sectionResultados  = document.getElementById('resultados');
const questionnaireContainer = document.getElementById('questionnaire-container');
const currentQNumElem = document.getElementById('current-question-number');
const totalQNumElem   = document.getElementById('total-questions');
const selectedSectorName = document.getElementById('selected-sector-name');

// 2. Datos de preguntas / servicios
const questions = [
  { id: 1, text: '¿Tienes datos personales en tu sistema?', weights: { risk: 5, opp: 1 } },
  { id: 2, text: '¿Tu IA toma decisiones automatizadas?', weights: { risk: 4, opp: 2 } },
  { id: 3, text: '¿Tus datos están sesgados?', weights: { risk: 3, opp: 2 } },
  { id: 4, text: '¿Aplicas auditorías éticas?', weights: { risk: 2, opp: 4 } },
  { id: 5, text: '¿Usas explicabilidad en tu IA?', weights: { risk: 1, opp: 5 } },
  { id: 6, text: '¿Tienes políticas de privacidad claras?', weights: { risk: 1, opp: 5 } }
];
// Opcional: tu array de servicios
const services = [ /* … */ ];

// 3. Estado inicial
let currentQuestionIndex = 0;
let scores = { risk: 0, opp: 0 };

// 4. Al hacer clic en un sector, empieza la evaluación
sectors.forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.sector-card');
    selectedSectorName.textContent = card.querySelector('h3').textContent;
    totalQNumElem.textContent = questions.length;
    sectionEvaluacion.classList.remove('hidden');
    sectionResultados.classList.add('hidden');
    currentQuestionIndex = 0;
    scores = { risk: 0, opp: 0 };
    renderQuestion(0);
  });
});

// 5. Función principal: renderiza la pregunta `index`
function renderQuestion(index) {
  const q = questions[index];
  currentQNumElem.textContent = index + 1;

  // Generar botones de 1 a 5
  const optionsHtml = [1,2,3,4,5].map(val =>
    `<button class="option-btn px-4 py-2 m-1 border rounded" 
             data-risk="${q.weights.risk * val}" 
             data-opp="${q.weights.opp * val}">
       ${val}
     </button>`
  ).join('');

  // Botones Anterior / Siguiente / Finalizar
  const isLast = index === questions.length - 1;
  const navigationHtml = `
    <div class="mt-6 flex justify-between">
      <button id="prev-btn" class="btn btn-secondary" ${index===0? 'disabled':''}>Anterior</button>
      <button id="next-btn" class="btn btn-primary" disabled>
        ${isLast? 'Finalizar':'Siguiente'}
      </button>
    </div>`;

  // INYECTAR tarjeta con la clase `active`
  questionnaireContainer.innerHTML = `
    <div class="question-card active">
      <h3 class="text-xl font-semibold mb-4">${q.text}</h3>
      <div class="options-container flex flex-wrap">${optionsHtml}</div>
      ${navigationHtml}
    </div>`;

  // 6. Lógica de selección de opción
  document.querySelectorAll('.option-btn').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.option-btn').forEach(o => o.classList.remove('bg-blue-200'));
      opt.classList.add('bg-blue-200');
      document.getElementById('next-btn').disabled = false;
    });
  });

  // 7. Botón “Anterior”
  document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
      renderQuestion(--currentQuestionIndex);
    }
  });

  // 8. Botón “Siguiente” / “Finalizar”
  document.getElementById('next-btn').addEventListener('click', () => {
    const sel = document.querySelector('.option-btn.bg-blue-200');
    scores.risk += +sel.dataset.risk;
    scores.opp  += +sel.dataset.opp;

    if (!isLast) {
      renderQuestion(++currentQuestionIndex);
    } else {
      showResults();
    }
  });
}

// 9. Mostrar resultados finales
function showResults() {
  sectionEvaluacion.classList.add('hidden');
  sectionResultados.classList.remove('hidden');

  // Cálculo de porcentajes (ajusta fórmula si la tuya es distinta)
  const maxScore = 5 * questions.length * 5;
  const riskPct = Math.round((scores.risk / maxScore) * 100);
  const oppPct  = Math.round((scores.opp  / maxScore) * 100);

  document.getElementById('risk-level-bar').style.width = riskPct + '%';
  document.getElementById('risk-level-label').textContent = riskPct + '%';
  document.getElementById('opportunity-level-bar').style.width = oppPct + '%';
  document.getElementById('opportunity-level-label').textContent = oppPct + '%';

  // Aquí inyectarías los servicios recomendados…
}

// 10. Resto de inicializaciones (scrollspy, menú móvil, chat y footer) queda igual
