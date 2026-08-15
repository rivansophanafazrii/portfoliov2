/* =========================================================
   PORTFOLIO WEBSITE - MAIN JAVASCRIPT
   Author: Rivan Sophana Fazri
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* =========================================================
     ELEMENTS
     ========================================================= */

  const header = document.querySelector("#navbar");
  const progressBar = document.getElementById("myBar");
  const typingElement = document.getElementById("typing-role");
  const menuToggle = document.querySelector(".menu-toggle");
  const primaryNav = document.querySelector("#primary-nav");
  const navLinks = document.querySelector(".nav-links");

  /* =========================================================
     STICKY NAVBAR
     ========================================================= */

  function handleNavbar() {
    if (!header) return;

    if (window.scrollY > 50) {
      header.classList.add("sticky");
    } else {
      header.classList.remove("sticky");
    }
  }

  window.addEventListener("scroll", handleNavbar, {
    passive: true,
  });

  handleNavbar();

  /* =========================================================
     MOBILE NAVIGATION
     ========================================================= */

  function openMobileMenu() {
    if (!menuToggle || !primaryNav) return;

    menuToggle.classList.add("is-active");
    primaryNav.classList.add("open");

    menuToggle.setAttribute("aria-expanded", "true");

    document.body.classList.add("nav-open");
  }

  function closeMobileMenu() {
    if (!menuToggle || !primaryNav) return;

    menuToggle.classList.remove("is-active");
    primaryNav.classList.remove("open");

    menuToggle.setAttribute("aria-expanded", "false");

    document.body.classList.remove("nav-open");
  }

  function toggleMobileMenu() {
    if (!menuToggle || !primaryNav) return;

    const isOpen = primaryNav.classList.contains("open");

    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  if (menuToggle && primaryNav) {
    /* Initial accessibility state */
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-controls", "primary-nav");

    /* Hamburger click */
    menuToggle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      toggleMobileMenu();
    });

    /* Close when clicking navigation link */
    if (navLinks) {
      navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          closeMobileMenu();
        });
      });
    }

    /* Close when clicking overlay */
    primaryNav.addEventListener("click", (event) => {
      if (event.target === primaryNav) {
        closeMobileMenu();
      }
    });

    /* Close with Escape */
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    });

    /* Close when returning to desktop */
    window.addEventListener("resize", () => {
      if (window.innerWidth > 860) {
        closeMobileMenu();
      }
    });

    /* Close after orientation change */
    window.addEventListener("orientationchange", () => {
      setTimeout(() => {
        if (window.innerWidth > 860) {
          closeMobileMenu();
        }
      }, 150);
    });
  }

  /* =========================================================
     TYPING EFFECT
     ========================================================= */

  if (typingElement) {
    const words = [
      "Web Developer",
      "UI/UX Designer",
      "Frontend Developer",
      // "Creative Developer",
    ];

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typingSpeed = 90;
    const deletingSpeed = 45;
    const pauseAfterTyping = 1800;
    const pauseAfterDeleting = 400;

    function typeRole() {
      const currentWord = words[wordIndex];

      if (!isDeleting) {
        typingElement.textContent = currentWord.substring(
          0,
          charIndex + 1,
        );

        charIndex++;

        if (charIndex === currentWord.length) {
          isDeleting = true;

          setTimeout(typeRole, pauseAfterTyping);

          return;
        }
      } else {
        typingElement.textContent = currentWord.substring(
          0,
          charIndex - 1,
        );

        charIndex--;

        if (charIndex === 0) {
          isDeleting = false;

          wordIndex = (wordIndex + 1) % words.length;

          setTimeout(typeRole, pauseAfterDeleting);

          return;
        }
      }

      setTimeout(
        typeRole,
        isDeleting ? deletingSpeed : typingSpeed,
      );
    }

    typeRole();
  }

  /* =========================================================
     SCROLL PROGRESS BAR
     ========================================================= */

  function updateProgressBar() {
    if (!progressBar) return;

    const scrollTop =
      document.documentElement.scrollTop ||
      document.body.scrollTop;

    const documentHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    if (documentHeight <= 0) {
      progressBar.style.width = "0%";
      return;
    }

    const scrollPercentage =
      (scrollTop / documentHeight) * 100;

    progressBar.style.width =
      `${Math.min(scrollPercentage, 100)}%`;
  }

  window.addEventListener("scroll", updateProgressBar, {
    passive: true,
  });

  updateProgressBar();

  /* =========================================================
     ACTIVE NAVIGATION BASED ON SECTION
     ========================================================= */

  const sections = document.querySelectorAll("section[id]");

  const navigationLinks =
    document.querySelectorAll(".nav-links a[href^='#']");

  function updateActiveNavigation() {
    let currentSection = "";

    sections.forEach((section) => {
      const sectionTop =
        section.offsetTop - 150;

      const sectionHeight =
        section.offsetHeight;

      if (
        window.scrollY >= sectionTop &&
        window.scrollY <
          sectionTop + sectionHeight
      ) {
        currentSection =
          section.getAttribute("id");
      }
    });

    navigationLinks.forEach((link) => {
      link.classList.remove("active");

      const href =
        link.getAttribute("href");

      if (href === `#${currentSection}`) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener(
    "scroll",
    updateActiveNavigation,
    {
      passive: true,
    },
  );

  updateActiveNavigation();

  /* =========================================================
     SMOOTH SCROLL
     ========================================================= */

  document
    .querySelectorAll('a[href^="#"]')
    .forEach((anchor) => {
      anchor.addEventListener(
        "click",
        function (event) {
          const targetId =
            this.getAttribute("href");

          if (!targetId || targetId === "#") {
            return;
          }

          const target =
            document.querySelector(targetId);

          if (!target) return;

          event.preventDefault();

          const navbarHeight =
            header
              ? header.offsetHeight
              : 80;

          const targetPosition =
            target.getBoundingClientRect().top +
            window.scrollY -
            navbarHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        },
      );
    });

  /* =========================================================
     SCROLL REVEAL ANIMATION
     ========================================================= */

  const revealElements =
    document.querySelectorAll(
      ".reveal, .section-heading, .skill-card, .project-card, .certificate-card, .about-card",
    );

  if ("IntersectionObserver" in window) {
    const revealObserver =
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add(
                "visible",
              );

              revealObserver.unobserve(
                entry.target,
              );
            }
          });
        },
        {
          threshold: 0.12,
          rootMargin:
            "0px 0px -50px 0px",
        },
      );

    revealElements.forEach((element) => {
      element.classList.add("reveal");

      revealObserver.observe(element);
    });
  }

  /* =========================================================
     CERTIFICATE MODAL
     ========================================================= */

  window.openCertDetail = function (category) {
    const modal =
      document.getElementById(
        "certModal",
      );

    const title =
      document.getElementById(
        "modalTitle",
      );

    const gallery =
      document.getElementById(
        "modalGallery",
      );

    if (!modal || !title || !gallery) {
      return;
    }

    modal.classList.add("show");

    document.body.classList.add(
      "modal-open",
    );

    gallery.innerHTML = "";

    if (category === "web-dev") {
      title.textContent =
        "Sertifikasi Pengembangan Web";

      gallery.innerHTML = `
        <div class="gallery-item">
          <img
            src="img/cert/dicoding/dasar-pw.png"
            alt="Sertifikat Dasar Pemrograman Web"
            loading="lazy"
          >
          <p>Dasar Pemrograman Web</p>
        </div>

        <div class="gallery-item">
          <img
            src="img/cert/dicoding/js.png"
            alt="Sertifikat Dasar JavaScript"
            loading="lazy"
          >
          <p>Dasar JavaScript</p>
        </div>
      `;
    } else if (category === "ai") {
      title.textContent =
        "Sertifikasi Kecerdasan Buatan";

      gallery.innerHTML = `
        <div class="gallery-item">
          <img
            src="img/cert/dicoding/belajar-dasar-ai.png"
            alt="Sertifikat Dasar AI"
            loading="lazy"
          >
          <p>Dasar Artificial Intelligence</p>
        </div>
      `;
    } else {
      title.textContent =
        "Sertifikasi UI/UX & Desain Grafis";

      gallery.innerHTML = `
        <div class="gallery-item">
          <img
            src="img/cert/bnsp/junior-graphic-designer.png"
            alt="Sertifikat Junior Graphic Designer"
            loading="lazy"
          >
          <p>Junior Graphic Designer</p>
        </div>

        <div class="gallery-item">
          <img
            src="img/cert/dibimbing/ui-ux.png"
            alt="Sertifikat UI UX Design"
            loading="lazy"
          >
          <p>UI/UX Design</p>
        </div>
      `;
    }

    requestAnimationFrame(() => {
      modal.classList.add(
        "modal-visible",
      );
    });
  };

  /* =========================================================
     CLOSE CERTIFICATE MODAL
     ========================================================= */

  window.closeCertModal = function () {
    const modal =
      document.getElementById(
        "certModal",
      );

    if (!modal) return;

    modal.classList.remove(
      "modal-visible",
    );

    setTimeout(() => {
      modal.classList.remove("show");

      document.body.classList.remove(
        "modal-open",
      );
    }, 250);
  };

  /* =========================================================
     CLOSE MODAL WHEN CLICKING OUTSIDE
     ========================================================= */

  window.addEventListener("click", (event) => {
    const modal =
      document.getElementById(
        "certModal",
      );

    if (
      modal &&
      event.target === modal
    ) {
      window.closeCertModal();
    }
  });

  /* =========================================================
     CLOSE MODAL WITH ESC KEY
     ========================================================= */

  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key !== "Escape") {
        return;
      }

      const modal =
        document.getElementById(
          "certModal",
        );

      if (
        modal &&
        modal.classList.contains("show")
      ) {
        window.closeCertModal();
      }
    },
  );

  /* =========================================================
     CONTACT FORM
     ========================================================= */

  const scriptURL =
    "https://script.google.com/macros/s/AKfycbw2o2Rqnz2Qt-aS7HlV5SLgB1YEZ-WPYFEo16F-Vj7ZWde19HsLL2ZhOmUrCt9X0484AA/exec";

  const form =
    document.forms[
      "submit-to-google-sheet"
    ];

  if (form) {
    form.addEventListener(
      "submit",
      async (event) => {
        event.preventDefault();

        const submitButton =
          form.querySelector(
            'button[type="submit"]',
          );

        const originalButtonText =
          submitButton
            ? submitButton.innerHTML
            : "";

        try {
          /* Disable button */
          if (submitButton) {
            submitButton.disabled = true;

            submitButton.innerHTML = `
              <span class="button-loading">
                <i class="fas fa-spinner fa-spin"></i>
                Mengirim...
              </span>
            `;
          }

          /* Loading popup */
          if (
            typeof Swal !== "undefined"
          ) {
            Swal.fire({
              title: "Mengirim pesan",
              text:
                "Mohon tunggu sebentar...",
              allowOutsideClick: false,
              allowEscapeKey: false,
              showConfirmButton: false,
              didOpen: () => {
                Swal.showLoading();
              },
            });
          }

          /* Send data */
          const response =
            await fetch(scriptURL, {
              method: "POST",
              body: new FormData(form),
            });

          if (!response.ok) {
            throw new Error(
              "Gagal mengirim data.",
            );
          }

          /* Close loading */
          if (
            typeof Swal !== "undefined"
          ) {
            Swal.close();

            await Swal.fire({
              icon: "success",
              title:
                "Pesan Berhasil Dikirim",
              text:
                "Terima kasih. Pesan kamu sudah berhasil dikirim.",
              confirmButtonText: "Oke",
              confirmButtonColor:
                "#0984F3",
            });
          } else {
            alert(
              "Pesan berhasil dikirim.",
            );
          }

          /* Reset form */
          form.reset();
        } catch (error) {
          console.error(
            "Contact form error:",
            error,
          );

          if (
            typeof Swal !== "undefined"
          ) {
            Swal.close();

            Swal.fire({
              icon: "error",
              title: "Gagal Mengirim",
              text:
                "Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.",
              confirmButtonText:
                "Coba Lagi",
              confirmButtonColor:
                "#0984F3",
            });
          } else {
            alert(
              "Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.",
            );
          }
        } finally {
          /* Enable button */
          if (submitButton) {
            submitButton.disabled =
              false;

            submitButton.innerHTML =
              originalButtonText;
          }
        }
      },
    );
  }

  /* =========================================================
     IMAGE ERROR HANDLING
     ========================================================= */

  document
    .querySelectorAll("img")
    .forEach((image) => {
      image.addEventListener(
        "error",
        function () {
          this.classList.add(
            "image-error",
          );

          console.warn(
            `Gambar tidak ditemukan: ${this.src}`,
          );
        },
      );
    });

  /* =========================================================
     LAZY IMAGE EFFECT
     ========================================================= */

  const images =
    document.querySelectorAll(
      'img[loading="lazy"]',
    );

  images.forEach((image) => {
    image.addEventListener(
      "load",
      () => {
        image.classList.add(
          "loaded",
        );
      },
      {
        once: true,
      },
    );
  });

  /* =========================================================
     CURRENT YEAR
     ========================================================= */

  const currentYear =
    document.getElementById(
      "current-year",
    );

  if (currentYear) {
    currentYear.textContent =
      new Date().getFullYear();
  }

  /* =========================================================
     CURSOR INTERACTION
     ========================================================= */

  const interactiveElements =
    document.querySelectorAll(
      "a, button, .skill-card, .certificate-card, .project-card",
    );

  interactiveElements.forEach(
    (element) => {
      element.addEventListener(
        "mouseenter",
        () => {
          element.classList.add(
            "is-hovered",
          );
        },
      );

      element.addEventListener(
        "mouseleave",
        () => {
          element.classList.remove(
            "is-hovered",
          );
        },
      );
    },
  );

  /* =========================================================
     PREVENT DOUBLE SUBMISSION
     ========================================================= */

  if (form) {
    let isSubmitting = false;

    form.addEventListener(
      "submit",
      (event) => {
        if (isSubmitting) {
          event.preventDefault();
          return;
        }

        isSubmitting = true;

        setTimeout(() => {
          isSubmitting = false;
        }, 5000);
      },
      true,
    );
  }

  /* =========================================================
     REDUCED MOTION SUPPORT
     ========================================================= */

  const prefersReducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

  if (prefersReducedMotion) {
    document.documentElement.style.scrollBehavior =
      "auto";

    document
      .querySelectorAll(".reveal")
      .forEach((element) => {
        element.classList.add(
          "visible",
        );
      });
  }

  /* =========================================================
     AOS ANIMATION
     ========================================================= */

  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
      offset: 80,
    });
  }

  /* =========================================================
     PAGE LOADED
     ========================================================= */

  document.body.classList.add(
    "page-loaded",
  );
});