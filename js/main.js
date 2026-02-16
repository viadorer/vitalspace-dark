/**
 * VitalSpace - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    initFAQ();
    initSegmentTabs();
    initSmoothScroll();
    initFormHandler();
});

/**
 * FAQ Toggle Functionality
 */
function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const isActive = item.classList.contains('active');
            
            // Close all items
            document.querySelectorAll('.faq-item').forEach(i => {
                i.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

/**
 * Segment Tabs Functionality
 */
function initSegmentTabs() {
    document.querySelectorAll('.segment-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const segment = this.getAttribute('data-segment');
            switchSegment(segment, this);
        });
    });
}

function switchSegment(segment, clickedTab) {
    // Remove active class from all tabs and contents
    document.querySelectorAll('.segment-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.segment-content').forEach(content => {
        content.classList.remove('active');
    });

    // Add active class to clicked tab and corresponding content
    if (clickedTab) {
        clickedTab.classList.add('active');
    }
    const targetContent = document.getElementById(segment);
    if (targetContent) {
        targetContent.classList.add('active');
    }
}

// Global function for inline onclick handlers (backward compatibility)
window.switchSegment = function(segment) {
    const tab = document.querySelector(`[data-segment="${segment}"]`) || 
                document.querySelector(`.segment-tab:contains("${segment}")`);
    
    document.querySelectorAll('.segment-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.segment-content').forEach(c => c.classList.remove('active'));
    
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    const targetContent = document.getElementById(segment);
    if (targetContent) {
        targetContent.classList.add('active');
    }
};

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Form Handler
 * Note: This is a placeholder. Replace with actual form widget integration.
 */
function initFormHandler() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Collect form data
            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            // TODO: Replace with actual form widget submission
            // This is a placeholder alert
            console.log('Form data:', data);
            alert('Děkujeme za poptávku! Ozveme se vám do 24 hodin.');
            
            // Reset form
            form.reset();
        });
    }
}

/**
 * Scroll to form helper
 */
function scrollToForm() {
    const formSection = document.getElementById('form');
    if (formSection) {
        formSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Export for global use
window.scrollToForm = scrollToForm;
