document.addEventListener('DOMContentLoaded', function() {
    // --- Lógica del Carrusel y la Galería (Mantenida) ---

    const carouselSlide = document.querySelector('.carousel-slide');
    if (carouselSlide) {
        const mediaItems = document.querySelectorAll('.media-item');
        const prevButton = document.querySelector('.carousel-nav.prev');
        const nextButton = document.querySelector('.carousel-nav.next');
        const paginationContainer = document.querySelector('.carousel-pagination');
        const itemsPerView = 3;
        let currentIndex = 0;
        const totalItems = mediaItems.length;

        // Función para crear los indicadores de paginación
        function createPagination() {
            paginationContainer.innerHTML = '';
            const totalPages = Math.ceil(totalItems / itemsPerView);
            for (let i = 0; i < totalPages; i++) {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                if (i === 0) {
                    dot.classList.add('active');
                }
                dot.addEventListener('click', () => {
                    currentIndex = i * itemsPerView;
                    updateCarousel();
                });
                paginationContainer.appendChild(dot);
            }
        }

        // Función para actualizar la vista del carrusel y la paginación
        function updateCarousel() {
            // Asegurarse de que el primer elemento exista antes de intentar obtener su ancho
            const itemWidth = carouselSlide.children[0] ? carouselSlide.children[0].offsetWidth : 0;
            const offset = -currentIndex * itemWidth;
            carouselSlide.style.transform = `translateX(${offset}px)`;

            // Actualizar los puntos
            document.querySelectorAll('.dot').forEach((dot, index) => {
                dot.classList.remove('active');
                if (index === Math.floor(currentIndex / itemsPerView)) {
                    dot.classList.add('active');
                }
            });
        }

        // Navegación
        prevButton.addEventListener('click', () => {
            currentIndex = Math.max(0, currentIndex - itemsPerView);
            updateCarousel();
        });

        nextButton.addEventListener('click', () => {
            const maxIndex = totalItems - itemsPerView;
            currentIndex = Math.min(maxIndex, currentIndex + itemsPerView);
            updateCarousel();
        });

        // Inicializar
        if (totalItems > 0) {
            createPagination();
            updateCarousel();
            // Recalcular al cambiar el tamaño de la ventana
            window.addEventListener('resize', updateCarousel);
        }

        // --- Lógica del Modal (Lightbox) ---
        const modal = document.getElementById('mediaModal');
        const modalContent = document.getElementById('modal-body-content');
        const closeBtn = document.querySelector('.modal .close-btn');

        mediaItems.forEach(item => {
            item.addEventListener('click', () => {
                modalContent.innerHTML = ''; // Limpiar contenido anterior
                const dataType = item.getAttribute('data-type');
                const dataSrc = item.getAttribute('data-src');

                if (dataType === 'image') {
                    const img = document.createElement('img');
                    img.src = dataSrc;
                    modalContent.appendChild(img);
                } else if (dataType === 'video') {
                    const video = document.createElement('video');
                    video.src = dataSrc;
                    video.controls = true;
                    video.autoplay = true; // Reproducción automática
                    modalContent.appendChild(video);
                }

                modal.style.display = 'block';
            });
        });

        closeBtn.addEventListener('click', () => {
            // Función para cerrar el modal
            const videoElement = modalContent.querySelector('video');
            if (videoElement) {
                videoElement.pause();
            }
            modal.style.display = 'none';
            modalContent.innerHTML = '';
        });

        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                const videoElement = modalContent.querySelector('video');
                if (videoElement) {
                    videoElement.pause();
                }
                modal.style.display = 'none';
                modalContent.innerHTML = '';
            }
        });
    }


    // --- NUEVA LÓGICA: ENVÍO DE FORMULARIO POR WHATSAPP ---
    const whatsappForm = document.getElementById('whatsapp-form');
    // **IMPORTANTE**: Este es el número de la publicidad (11 3390-4903).
    const phoneNumber = '5491133904903'; 

    if (whatsappForm) {
        whatsappForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // 1. Obtener los valores del formulario
            const name = document.querySelector('input[name="name"]').value;
            const serviceSelect = document.getElementById('service-type');
            const serviceType = serviceSelect.options[serviceSelect.selectedIndex].value;
            const projectDetails = document.getElementById('project-details').value || 'No se proporcionaron detalles adicionales.';
            
            // 2. Construir el mensaje (usando %0A para saltos de línea y %20 para espacios)
            let message = `¡Hola, soy ${name}!%0A`;
            message += `Quisiera solicitar un presupuesto sin cargo.%0A%0A`;
            message += `*Servicio Requerido:* ${serviceType}%0A`;
            message += `*Detalles del Proyecto:* ${projectDetails}`;

            // 3. Codificar y redirigir a WhatsApp
            const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
            window.open(whatsappURL, '_blank');
        });
    }
});