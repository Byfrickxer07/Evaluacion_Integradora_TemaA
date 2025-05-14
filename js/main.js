/**
 * Eleganza Eventos - Main JavaScript
 * Theme B
 */

// IndexedDB para reservas
let db;

// Inicializar la base de datos
function initDatabase() {
    const request = indexedDB.open('EleganzaDB', 1);
    
    request.onerror = function(event) {
        console.error('Error al abrir la base de datos:', event.target.error);
    };
    
    request.onupgradeneeded = function(event) {
        db = event.target.result;
        
        // Crear un almacén de objetos para las reservas
        if (!db.objectStoreNames.contains('reservas')) {
            const reservasStore = db.createObjectStore('reservas', { keyPath: 'id', autoIncrement: true });
            reservasStore.createIndex('email', 'email', { unique: false });
            reservasStore.createIndex('fecha', 'fecha', { unique: false });
        }
    };
    
    request.onsuccess = function(event) {
        db = event.target.result;
        console.log('Base de datos inicializada correctamente');
    };
}

// Guardar una reserva en IndexedDB
function guardarReserva(reserva) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['reservas'], 'readwrite');
        const reservasStore = transaction.objectStore('reservas');
        const request = reservasStore.add(reserva);
        
        request.onsuccess = function(event) {
            resolve(event.target.result);
        };
        
        request.onerror = function(event) {
            reject(event.target.error);
        };
    });
}

// Obtener todas las reservas
function obtenerReservas() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['reservas'], 'readonly');
        const reservasStore = transaction.objectStore('reservas');
        const request = reservasStore.getAll();
        
        request.onsuccess = function(event) {
            resolve(event.target.result);
        };
        
        request.onerror = function(event) {
            reject(event.target.error);
        };
    });
}

// Eliminar una reserva por su ID
function eliminarReserva(id) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['reservas'], 'readwrite');
        const reservasStore = transaction.objectStore('reservas');
        const request = reservasStore.delete(id);
        
        request.onsuccess = function(event) {
            resolve(true);
        };
        
        request.onerror = function(event) {
            reject(event.target.error);
        };
    });
}

// Mostrar las reservas en el modal
async function mostrarReservas() {
    try {
        const reservas = await obtenerReservas();
        const reservasList = document.getElementById('reservas-list');
        const noReservas = document.getElementById('no-reservas');
        
        reservasList.innerHTML = '';
        
        if (reservas.length === 0) {
            noReservas.classList.remove('d-none');
            return;
        }
        
        noReservas.classList.add('d-none');
        
        reservas.forEach(reserva => {
            const item = document.createElement('div');
            item.className = 'list-group-item';
            
            const fecha = new Date(reserva.fecha + 'T' + reserva.hora);
            const fechaFormateada = fecha.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            item.innerHTML = `
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h5 class="mb-1">${reserva.tipoEvento} - ${fechaFormateada}</h5>
                        <p class="mb-1">Nombre: ${reserva.nombre}</p>
                        <p class="mb-1">Email: ${reserva.email}</p>
                        <p class="mb-1">Teléfono: ${reserva.telefono}</p>
                        <p class="mb-1">Invitados: ${reserva.invitados}</p>
                        <p class="mb-1">Presupuesto: ${reserva.presupuesto}</p>
                        ${reserva.mensaje ? `<p class="mb-1">Mensaje: ${reserva.mensaje}</p>` : ''}
                    </div>
                    <button class="btn btn-danger btn-sm cancelar-reserva" data-id="${reserva.id}">
                        <i class="fas fa-times"></i> Cancelar
                    </button>
                </div>
            `;
            
            reservasList.appendChild(item);
        });
        
        // Agregar event listeners a los botones de cancelar
        document.querySelectorAll('.cancelar-reserva').forEach(button => {
            button.addEventListener('click', async function() {
                if (confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
                    const id = parseInt(this.getAttribute('data-id'));
                    try {
                        await eliminarReserva(id);
                        // Mostrar mensaje de éxito
                        const alertHTML = `
                            <div class="alert alert-success alert-dismissible fade show mb-3" role="alert">
                                <strong>¡Reserva cancelada con éxito!</strong>
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                            </div>
                        `;
                        const alertContainer = document.createElement('div');
                        alertContainer.innerHTML = alertHTML;
                        const modalBody = document.querySelector('#reservasModal .modal-body');
                        modalBody.insertBefore(alertContainer, modalBody.firstChild);
                        
                        // Actualizar la lista de reservas
                        mostrarReservas();
                        
                        // Eliminar la alerta después de 3 segundos
                        setTimeout(() => {
                            const alert = modalBody.querySelector('.alert');
                            if (alert) {
                                alert.classList.remove('show');
                                setTimeout(() => alert.remove(), 500);
                            }
                        }, 3000);
                    } catch (error) {
                        console.error('Error al cancelar la reserva:', error);
                        alert('Ha ocurrido un error al cancelar la reserva. Por favor, inténtalo de nuevo.');
                    }
                }
            });
        });
    } catch (error) {
        console.error('Error al mostrar las reservas:', error);
    }
}

