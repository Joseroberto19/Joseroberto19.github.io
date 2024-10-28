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

