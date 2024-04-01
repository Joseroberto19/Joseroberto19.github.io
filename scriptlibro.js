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
