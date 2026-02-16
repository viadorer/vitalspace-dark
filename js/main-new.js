/* =============================================================================
   VITALSPACE - Main JavaScript
   Interaktivní funkce pro nový web
   ============================================================================= */

(function() {
    'use strict';

    // ==========================================================================
    // STICKY HEADER - Scroll Effect
    // ==========================================================================
    const header = document.querySelector('.header-sticky');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // ==========================================================================
    // SMOOTH SCROLL - Anchor Links
    // ==========================================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Ignore empty anchors
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================================================
    // FAQ ACCORDION
    // ==========================================================================
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            
            // Close all other items
            faqItems.forEach(otherItem => {
                const otherQuestion = otherItem.querySelector('.faq-question');
                const otherAnswer = otherItem.querySelector('.faq-answer');
                
                if (otherItem !== item) {
                    otherQuestion.setAttribute('aria-expanded', 'false');
                    otherAnswer.style.maxHeight = '0';
                }
            });
            
            // Toggle current item
            if (isExpanded) {
                question.setAttribute('aria-expanded', 'false');
                answer.style.maxHeight = '0';
            } else {
                question.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // ==========================================================================
    // ROI CALCULATOR
    // ==========================================================================
    const roiForm = document.getElementById('roi-calculator');
    const roiResults = document.getElementById('roi-results');
    
    if (roiForm) {
        roiForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const flatSize = parseInt(document.getElementById('flat-size').value);
            const peopleCount = parseInt(document.getElementById('people-count').value);
            const isAllergic = document.querySelector('input[name="allergic"]:checked').value === 'yes';
            
            // Calculate results (simplified algorithm)
            const baseSickDays = peopleCount * 3; // Average 3 sick days per person
            const allergyMultiplier = isAllergic ? 1.5 : 1;
            const sizeFactor = flatSize > 100 ? 1.2 : 1;
            
            const potentialReduction = Math.round(baseSickDays * allergyMultiplier * sizeFactor * 0.3);
            
            // Update results
            document.getElementById('result-sick-days').innerHTML = 
                `Odhadovaně <span class="highlight">${potentialReduction} dní</span> méně nemocnosti ročně`;
            
            if (isAllergic) {
                document.getElementById('result-allergens').textContent = 
                    'Pravidelná sanitace může výrazně snížit koncentraci alergenů v prostoru, což může přispět k úlevě od příznaků alergie.';
            } else {
                document.getElementById('result-allergens').textContent = 
                    'Pravidelná sanitace může výrazně snížit koncentraci alergenů v prostoru a podpořit celkové zdraví domácnosti.';
            }
            
            // Show results
            roiResults.style.display = 'block';
            
            // Scroll to results
            setTimeout(() => {
                roiResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        });
    }

    // ==========================================================================
    // CONTACT FORM - Validation & Submit
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = {};
            
            formData.forEach((value, key) => {
                if (key === 'problem') {
                    if (!data.problem) data.problem = [];
                    data.problem.push(value);
                } else {
                    data[key] = value;
                }
            });
            
            // Validate GDPR consent
            if (!formData.get('gdpr')) {
                alert('Prosím, potvrďte souhlas se zpracováním osobních údajů.');
                return;
            }
            
            // TODO: Send to backend API
            console.log('Form data:', data);
            
            // For now, use mailto (temporary solution)
            const subject = encodeURIComponent('Poptávka VitalSpace - ' + data['space-type']);
            const body = encodeURIComponent(
                `Jméno: ${data.name}\n` +
                `Email: ${data.email}\n` +
                `Telefon: ${data.phone || 'Neuvedeno'}\n` +
                `Typ prostoru: ${data['space-type']}\n` +
                `Problémy: ${data.problem ? data.problem.join(', ') : 'Neuvedeno'}\n\n` +
                `Poznámka:\n${data.message || 'Žádná poznámka'}`
            );
            
            window.location.href = `mailto:info@vitalspace.cz?subject=${subject}&body=${body}`;
            
            // Show success message
            alert('Děkujeme za vaši poptávku! Brzy se vám ozveme.');
            contactForm.reset();
        });
    }

    // ==========================================================================
    // LANGUAGE SWITCHER
    // ==========================================================================
    const langButtons = document.querySelectorAll('.lang-btn');
    
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            
            // Update active state
            langButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // TODO: Implement language switching
            // For now, redirect to English version if exists
            if (lang === 'en') {
                const currentPage = window.location.pathname.split('/').pop();
                const enPage = currentPage.replace('.html', '-en.html');
                
                // Check if English version exists
                fetch(enPage, { method: 'HEAD' })
                    .then(response => {
                        if (response.ok) {
                            window.location.href = enPage;
                        } else {
                            alert('Anglická verze této stránky zatím není k dispozici.');
                        }
                    })
                    .catch(() => {
                        alert('Anglická verze této stránky zatím není k dispozici.');
                    });
            }
        });
    });

    // ==========================================================================
    // MOBILE MENU TOGGLE
    // ==========================================================================
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navPrimary = document.querySelector('.nav-primary');
    
    if (mobileMenuToggle && navPrimary) {
        mobileMenuToggle.addEventListener('click', () => {
            const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
            
            mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
            navPrimary.classList.toggle('mobile-active');
        });
    }

    // ==========================================================================
    // FORM INPUT ENHANCEMENTS
    // ==========================================================================
    
    // Auto-format phone number
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            
            // Format as +420 XXX XXX XXX
            if (value.startsWith('420')) {
                value = value.substring(3);
            }
            
            if (value.length > 0) {
                if (value.length <= 3) {
                    e.target.value = '+420 ' + value;
                } else if (value.length <= 6) {
                    e.target.value = '+420 ' + value.substring(0, 3) + ' ' + value.substring(3);
                } else {
                    e.target.value = '+420 ' + value.substring(0, 3) + ' ' + 
                                     value.substring(3, 6) + ' ' + value.substring(6, 9);
                }
            }
        });
    }

    // ==========================================================================
    // INTERSECTION OBSERVER - Animate on Scroll
    // ==========================================================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe cards and sections
    document.querySelectorAll('.card, .eco-card, .problem-card').forEach(el => {
        observer.observe(el);
    });

    // ==========================================================================
    // PERFORMANCE - Lazy Load Images
    // ==========================================================================
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }

    // ==========================================================================
    // ANALYTICS - Track Form Interactions (Placeholder)
    // ==========================================================================
    function trackEvent(category, action, label) {
        // TODO: Integrate with Google Analytics or Matomo
        console.log('Analytics Event:', { category, action, label });
        
        // Example for future GA4 integration:
        // gtag('event', action, {
        //     'event_category': category,
        //     'event_label': label
        // });
    }
    
    // Track CTA clicks
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.textContent.trim();
            trackEvent('CTA', 'click', text);
        });
    });
    
    // Track calculator usage
    if (roiForm) {
        roiForm.addEventListener('submit', () => {
            trackEvent('Calculator', 'submit', 'ROI Calculator');
        });
    }
    
    // Track contact form submission
    if (contactForm) {
        contactForm.addEventListener('submit', () => {
            trackEvent('Form', 'submit', 'Contact Form');
        });
    }

    // ==========================================================================
    // INITIALIZE LUCIDE ICONS
    // ==========================================================================
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ==========================================================================
    // CONSOLE MESSAGE - Developer Info
    // ==========================================================================
    console.log(
        '%c VitalSpace - MedTech Platform ',
        'background: #03A9F4; color: white; font-size: 16px; padding: 10px;'
    );
    console.log(
        '%c Čistý vzduch jako základ dlouhého a zdravého života ',
        'color: #1A237E; font-size: 14px;'
    );
    console.log('Version: 2.0 | Built: 2026');

})();

// ==========================================================================
// EXPORT FOR TESTING (if needed)
// ==========================================================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // Export functions for testing if needed
    };
}
