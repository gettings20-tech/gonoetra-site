// Noetra — Main JS

(function () {
    'use strict';

    // Site is public — initialize immediately on load.
    initSite();

    // ---- Site Init ----
    function initSite() {
        initNav();
        initFAQ();
        initScrollAnimations();
    }

    // ---- Mobile Nav ----
    function initNav() {
        const toggle = document.getElementById('nav-toggle');
        const links = document.getElementById('nav-links');

        toggle.addEventListener('click', function () {
            links.classList.toggle('active');
        });

        // Close menu on link click
        links.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () {
                links.classList.remove('active');
            });
        });

        // Nav background on scroll
        const nav = document.getElementById('nav');
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                nav.style.background = 'rgba(26, 26, 46, 0.95)';
            } else {
                nav.style.background = 'rgba(26, 26, 46, 0.85)';
            }
        });
    }

    // ---- FAQ Accordion ----
    function initFAQ() {
        document.querySelectorAll('.faq-question').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const item = btn.closest('.faq-item');
                const answer = item.querySelector('.faq-answer');
                const isActive = item.classList.contains('active');

                // Close all
                document.querySelectorAll('.faq-item').forEach(function (i) {
                    i.classList.remove('active');
                    i.querySelector('.faq-answer').style.maxHeight = null;
                });

                // Open clicked (if wasn't active)
                if (!isActive) {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        });
    }

    // ---- Scroll Animations ----
    function initScrollAnimations() {
        const targets = document.querySelectorAll(
            '.problem-card, .step, .feature-card, .pricing-card, .faq-item'
        );

        targets.forEach(function (el) {
            el.classList.add('fade-in');
        });

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        targets.forEach(function (el) {
            observer.observe(el);
        });
    }
})();
