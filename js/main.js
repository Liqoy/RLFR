document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lenis Smooth Scroll
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

    // Smooth scrolling for navigation links (using Lenis)
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navHeight = document.querySelector('nav').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar background change on scroll
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('bg-[#0a0a0c]');
            nav.classList.remove('bg-[#0a0a0c]/80');
            nav.classList.add('py-3');
            nav.classList.remove('py-4');
        } else {
            nav.classList.remove('bg-[#0a0a0c]');
            nav.classList.add('bg-[#0a0a0c]/80');
            nav.classList.remove('py-3');
            nav.classList.add('py-4');
        }
    });

    // Scroll reveal animation
    const revealElements = document.querySelectorAll('section, .grid > div, .max-w-2xl, #bot > div');
    
    const revealOnScroll = () => {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            if (rect.top < windowHeight * 0.85) {
                el.classList.add('reveal-active');
                el.style.opacity = "1";
                el.style.transform = "translateY(0)";
            }
        });
    };

    // Set initial state for animations
    revealElements.forEach(el => {
        el.style.transition = "all 0.8s ease-out";
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
    });

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Run once on load
});
