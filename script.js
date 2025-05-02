document.addEventListener("DOMContentLoaded", () => {
    // Header scroll effect
    const header = document.querySelector(".header")
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        header.classList.add("scrolled")
      } else {
        header.classList.remove("scrolled")
      }
    })
  
    // Mobile menu toggle
    const menuToggle = document.querySelector(".menu-toggle")
    const navigation = document.querySelector(".navigation")
  
    if (menuToggle && navigation) {
      menuToggle.addEventListener("click", () => {
        menuToggle.classList.toggle("active")
        navigation.classList.toggle("active")
      })
  
      // Close menu when clicking on a link
      const navLinks = document.querySelectorAll(".nav-item a")
      navLinks.forEach((link) => {
        link.addEventListener("click", () => {
          menuToggle.classList.remove("active")
          navigation.classList.remove("active")
        })
      })
    }
  
    // Skills carousel
    const track = document.querySelector(".carousel-track")
    if (track) {
      const items = Array.from(track.children)
      const nextButton = document.querySelector(".carousel-control.next")
      const prevButton = document.querySelector(".carousel-control.prev")
      const itemWidth = items[0].getBoundingClientRect().width
      let currentIndex = 0
      let visibleItems = 6
  
      // Adjust visible items based on screen width
      function updateVisibleItemsCount() {
        if (window.innerWidth < 768) {
          visibleItems = 1
        } else if (window.innerWidth < 992) {
          visibleItems = 2
        } else {
          visibleItems = 6
        }
      }
  
      updateVisibleItemsCount()
      window.addEventListener("resize", updateVisibleItemsCount)
  
      function updateCarouselPosition() {
        const offset = -currentIndex * itemWidth
        track.style.transform = `translateX(${offset}px)`
        updateVisibility()
      }
  
      function updateVisibility() {
        items.forEach((item, index) => {
          if (index >= currentIndex && index < currentIndex + visibleItems) {
            item.classList.add("visible")
          } else {
            item.classList.remove("visible")
          }
        })
      }
  
      function nextSlide() {
        if (currentIndex < items.length - visibleItems) {
          currentIndex++
        } else {
          currentIndex = 0
        }
        updateCarouselPosition()
      }
  
      function prevSlide() {
        if (currentIndex > 0) {
          currentIndex--
        } else {
          currentIndex = items.length - visibleItems
        }
        updateCarouselPosition()
      }
  
      if (nextButton && prevButton) {
        nextButton.addEventListener("click", nextSlide)
        prevButton.addEventListener("click", prevSlide)
      }
  
      // Auto-scroll with pause on hover
      let autoScrollInterval
  
      function startAutoScroll() {
        autoScrollInterval = setInterval(nextSlide, 3000)
      }
  
      function stopAutoScroll() {
        clearInterval(autoScrollInterval)
      }
  
      const carousel = document.querySelector(".carousel")
      if (carousel) {
        carousel.addEventListener("mouseenter", stopAutoScroll)
        carousel.addEventListener("mouseleave", startAutoScroll)
      }
  
      startAutoScroll()
      updateCarouselPosition()
    }
  
    // Animation on scroll
    const animatedElements = document.querySelectorAll(".fade-in-up")
  
    function checkScroll() {
      animatedElements.forEach((el) => {
        const elementTop = el.getBoundingClientRect().top
        const windowHeight = window.innerHeight
  
        if (elementTop < windowHeight * 0.9) {
          el.style.opacity = "1"
          el.style.transform = "translateY(0)"
        }
      })
    }
  
    window.addEventListener("scroll", checkScroll)
    checkScroll() // Check on load
  
    // Clock functionality
    const clockElement = document.getElementById("time")
    const countrySelect = document.getElementById("country-select")
    const backgroundImageContainer = document.querySelector(".clock-background")
  
    if (clockElement && countrySelect) {
      let intervalId
  
      function updateTime() {
        const selectedOption = countrySelect.options[countrySelect.selectedIndex]
        const selectedCountry = selectedOption.value
        const selectedImage = selectedOption.getAttribute("data-image")
  
        if (backgroundImageContainer) {
          backgroundImageContainer.classList.remove("show")
        }
  
        if (intervalId) {
          clearInterval(intervalId)
        }
  
        fetch(`https://timeapi.io/api/Time/current/zone?timeZone=${selectedCountry}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Error en la respuesta de la API")
            }
            return response.json()
          })
          .then((data) => {
            const localTime = new Date(data.dateTime)
  
            displayTime(localTime)
  
            intervalId = setInterval(() => {
              localTime.setSeconds(localTime.getSeconds() + 1)
              displayTime(localTime)
            }, 1000)
  
            if (backgroundImageContainer && selectedImage) {
              setTimeout(() => {
                backgroundImageContainer.classList.add("show")
                backgroundImageContainer.style.backgroundImage = `url(${selectedImage})`
              }, 100)
            }
          })
          .catch((error) => {
            console.error("Error fetching time:", error)
            if (clockElement) {
              clockElement.textContent = "Error al obtener la hora"
            }
  
            const fallbackTime = new Date()
            displayTime(fallbackTime)
          })
      }
  
      function displayTime(time) {
        const formattedTime = time.toLocaleTimeString("en-US", {
          hour12: true,
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
        })
        clockElement.textContent = formattedTime
      }
  
      countrySelect.addEventListener("change", updateTime)
  
      // Initialize clock
      if (window.location.pathname.includes("Reloj.html")) {
        updateTime()
      }
    }
  
    // Update copyright year
    const yearElement = document.getElementById("current-year")
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear()
    }
  })
  