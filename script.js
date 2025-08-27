document.addEventListener("DOMContentLoaded", () => {
  // Header scroll effect
  const header = document.querySelector(".header")

  let scrollTimeout

  function handleScroll() {
    if (window.scrollY > 50) {
      header.classList.add("scrolled")
    } else {
      header.classList.remove("scrolled")
    }
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
          handleScroll()
          scrollTimeout = null
        }, 16) // ~60fps
      }
    },
    { passive: true },
  )

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

  // Skills collapsible functionality
  const skillCards = document.querySelectorAll(".skill-card")

  skillCards.forEach((card) => {
    const header = card.querySelector(".skill-header")
    const content = card.querySelector(".skill-content")
    const toggle = card.querySelector(".skill-toggle")

    if (header && content && toggle) {
      header.addEventListener(
        "click",
        (e) => {
          e.preventDefault()

          requestAnimationFrame(() => {
            const isActive = card.classList.contains("active")

            // Close all other cards
            skillCards.forEach((otherCard) => {
              if (otherCard !== card) {
                otherCard.classList.remove("active")
              }
            })

            // Toggle current card
            if (isActive) {
              card.classList.remove("active")
            } else {
              card.classList.add("active")
            }
          })
        },
        { passive: false },
      )
    }
  })

  // Animation on scroll
  const animatedElements = document.querySelectorAll(".fade-in-up")

  if (animatedElements.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1"
            entry.target.style.transform = "translateY(0)"
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -10% 0px",
      },
    )

    animatedElements.forEach((el) => {
      observer.observe(el)
    })
  }

  // Enhanced Clock functionality with timeapi.io
  const clockElement = document.getElementById("time")
  const countrySelect = document.getElementById("country-select")
  const backgroundImageContainer = document.querySelector(".clock-background")

  if (clockElement && countrySelect) {
    let intervalId
    let currentTime = new Date() // Fallback time object

    function updateTime() {
      const selectedOption = countrySelect.options[countrySelect.selectedIndex]
      const selectedCountry = selectedOption.value
      const selectedImage = selectedOption.getAttribute("data-image")

      // Reset background animation
      if (backgroundImageContainer) {
        backgroundImageContainer.classList.remove("show")
      }

      // Clear previous interval
      if (intervalId) {
        clearInterval(intervalId)
      }

      // Fetch time from timeapi.io
      fetch(`https://timeapi.io/api/Time/current/zone?timeZone=${selectedCountry}`)
        .then((response) => {
          if (!response.ok) throw new Error("Network response was not ok")
          return response.json()
        })
        .then((data) => {
          // Parse API response
          currentTime = new Date(data.dateTime)

          // Display initial time
          displayTime(currentTime)

          // Start updating time every second
          intervalId = setInterval(() => {
            currentTime.setSeconds(currentTime.getSeconds() + 1)
            displayTime(currentTime)
          }, 1000)

          // Update background image with animation
          if (backgroundImageContainer && selectedImage) {
            setTimeout(() => {
              backgroundImageContainer.style.backgroundImage = `url(${selectedImage})`
              backgroundImageContainer.classList.add("show")
            }, 100)
          }
        })
        .catch((error) => {
          console.error("Error fetching time:", error)
          // Fallback to local time if API fails
          currentTime = new Date()
          displayTime(currentTime)

          // Start updating fallback time
          intervalId = setInterval(() => {
            currentTime.setSeconds(currentTime.getSeconds() + 1)
            displayTime(currentTime)
          }, 1000)
        })
    }

    function displayTime(time) {
      const options = {
        hour12: true,
        hour: "numeric",
        minute: "2-digit",
      }

      clockElement.textContent = time.toLocaleTimeString("en-US", options)
    }

    // Initialize clock
    countrySelect.addEventListener("change", updateTime)
    updateTime() // Load immediately
  }

  // Update copyright year
  const yearElement = document.getElementById("current-year")
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear()
  }
})
