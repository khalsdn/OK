// Better Communication Stories - Main JavaScript File
// Navigation and interaction logic

// Global variables
let currentStory = 1;
const totalStories = 9;

// Initialize page animations and interactions
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeVocabularyWords();
    initializeProgressTracking();
    initializeKeyboardNavigation();
});

// Initialize entrance animations
function initializeAnimations() {
    // Animate main content on page load
    anime({
        targets: '.story-content, .book-card',
        translateY: [50, 0],
        opacity: [0, 1],
        duration: 800,
        delay: anime.stagger(200),
        easing: 'easeOutExpo'
    });

    // Animate vocabulary words with stagger effect
    anime({
        targets: '.vocabulary-word',
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 600,
        delay: anime.stagger(100, {start: 1000}),
        easing: 'easeOutElastic(1, .8)'
    });

    // Animate navigation buttons
    anime({
        targets: '.nav-button',
        scale: [0.9, 1],
        opacity: [0, 1],
        duration: 600,
        delay: 1200,
        easing: 'easeOutElastic(1, .8)'
    });
}

// Initialize vocabulary word interactions
function initializeVocabularyWords() {
    const vocabularyWords = document.querySelectorAll('.vocabulary-word');
    
    vocabularyWords.forEach(word => {
        // Add hover animation
        word.addEventListener('mouseenter', function() {
            anime({
                targets: this,
                scale: 1.1,
                duration: 200,
                easing: 'easeOutQuad'
            });
        });

        word.addEventListener('mouseleave', function() {
            anime({
                targets: this,
                scale: 1,
                duration: 200,
                easing: 'easeOutQuad'
            });
        });

        // Add click animation for definition
        word.addEventListener('click', function() {
            showDefinition(this);
        });
    });
}

// Show vocabulary word definition with animation
function showDefinition(wordElement) {
    const definition = wordElement.getAttribute('title');
    
    // Create tooltip if it doesn't exist
    let tooltip = wordElement.querySelector('.definition-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'definition-tooltip';
        tooltip.textContent = definition;
        tooltip.style.cssText = `
            position: absolute;
            background: #333;
            color: white;
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 14px;
            white-space: nowrap;
            z-index: 1000;
            top: -40px;
            left: 50%;
            transform: translateX(-50%);
            opacity: 0;
        `;
        wordElement.style.position = 'relative';
        wordElement.appendChild(tooltip);
    }

    // Animate tooltip appearance
    anime({
        targets: tooltip,
        opacity: [0, 1],
        translateY: [-10, 0],
        duration: 300,
        easing: 'easeOutQuad'
    });

    // Auto-hide tooltip after 3 seconds
    setTimeout(() => {
        anime({
            targets: tooltip,
            opacity: 0,
            duration: 200,
            complete: () => {
                if (tooltip.parentNode) {
                    tooltip.parentNode.removeChild(tooltip);
                }
            }
        });
    }, 3000);
}

// Initialize progress tracking
function initializeProgressTracking() {
    // Update progress based on current page
    const path = window.location.pathname;
    const page = path.split('/').pop();
    
    let progress = 0;
    if (page === 'index.html' || page === '') {
        progress = 0;
    } else if (page === 'contents.html') {
        progress = 5;
    } else if (page.startsWith('story')) {
        const storyNumber = parseInt(page.replace('story', '').replace('.html', ''));
        progress = (storyNumber / totalStories) * 100;
    }

    // Animate progress bar
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        anime({
            targets: progressBar,
            width: `${progress}%`,
            duration: 1000,
            easing: 'easeOutExpo'
        });
    }
}

// Initialize keyboard navigation
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // Left arrow or 'A' key - previous page
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
            e.preventDefault();
            navigateToPrevious();
        }
        
        // Right arrow or 'D' key - next page
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
            e.preventDefault();
            navigateToNext();
        }
        
        // Space bar - next page
        if (e.key === ' ') {
            e.preventDefault();
            navigateToNext();
        }
        
        // Home key - go to contents
        if (e.key === 'Home') {
            e.preventDefault();
            window.location.href = 'contents.html';
        }
        
        // Escape key - go to home
        if (e.key === 'Escape') {
            e.preventDefault();
            window.location.href = 'index.html';
        }
    });
}

