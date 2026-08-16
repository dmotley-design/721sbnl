document.addEventListener('DOMContentLoaded', () => {

    // ---- Elements -----------------------------------------------
    const navbar       = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks     = document.getElementById('nav-links');
    const progressBar  = document.getElementById('scroll-progress');
    const backToTop    = document.getElementById('back-to-top');
    const lightbox     = document.getElementById('lightbox');
    const lightboxImg  = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');

    // ---- Scroll Events ------------------------------------------
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;

        // Scroll progress bar
        if (progressBar) {
            progressBar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
        }

        // Navbar
        if (scrollTop > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');

        // Back to top
        if (backToTop) {
            if (scrollTop > 400) backToTop.classList.add('visible');
            else backToTop.classList.remove('visible');
        }
    }, { passive: true });

    // ---- Back to Top --------------------------------------------
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ---- Mobile Menu --------------------------------------------
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const spans = mobileToggle.querySelectorAll('span');
            const isOpen = navLinks.classList.contains('active');
            spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none';
            spans[1].style.opacity   = isOpen ? '0' : '1';
            spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(6px, -6px)' : 'none';
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const spans = mobileToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity   = '1';
                spans[2].style.transform = 'none';
            });
        });
    }

    // ---- Slide-Up Observer --------------------------------------
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.slide-up').forEach(el => observer.observe(el));

    // ---- Today's Hours Highlight --------------------------------
    const dayIndex = new Date().getDay(); // 0 = Sun … 6 = Sat
    document.querySelectorAll('.hours-row').forEach(row => {
        const label = (row.querySelector('span:first-child')?.textContent || '').trim();
        let match = false;
        if (label.includes('Mon') && label.includes('Wed') && dayIndex >= 1 && dayIndex <= 3) match = true;
        if (label === 'Thursday'  && dayIndex === 4) match = true;
        if (label === 'Friday'    && dayIndex === 5) match = true;
        if (label === 'Saturday'  && dayIndex === 6) match = true;
        if (label === 'Sunday'    && dayIndex === 0) match = true;
        if (match) row.classList.add('today');
    });

    // ---- Lightbox -----------------------------------------------
    function openLightbox(src, alt) {
        if (!lightbox || !lightboxImg) return;
        lightboxImg.src = src;
        lightboxImg.alt = alt || '';
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('open');
        lightboxImg.src = '';
        document.body.style.overflow = '';
    }

    // Gallery items on index page
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('.gallery-img');
            if (img) openLightbox(img.src, img.alt);
        });
    });

    // About page gallery images
    document.querySelectorAll('.about-gallery-img').forEach(img => {
        img.addEventListener('click', () => openLightbox(img.src, img.alt));
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

    if (lightbox) {
        lightbox.addEventListener('click', e => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeLightbox();
    });
});