// Variable global para el mapa
let map;

// Función para inicializar Google Maps
function initMap() {
    console.log('Inicializando Google Maps...');
    try {
        // Comprobar si el elemento del mapa existe
        const mapElement = document.getElementById('map');
        if (!mapElement) {
            console.error('Elemento del mapa no encontrado');
            return;
        }
        
        // Coordenadas del salón de eventos (ejemplo)
        const ubicacion = { lat: -34.603722, lng: -58.381592 }; // Buenos Aires como ejemplo
        
        // Crear el mapa
        map = new google.maps.Map(mapElement, {
            center: ubicacion,
            zoom: 15,
            styles: [
                {
                    "featureType": "all",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#f5f5f5"
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#757575"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#c9c9c9"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#9e9e9e"
                        }
                    ]
                }
            ]
        });
        
        console.log('Mapa creado correctamente');
        
        // Añadir un marcador
        const marker = new google.maps.Marker({
            position: ubicacion,
            map: map,
            title: 'Salón de Eventos Eleganza',
            animation: google.maps.Animation.DROP
        });
        
        // Añadir un InfoWindow
        const infoWindow = new google.maps.InfoWindow({
            content: '<div><strong>Salón de Eventos Eleganza</strong><br>¡Tu evento soñado te espera aquí!</div>'
        });
        
        // Mostrar InfoWindow al hacer clic en el marcador
        marker.addListener('click', function() {
            infoWindow.open(map, marker);
        });
        
        // Abrir InfoWindow automáticamente
        infoWindow.open(map, marker);
    } catch (error) {
        console.error('Error al inicializar el mapa:', error);
    }
}

