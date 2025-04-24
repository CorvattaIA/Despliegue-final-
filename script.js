// script.js - Lógica de JavaScript para ÉticaIA (sin N8N Chat)

// --- Esperar a que el DOM esté completamente cargado ---
document.addEventListener('DOMContentLoaded', () => {

    // --- Constantes y Estado Global (Cuestionario) ---
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
    const contactForm = document.getElementById('contact-form'); // Aunque no se use JS para mailto, la referencia puede existir

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
    // Actualizar el contador total de preguntas si el elemento existe
    if (totalQuestionsSpan) {
        totalQuestionsSpan.textContent = questions.length;
    }


    const allServices = [
        { id: 'diag', name: 'Diagnóstico de Riesgos Éticos', desc: 'Evaluación exhaustiva de riesgos éticos con recomendaciones específicas.', riskThreshold: 3, opportunityThreshold: 0 },
        { id: 'estr', name: 'Diseño de Estrategias Éticas', desc: 'Desarrollo de estrategias personalizadas para integrar principios éticos.', riskThreshold: 2, opportunityThreshold: 3 },
        { id: 'anal', name: 'Análisis Ético de la IA', desc: 'Evaluación integral de sistemas existentes o en desarrollo.', riskThreshold: 4, opportunityThreshold: 0 },
        { id: 'capa', name: 'Capacitación en Ética para IA', desc: 'Programas de formación para su equipo sobre principios éticos.', riskThreshold: 0, opportunityThreshold: 0 }
    ];


    // --- Funciones del Cuestionario ---

    function renderQuestion(index) {
        // Solo renderizar si el contenedor existe y el índice es válido
        if (!questionnaireContainer || !currentQuestionNumberSpan || index < 0 || index >= questions.length) {
             // console.warn("Contenedor de cuestionario no encontrado o índice inválido.");
             return;
        }

        const question = questions[index];
        currentQuestionIndex = index;
        currentQuestionNumberSpan.textContent = index + 1; // Actualizar número de pregunta actual

        // Crear HTML para las opciones
        let optionsHtml = question.options.map(option =>
            `<button class="option-btn" data-value="${option.value}">${option.text}</button>`
        ).join('');

        // Crear HTML para los botones de navegación
        let navigationHtml;
         if (index === questions.length - 1) { // Última pregunta
             navigationHtml = `
                <div class="navigation-buttons">
                    <button class="btn btn-secondary prev-btn" ${index === 0 ? 'disabled' : ''}>Anterior</button>
                    <button class="btn btn-primary finish-btn" ${!answers[question.id] ? 'disabled' : ''}>Finalizar</button>
                </div>`;
         } else { // Preguntas intermedias
              navigationHtml = `
                <div class="navigation-buttons">
                    <button class="btn btn-secondary prev-btn" ${index === 0 ? 'disabled' : ''}>Anterior</button>
                    <button class="btn btn-primary next-btn" ${!answers[question.id] ? 'disabled' : ''}>Siguiente</button>
                </div>`;
         }

        // Insertar HTML en el contenedor del cuestionario
        questionnaireContainer.innerHTML = `
            <div class="question-card active" data-question="${question.id}">
                <h3 class="text-xl font-semibold mb-6">${question.text}</h3>
                <div class="options-container">${optionsHtml}</div>
                ${navigationHtml}
            </div>`;

        // Si ya existe una respuesta para esta pregunta, marcarla como seleccionada
        if (answers[question.id]) {
            const selectedBtn = questionnaireContainer.querySelector(`.option-btn[data-value="${answers[question.id]}"]`);
            if (selectedBtn) {
                selectedBtn.classList.add('selected');
            }
        }

        // Añadir listeners a los nuevos botones creados
        addQuestionListeners();
    }

    function addQuestionListeners() {
        // Añadir listeners solo si el contenedor existe
        if (!questionnaireContainer) return;

        // Listener para cada botón de opción
        questionnaireContainer.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', handleOptionSelect);
        });

        // Listeners para botones de navegación
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
        answers[questionId] = parseInt(selectedValue); // Guardar la respuesta

        // Actualizar visualmente qué botón está seleccionado
        if (!questionnaireContainer) return;
        questionnaireContainer.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
        event.target.classList.add('selected');

        // Habilitar el botón de Siguiente/Finalizar una vez seleccionada una opción
        const nextBtn = questionnaireContainer.querySelector('.next-btn');
        const finishBtn = questionnaireContainer.querySelector('.finish-btn');
        if (nextBtn) nextBtn.disabled = false;
        if (finishBtn) finishBtn.disabled = false;
    }

    function handleNextQuestion() {
        // Ir a la siguiente pregunta si no es la última
        if (currentQuestionIndex < questions.length - 1) {
            renderQuestion(currentQuestionIndex + 1);
        }
    }

     function handlePrevQuestion() {
        // Ir a la pregunta anterior si no es la primera
        if (currentQuestionIndex > 0) {
            renderQuestion(currentQuestionIndex - 1);
        }
    }

    function handleFinishQuestionnaire() {
        // Calcular puntuaciones de riesgo y oportunidad
        const riskScore = calculateScore('risk');
        const opportunityScore = calculateScore('opportunity');

        // Mostrar los resultados y ocultar el cuestionario
        displayResults(riskScore, opportunityScore);
        if (evaluationSection) evaluationSection.classList.add('hidden'); // Ocultar sección de evaluación
        if (resultsSection) {
            resultsSection.style.display = 'block'; // Mostrar sección de resultados
            resultsSection.scrollIntoView({ behavior: 'smooth' }); // Hacer scroll hacia los resultados
        }
    }

    function calculateScore(type) {
        let totalScore = 0;
        let count = 0;
        // Sumar los valores de las respuestas del tipo especificado ('risk' u 'opportunity')
        questions.forEach(q => {
            if (q.type === type && answers[q.id]) {
                totalScore += answers[q.id];
                count++;
            }
        });
        // Evitar división por cero y calcular porcentaje
        if (count === 0) return 0;
        const maxPossible = count * 5; // Máxima puntuación posible (todas las respuestas valen 5)
        const minPossible = count * 1; // Mínima puntuación posible (todas las respuestas valen 1)
        // Normalizar el puntaje a una escala de 0 a 100
        const percentage = ((totalScore - minPossible) / (maxPossible - minPossible)) * 100;
        return Math.round(percentage); // Devolver porcentaje redondeado
    }

    function displayResults(riskScore, opportunityScore) {
        // Actualizar elementos visuales solo si existen
        if (!riskLevelBar || !opportunityLevelBar || !riskLevelLabel || !opportunityLevelLabel) return;

        // Actualizar el ancho de las barras de progreso
        riskLevelBar.style.width = `${riskScore}%`;
        opportunityLevelBar.style.width = `${opportunityScore}%`;

        // Actualizar las etiquetas de texto con el nivel y porcentaje
        riskLevelLabel.textContent = getLevelLabel(riskScore);
        opportunityLevelLabel.textContent = getLevelLabel(opportunityScore); // Usar la misma función para la etiqueta de oportunidad

        // Generar y mostrar las recomendaciones de servicios
        renderRecommendedServices(riskScore, opportunityScore);
    }

     function getLevelLabel(score) {
        // Devolver una etiqueta descriptiva basada en el puntaje
        if (score < 25) return `Bajo (${score}%)`;
        if (score < 50) return `Moderado (${score}%)`;
        if (score < 75) return `Alto (${score}%)`;
        return `Muy Alto (${score}%)`;
    }

    function renderRecommendedServices(riskScore, opportunityScore) {
        // Renderizar servicios recomendados solo si el contenedor existe
        if (!recommendedServicesContainer) return;
        recommendedServicesContainer.innerHTML = ''; // Limpiar recomendaciones anteriores

        let recommended = []; // Array para guardar los servicios recomendados

        // Lógica simple de recomendación basada en puntajes
        if (riskScore >= 75) { // Riesgo Muy Alto
            recommended.push(allServices.find(s => s.id === 'anal')); // Análisis Ético
            recommended.push(allServices.find(s => s.id === 'diag')); // Diagnóstico
        } else if (riskScore >= 50) { // Riesgo Alto
             recommended.push(allServices.find(s => s.id === 'diag'));
             recommended.push(allServices.find(s => s.id === 'estr')); // Estrategias
        } else if (riskScore >= 25) { // Riesgo Moderado
            recommended.push(allServices.find(s => s.id === 'estr'));
        }

        // Recomendar estrategias si la oportunidad es alta
        if (opportunityScore >= 50) {
            // Añadir solo si no está ya recomendado
            if (!recommended.some(s => s && s.id === 'estr')) {
                 recommended.push(allServices.find(s => s.id === 'estr'));
            }
        }

        // Recomendar capacitación si hay riesgo moderado/alto o oportunidad alta
        if (riskScore >= 25 || opportunityScore >= 50) {
             // Añadir solo si no está ya recomendado
             if (!recommended.some(s => s && s.id === 'capa')) {
                 recommended.push(allServices.find(s => s.id === 'capa'));
             }
        }

        // Eliminar posibles duplicados y elementos nulos/undefined
        recommended = [...new Set(recommended.filter(s => s))];

        // Mostrar mensaje si no hay recomendaciones específicas
        if (recommended.length === 0) {
             recommendedServicesContainer.innerHTML = '<p class="text-gray-600 md:col-span-2 lg:col-span-3 text-center">No se requieren servicios específicos basados en esta evaluación inicial, pero siempre recomendamos buenas prácticas.</p>';
             return;
        }

        // Crear y añadir el HTML para cada servicio recomendado
        recommended.forEach(service => {
            const serviceEl = document.createElement('div');
            serviceEl.className = 'bg-white p-6 rounded-lg shadow-md'; // Estilos de la tarjeta
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
            if (!card) return; // Salir si no se encuentra la tarjeta
            selectedSector = card.dataset.sector; // Guardar el sector seleccionado
            const sectorNameElement = card.querySelector('h3');
            const sectorName = sectorNameElement ? sectorNameElement.textContent : 'Desconocido'; // Obtener nombre del sector

            // Actualizar el nombre del sector en la sección de evaluación si existe
            if (selectedSectorNameSpan) {
                selectedSectorNameSpan.textContent = sectorName;
            }
            // Reiniciar estado del cuestionario
            currentQuestionIndex = 0;
            answers = {};
            // Ocultar resultados y mostrar la sección de evaluación
            if (resultsSection) resultsSection.style.display = 'none';
            if (evaluationSection && questionnaireContainer) { // Asegurarse que los elementos existen
                 evaluationSection.classList.remove('hidden'); // Mostrar sección
                 renderQuestion(0); // Renderizar la primera pregunta
                 evaluationSection.scrollIntoView({ behavior: 'smooth' }); // Hacer scroll a la sección
            }
        });
    });

    // Toggle para el menú móvil
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuBtn && mobileMenu) { // Asegurarse que ambos elementos existen
        const mobileLinks = mobileMenu.querySelectorAll('.mobile-link');
        menuBtn.addEventListener('click', () => {
          mobileMenu.classList.toggle('hidden'); // Mostrar/ocultar menú
          const icon = menuBtn.querySelector('i'); // Obtener el icono dentro del botón
          if (icon) { // Cambiar entre icono de barras y 'X'
              icon.classList.toggle('fa-bars');
              icon.classList.toggle('fa-times');
          }
        });

        // Cerrar menú móvil al hacer clic en un enlace
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden'); // Ocultar menú
                const icon = menuBtn.querySelector('i');
                if (icon) { // Resetear icono a barras
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // Establecer el año actual en el pie de página
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) { // Verificar si el elemento existe
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Scrollspy para resaltar enlace de navegación activo
    const sections = document.querySelectorAll('main section[id]');
    const headerNavLinks = document.querySelectorAll('header nav a[href^="#"]'); // Enlaces de nav de escritorio
    const mobileNavLinks = document.querySelectorAll('#mobile-menu a[href^="#"]'); // Enlaces de nav móvil

    // Solo configurar IntersectionObserver si hay secciones y enlaces
    if (sections.length > 0 && headerNavLinks.length > 0) {
        const observerOptions = {
            root: null, // Observar en relación al viewport
            rootMargin: '-50% 0px -50% 0px', // Activar cuando la sección está en el centro vertical
            threshold: 0 // Activar apenas entre/salga del margen
        };

        const observerCallback = (entries) => {
            let activeSectionId = null;
            // Encontrar la última sección que está intersectando (más abajo en la página)
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                   activeSectionId = entry.target.id;
                }
            });

            // Si ninguna sección está en el centro, buscar la más cercana arriba del centro
            if (!activeSectionId) {
                 let closestSection = null;
                 let minDistance = Infinity;
                 sections.forEach(section => {
                     // Considerar solo secciones visibles
                     if (section.offsetParent !== null) {
                         const rect = section.getBoundingClientRect();
                         // Si la sección está por encima o justo en el centro
                         if (rect.top <= window.innerHeight / 2) {
                             const distance = Math.abs(rect.top); // Distancia desde el top del viewport
                             if (distance < minDistance) {
                                 minDistance = distance;
                                 closestSection = section;
                             }
                         }
                     }
                 });
                 // Si se encontró una sección cercana, usar su ID, si no, usar 'inicio' por defecto
                 activeSectionId = closestSection ? closestSection.id : 'inicio';
            }

            // Actualizar enlaces de navegación de escritorio
            headerNavLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${activeSectionId}`) {
                    link.classList.add('active');
                }
            });
            // Actualizar enlaces de navegación móvil
            mobileNavLinks.forEach(link => {
                link.classList.remove('active', 'bg-blue-100', 'text-blue-700'); // Quitar estilos activos
                if (link.getAttribute('href') === `#${activeSectionId}`) {
                    link.classList.add('active', 'bg-blue-100', 'text-blue-700'); // Añadir estilos activos
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        // Observar todas las secciones principales que no estén ocultas inicialmente
        sections.forEach(section => {
            // Observar solo si no está oculto inicialmente Y no es la sección de resultados
            if (!section.classList.contains('hidden') && section.id !== 'resultados') {
                 observer.observe(section);
            }
        });

         // Observadores para detectar cambios de visibilidad en secciones dinámicas
         if (evaluationSection) {
             const evaluationObserver = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.attributeName === 'class') { // Si cambia la clase (ej. se quita 'hidden')
                        const isHidden = evaluationSection.classList.contains('hidden');
                        if (!isHidden) {
                            observer.observe(evaluationSection); // Empezar a observar
                        } else {
                            observer.unobserve(evaluationSection); // Dejar de observar
                        }
                    }
                });
             });
             // Observar cambios en los atributos de la sección de evaluación
             evaluationObserver.observe(evaluationSection, { attributes: true });
         }

         if (resultsSection) {
             const resultsObserver = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.attributeName === 'style') { // Si cambia el estilo (ej. display: block)
                        const isHidden = resultsSection.style.display === 'none';
                         if (!isHidden) {
                            observer.observe(resultsSection); // Empezar a observar
                        } else {
                            observer.unobserve(resultsSection); // Dejar de observar
                        }
                    }
                });
             });
             // Observar cambios en los atributos de estilo de la sección de resultados
             resultsObserver.observe(resultsSection, { attributes: true });
         }

        // Ejecutar una vez al inicio para establecer el estado activo correcto
         setTimeout(() => {
            observerCallback(observer.takeRecords()); // Obtener estado inicial
             // Caso especial: si estamos muy arriba, forzar 'inicio' como activo
             if (window.scrollY < 100 && sections.length > 0 && sections[0].id === 'inicio') {
                 headerNavLinks.forEach(link => link.classList.remove('active'));
                 mobileNavLinks.forEach(link => link.classList.remove('active', 'bg-blue-100', 'text-blue-700'));
                 document.querySelector('header nav a[href="#inicio"]')?.classList.add('active');
                 document.querySelector('#mobile-menu a[href="#inicio"]')?.classList.add('active', 'bg-blue-100', 'text-blue-700');
             }
        }, 100); // Pequeño retraso para asegurar que todo esté renderizado
    }


    // --- Manejo del Formulario de Contacto (con mailto:) ---
    // No se necesita JS para mailto:, el navegador lo gestiona.
    // El código para mostrar mensajes de estado se deja comentado por si se cambia el método
    /*
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            // Si no se usa mailto:, descomentar la siguiente línea:
            // event.preventDefault();
            const formStatus = document.getElementById('form-status');
            if (formStatus) {
                 formStatus.textContent = 'Enviando mensaje...';
                 formStatus.classList.remove('text-red-500', 'text-green-500');
                 // Aquí iría la lógica de envío real (fetch a un backend)
                 // Simulación:
                 setTimeout(() => {
                    // Éxito simulado
                    formStatus.textContent = '¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.';
                    formStatus.classList.add('text-green-500');
                    contactForm.reset();
                    setTimeout(() => { formStatus.textContent = ''; }, 5000);

                    // Error simulado (descomentar para probar)
                    // formStatus.textContent = 'Error al enviar el mensaje. Inténtalo de nuevo.';
                    // formStatus.classList.add('text-red-500');
                 }, 1500);
            }
        });
    }
    */

    // La inicialización de N8N Chat se hace en el script type="module" en el HTML

}); // Fin del DOMContentLoaded
