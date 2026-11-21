
document.addEventListener("DOMContentLoaded", function () {

    // ===================================
    // 1. SCROLL REVEAL ANIMATION
    // ===================================

    const revealElements = document.querySelectorAll(
        ".section-heading, " +
        ".about-content, " +
        ".skill-card, " +
        ".project-card, " +
        ".gallery-item, " +
        ".certificate-card, " +
        ".contact-card"
    );

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!prefersReducedMotion && "IntersectionObserver" in window) {

        revealElements.forEach(function (element) {
            element.classList.add("reveal");
        });

        const observer = new IntersectionObserver(
            function (entries, observer) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }

                });

            },
            {
                threshold: 0.15
            }
        );

        revealElements.forEach(function (element) {
            observer.observe(element);
        });

    }


    // ===================================
    // 2. MOBILE NAVIGATION
    // ===================================

    const navbar = document.querySelector(".navbar");
    const menuToggle = document.getElementById("menu-toggle");

    if (navbar && menuToggle) {

        const navLinks = document.querySelectorAll(".nav-menu a");

        // Update menu state
        function closeMobileMenu(returnFocus = false) {

            const wasOpen = navbar.classList.contains("menu-open");

            navbar.classList.remove("menu-open");

            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute(
                "aria-label",
                "Buka menu navigasi"
            );

            if (returnFocus && wasOpen) {
                menuToggle.focus();
            }

        }

        // Open and close menu
        menuToggle.addEventListener("click", function () {

            const isOpen = navbar.classList.toggle("menu-open");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuToggle.setAttribute(
                "aria-label",
                isOpen
                    ? "Tutup menu navigasi"
                    : "Buka menu navigasi"
            );

        });

        // Close menu after selecting a navigation link
        navLinks.forEach(function (link) {

            link.addEventListener("click", function () {
                closeMobileMenu();
            });

        });

        // Close menu when pressing Escape
        document.addEventListener("keydown", function (event) {

            if (
                event.key === "Escape" &&
                navbar.classList.contains("menu-open")
            ) {
                closeMobileMenu(true);
            }

        });

        // Close menu when returning to desktop width
        window.addEventListener("resize", function () {

            if (window.innerWidth > 768) {
                closeMobileMenu();
            }

        });

    }


    // ===================================
    // 3. IMAGE LIGHTBOX
    // ===================================

    const galleryItems = Array.from(
        document.querySelectorAll(".gallery-item")
    );

    const lightbox = document.getElementById("image-lightbox");
    const lightboxImage = document.getElementById("lightbox-image");
    const lightboxTitle = document.getElementById("lightbox-title");
    const lightboxDescription = document.getElementById("lightbox-description");
    const lightboxCounter = document.getElementById("lightbox-counter");

    const closeButton = document.getElementById("lightbox-close");
    const prevButton = document.getElementById("lightbox-prev");
    const nextButton = document.getElementById("lightbox-next");

    if (
        lightbox &&
        lightboxImage &&
        lightboxTitle &&
        lightboxDescription &&
        lightboxCounter &&
        closeButton &&
        prevButton &&
        nextButton &&
        galleryItems.length > 0
    ) {

        let currentIndex = 0;
        let previousFocus = null;

        // Get screenshot information
        function getGalleryData(index) {

            const item = galleryItems[index];
            const image = item.querySelector("img");

            const title = item.querySelector(".gallery-caption h4");
            const description = item.querySelector(".gallery-caption p");

            if (!image) {
                return null;
            }

            return {
                src: image.src,
                alt: image.alt,
                title: title ? title.textContent.trim() : "",
                description: description
                    ? description.textContent.trim()
                    : ""
            };

        }

        // Display selected screenshot
        function showImage(index) {

            currentIndex =
                (index + galleryItems.length) % galleryItems.length;

            const data = getGalleryData(currentIndex);

            if (!data) {
                return;
            }

            lightboxImage.src = data.src;
            lightboxImage.alt = data.alt;

            lightboxTitle.textContent = data.title;
            lightboxDescription.textContent = data.description;

            lightboxCounter.textContent =
                `${currentIndex + 1} / ${galleryItems.length}`;

        }

        // Open lightbox
        function openLightbox(index) {

            previousFocus = document.activeElement;

            showImage(index);

            lightbox.classList.add("active");
            lightbox.setAttribute("aria-hidden", "false");

            document.body.style.overflow = "hidden";

            closeButton.focus();

        }

        // Close lightbox
        function closeLightbox() {

            if (!lightbox.classList.contains("active")) {
                return;
            }

            lightbox.classList.remove("active");
            lightbox.setAttribute("aria-hidden", "true");

            lightboxImage.removeAttribute("src");

            document.body.style.overflow = "";

            if (previousFocus) {
                previousFocus.focus();
                previousFocus = null;
            }

        }

        // Attach click and keyboard events to gallery
        galleryItems.forEach(function (item, index) {

            const image = item.querySelector("img");

            if (!image) {
                return;
            }

            item.setAttribute("tabindex", "0");
            item.setAttribute("role", "button");

            item.setAttribute(
                "aria-label",
                "Perbesar screenshot " + (index + 1)
            );

            item.addEventListener("click", function () {
                openLightbox(index);
            });

            item.addEventListener("keydown", function (event) {

                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openLightbox(index);
                }

            });

        });

        // Close button
        closeButton.addEventListener("click", closeLightbox);

        // Previous image
        prevButton.addEventListener("click", function () {
            showImage(currentIndex - 1);
        });

        // Next image
        nextButton.addEventListener("click", function () {
            showImage(currentIndex + 1);
        });

        // Close by clicking the dark background
        lightbox.addEventListener("click", function (event) {

            if (event.target === lightbox) {
                closeLightbox();
            }

        });

        // Keyboard controls
        document.addEventListener("keydown", function (event) {

            if (!lightbox.classList.contains("active")) {
                return;
            }

            if (event.key === "Escape") {
                closeLightbox();
            }

            if (event.key === "ArrowRight") {
                showImage(currentIndex + 1);
            }

            if (event.key === "ArrowLeft") {
                showImage(currentIndex - 1);
            }

        });

    }

});
