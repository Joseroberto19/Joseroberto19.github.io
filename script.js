
document.addEventListener("DOMContentLoaded", function() {
    const menuToggle = document.querySelector('.menu-toggle-unique');
    const mobileMenu = document.querySelector('.mobile-menu-unique');

    // Verifica si los elementos existen antes de añadir el event listener
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
        });
    } else {
        console.error("menuToggle o mobileMenu no se encontraron en el DOM.");
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const track = document.querySelector(".carousel-track");
    const items = Array.from(track.children);
    const nextButton = document.querySelector(".carousel-control.next");
    const prevButton = document.querySelector(".carousel-control.prev");
    const itemWidth = items[0].getBoundingClientRect().width;
    let currentIndex = 0;

    function updateCarouselPosition() {
        const offset = -currentIndex * (itemWidth + 10); // 10 es el margen horizontal entre items
        track.style.transform = `translateX(${offset}px)`;
        updateVisibility();
    }

    function updateVisibility() {
        items.forEach((item, index) => {
            if (index >= currentIndex && index < currentIndex + 3) { // Mostrar solo los 3 visibles
                item.classList.add('visible');
            } else {
                item.classList.remove('visible');
            }
        });
    }

    function nextSlide() {
        if (currentIndex < items.length - 3) { // Mostrar solo hasta 3 elementos al final
            currentIndex++;
        } else {
            currentIndex = 0; // Regresa al inicio
        }
        updateCarouselPosition();
    }

    function prevSlide() {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = items.length - 3; // Salta al final para mostrar los últimos 3
        }
        updateCarouselPosition();
    }

    nextButton.addEventListener("click", nextSlide);
    prevButton.addEventListener("click", prevSlide);

    // Desplazamiento automático cada 3 segundos
    setInterval(nextSlide, 3000);

    // Inicializar la posición y visibilidad
    updateCarouselPosition();
});

let intervalId;

function updateTime() {
    const selectedOption = document.getElementById('country-select').options[document.getElementById('country-select').selectedIndex];
    const selectedCountry = selectedOption.value;
    const selectedImage = selectedOption.getAttribute('data-image');
    const backgroundImageContainer = document.querySelector('.background-image');
  
    // Eliminar la clase 'show' para desencadenar la animación nuevamente
    backgroundImageContainer.classList.remove('show');
  
    // Limpiar cualquier intervalo previo
    if (intervalId) {
        clearInterval(intervalId);
    }
  
    // Obtener la hora inicial desde la API
    fetch(`https://timeapi.io/api/Time/current/zone?timeZone=${selectedCountry}`)
        .then(response => response.json())
        .then(data => {
            let localTime = new Date(data.dateTime);

            // Mostrar la hora inicial
            displayTime(localTime);

            // Iniciar un intervalo para actualizar el tiempo localmente cada segundo
            intervalId = setInterval(() => {
                localTime.setSeconds(localTime.getSeconds() + 1); // Incrementa 1 segundo
                displayTime(localTime);
            }, 1000);

            // Agregar clase 'show' después de un breve retraso para permitir la animación
            setTimeout(() => {
                backgroundImageContainer.classList.add('show');
                backgroundImageContainer.style.backgroundImage = `url(${selectedImage})`;
            }, 100);
        })
        .catch(error => {
            console.error('Error fetching time:', error);
            document.getElementById('time').textContent = 'Error fetching time';
        });
}

// Función para mostrar la hora en el formato deseado
function displayTime(time) {
    const formattedTime = time.toLocaleTimeString('en-US', {
        hour12: true,
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('time').textContent = formattedTime;
}

// Llama a updateTime cuando se cambia la selección de país
document.getElementById('country-select').addEventListener('change', updateTime);

// Llama a updateTime al cargar la página
updateTime();
/////////