// Función para verificar si el usuario está logueado
function checkUserLoggedIn() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    
    if (user) {
        // Usuario logueado
        $('#login-nav-item, #register-nav-item').addClass('d-none');
        $('#user-nav-item, #logout-nav-item').removeClass('d-none');
        $('#user-profile').text(user.nombre);
        
        // Mostrar mensaje de bienvenida si acaba de iniciar sesión
        const justLoggedIn = sessionStorage.getItem('justLoggedIn');
        if (justLoggedIn) {
            sessionStorage.removeItem('justLoggedIn');
            
            const alertHTML = `
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    ¡Bienvenido/a, ${user.nombre}! Has iniciado sesión correctamente.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;
            
            const alertContainer = document.createElement('div');
            alertContainer.className = 'container mt-5 pt-3';
            alertContainer.innerHTML = alertHTML;
            
            const navbar = document.querySelector('.navbar');
            document.body.insertBefore(alertContainer, navbar.nextSibling);
            
            setTimeout(() => {
                alertContainer.querySelector('.alert').classList.remove('show');
                setTimeout(() => alertContainer.remove(), 500);
            }, 3000);
        }
    } else {
        // Usuario no logueado
        $('#login-nav-item, #register-nav-item').removeClass('d-none');
        $('#user-nav-item, #logout-nav-item').addClass('d-none');
    }
}

// Función para cerrar sesión
function logout() {
    // Eliminar datos del usuario del localStorage
    localStorage.removeItem('user');
    
    // Redirigir a la página de inicio
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar la base de datos
    initDatabase();
    
    // Verificar si el usuario está logueado
    checkUserLoggedIn();
    // Preloader - ocultar inmediatamente
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.display = 'none';
    }
    
    // Inicializar Google Maps manualmente si no se ha inicializado
    setTimeout(() => {
        const mapElement = document.getElementById('map');
        if (mapElement && (!map || mapElement.innerHTML === '')) {
            console.log('Inicializando mapa manualmente...');
            initMap();
        }
    }, 1000);
    
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

    // Evento de cierre de sesión
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
    
    // Manejar el envío del formulario de reserva
    const reservationForm = document.getElementById('reservation-form');
    if (reservationForm) {
        reservationForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            if (!this.checkValidity()) {
                event.stopPropagation();
                this.classList.add('was-validated');
                return;
            }
            
            // Recopilar datos del formulario
            const reserva = {
                nombre: document.getElementById('nombre').value,
                email: document.getElementById('email').value,
                telefono: document.getElementById('telefono').value,
                tipoEvento: document.getElementById('tipo_evento').value,
                fecha: document.getElementById('fecha').value,
                hora: document.getElementById('hora').value,
                invitados: document.getElementById('invitados').value,
                presupuesto: document.getElementById('presupuesto').value,
                mensaje: document.getElementById('mensaje').value,
                fechaCreacion: new Date().toISOString()
            };
            
            try {
                // Verificar si el usuario está logueado
                const user = JSON.parse(localStorage.getItem('user') || 'null');
                
                if (user) {
                    // Usuario logueado - Guardar en MySQL
                    $.ajax({
                        url: 'db/save_reservation.php',
                        type: 'POST',
                        data: {
                            nombre: reserva.nombre,
                            email: reserva.email,
                            telefono: reserva.telefono,
                            tipo_evento: reserva.tipoEvento,
                            fecha: reserva.fecha,
                            hora: reserva.hora,
                            invitados: reserva.invitados,
                            presupuesto: reserva.presupuesto,
                            mensaje: reserva.mensaje
                        },
                        dataType: 'json',
                        success: function(response) {
                            if (response.success) {
                                showReservationSuccess(reservationForm);
                            } else {
                                alert('Error: ' + response.message);
                            }
                        },
                        error: function(xhr, status, error) {
                            console.error('Error al guardar la reserva en MySQL:', error);
                            alert('Ha ocurrido un error al procesar tu reserva. Por favor, inténtalo de nuevo.');
                        }
                    });
                } else {
                    // Usuario no logueado - Guardar en IndexedDB
                    await guardarReserva(reserva);
                    showReservationSuccess(reservationForm);
                }
            } catch (error) {
                console.error('Error al guardar la reserva:', error);
                alert('Ha ocurrido un error al procesar tu reserva. Por favor, inténtalo de nuevo.');
            }
        });
    }
    
    // Función para mostrar mensaje de éxito en reserva
    function showReservationSuccess(form) {
        const alertHTML = `
            <div class="alert alert-success alert-dismissible fade show mt-3" role="alert">
                <strong>¡Reserva realizada con éxito!</strong> Hemos recibido tu solicitud y nos pondremos en contacto contigo pronto.
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        
        const alertContainer = document.createElement('div');
        alertContainer.innerHTML = alertHTML;
        form.parentNode.insertBefore(alertContainer, form.nextSibling);
        
        // Resetear el formulario
        form.reset();
        form.classList.remove('was-validated');
        
        // Desplazarse a la alerta
        alertContainer.scrollIntoView({ behavior: 'smooth' });
        
        // Eliminar la alerta después de 5 segundos
        setTimeout(() => {
            alertContainer.querySelector('.alert').classList.remove('show');
            setTimeout(() => alertContainer.remove(), 500);
        }, 5000);
    }
    
    // Botón para ver reservas
    const verReservasBtn = document.getElementById('ver-reservas-btn');
    if (verReservasBtn) {
        verReservasBtn.addEventListener('click', function() {
            mostrarReservas();
            const reservasModal = new bootstrap.Modal(document.getElementById('reservasModal'));
            reservasModal.show();
        });
    }

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
