document.addEventListener('DOMContentLoaded', function() {
    // Código JavaScript aquí
});

const dotsElement = document.getElementById('dots');

let dotsCount = 1;
setInterval(() => {
  dotsElement.textContent = '.'.repeat(dotsCount);
  dotsCount = (dotsCount % 3) + 1;
}, 500);
document.addEventListener("DOMContentLoaded", function () {
  const bookResults = document.getElementById("book-results");
  const searchForm = document.getElementById("search-form");
  const prevButton = document.getElementById("prev-button");
  const nextButton = document.getElementById("next-button");
  let currentPage = 1;
  let totalPages = 1;

  searchForm.addEventListener("submit", function (event) {
      event.preventDefault(); // Evitar que el formulario se envíe

      const searchTerm = document.getElementById("search-term").value;

      
      fetch(`https://openlibrary.org/search.json?q=${searchTerm}&page=${currentPage}`)
          .then(response => response.json())
          .then(data => {
             
              bookResults.innerHTML = "";

              
              data.docs.slice(0, 5).forEach(book => {
                  const div = document.createElement("div");
                  div.classList.add("book-item");

                  const title = book.title ? book.title : "Título no disponible";
                  const author = book.author_name ? book.author_name.join(", ") : "Autor no disponible";
                  const coverUrl = getBookCoverUrl(book);

                  div.innerHTML = `
                      <img src="${coverUrl}" alt="${title}">
                      <div>
                          <strong>Título:</strong> ${title}<br>
                          <strong>Autor:</strong> ${author}
                      </div>
                  `;

                  bookResults.appendChild(div);
              });

              
              totalPages = Math.ceil(data.numFound / 100);

              
              updatePaginationButtons();
          })
          .catch(error => {
              console.error("Error al buscar libros:", error);
          });
  });

  
  function getBookCoverUrl(book) {
      if (book.cover_i) {
          return `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
      } else {
          return "https://via.placeholder.com/150x200?text=No+Disponible";
      }
  }

  
  function updatePaginationButtons() {
      prevButton.disabled = currentPage <= 1;
      nextButton.disabled = currentPage >= totalPages;
  }

  
  prevButton.addEventListener("click", function () {
      if (currentPage > 1) {
          currentPage--;
          searchForm.dispatchEvent(new Event("submit"));
      }
  });

  
  nextButton.addEventListener("click", function () {
      if (currentPage < totalPages) {
          currentPage++;
          searchForm.dispatchEvent(new Event("submit"));
      }
  });
});

function updateTime() {
  const selectedOption = document.getElementById('country-select').options[document.getElementById('country-select').selectedIndex];
  const selectedCountry = selectedOption.value;
  const selectedImage = selectedOption.getAttribute('data-image');
  const backgroundImageContainer = document.querySelector('.background-image');

  // Eliminar la clase 'show' para desencadenar la animación nuevamente
  backgroundImageContainer.classList.remove('show');

  fetch(`https://worldtimeapi.org/api/timezone/${selectedCountry}`)
      .then(response => response.json())
      .then(data => {
          const utcTime = new Date(data.utc_datetime);
          const localTime = new Date(utcTime.toLocaleString("en-US", { timeZone: selectedCountry }));

          const formattedTime = localTime.toLocaleTimeString('en-US', {
              hour12: true,
              hour: 'numeric',
              minute: '2-digit',
              second: '2-digit'
          });
          document.getElementById('time').textContent = formattedTime;

          // Agregar clase 'show' después de un breve retraso para permitir la animación
          setTimeout(() => {
              backgroundImageContainer.classList.add('show');
              // Cambiar la imagen de fondo después de agregar la clase 'show'
              backgroundImageContainer.style.backgroundImage = `url(${selectedImage})`;
          }, 100);
      })
      .catch(error => {
          console.error('Error fetching time:', error);
          document.getElementById('time').textContent = 'Error fetching time';
      });
}

// Llama a updateTime cuando se cambia la selección de país
document.getElementById('country-select').addEventListener('change', updateTime);

// Llama a updateTime al cargar la página
updateTime();

