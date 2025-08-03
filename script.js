// Video Intro functionality
document.addEventListener('DOMContentLoaded', function() {
    const videoIntro = document.getElementById('videoIntro');
    const introVideo = document.getElementById('introVideo');
    const skipButton = document.getElementById('skipButton');
    const mainContent = document.getElementById('mainContent');
    
    // Start background music immediately when page loads
    startBackgroundMusic();
    
    // Function to transition to main content
    function transitionToMainContent() {
        // Fade out video intro
        videoIntro.style.transition = 'opacity 0.5s ease';
        videoIntro.style.opacity = '0';
        
        setTimeout(() => {
            // Hide video intro and show main content
            videoIntro.style.display = 'none';
            mainContent.style.display = 'block';
        }, 500);
    }
    
    // Handle video end
    introVideo.addEventListener('ended', function() {
        transitionToMainContent();
    });
    
    // Handle skip button click
    skipButton.addEventListener('click', function() {
        transitionToMainContent();
    });
    
    // Handle video errors (fallback to main content)
    introVideo.addEventListener('error', function() {
        console.log('Video failed to load, transitioning to main content');
        transitionToMainContent();
    });
    
    // Start background music function
    function startBackgroundMusic() {
        const backgroundMusic = document.getElementById('backgroundMusic');
        
        // Function to attempt autoplay
        function attemptAutoplay() {
            const playPromise = backgroundMusic.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('Background music started automatically');
                }).catch(error => {
                    console.log('Autoplay prevented by browser:', error);
                });
            }
        }
        
        // Try to start playing immediately
        attemptAutoplay();
        
        // Start playing on first user interaction
        function startMusicOnInteraction() {
            if (backgroundMusic.paused) {
                backgroundMusic.play().then(() => {
                    console.log('Background music started on user interaction');
                    // Remove event listeners after successful start
                    document.removeEventListener('click', startMusicOnInteraction);
                    document.removeEventListener('scroll', startMusicOnInteraction);
                    document.removeEventListener('keydown', startMusicOnInteraction);
                }).catch(error => {
                    console.log('Failed to start music:', error);
                });
            }
        }
        
        // Add event listeners for user interaction
        document.addEventListener('click', startMusicOnInteraction);
        document.addEventListener('scroll', startMusicOnInteraction);
        document.addEventListener('keydown', startMusicOnInteraction);
        
        // Ensure music loops
        backgroundMusic.loop = true;
        
        // Set volume (0.0 to 1.0, where 1.0 is 100%)
        backgroundMusic.volume = 0.5; // 50% volume
    }
});

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar background change on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.4)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.3)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Add loading animation for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });

    // Mobile menu toggle (if needed)
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }

    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close any open modals or menus
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        }
        
        // Arrow key navigation between sections
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            navigateToNextSection();
        }
        
        if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            navigateToPreviousSection();
        }
    });

    // Section navigation functions
    function navigateToNextSection() {
        const sections = document.querySelectorAll('.fullscreen-section, .hero');
        const currentScroll = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        for (let i = 0; i < sections.length; i++) {
            const sectionTop = sections[i].offsetTop;
            const sectionBottom = sectionTop + sections[i].offsetHeight;
            
            if (currentScroll < sectionBottom - windowHeight / 2) {
                window.scrollTo({
                    top: sectionTop,
                    behavior: 'smooth'
                });
                break;
            }
        }
    }

    function navigateToPreviousSection() {
        const sections = document.querySelectorAll('.fullscreen-section, .hero');
        const currentScroll = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        for (let i = sections.length - 1; i >= 0; i--) {
            const sectionTop = sections[i].offsetTop;
            
            if (currentScroll > sectionTop + windowHeight / 2) {
                window.scrollTo({
                    top: sectionTop,
                    behavior: 'smooth'
                });
                break;
            }
        }
    }

    // Add touch support for mobile devices
    let touchStartY = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', function(e) {
        touchStartY = e.changedTouches[0].screenY;
    });

    document.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartY - touchEndY;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe up - navigate to next section
                navigateToNextSection();
            } else {
                // Swipe down - navigate to previous section
                navigateToPreviousSection();
            }
        }
    }
}); 