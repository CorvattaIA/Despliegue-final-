// script.js - Lógica de JavaScript para ÉticaIA

// --- Esperar a que el DOM esté completamente cargado ---
document.addEventListener('DOMContentLoaded', () => {

    // --- Constantes y Estado Global ---
    const questionnaireContainer = document.querySelector('.questionnaire-container');
    const evaluationSection = document.getElementById('evaluacion');
    const resultsSection = document.getElementById('resultados');
    const currentQuestionNumberSpan = document.getElementById('current-question-number');
    const totalQuestionsSpan = document.getElementById('total-questions');
    const selectedSectorNameSpan = document.getElementById('selected-sector-name');
    const riskLevelBar = document.getElementById('risk-level-bar');
    const riskLevelLabel = document.getElementById('risk-level-label');
    const opportunityLevelBar = document.getElementById('opportunity-level-bar');
    const opportunityLevelLabel = document.getElementById('opportunity-level-label');
    const recommendedServicesContainer = document.getElementById('recommended-services-container');
    const contactForm = document.getElementById('contact-form');
    // const formStatus = document.getElementById('form-status'); // No se usa con mailto:

    let currentQuestionIndex = 0;
    let selectedSector = '';
    let answers = {}; // Almacenará { questionId: value }

    const questions = [
        { id: 'risk1', text: '¿Qué tipo de datos utiliza o utilizaría su sistema de IA?', type: 'risk', options: [ { text: 'Datos públicos y abiertos sin información personal', value: 1 }, { text: 'Datos agregados con información demográfica general', value: 2 }, { text: 'Datos con información personal pero no sensible', value: 3 }, { text: 'Datos con información personal sensible (salud, finanzas, etc.)', value: 4 }, { text: 'Datos biométricos o de categorías especiales', value: 5 } ] },
        { id: 'risk2', text: '¿Qué nivel de autonomía tendría el sistema de IA en la toma de decisiones?', type: 'risk', options: [ { text: 'Solo asistencia informativa, decisión humana final', value: 1 }, { text: 'Recomendaciones con supervisión humana constante', value: 2 }, { text: 'Decisiones automatizadas con posibilidad de intervención humana', value: 3 }, { text: 'Decisiones automatizadas con supervisión humana periódica', value: 4 }, { text: 'Decisiones completamente automatizadas sin supervisión humana', value: 5 } ] },
        { id: 'risk3', text: '¿Qué impacto potencial podrían tener las decisiones del sistema de IA?', type: 'risk', options: [ { text: 'Impacto mínimo, sin consecuencias significativas', value: 1 }, { text: 'Impacto bajo, afecta experiencias pero no derechos', value: 2 }, { text: 'Impacto moderado, puede afectar oportunidades', value: 3 }, { text: 'Impacto alto, afecta acceso a servicios esenciales', value: 4 }, { text: 'Impacto crítico, puede afectar derechos fundamentales', value: 5 } ] },
        { id: 'opportunity1', text: '¿Qué nivel de mejora en eficiencia espera obtener con la implementación de IA?', type: 'opportunity', options: [ { text: 'Mejora mínima (menos del 10%)', value: 1 }, { text: 'Mejora baja (10-25%)', value: 2 }, { text: 'Mejora moderada (25-50%)', value: 3 }, { text: 'Mejora alta (50-100%)', value: 4 }, { text: 'Mejora transformadora (más del 100%)', value: 5 } ] },
        { id: 'opportunity2', text: '¿Qué nivel de innovación representaría la IA en su sector específico?', type: 'opportunity', options: [ { text: 'Tecnología ya común en el sector', value: 1 }, { text: 'Mejora incremental sobre soluciones existentes', value: 2 }, { text: 'Aplicación novedosa de tecnologías probadas', value: 3 }, { text: 'Innovación significativa en el sector', value: 4 }, { text: 'Transformación disruptiva del sector', value: 5 } ] },
        { id: 'opportunity3', text: '¿Qué impacto tendría la IA en la experiencia de sus clientes o usuarios?', type: 'opportunity', options: [ { text: 'Impacto mínimo, apenas perceptible', value: 1 }, { text: 'Mejora leve en algunos aspectos', value: 2 }, { text: 'Mejora notable en la experiencia general', value: 3 }, { text: 'Transformación significativa de la experiencia', value: 4 }, { text: 'Creación de experiencias completamente nuevas', value: 5 } ] }
    ];
    // Asegurarse de que los elementos existen antes de intentar acceder a ellos
    if (totalQuestionsSpan) {
        totalQuestionsSpan.textContent = questions.length;
    }


    const allServices = [
        { id: 'diag', name: 'Diagnóstico de Riesgos Éticos', desc: 'Evaluación exhaustiva de riesgos éticos con recomendaciones específicas.', riskThreshold: 3, opportunityThreshold: 0 },
        { id: 'estr', name: 'Diseño de Estrategias Éticas', desc: 'Desarrollo de estrategias personalizadas para integrar principios éticos.', riskThreshold: 2, opportunityThreshold: 3 },
        { id: 'anal', name: 'Análisis Ético de la IA', desc: 'Evaluación integral de sistemas existentes o en desarrollo.', riskThreshold: 4, opportunityThreshold: 0 },
        { id: 'capa', name: 'Capacitación en Ética para IA', desc: 'Programas de formación para su equipo sobre principios éticos.', riskThreshold: 0, opportunityThreshold: 0 } // Siempre recomendado o basado en sector?
    ];


    // --- Funciones del Cuestionario ---

    function renderQuestion(index) {
        // Verificar si los elementos necesarios existen
        if (!questionnaireContainer || !currentQuestionNumberSpan || index < 0 || index >= questions.length) return;

        const question = questions[index];
        currentQuestionIndex = index;
        currentQuestionNumberSpan.textContent = index + 1;

        let optionsHtml = question.options.map(option =>
            `<button class="option-btn" data-value="${option.value}">${option.text}</button>`
        ).join('');

        let navigationHtml = `
            <div class="navigation-buttons">
                <button class="btn btn-secondary prev-btn" ${index === 0 ? 'disabled' : ''}>Anterior</button>
                <button class="btn btn-primary next-btn" ${index === questions.length - 1 ? 'disabled' : ''}>${index === questions.length - 1 ? 'Finalizar' : 'Siguiente'}</button>
            </div>`;
         if (index === questions.length - 1) {
             // Asegurar que el botón Finalizar esté habilitado solo si hay respuesta
             navigationHtml = `
                <div class="navigation-buttons">
                    <button class="btn btn-secondary prev-btn" ${index === 0 ? 'disabled' : ''}>Anterior</button>
                    <button class="btn btn-primary finish-btn" ${!answers[question.id] ? 'disabled' : ''}>Finalizar</button>
                </div>`;
         } else {
              navigationHtml = `
                <div class="navigation-buttons">
                    <button class="btn btn-secondary prev-btn" ${index === 0 ? 'disabled' : ''}>Anterior</button>
                    <button class="btn btn-primary next-btn" ${!answers[question.id] ? 'disabled' : ''}>Siguiente</button>
                </div>`;
         }


        questionnaireContainer.innerHTML = `
            <div class="question-card active" data-question="${question.id}">
                <h3 class="text-xl font-semibold mb-6">${question.text}</h3>
                <div class="options-container">${optionsHtml}</div>
                ${navigationHtml}
            </div>`;

        // Marcar opción seleccionada si existe
        if (answers[question.id]) {
            const selectedBtn = questionnaireContainer.querySelector(`.option-btn[data-value="${answers[question.id]}"]`);
            if (selectedBtn) {
                selectedBtn.classList.add('selected');
            }
        }

        addQuestionListeners();
    }

    function addQuestionListeners() {
        if (!questionnaireContainer) return;
        questionnaireContainer.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', handleOptionSelect);
        });
        const nextBtn = questionnaireContainer.querySelector('.next-btn');
        const prevBtn = questionnaireContainer.querySelector('.prev-btn');
        const finishBtn = questionnaireContainer.querySelector('.finish-btn');

        if (nextBtn) nextBtn.addEventListener('click', handleNextQuestion);
        if (prevBtn) prevBtn.addEventListener('click', handlePrevQuestion);
        if (finishBtn) finishBtn.addEventListener('click', handleFinishQuestionnaire);
    }

    function handleOptionSelect(event) {
        const selectedValue = event.target.dataset.value;
        const questionId = questions[currentQuestionIndex].id;
        answers[questionId] = parseInt(selectedValue); // Guardar respuesta

        // Actualizar UI de selección
        if (!questionnaireContainer) return;
        questionnaireContainer.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
        event.target.classList.add('selected');

        // Habilitar botón Siguiente/Finalizar
        const nextBtn = questionnaireContainer.querySelector('.next-btn');
        const finishBtn = questionnaireContainer.querySelector('.finish-btn');
        if (nextBtn) nextBtn.disabled = false;
        if (finishBtn) finishBtn.disabled = false;
    }

    function handleNextQuestion() {
        if (currentQuestionIndex < questions.length - 1) {
            renderQuestion(currentQuestionIndex + 1);
        }
    }

     function handlePrevQuestion() {
        if (currentQuestionIndex > 0) {
            renderQuestion(currentQuestionIndex - 1);
        }
    }

    function handleFinishQuestionnaire() {
        // Calcular resultados
        const riskScore = calculateScore('risk');
        const opportunityScore = calculateScore('opportunity');

        // Mostrar sección de resultados
        displayResults(riskScore, opportunityScore);
        if (evaluationSection) evaluationSection.classList.add('hidden'); // Ocultar cuestionario
        if (resultsSection) {
            resultsSection.style.display = 'block'; // Mostrar resultados
            resultsSection.scrollIntoView({ behavior: 'smooth' }); // Scroll a resultados
        }
    }

    function calculateScore(type) {
        let totalScore = 0;
        let count = 0;
        questions.forEach(q => {
            if (q.type === type && answers[q.id]) {
                totalScore += answers[q.id];
                count++;
            }
        });
        // Normalizar a un porcentaje (o escala de 1 a 5, o 0 a 100)
        if (count === 0) return 0;
        const maxPossible = count * 5;
        const minPossible = count * 1;
         // Escala de 0 a 100
        const percentage = ((totalScore - minPossible) / (maxPossible - minPossible)) * 100;
        return Math.round(percentage); // Devolver porcentaje redondeado
    }

    function displayResults(riskScore, opportunityScore) {
        // Verificar si los elementos existen
        if (!riskLevelBar || !opportunityLevelBar || !riskLevelLabel || !opportunityLevelLabel) return;

        // Actualizar barras de progreso
        riskLevelBar.style.width = `${riskScore}%`;
        opportunityLevelBar.style.width = `${opportunityScore}%`;

        // Actualizar etiquetas de nivel
        riskLevelLabel.textContent = getLevelLabel(riskScore);
        opportunityLevelLabel.textContent = getLevelLabel(opportunityScore);

        // Generar recomendaciones de servicios
        renderRecommendedServices(riskScore, opportunityScore);
    }

     function getLevelLabel(score) {
        if (score < 25) return `Bajo (${score}%)`;
        if (score < 50) return `Moderado (${score}%)`;
        if (score < 75) return `Alto (${score}%)`;
        return `Muy Alto (${score}%)`;
    }

    function renderRecommendedServices(riskScore, opportunityScore) {
        if (!recommendedServicesContainer) return;
        recommendedServicesContainer.innerHTML = ''; // Limpiar contenedor

        // Lógica de recomendación
        let recommended = [];
        if (riskScore >= 75) { // Riesgo Muy Alto
            recommended.push(allServices.find(s => s.id === 'anal'));
            recommended.push(allServices.find(s => s.id === 'diag'));
        } else if (riskScore >= 50) { // Riesgo Alto
             recommended.push(allServices.find(s => s.id === 'diag'));
             recommended.push(allServices.find(s => s.id === 'estr'));
        } else if (riskScore >= 25) { // Riesgo Moderado
            recommended.push(allServices.find(s => s.id === 'estr'));
        }

        if (opportunityScore >= 50) { // Oportunidad Alta/Muy Alta
            if (!recommended.some(s => s && s.id === 'estr')) {
                 recommended.push(allServices.find(s => s.id === 'estr'));
            }
        }

        if (riskScore >= 25 || opportunityScore >= 50) {
             if (!recommended.some(s => s && s.id === 'capa')) {
                 recommended.push(allServices.find(s => s.id === 'capa'));
             }
        }

        // Eliminar duplicados y nulos
        recommended = [...new Set(recommended.filter(s => s))];

        if (recommended.length === 0) {
             recommendedServicesContainer.innerHTML = '<p class="text-gray-600 md:col-span-2 lg:col-span-3 text-center">No se requieren servicios específicos basados en esta evaluación inicial, pero siempre recomendamos buenas prácticas.</p>';
             return;
        }

        recommended.forEach(service => {
            const serviceEl = document.createElement('div');
            serviceEl.className = 'bg-white p-6 rounded-lg shadow-md';
            serviceEl.innerHTML = `
                <h4 class="text-lg font-semibold mb-2 text-blue-600">${service.name}</h4>
                <p class="text-gray-600 text-sm">${service.desc}</p>
                <a href="#contacto" class="text-blue-500 hover:underline text-sm mt-3 inline-block">Solicitar más info</a>
            `;
            recommendedServicesContainer.appendChild(serviceEl);
        });
    }


    // --- Inicialización y Event Listeners Globales ---

    // Listener para botones "Evaluar mi negocio" en tarjetas de sector
    document.querySelectorAll('.evaluate-sector-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const card = event.target.closest('.sector-card');
            if (!card) return;
            selectedSector = card.dataset.sector;
            const sectorNameElement = card.querySelector('h3');
            const sectorName = sectorNameElement ? sectorNameElement.textContent : 'Desconocido';

            if (selectedSectorNameSpan) {
                selectedSectorNameSpan.textContent = sectorName; // Mostrar nombre del sector
            }
            // Reiniciar cuestionario
            currentQuestionIndex = 0;
            answers = {};
            // Ocultar/mostrar secciones
            if (resultsSection) resultsSection.style.display = 'none';
            if (evaluationSection) evaluationSection.classList.remove('hidden');
            renderQuestion(0); // Empezar cuestionario
            if (evaluationSection) evaluationSection.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Toggle para el menú móvil
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuBtn && mobileMenu) {
        const mobileLinks = mobileMenu.querySelectorAll('.mobile-link');
        menuBtn.addEventListener('click', () => {
          mobileMenu.classList.toggle('hidden');
          const icon = menuBtn.querySelector('i');
          if (icon) {
              icon.classList.toggle('fa-bars');
              icon.classList.toggle('fa-times');
          }
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                const icon = menuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // Establecer el año actual en el pie de página
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Scrollspy para resaltar enlace de navegación activo
    const sections = document.querySelectorAll('main section[id]');
    const headerNavLinks = document.querySelectorAll('header nav a[href^="#"]');
    const mobileNavLinks = document.querySelectorAll('#mobile-menu a[href^="#"]');

    if (sections.length > 0 && headerNavLinks.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0
        };

        const observerCallback = (entries) => {
            let activeSectionId = null;
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                   activeSectionId = entry.target.id;
                }
            });

            if (!activeSectionId) {
                 let closestSection = null;
                 let minDistance = Infinity;
                 sections.forEach(section => {
                     const rect = section.getBoundingClientRect();
                     if (rect.top < window.innerHeight / 2) {
                         const distance = Math.abs(rect.top - window.innerHeight / 2);
                         if (distance < minDistance) {
                             minDistance = distance;
                             closestSection = section;
                         }
                     }
                 });
                 activeSectionId = closestSection ? closestSection.id : 'inicio';
            }

            headerNavLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${activeSectionId}`) {
                    link.classList.add('active');
                }
            });
            mobileNavLinks.forEach(link => {
                link.classList.remove('active', 'bg-blue-100', 'text-blue-700');
                if (link.getAttribute('href') === `#${activeSectionId}`) {
                    link.classList.add('active', 'bg-blue-100', 'text-blue-700');
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        sections.forEach(section => {
            if (!section.classList.contains('hidden') && section.id !== 'resultados') {
                 observer.observe(section);
            }
        });

         // Observadores para secciones dinámicas (si existen)
         if (evaluationSection) {
             const evaluationObserver = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.attributeName === 'class') {
                        const isHidden = evaluationSection.classList.contains('hidden');
                        if (!isHidden) {
                            observer.observe(evaluationSection);
                        } else {
                            observer.unobserve(evaluationSection);
                        }
                    }
                });
             });
             evaluationObserver.observe(evaluationSection, { attributes: true });
         }

         if (resultsSection) {
             const resultsObserver = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.attributeName === 'style') {
                        const isHidden = resultsSection.style.display === 'none';
                         if (!isHidden) {
                            observer.observe(resultsSection);
                        } else {
                            observer.unobserve(resultsSection);
                        }
                    }
                });
             });
             resultsObserver.observe(resultsSection, { attributes: true });
         }

        // Ejecutar inicialmente
         setTimeout(() => {
            observerCallback(observer.takeRecords());
             if (window.scrollY < 100) {
                 headerNavLinks.forEach(link => link.classList.remove('active'));
                 mobileNavLinks.forEach(link => link.classList.remove('active', 'bg-blue-100', 'text-blue-700'));
                 document.querySelector('header nav a[href="#inicio"]')?.classList.add('active');
                 document.querySelector('#mobile-menu a[href="#inicio"]')?.classList.add('active', 'bg-blue-100', 'text-blue-700');
             }
        }, 100);
    }


    // --- Funcionalidad del Chat ---
    const chatWidget = document.getElementById('chat-widget');
    const chatHeader = document.getElementById('chat-header');
    const chatToggleBtn = document.getElementById('chat-toggle-btn');
    const chatMessages = document.getElementById('chat-messages');
    const chatInputField = document.getElementById('chat-input-field');
    const chatSendBtn = document.getElementById('chat-send-btn');

    if (chatWidget && chatHeader && chatToggleBtn && chatMessages && chatInputField && chatSendBtn) {
        chatHeader.addEventListener('click', () => {
            chatWidget.classList.toggle('closed');
        });

        function addChatMessage(message, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', sender);
            messageDiv.textContent = message;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll
        }

        function sendMessage() {
            const messageText = chatInputField.value.trim();
            if (messageText === '') return;

            addChatMessage(messageText, 'user');
            chatInputField.value = '';

            // Simular respuesta del asistente
            setTimeout(() => {
                 let reply = "Gracias por tu mensaje. Como asistente virtual, puedo ofrecer información general sobre ética en IA. Para consultas específicas sobre tu negocio, te recomiendo completar nuestra evaluación o contactar a nuestros consultores usando el formulario o los datos del pie de página.";
                 if (messageText.toLowerCase().includes('hola') || messageText.toLowerCase().includes('buenos dias')) {
                     reply = "¡Hola! ¿En qué puedo ayudarte hoy sobre la ética y la IA?";
                 } else if (messageText.toLowerCase().includes('riesgo')) {
                     reply = "La evaluación de riesgos éticos es crucial. Nuestro cuestionario puede darte una idea inicial. ¿Te gustaría comenzarlo seleccionando tu sector en la sección 'Sectores Económicos'?";
                 } else if (messageText.toLowerCase().includes('servicio')) {
                      reply = "Ofrecemos diagnóstico de riesgos, diseño de estrategias, análisis ético y capacitación. Puedes ver más detalles en la sección 'Servicios' o contactarnos a través del formulario en la sección 'Contacto'.";
                 } else if (messageText.toLowerCase().includes('contacto') || messageText.toLowerCase().includes('telefono') || messageText.toLowerCase().includes('correo')) {
                      reply = "Puedes encontrar nuestra información de contacto (correo, teléfono, ubicación) en el pie de página, o usar el formulario en la sección 'Contacto'.";
                 }
                addChatMessage(reply, 'assistant');
            }, 1000);
        }

        chatSendBtn.addEventListener('click', sendMessage);
        chatInputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // --- Manejo del Formulario de Contacto (con mailto:) ---
    // No se necesita JS para mailto:, el navegador lo gestiona.

}); // Fin del DOMContentLoaded
