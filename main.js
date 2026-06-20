document.addEventListener('DOMContentLoaded', () => {

    /* ----------------------------------------------------
       LENIS SMOOTH INERTIAL SCROLLING
    ---------------------------------------------------- */
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Coordinate with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);


    /* ----------------------------------------------------
       TYPEWRITER TEXT CAROUSEL
    ---------------------------------------------------- */
    const words = ["Full Stack Developer", "React Developer", "Java Developer"];
    let wordIndex = 0;
    let typeTimer;

    function typingEffect() {
        const typewriterEl = document.getElementById('typewriter');
        if (!typewriterEl) return;
        
        let word = words[wordIndex].split("");
        const loopTyping = () => {
            if (word.length > 0) {
                typewriterEl.innerHTML += word.shift();
            } else {
                setTimeout(deletingEffect, 2200);
                return false;
            }
            typeTimer = setTimeout(loopTyping, 90);
        };
        loopTyping();
    }

    function deletingEffect() {
        const typewriterEl = document.getElementById('typewriter');
        if (!typewriterEl) return;

        let word = words[wordIndex].split("");
        const loopDeleting = () => {
            if (typewriterEl.innerHTML.length > 0) {
                typewriterEl.innerHTML = typewriterEl.innerHTML.substring(0, typewriterEl.innerHTML.length - 1);
            } else {
                wordIndex = (wordIndex + 1) % words.length;
                setTimeout(typingEffect, 500);
                return false;
            }
            typeTimer = setTimeout(loopDeleting, 50);
        };
        loopDeleting();
    }

    // Trigger typing loop
    setTimeout(typingEffect, 1000);


    /* ----------------------------------------------------
       CANVAS PARTICLES NODES BACKGROUND
    ---------------------------------------------------- */
    const canvas = document.getElementById('bg-particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 55;
        const connectionDistance = 120;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor() {
                this.reset();
                this.y = Math.random() * canvas.height; // Spread initially
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = -10;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 0.4 - 0.2;
                this.speedY = Math.random() * 0.3 + 0.15; // Slow downward drift
                this.alpha = Math.random() * 0.4 + 0.15;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Reset particle if off bounds
                if (this.x < 0 || this.x > canvas.width || this.y > canvas.height) {
                    this.reset();
                    this.y = 0;
                }
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 255, 255, ${this.alpha})`;
                ctx.fill();
            }
        }

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            // Drawing connecting line webs
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDistance) {
                        const opacity = (1 - dist / connectionDistance) * 0.12;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.strokeStyle = `rgba(0, 255, 255, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }


    /* ----------------------------------------------------
       CUSTOM POINTER & TRAILER CURSOR
    ---------------------------------------------------- */
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.custom-cursor-follower');
    
    if (cursor && follower) {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            cursor.style.left = `${mouseX}px`;
            cursor.style.top = `${mouseY}px`;
        });

        function animateFollower() {
            // Apply fluid trailing delay
            followerX += (mouseX - followerX) * 0.12;
            followerY += (mouseY - followerY) * 0.12;

            follower.style.left = `${followerX}px`;
            follower.style.top = `${followerY}px`;

            requestAnimationFrame(animateFollower);
        }
        animateFollower();

        // Cursor scaling reactions
        const interactiveSelectors = 'a, button, .spotlight-card, input, textarea, .scroll-indicator';
        const registerHoverEffects = () => {
            const elements = document.querySelectorAll(interactiveSelectors);
            elements.forEach(el => {
                el.addEventListener('mouseenter', () => document.body.classList.add('hovering-link'));
                el.addEventListener('mouseleave', () => document.body.classList.remove('hovering-link'));
            });
        };
        registerHoverEffects();

        // Re-register hovers on elements inside dynamic scopes if needed
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(interactiveSelectors)) {
                document.body.classList.add('hovering-link');
            } else {
                document.body.classList.remove('hovering-link');
            }
        });
    }


    /* ----------------------------------------------------
       SPOTLIGHT GLOW HOVER EFFECTS
    ---------------------------------------------------- */
    const spotlightCards = document.querySelectorAll('.spotlight-card');
    spotlightCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });


    /* ----------------------------------------------------
       STICKY HEADER & ACTIVE SECTION NAV LINKS
    ---------------------------------------------------- */
    const header = document.querySelector('.main-header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active page indicator updates
        let currentSec = 'home';
        sections.forEach(sec => {
            const secTop = sec.offsetTop - 180;
            const secHeight = sec.clientHeight;
            if (window.scrollY >= secTop && window.scrollY < secTop + secHeight) {
                currentSec = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === currentSec) {
                link.classList.add('active');
            }
        });
    });


    /* ----------------------------------------------------
       MOBILE NAVIGATION HAMBURGER DRAWER
    ---------------------------------------------------- */
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const navbar = document.querySelector('.navbar');

    if (mobileToggle && navbar) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navbar.classList.toggle('active');
        });

        // Click nav anchors closes mobile drawer
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navbar.classList.remove('active');
            });
        });
    }


    /* ----------------------------------------------------
       ANIMATED STAT COUNTERS
    ---------------------------------------------------- */
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length > 0) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const targetEl = entry.target;
                    const finalVal = parseInt(targetEl.getAttribute('data-target'), 10);
                    animateStatCounter(targetEl, finalVal);
                    observer.unobserve(targetEl);
                }
            });
        }, { threshold: 0.6 });

        statNumbers.forEach(num => statsObserver.observe(num));

        function animateStatCounter(element, finalVal) {
            let startVal = 0;
            const duration = 1600;
            const startTime = performance.now();

            function run(currentTime) {
                const elapsed = currentTime - startTime;
                const ratio = Math.min(elapsed / duration, 1);
                
                // Ease out cubic
                const easeRatio = 1 - Math.pow(1 - ratio, 3);
                const currentVal = Math.floor(easeRatio * finalVal);
                
                element.textContent = currentVal;

                if (ratio < 1) {
                    requestAnimationFrame(run);
                } else {
                    element.textContent = finalVal;
                }
            }
            requestAnimationFrame(run);
        }
    }


    /* ----------------------------------------------------
       GSAP SCROLLTRIGGER ENTRANCES REVEALS
    ---------------------------------------------------- */
    gsap.registerPlugin(ScrollTrigger);

    // Hero Section Entrance Timeline
    const heroTimeline = gsap.timeline({ defaults: { ease: 'power4.out' } });
    heroTimeline.from('.hero-badge', { y: 24, opacity: 0, duration: 0.9, delay: 0.25 })
                .from('.hero-title', { y: 48, opacity: 0, duration: 1.1 }, '-=0.7')
                .from('.typewriter-container', { y: 20, opacity: 0, duration: 0.8 }, '-=0.8')
                .from('.hero-description', { y: 32, opacity: 0, duration: 0.9 }, '-=0.7')
                .from('.hero-ctas', { y: 32, opacity: 0, duration: 0.9 }, '-=0.8')
                .from('.social-links-container', { y: 20, opacity: 0, duration: 0.8 }, '-=0.8')
                .from('.profile-card-wrapper', { scale: 0.93, opacity: 0, duration: 1.3 }, '-=1.2')
                .from('.floating-element', { scale: 0, opacity: 0, stagger: 0.16, duration: 0.9 }, '-=0.9');

    // Section reveal wrappers
    const scrollRevealSections = document.querySelectorAll('.scroll-reveal');
    scrollRevealSections.forEach(section => {
        const title = section.querySelector('.section-title');
        const subtitle = section.querySelector('.section-subtitle');
        const line = section.querySelector('.section-line');

        if (title) {
            const sectionTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: 'top 82%',
                    toggleActions: 'play none none none'
                }
            });

            sectionTimeline.from(subtitle, { opacity: 0, y: 12, duration: 0.5 })
                           .from(title, { opacity: 0, y: 24, duration: 0.7 }, '-=0.3')
                           .from(line, { width: 0, duration: 0.5, ease: 'power2.out' }, '-=0.4');

            // About Section specific sub-animations
            if (section.id === 'about') {
                sectionTimeline.from('.about-visual', { scale: 0.96, opacity: 0, duration: 0.85 }, '-=0.4')
                               .from('.about-tagline', { y: 32, opacity: 0, duration: 0.65 }, '-=0.6')
                               .from('.about-text', { y: 32, opacity: 0, stagger: 0.16, duration: 0.7 }, '-=0.55')
                               .from('.key-point', { y: 24, opacity: 0, stagger: 0.12, duration: 0.6 }, '-=0.5')
                               .from('.stats-grid', { opacity: 0, y: 24, duration: 0.7 }, '-=0.45');
            }

            // Skills Section progress bars filling
            if (section.id === 'skills') {
                const skillCards = section.querySelectorAll('.skills-category-card');
                skillCards.forEach(card => {
                    gsap.from(card, {
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 85%',
                            toggleActions: 'play none none none'
                        },
                        y: 36,
                        opacity: 0,
                        duration: 0.95,
                        ease: 'power3.out'
                    });
                    
                    const bars = card.querySelectorAll('.skill-bar-fill');
                    gsap.to(bars, {
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 85%',
                            toggleActions: 'play none none none'
                        },
                        width: function(i, target) {
                            return target.getAttribute('data-width');
                        },
                        duration: 1.4,
                        ease: 'power3.out',
                        stagger: 0.04,
                        delay: 0.3
                    });
                });
            }

            // Projects Cards reveals
            if (section.id === 'projects') {
                const projectCards = section.querySelectorAll('.project-card');
                projectCards.forEach(card => {
                    gsap.from(card, {
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 85%',
                            toggleActions: 'play none none none'
                        },
                        y: 55,
                        opacity: 0,
                        duration: 0.95,
                        ease: 'power3.out'
                    });
                });
            }

            // Experience Card details reveal
            if (section.id === 'experience') {
                const expCards = section.querySelectorAll('.experience-card');
                expCards.forEach(card => {
                    gsap.from(card, {
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 85%',
                            toggleActions: 'play none none none'
                        },
                        y: 44, 
                        opacity: 0, 
                        duration: 0.9,
                        ease: 'power3.out'
                    });
                });
            }

            // Education vertical timeline reveals
            if (section.id === 'education') {
                const timelineItems = section.querySelectorAll('.timeline-item');
                timelineItems.forEach(item => {
                    gsap.from(item, {
                        scrollTrigger: {
                            trigger: item,
                            start: 'top 85%',
                            toggleActions: 'play none none none'
                        },
                        y: 40,
                        opacity: 0,
                        duration: 0.85,
                        ease: 'power3.out'
                    });
                });
            }

            // GitHub cards stagger reveals
            if (section.id === 'github') {
                const ghCards = section.querySelectorAll('.github-card');
                ghCards.forEach(card => {
                    gsap.from(card, {
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 85%',
                            toggleActions: 'play none none none'
                        },
                        y: 44, 
                        opacity: 0, 
                        duration: 0.85,
                        ease: 'power3.out'
                    });
                });
                
                const ghMore = section.querySelector('.github-more');
                if (ghMore) {
                    gsap.from(ghMore, {
                        scrollTrigger: {
                            trigger: ghMore,
                            start: 'top 90%',
                            toggleActions: 'play none none none'
                        },
                        opacity: 0, 
                        y: 20, 
                        duration: 0.6
                    });
                }
            }

            // Certifications stagger reveals
            if (section.id === 'certifications') {
                const certCards = section.querySelectorAll('.cert-card');
                certCards.forEach(card => {
                    gsap.from(card, {
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 85%',
                            toggleActions: 'play none none none'
                        },
                        scale: 0.9, 
                        opacity: 0, 
                        duration: 0.8,
                        ease: 'power3.out'
                    });
                });
            }

            // Contact columns panels reveals
            if (section.id === 'contact') {
                sectionTimeline.from('.contact-info-panel', { x: -36, opacity: 0, duration: 0.85 }, '-=0.45')
                               .from('.contact-form-panel', { x: 36, opacity: 0, duration: 0.85 }, '-=0.85');
            }
        }
    });


    /* ----------------------------------------------------
       CONTACT FORM FEEDBACK CONTROLLERS
    ---------------------------------------------------- */
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');

    if (contactForm && formFeedback) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Set sending notice status
            formFeedback.className = 'form-feedback';
            formFeedback.textContent = 'Transmitting message...';

            // Simulate form submission delay
            setTimeout(() => {
                formFeedback.className = 'form-feedback success';
                formFeedback.textContent = 'Message delivered successfully! I will reach out shortly.';
                contactForm.reset();

                // Clear feed notice after delay
                setTimeout(() => {
                    formFeedback.textContent = '';
                }, 5000);
            }, 1400);
        });
    }

});


/* ----------------------------------------------------
   RESUME DOWNLOAD & ROCKET LAUNCH TIMEOUT
---------------------------------------------------- */
function triggerResumeDownload() {
    const rocket = document.getElementById('rocket-anim');
    const downloadLink = document.getElementById('resume-download-link');

    if (rocket && downloadLink) {
        rocket.classList.add('rocket-launch');

        // Delay download slightly to let rocket start flying
        setTimeout(() => {
            downloadLink.click();
        }, 550);

        // Reset class after animation completes
        rocket.addEventListener('animationend', () => {
            rocket.classList.remove('rocket-launch');
        }, { once: true });
    }
}
