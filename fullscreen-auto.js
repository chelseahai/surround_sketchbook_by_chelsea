// Simple Auto Fullscreen Functionality for Sub-Pages
let fullscreenRequested = false;
let userExitedFullscreen = false;

// Check if user previously exited fullscreen
if (sessionStorage.getItem('userExitedFullscreen') === 'true') {
    userExitedFullscreen = true;
}

// Function to enter full-screen mode
function enterFullscreen() {
    if (userExitedFullscreen) return;
    
    console.log('Attempting fullscreen...');
    const docEl = document.documentElement;
    const requestMethod = docEl.requestFullscreen || 
                         docEl.webkitRequestFullscreen || 
                         docEl.mozRequestFullScreen || 
                         docEl.msRequestFullscreen;
    
    if (requestMethod) {
        requestMethod.call(docEl).then(() => {
            console.log('Fullscreen activated successfully!');
            sessionStorage.removeItem('userExitedFullscreen');
        }).catch(err => {
            console.log('Fullscreen failed:', err.message);
        });
    }
}

// Handle ESC key to exit and remember user choice
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const isFS = !!(document.fullscreenElement || document.webkitFullscreenElement);
        if (isFS) {
            userExitedFullscreen = true;
            sessionStorage.setItem('userExitedFullscreen', 'true');
            console.log('User exited fullscreen with ESC');
        }
    }
    
    // F11 key to re-enable fullscreen
    if (e.key === 'F11') {
        e.preventDefault();
        userExitedFullscreen = false;
        sessionStorage.removeItem('userExitedFullscreen');
        enterFullscreen();
    }
});

// Try fullscreen immediately when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, attempting fullscreen...');
    enterFullscreen();
});

// Also try fullscreen on page load
window.addEventListener('load', () => {
    console.log('Page loaded, attempting fullscreen...');
    enterFullscreen();
});

// Try fullscreen on first user interaction
function requestFullscreenOnInteraction() {
    if (!fullscreenRequested) {
        fullscreenRequested = true;
        console.log('User interaction detected, attempting fullscreen...');
        enterFullscreen();
        // Remove event listeners after first interaction
        document.removeEventListener('click', requestFullscreenOnInteraction);
        document.removeEventListener('keydown', requestFullscreenOnInteraction);
        document.removeEventListener('wheel', requestFullscreenOnInteraction);
        document.removeEventListener('touchstart', requestFullscreenOnInteraction);
    }
}

// Add event listeners for user interaction
document.addEventListener('click', requestFullscreenOnInteraction);
document.addEventListener('keydown', requestFullscreenOnInteraction);
document.addEventListener('wheel', requestFullscreenOnInteraction);
document.addEventListener('touchstart', requestFullscreenOnInteraction);

// Handle page navigation - remember fullscreen preference
window.addEventListener('beforeunload', function() {
    if (!userExitedFullscreen) {
        sessionStorage.setItem('shouldBeFullscreen', 'true');
    }
});

// Check if we should be fullscreen when page loads
if (sessionStorage.getItem('shouldBeFullscreen') === 'true' && !userExitedFullscreen) {
    sessionStorage.removeItem('shouldBeFullscreen');
    setTimeout(enterFullscreen, 100);
}

 