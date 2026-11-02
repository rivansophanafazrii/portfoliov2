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
      "Frontend Developer",
      "Backend Developer",
      "UI/UX Design",
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
        typingElement.textContent = currentWord.substring(0, charIndex + 1);

        charIndex++;

        if (charIndex === currentWord.length) {
          isDeleting = true;

          setTimeout(typeRole, pauseAfterTyping);

          return;
        }
      } else {
        typingElement.textContent = currentWord.substring(0, charIndex - 1);

        charIndex--;

        if (charIndex === 0) {
          isDeleting = false;

          wordIndex = (wordIndex + 1) % words.length;

          setTimeout(typeRole, pauseAfterDeleting);

          return;
        }
      }

      setTimeout(typeRole, isDeleting ? deletingSpeed : typingSpeed);
    }

    typeRole();
  }

  /* =========================================================
     SCROLL PROGRESS BAR
     ========================================================= */

  function updateProgressBar() {
    if (!progressBar) return;

    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;

    const documentHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    if (documentHeight <= 0) {
      progressBar.style.width = "0%";
      return;
    }

    const scrollPercentage = (scrollTop / documentHeight) * 100;

    progressBar.style.width = `${Math.min(scrollPercentage, 100)}%`;
  }

  window.addEventListener("scroll", updateProgressBar, {
    passive: true,
  });

  updateProgressBar();

  /* =========================================================
     ACTIVE NAVIGATION BASED ON SECTION
     ========================================================= */

  const sections = document.querySelectorAll("section[id]");

  const navigationLinks = document.querySelectorAll(".nav-links a[href^='#']");

  function updateActiveNavigation() {
    let currentSection = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 150;

      const sectionHeight = section.offsetHeight;

      if (
        window.scrollY >= sectionTop &&
        window.scrollY < sectionTop + sectionHeight
      ) {
        currentSection = section.getAttribute("id");
      }
    });

    navigationLinks.forEach((link) => {
      link.classList.remove("active");

      const href = link.getAttribute("href");

      if (href === `#${currentSection}`) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", updateActiveNavigation, {
    passive: true,
  });

  updateActiveNavigation();

  /* =========================================================
     SMOOTH SCROLL
     ========================================================= */

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (event) {
      const targetId = this.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      const navbarHeight = header ? header.offsetHeight : 80;

      const targetPosition =
        target.getBoundingClientRect().top + window.scrollY - navbarHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    });
  });

  /* =========================================================
     SCROLL REVEAL ANIMATION
     ========================================================= */

  const revealElements = document.querySelectorAll(
    ".reveal, .section-heading, .skill-card, .project-card, .certificate-card, .about-card",
  );

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");

            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -50px 0px",
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
    const modal = document.getElementById("certModal");

    const title = document.getElementById("modalTitle");

    const gallery = document.getElementById("modalGallery");

    if (!modal || !title || !gallery) {
      return;
    }

    modal.classList.add("show");

    document.body.classList.add("modal-open");

    gallery.innerHTML = "";

    if (category === "web-dev") {
      title.textContent = "Sertifikasi Pengembangan Web";

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

        <div class="gallery-item">
          <img
            src="img/cert/dicoding/front-end.png"
            alt="Sertifikat Belajar Membuat Front-End Web untuk Pemula"
            loading="lazy"
          >
          <p>Front-End Web</p>
        </div>

        <div class="gallery-item">
          <img
            src="img/cert/dicoding/memulai-dasar-pemrograman-untuk-menjadi-pengembang-software.png"
            alt="memulai-dasar-pemrograman-untuk-menjadi-pengembang-software"
            loading="lazy"
          >
          <p>Memulai Dasar Pemrograman untuk Menjadi Pengembang Software</p>
        </div>
      `;
    } else if (category === "ai") {
      title.textContent = "Sertifikasi Kecerdasan Buatan";

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
      title.textContent = "Sertifikasi UI/UX & Desain Grafis";

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
      modal.classList.add("modal-visible");
    });
  };

  /* =========================================================
     CLOSE CERTIFICATE MODAL
     ========================================================= */

  window.closeCertModal = function () {
    const modal = document.getElementById("certModal");

    if (!modal) return;

    modal.classList.remove("modal-visible");

    setTimeout(() => {
      modal.classList.remove("show");

      document.body.classList.remove("modal-open");
    }, 250);
  };

  /* =========================================================
     CLOSE MODAL WHEN CLICKING OUTSIDE
     ========================================================= */

  window.addEventListener("click", (event) => {
    const modal = document.getElementById("certModal");

    if (modal && event.target === modal) {
      window.closeCertModal();
    }
  });

  /* =========================================================
     CLOSE MODAL WITH ESC KEY
     ========================================================= */

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    const modal = document.getElementById("certModal");

    if (modal && modal.classList.contains("show")) {
      window.closeCertModal();
    }
  });

  /* =========================================================
     CONTACT FORM
     ========================================================= */

  const scriptURL =
    "https://script.google.com/macros/s/AKfycbw2o2Rqnz2Qt-aS7HlV5SLgB1YEZ-WPYFEo16F-Vj7ZWde19HsLL2ZhOmUrCt9X0484AA/exec";

  const form = document.forms["submit-to-google-sheet"];

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const submitButton = form.querySelector('button[type="submit"]');

      const originalButtonText = submitButton ? submitButton.innerHTML : "";

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
        if (typeof Swal !== "undefined") {
          Swal.fire({
            title: "Mengirim pesan",
            text: "Mohon tunggu sebentar...",
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });
        }

        /* Send data */
        const response = await fetch(scriptURL, {
          method: "POST",
          body: new FormData(form),
        });

        if (!response.ok) {
          throw new Error("Gagal mengirim data.");
        }

        /* Close loading */
        if (typeof Swal !== "undefined") {
          Swal.close();

          await Swal.fire({
            icon: "success",
            title: "Pesan Berhasil Dikirim",
            text: "Terima kasih. Pesan kamu sudah berhasil dikirim.",
            confirmButtonText: "Oke",
            confirmButtonColor: "#0984F3",
          });
        } else {
          alert("Pesan berhasil dikirim.");
        }

        /* Reset form */
        form.reset();
      } catch (error) {
        console.error("Contact form error:", error);

        if (typeof Swal !== "undefined") {
          Swal.close();

          Swal.fire({
            icon: "error",
            title: "Gagal Mengirim",
            text: "Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.",
            confirmButtonText: "Coba Lagi",
            confirmButtonColor: "#0984F3",
          });
        } else {
          alert("Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.");
        }
      } finally {
        /* Enable button */
        if (submitButton) {
          submitButton.disabled = false;

          submitButton.innerHTML = originalButtonText;
        }
      }
    });
  }

  /* =========================================================
     IMAGE ERROR HANDLING
     ========================================================= */

  document.querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", function () {
      this.classList.add("image-error");

      console.warn(`Gambar tidak ditemukan: ${this.src}`);
    });
  });

  /* =========================================================
     LAZY IMAGE EFFECT
     ========================================================= */

  const images = document.querySelectorAll('img[loading="lazy"]');

  images.forEach((image) => {
    image.addEventListener(
      "load",
      () => {
        image.classList.add("loaded");
      },
      {
        once: true,
      },
    );
  });

  /* =========================================================
     CURRENT YEAR
     ========================================================= */

  const currentYear = document.getElementById("current-year");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  /* =========================================================
     CURSOR INTERACTION
     ========================================================= */

  const interactiveElements = document.querySelectorAll(
    "a, button, .skill-card, .certificate-card, .project-card",
  );

  interactiveElements.forEach((element) => {
    element.addEventListener("mouseenter", () => {
      element.classList.add("is-hovered");
    });

    element.addEventListener("mouseleave", () => {
      element.classList.remove("is-hovered");
    });
  });

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

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    document.documentElement.style.scrollBehavior = "auto";

    document.querySelectorAll(".reveal").forEach((element) => {
      element.classList.add("visible");
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

  document.body.classList.add("page-loaded");
});

/* =========================================================
   PROJECT MODAL
   ========================================================= */

// Database Proyek (Tambahkan proyek Anda di sini tanpa batas)
const projectsData = {
  "project-1": {
    title: "Sistem Informasi Perpustakaan Berbasis Website",
    subtitle:
      "SIPERPUS adalah aplikasi manajemen perpustakaan berbasis web untuk mendukung administrasi buku, anggota, peminjaman, pengembalian, berita, layanan perpustakaan, serta pelaporan. Sistem menyediakan dua area utama: area administrator untuk pengelolaan operasional dan area anggota untuk katalog, peminjaman, riwayat, serta profil pengguna.",
    year: "2026",
    category: "Web Development",
    role: "Fullstack Developer",
    mainImage: "img/web/siperpus.webp",
    task: "Mengembangkan inti dari sistem perpustakaan, yaitu sirkulasi peminjaman dan pengembalian. Sistem wajib memperbarui stok buku secara otomatis saat transaksi terjadi dan menghitung denda keterlambatan secara objektif tanpa kalkulasi manual dari petugas.",
    solution:
      "Memanfaatkan library penanggalan Carbon (bawaan Laravel) untuk menghitung selisih hari antara tanggal jatuh tempo dengan tanggal pengembalian riil. Jika terlambat, sistem otomatis mengalikan jumlah hari tersebut dengan tarif denda per hari yang berlaku di sekolah.",
    videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4", // Ganti ID YouTube
    gallery: ["img/web/siperpus.webp"],
  },
  "project-2": {
    title: "Undangan Digital",
    subtitle:
      "Proyek ini merupakan pengembangan platform Website Undangan Digital (Digital Invitation) berbasis web statis yang dirancang sebagai alternatif modern, ekonomis, dan ramah lingkungan untuk menggantikan atau melengkapi undangan fisik konvensional. Menggunakan kombinasi teknologi fundamental web yaitu HTML5, CSS3, dan JavaScript, proyek ini berfokus pada penciptaan media informasi satu halaman (Landing Page) yang tidak hanya estetis secara visual, tetapi juga interaktif dan kaya akan fitur.",
    year: "2023",
    category: "Web Development",
    role: "Fullstack Developer",
    mainImage: "img/web/undangan-digital.webp",
    task: "Website harus menyajikan informasi acara secara terstruktur, mulai dari sampul pembuka, profil mempelai/penyelenggara, detail waktu dan lokasi, galeri foto, hingga kolom ucapan. Navigasi harus mulus agar tamu tidak bingung saat menggeser (scroll) halaman dari atas ke bawah.",
    solution:
      "HTML5 Semantic: Menyusun struktur halaman menggunakan tag HTML5 yang rapi seperti header untuk sampul, section untuk tiap informasi (Mempelai, Acara, Galeri, Ucapan), dan footer untuk penutup. <br> CSS Smooth Scroll: Menggunakan properti CSS html { scroll-behavior: smooth; } agar perpindahan antar bagian halaman terasa halus saat tamu menggunakan menu navigasi.",
    videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4", // Ganti ID YouTube
    gallery: [
      "img/web/undangan-digital1.webp","img/web/undangan-digital2.webp","img/web/undangan-digital3.webp","img/web/undangan-digital4.webp","img/web/undangan-digital5.webp","img/web/undangan-digital6.webp",
    ], // Kosongkan array [] jika tidak ada foto
  },
  // Tambahkan 'project-2', 'project-3', dst...
};

window.openProjectModal = function (projectId) {
  const modal = document.getElementById("projectModal");
  const modalBody = document.getElementById("projectModalBody");
  const data = projectsData[projectId];

  if (!modal || !modalBody || !data) return;

  // Generate Gallery HTML dengan event onclick untuk Zoom
  let galleryHTML = "";
  if (data.gallery && data.gallery.length > 0) {
    galleryHTML = `<div class="project-section" style="grid-column: 1 / -1;">
                     <h4>Dokumentasi</h4>
                     <div class="project-gallery">
                       ${data.gallery.map((img) => `<img src="${img}" alt="Dokumentasi Proyek" onclick="zoomImage(this.src)">`).join("")}
                     </div>
                   </div>`;
  }

  // Inject HTML ke dalam modal (Gambar Utama juga diberi event onclick untuk Zoom)
  modalBody.innerHTML = `
    <span class="mini-title">${data.subtitle}</span>
    <h2 id="modalTitle">${data.title}</h2>
    
    <div class="project-meta">
      <span><i class="fa-regular fa-calendar"></i> ${data.year}</span>
      <span><i class="fa-solid fa-layer-group"></i> ${data.category}</span>
      <span><i class="fa-solid fa-user-astronaut"></i> ${data.role}</span>
    </div>

    <img src="${data.mainImage}" alt="${data.title}" class="project-main-img" onclick="zoomImage(this.src)">

    <div class="project-desc-grid">
      <div class="project-section">
        <h4>Task</h4>
        <p>${data.task}</p>
      </div>
      <div class="project-section">
        <h4>Solution</h4>
        <p>${data.solution}</p>
      </div>
    </div>

    ${
      data.videoUrl
        ? `
    <div class="project-section">
      <h4>Video Review</h4>
      <div class="video-container">
        <iframe src="${data.videoUrl}" allowfullscreen></iframe>
      </div>
    </div>`
        : ""
    }

    ${galleryHTML}
  `;

  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  requestAnimationFrame(() => {
    modal.classList.add("modal-visible");
  });
};

window.closeProjectModal = function () {
  const modal = document.getElementById("projectModal");
  if (!modal) return;

  modal.classList.remove("modal-visible");
  modal.setAttribute("aria-hidden", "true");
  setTimeout(() => {
    modal.classList.remove("show");
    document.body.classList.remove("modal-open");
    // Hapus iframe agar video berhenti memutar saat ditutup
    const modalBody = document.getElementById("projectModalBody");
    if (modalBody) modalBody.innerHTML = "";
  }, 250);
};

// Menutup modal project saat klik di luar
window.addEventListener("click", (event) => {
  const projectModal = document.getElementById("projectModal");
  if (projectModal && event.target === projectModal) {
    window.closeProjectModal();
  }
});

/* =========================================================
   ZOOM IMAGE LOGIC
   ========================================================= */

window.zoomImage = function (src) {
  const zoomModal = document.getElementById("imageZoomModal");
  const zoomedImg = document.getElementById("zoomedImage");

  if (!zoomModal || !zoomedImg) return;

  zoomedImg.src = src;
  zoomedImg.alt = "Gambar proyek yang diperbesar";
  zoomModal.setAttribute("aria-hidden", "false");
  zoomModal.classList.add("show");

  requestAnimationFrame(() => {
    zoomModal.classList.add("modal-visible");
  });
};

window.closeImageZoom = function () {
  const zoomModal = document.getElementById("imageZoomModal");
  if (!zoomModal) return;

  zoomModal.classList.remove("modal-visible");
  zoomModal.setAttribute("aria-hidden", "true");
  setTimeout(() => {
    zoomModal.classList.remove("show");
    const zoomedImg = document.getElementById("zoomedImage");
    if (zoomedImg) zoomedImg.removeAttribute("src");
  }, 200);
};

const imageZoomModal = document.getElementById("imageZoomModal");
if (imageZoomModal) {
  imageZoomModal.addEventListener("click", (event) => {
    if (event.target === imageZoomModal) {
      window.closeImageZoom();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  const zoomModal = document.getElementById("imageZoomModal");
  const projectModal = document.getElementById("projectModal");

  if (zoomModal && zoomModal.classList.contains("show")) {
    window.closeImageZoom();
    return;
  }

  if (projectModal && projectModal.classList.contains("show")) {
    window.closeProjectModal();
  }
});