// Navigation functions
function navigateToPrevious() {
    const currentPage = getCurrentPageNumber();
    if (currentPage > 1) {
        const prevPage = currentPage === 0 ? 'index.html' : 
                        currentPage === 1 ? 'contents.html' : 
                        `story${currentPage - 1}.html`;
        
        animatePageTransition(() => {
            window.location.href = prevPage;
        });
    }
}

function navigateToNext() {
    const currentPage = getCurrentPageNumber();
    if (currentPage < totalStories) {
        const nextPage = currentPage === 0 ? 'contents.html' : 
                        currentPage === -1 ? 'story01.html' : 
                        `story${currentPage + 1}.html`;
        
        animatePageTransition(() => {
            window.location.href = nextPage;
        });
    }
}

// Get current page number for navigation
function getCurrentPageNumber() {
    const path = window.location.pathname;
    const page = path.split('/').pop();
    
    if (page === 'index.html' || page === '') return -1;
    if (page === 'contents.html') return 0;
    if (page.startsWith('story')) {
        return parseInt(page.replace('story', '').replace('.html', ''));
    }
    return -1;
}

// Page transition animation
function animatePageTransition(callback) {
    anime({
        targets: 'body',
        opacity: [1, 0],
        duration: 300,
        easing: 'easeInQuad',
        complete: callback
    });
}

// Smooth scroll to top function
function scrollToTop() {
    anime({
        targets: document.documentElement,
        scrollTop: 0,
        duration: 500,
        easing: 'easeInOutQuad'
    });
}

// Story completion tracking
function markStoryComplete(storyNumber) {
    const completedStories = JSON.parse(localStorage.getItem('completedStories') || '[]');
    if (!completedStories.includes(storyNumber)) {
        completedStories.push(storyNumber);
        localStorage.setItem('completedStories', JSON.stringify(completedStories));
    }
}

// Check if story is completed
function isStoryComplete(storyNumber) {
    const completedStories = JSON.parse(localStorage.getItem('completedStories') || '[]');
    return completedStories.includes(storyNumber);
}

// Reset progress (for testing)
function resetProgress() {
    localStorage.removeItem('completedStories');
    location.reload();
}

// Add floating animation to decorative elements
function addFloatingAnimation() {
    const floatingElements = document.querySelectorAll('.floating-element, .decorative-star');
    
    floatingElements.forEach((element, index) => {
        anime({
            targets: element,
            translateY: [-10, 10],
            duration: 3000 + (index * 500),
            direction: 'alternate',
            loop: true,
            easing: 'easeInOutSine'
        });
    });
}

// Initialize floating animations after page load
setTimeout(addFloatingAnimation, 1000);

// Add scroll-triggered animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                anime({
                    targets: entry.target,
                    translateY: [20, 0],
                    opacity: [0.7, 1],
                    duration: 600,
                    easing: 'easeOutQuad'
                });
            }
        });
    }, observerOptions);

    // Observe story sections
    document.querySelectorAll('.story-text p, .question-card, .vocabulary-section').forEach(el => {
        observer.observe(el);
    });
}

// Initialize scroll animations
setTimeout(initializeScrollAnimations, 500);

// Print-friendly mode
function enablePrintMode() {
    document.body.classList.add('print-mode');
    
    // Hide navigation elements
    const navElements = document.querySelectorAll('.nav-button, .progress-bar, .splide__arrows');
    navElements.forEach(el => el.style.display = 'none');
    
    // Show print message
    const printMessage = document.createElement('div');
    printMessage.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; background: #4CAF50; color: white; padding: 10px 20px; border-radius: 5px; z-index: 9999;">
            Print mode enabled - Navigation hidden
        </div>
    `;
    document.body.appendChild(printMessage);
    
    setTimeout(() => {
        document.body.removeChild(printMessage);
    }, 3000);
}

// Export functions for global use
window.StoryApp = {
    navigateToPrevious,
    navigateToNext,
    scrollToTop,
    markStoryComplete,
    isStoryComplete,
    resetProgress,
    enablePrintMode
};