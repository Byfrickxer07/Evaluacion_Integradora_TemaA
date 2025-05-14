/**
 * Eleganza Eventos - Main JavaScript
 * Theme B
 */

document.addEventListener('DOMContentLoaded', function() {
    // Preloader - ocultar inmediatamente
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.display = 'none';
    }
    
    // Sonido de clic para botones
    const clickSound = new Audio('img/mouse-button-click-308449.mp3');
    
    // Agregar sonido a todos los botones
    document.querySelectorAll('button, .btn').forEach(button => {
        button.addEventListener('click', function() {
            clickSound.currentTime = 0;
            clickSound.play();
        });
    });

    // Initialize Bootstrap components
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Audio toggle functionality
    const audioToggle = document.getElementById('audio-toggle');
    const backgroundMusic = document.getElementById('background-music');
    
    if (audioToggle && backgroundMusic) {
        audioToggle.addEventListener('click', function() {
            if (backgroundMusic.paused) {
                backgroundMusic.play();
                audioToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
            } else {
                backgroundMusic.pause();
                audioToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
            }
        });
    }

    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            if (body.getAttribute('data-theme') === 'light') {
                body.setAttribute('data-theme', 'dark');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
                localStorage.setItem('theme', 'dark');
            } else {
                body.setAttribute('data-theme', 'light');
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
                localStorage.setItem('theme', 'light');
            }
        });

        // Check saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            body.setAttribute('data-theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }

    // Counter animation
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    function animateCounters() {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-count');
            const count = +counter.innerText;
            const increment = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(animateCounters, 1);
            } else {
                counter.innerText = target;
            }
        });
    }

    // Start counter animation when in viewport
    const counterSection = document.querySelector('.stats-counter');
    
    if (counterSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                animateCounters();
                observer.unobserve(counterSection);
            }
        });
        
        observer.observe(counterSection);
    }

    // Gallery filter
    const filterButtons = document.querySelectorAll('.btn-filter');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            galleryItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Form validation
    const forms = document.querySelectorAll('.needs-validation');
    
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            form.classList.add('was-validated');
        }, false);
    });

    // Service modal content
    const serviceButtons = document.querySelectorAll('.service-btn');
    
    serviceButtons.forEach(button => {
        button.addEventListener('click', function() {
            const service = this.getAttribute('data-service');
            const modalTitle = document.getElementById('service-title');
            const modalContent = document.getElementById('service-details');
            
            if (modalTitle && modalContent) {
                modalTitle.textContent = service;
                
                // Set content based on service type
                let content = '';
                
                switch(service) {
                    case 'Bodas':
                        content = `
                            <div class="row">
                                <div class="col-md-12">
                                    <h4>El día más especial de tu vida</h4>
                                    <p>Nuestro servicio de bodas incluye:</p>
                                    <ul>
                                        <li>Decoración personalizada según tu estilo</li>
                                        <li>Coordinación completa del evento</li>
                                        <li>Menú de degustación previo al evento</li>
                                        <li>Opciones de catering premium</li>
                                        <li>Iluminación ambiental</li>
                                        <li>Pista de baile y equipo de sonido</li>
                                        <li>Mesa de dulces</li>
                                    </ul>
                                    <p class="price">Desde $150,000</p>
                                </div>
                            </div>
                        `;
                        break;
                    case 'Cumpleaños':
                        content = `
                            <div class="row">
                                <div class="col-md-12">
                                    <h4>Celebra tu día especial</h4>
                                    <p>Nuestro servicio de cumpleaños incluye:</p>
                                    <ul>
                                        <li>Decoración temática</li>
                                        <li>Opciones de catering variadas</li>
                                        <li>Torta personalizada</li>
                                        <li>DJ o música en vivo</li>
                                        <li>Barra de bebidas</li>
                                        <li>Animación (opcional)</li>
                                    </ul>
                                    <p class="price">Desde $80,000</p>
                                </div>
                            </div>
                        `;
                        break;
                    case 'Eventos Corporativos':
                        content = `
                            <div class="row">
                                <div class="col-md-12">
                                    <h4>Soluciones profesionales para empresas</h4>
                                    <p>Nuestro servicio de eventos corporativos incluye:</p>
                                    <ul>
                                        <li>Salas de conferencias equipadas</li>
                                        <li>Sistemas audiovisuales completos</li>
                                        <li>Coffee breaks y catering ejecutivo</li>
                                        <li>Wifi de alta velocidad</li>
                                        <li>Estacionamiento para asistentes</li>
                                        <li>Personal de asistencia</li>
                                    </ul>
                                    <p class="price">Desde $100,000</p>
                                </div>
                            </div>
                        `;
                        break;
                    default:
                        content = `
                            <div class="text-center">
                                <p>Por favor contáctanos para obtener información detallada sobre este servicio.</p>
                                <a href="#contacto" class="btn btn-primary" data-bs-dismiss="modal">Ir a Contacto</a>
                            </div>
                        `;
                }
                
                modalContent.innerHTML = content;
            }
        });
    });

    // Load promotions dynamically
    const promoContainer = document.querySelector('.promo-container');
    
    if (promoContainer) {
        const promotions = [
            {
                title: 'Oferta de Temporada',
                description: '20% de descuento en eventos reservados para los meses de marzo a mayo.',
                image: 'img/promos/promo1.jpg',
                expiry: '31/05/2025'
            }
        ];
        
        let promoHTML = '';
        
        promotions.forEach(promo => {
            promoHTML += `
                <div class="col-lg-3 col-md-6">
                    <div class="promo-card">
                        <div class="promo-badge">Oferta</div>
                        <div class="promo-content">
                            <h3>${promo.title}</h3>
                            <p>${promo.description}</p>
                            <div class="promo-expiry">Válido hasta: ${promo.expiry}</div>
                            <a href="#reservas" class="btn btn-sm btn-primary">Reservar Ahora</a>
                        </div>
                    </div>
                </div>
            `;
        });
        
        promoContainer.innerHTML = promoHTML;
    }

    // Google Map initialization
    window.initMap = function() {
        // Replace with actual coordinates
        const location = { lat: -34.603722, lng: -58.381592 };
        const map = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center: location,
        });
        const marker = new google.maps.Marker({
            position: location,
            map: map,
            title: 'Eleganza Eventos'
        });
    };

    // Back to top button
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('active');
            } else {
                backToTopButton.classList.remove('active');
            }
        });
        
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const navbarHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse.classList.contains('show')) {
                        navbarCollapse.classList.remove('show');
                    }
                }
            }
        });
    });
});
