/* =====================================
Arquivo: script.js
Lógica Principal do Site Lucas Martins
   ===================================== */

document.addEventListener("DOMContentLoaded", () => {
	// ========================================
	// MENU MOBILE
	// ========================================
	const hamburger = document.querySelector(".hamburger-menu");
	const mobileMenu = document.querySelector(".mobile-menu");
	const menuOverlay = document.querySelector(".menu-overlay");
	const menuLinks = document.querySelectorAll(".mobile-menu a");
	const header = document.querySelector(".header"); // Referência ao header adicionada aqui

	function toggleMenu() {
		mobileMenu.classList.toggle("active");
		menuOverlay.classList.toggle("active");
		const icon = hamburger.querySelector("i");
		icon.classList.toggle("fa-bars");
		icon.classList.toggle("fa-times");

		// Muda cor do hamburger para branco quando menu está ativo
		// e volta ao normal (dependendo do scroll) quando fecha
		if (mobileMenu.classList.contains("active")) {
			hamburger.style.color = "var(--text-light)";
		} else {
			if (window.scrollY <= 100) {
				// Usa o mesmo threshold do scroll do header
				hamburger.style.color = "var(--text-dark)";
			} else {
				hamburger.style.color = "var(--text-light)";
			}
		}
	}

	if (hamburger && mobileMenu && menuOverlay) {
		hamburger.addEventListener("click", toggleMenu);
		menuOverlay.addEventListener("click", toggleMenu);

		menuLinks.forEach((link) => {
			link.addEventListener("click", toggleMenu); // Fecha menu ao clicar no link
		});
	}

	// ========================================
	// HEADER SCROLL - Muda cor ao rolar
	// ========================================
	// const header = document.querySelector(".header"); // Já definido acima

	if (header) {
		window.addEventListener("scroll", () => {
			const shouldBeScrolled = window.scrollY > 100;
			header.classList.toggle("scrolled", shouldBeScrolled);
			// Atualiza cor do hamburger no scroll, mas só se o menu NÃO estiver ativo
			if (hamburger && !mobileMenu.classList.contains("active")) {
				hamburger.style.color = shouldBeScrolled
					? "var(--text-light)"
					: "var(--text-dark)";
			}
		});
		// Define a cor inicial do hamburger baseado na posição inicial do scroll
		if (hamburger && !mobileMenu.classList.contains("active")) {
			hamburger.style.color =
				window.scrollY > 100 ? "var(--text-light)" : "var(--text-dark)";
		}
	}

	// ========================================
	// SCROLL ANIMATIONS - Fade in ao aparecer
	// ========================================
	const observerOptions = {
		threshold: 0.1, // Anima quando 10% está visível
		// rootMargin: "0px 0px -100px 0px", // Pode ajustar se necessário
	};

	const observer = new IntersectionObserver((entries, observer) => {
		// Adicionado observer como argumento
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add("visible");
				observer.unobserve(entry.target); // Descomente para animar só uma vez
			}
			// else { // Opcional: remover a classe se sair da tela
			//     entry.target.classList.remove("visible");
			// }
		});
	}, observerOptions);

	document.querySelectorAll(".fade-in-section").forEach((section) => {
		observer.observe(section);
	});

	// ========================================
	// COUNTER ANIMATION - Anima números
	// ========================================
	const counters = document.querySelectorAll(".stat-number");
	const statsSection = document.querySelector(".stats"); // Observa a seção inteira

	// Flag para garantir que a animação ocorra apenas uma vez por carregamento
	let hasCounterAnimated = false;

	const counterObserver = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				// Anima se a seção estiver visível E ainda não animou
				if (entry.isIntersecting && !hasCounterAnimated) {
					hasCounterAnimated = true; // Marca como animado
					counters.forEach((counter) => animateCounter(counter));
					// counterObserver.unobserve(statsSection); // Para de observar após animar
				}
			});
		},
		{threshold: 0.5} // Inicia quando 50% da seção de stats estiver visível
	);

	if (statsSection && counters.length > 0) {
		counterObserver.observe(statsSection); // Observa a seção, não os números individuais
	}

	function animateCounter(element) {
		const target = parseInt(element.getAttribute("data-target"));
		if (isNaN(target)) return; // Sai se não for um número válido

		const duration = 1500; // Duração da animação em ms
		const stepTime = 16; // Aproximadamente 60fps
		const totalSteps = duration / stepTime;
		const increment = target / totalSteps;
		let current = 0;

		const updateCounter = () => {
			current += increment;
			if (current < target) {
				element.textContent = Math.floor(current);
				requestAnimationFrame(updateCounter);
			} else {
				// Garante o valor final exato
				element.textContent = target;
			}
		};
		requestAnimationFrame(updateCounter); // Inicia a animação
	}

	// ========================================
	// CAROUSEL DE FEEDBACKS - Infinito
	// ========================================
	const feedbackData = [
		{
			user: "@davidbeckham",
			image: "ARTISTAS/PERFIL BECKHAM.jpg",
			stars: 5,
			text: "O Lucas transformou minha ideia em uma arte única. Traço perfeito!",
		},
		{
			user: "@leomessi",
			image: "ARTISTAS/PERFIL MESSI.jpg",
			stars: 5,
			text: "Traço firme, sombreamento top e estúdio super profissional.",
		},
		{
			user: "@NeymarJr",
			image: "ARTISTAS/PERFIL NEYMAR.jpg",
			stars: 5,
			text: "Já tinha tatuagem, mas nenhuma com a vibe e a qualidade do Lucas.",
		},
		// Adicione mais se tiver
	];

	const track = document.querySelector(".carousel-track");
	const prevButton = document.querySelector(".carousel-button.prev-button");
	const nextButton = document.querySelector(".carousel-button.next-button");

	let currentIndex = 0;
	let cardWidth = 0;
	let totalOriginalCards = feedbackData.length;
	let cardsToShow = 3; // Padrão desktop
	let totalClonedCards = 0; // Total de cards no track (originais + clones)

	function renderCards() {
		if (!track || totalOriginalCards === 0) return;
		track.innerHTML = "";

		// Clona no início e no fim para efeito infinito
		const clonedStart = feedbackData.slice(-cardsToShow);
		const clonedEnd = feedbackData.slice(0, cardsToShow);
		const allFeedback = [...clonedStart, ...feedbackData, ...clonedEnd];
		totalClonedCards = allFeedback.length;

		allFeedback.forEach((feedback) => {
			const starsHTML =
				'<i class="fas fa-star"></i>'.repeat(feedback.stars) +
				'<i class="far fa-star"></i>'.repeat(5 - feedback.stars);
			const cardHTML = `
                <div class="feedback-card" style="min-width: calc(${
									100 / cardsToShow
								}% - 2rem); flex-basis: calc(${100 / cardsToShow}% - 2rem);">
                    <img src="${feedback.image}" alt="Foto de ${feedback.user}">
                    <p class="feedback-username">${feedback.user}</p>
                    <div class="feedback-stars">${starsHTML}</div>
                    <p class="feedback-text">"${feedback.text}"</p>
                </div>
            `;
			track.innerHTML += cardHTML;
		});

		// Define a posição inicial (mostrando os cards originais)
		currentIndex = cardsToShow;
		updateCarouselPosition(false); // Move sem animar
	}

	function updateCardsToShow() {
		if (window.innerWidth <= 600) cardsToShow = 1;
		else if (window.innerWidth <= 992) cardsToShow = 2;
		else cardsToShow = 3;
		renderCards(); // Re-renderiza com o número correto de clones
	}

	function updateCarouselPosition(animate = true) {
		if (!track) return;

		// Recalcula cardWidth dinamicamente
		const firstCard = track.querySelector(".feedback-card");
		if (firstCard) {
			cardWidth =
				firstCard.offsetWidth +
				parseFloat(getComputedStyle(firstCard).marginLeft) * 2;
		} else {
			cardWidth = track.offsetWidth / cardsToShow; // Fallback
		}

		if (animate) track.style.transition = "transform 0.5s ease-in-out";
		else track.style.transition = "none";

		track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
	}

	// Event listener para transição infinita
	if (track) {
		track.addEventListener("transitionend", () => {
			// Se chegou ao fim dos clones da direita, salta para o início dos originais
			if (currentIndex >= totalOriginalCards + cardsToShow) {
				currentIndex = cardsToShow;
				updateCarouselPosition(false);
			}
			// Se chegou ao início dos clones da esquerda, salta para o fim dos originais
			if (currentIndex < cardsToShow) {
				currentIndex = totalOriginalCards + cardsToShow - 1;
				updateCarouselPosition(false);
			}
		});
	}

	if (nextButton) {
		nextButton.addEventListener("click", () => {
			if (totalOriginalCards === 0) return;
			currentIndex++;
			updateCarouselPosition();
		});
	}

	if (prevButton) {
		prevButton.addEventListener("click", () => {
			if (totalOriginalCards === 0) return;
			currentIndex--;
			updateCarouselPosition();
		});
	}

	// Recalcula ao redimensionar a janela
	window.addEventListener("resize", updateCardsToShow);

	// Inicializa
	updateCardsToShow();

	// ========================================
	// LIGHTBOX - Visualizar imagens grandes
	// ========================================
	const lightbox = document.querySelector(".lightbox");
	const lightboxImg = lightbox.querySelector(".lightbox-content img");
	const lightboxClose = document.querySelector(".lightbox-close");
	const galleryItems = document.querySelectorAll(".gallery-item");

	if (lightbox && lightboxImg && lightboxClose && galleryItems.length > 0) {
		galleryItems.forEach((item) => {
			item.addEventListener("click", () => {
				const imgSrc =
					item.getAttribute("data-img") || item.querySelector("img")?.src;
				if (imgSrc) {
					lightboxImg.setAttribute("src", imgSrc); // Usar setAttribute
					lightbox.classList.add("active");
				}
			});
		});

		lightboxClose.addEventListener("click", () => {
			lightbox.classList.remove("active");
		});

		lightbox.addEventListener("click", (e) => {
			if (e.target === lightbox) {
				lightbox.classList.remove("active");
			}
		});

		document.addEventListener("keydown", (e) => {
			if (e.key === "Escape" && lightbox.classList.contains("active")) {
				lightbox.classList.remove("active");
			}
		});
	}

	// ========================================
	// SCHEDULE TOGGLE - Removido, agora controlado por calendar.js
	// ========================================
	// const scheduleButton = document.querySelector(".schedule-button"); // Não mais necessário aqui
	// const scheduleCalendar = document.querySelector(".schedule-calendar"); // Removido do HTML

	// ========================================
	// SCROLL TO TOP - Botão voltar ao topo
	// ========================================
	const scrollToTopBtn = document.querySelector(".scroll-to-top");

	if (scrollToTopBtn) {
		window.addEventListener("scroll", () => {
			if (window.scrollY > 500) {
				scrollToTopBtn.classList.add("visible");
			} else {
				scrollToTopBtn.classList.remove("visible");
			}
		});

		scrollToTopBtn.addEventListener("click", () => {
			window.scrollTo({top: 0, behavior: "smooth"});
		});
	}

	// ========================================
	// SMOOTH SCROLL - Rolagem suave para âncoras
	// ========================================
	document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
		anchor.addEventListener("click", function (e) {
			const href = this.getAttribute("href");
			// Só previne o padrão se for um link interno real
			if (href && href.startsWith("#") && href.length > 1) {
				e.preventDefault();
				const target = document.querySelector(href);
				if (target) {
					const headerOffset = 80; // Ajuste conforme a altura do seu header fixo
					const elementPosition = target.getBoundingClientRect().top;
					const offsetPosition =
						elementPosition + window.pageYOffset - headerOffset;

					window.scrollTo({top: offsetPosition, behavior: "smooth"});
				}
			}
		});
	});

	// ========================================
	// LOADING SUAVE DAS IMAGENS
	// ========================================
	const images = document.querySelectorAll("img");
	images.forEach((img) => {
		img.style.opacity = "0";
		img.style.transition = "opacity 0.5s ease 0.1s"; // Pequeno delay

		// Função para mostrar a imagem
		const showImage = () => (img.style.opacity = "1");

		// Verifica se a imagem já carregou (cache)
		if (img.complete) {
			showImage();
		} else {
			// Adiciona listener para quando carregar
			img.addEventListener("load", showImage, {once: true}); // 'once: true' remove o listener após disparar
			// Adiciona um listener para erro (imagem quebrada), para não ficar invisível
			img.addEventListener(
				"error",
				() => {
					console.warn(`Erro ao carregar imagem: ${img.src}`);
					img.style.opacity = "1"; // Mostra mesmo se quebrar (pode mostrar o ícone de imagem quebrada)
					img.style.border = "1px dashed red"; // Opcional: indicar erro visualmente
				},
				{once: true}
			);
		}
	});
}); // Fim do DOMContentLoaded
