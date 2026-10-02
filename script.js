// Floating Hearts Animation
function createFloatingHearts() {
    const heroSection = document.getElementById('hero');
    if (!heroSection) return;

    const hearts = ['💕', '💗', '💖', '💝', '❤️'];

    setInterval(() => {
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        heart.innerText = hearts[Math.floor(Math.random() * hearts.length)];
        
        // Random properties
        const size = Math.random() * 25 + 15; // 15px to 40px
        const left = Math.random() * 100;
        const duration = Math.random() * 5 + 3; // 3 to 8 seconds

        heart.style.fontSize = `${size}px`;
        heart.style.left = `${left}%`;
        heart.style.animationDuration = `${duration}s`;
        
        // Basic styles in case CSS isn't fully set up yet
        heart.style.position = 'absolute';
        heart.style.bottom = '-50px';
        heart.style.opacity = '0.8';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '10';
        // Add animation via CSS: @keyframes floatUp { to { transform: translateY(-100vh); opacity: 0; } }
        heart.style.animation = `floatUp ${duration}s linear forwards`;
        
        heroSection.appendChild(heart);

        // Remove after animation completes
        setTimeout(() => {
            heart.remove();
        }, duration * 1000);
    }, 500);
}

// Scroll Animations (Intersection Observer)
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll('.photo-card, .note-card, .quiz-question, .video-card, .compliment-bubble, section h2');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
}

// Navigation Dots
function initNavDots() {
    const sections = document.querySelectorAll('section[id]');
    const navDots = document.querySelectorAll('.nav-dot');
    
    if (sections.length === 0 || navDots.length === 0) return;

    let timeout;
    window.addEventListener('scroll', () => {
        if (timeout) {
            window.cancelAnimationFrame(timeout);
        }
        
        timeout = window.requestAnimationFrame(() => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                    current = section.getAttribute('id');
                }
            });

            navDots.forEach(dot => {
                dot.classList.remove('active');
                if (dot.getAttribute('href') === `#${current}`) {
                    dot.classList.add('active');
                }
            });
        });
    });
}

// Photo Lightbox
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');
    const photoCards = document.querySelectorAll('.photo-card img');

    if (!lightbox || !lightboxImg) return;

    photoCards.forEach(img => {
        img.addEventListener('click', (e) => {
            lightboxImg.src = e.target.src;
            lightbox.classList.add('active');
        });
    });

    const closeLightbox = () => lightbox.classList.remove('active');

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

// Quiz System
let currentScore = 0;
let questionsAnswered = 0;

function initQuiz() {
    const quizContainer = document.getElementById('quiz-container');
    if (!quizContainer) return;
    
    if (typeof quizQuestions === 'undefined') {
        console.warn('quizQuestions array is not defined.');
        return;
    }

    quizQuestions.forEach((q, qIndex) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('quiz-question');
        
        const questionTitle = document.createElement('h3');
        questionTitle.innerText = `${qIndex + 1}. ${q.question}`;
        questionDiv.appendChild(questionTitle);
        
        const optionsDiv = document.createElement('div');
        optionsDiv.classList.add('quiz-options');
        
        q.options.forEach((opt, optIndex) => {
            const btn = document.createElement('button');
            btn.classList.add('quiz-option-btn');
            btn.innerText = opt;
            btn.addEventListener('click', () => selectAnswer(qIndex, optIndex, btn, optionsDiv));
            optionsDiv.appendChild(btn);
        });
        
        questionDiv.appendChild(optionsDiv);
        quizContainer.appendChild(questionDiv);
    });
}

function selectAnswer(questionIndex, selectedIndex, button, optionsContainer) {
    const allButtons = optionsContainer.querySelectorAll('.quiz-option-btn');
    const question = quizQuestions[questionIndex];
    
    // Disable all buttons in this question
    allButtons.forEach((btn) => {
        btn.disabled = true;
        btn.classList.add('disabled');
    });
    
    if (selectedIndex === question.correct) {
        button.classList.add('correct');
        currentScore++;
    } else {
        button.classList.add('wrong');
        allButtons[question.correct].classList.add('correct');
    }
    
    questionsAnswered++;
    
    if (questionsAnswered === quizQuestions.length) {
        setTimeout(showResults, 1000);
    }
}

function showResults() {
    const resultsDiv = document.getElementById('quiz-results');
    const scoreDisplay = document.getElementById('score-display');
    const messageDisplay = document.getElementById('quiz-message');
    
    if (!resultsDiv) return;
    
    resultsDiv.style.display = 'block';
    
    if (scoreDisplay) {
        scoreDisplay.innerText = `${currentScore} / ${quizQuestions.length}`;
    }
    
    const percentage = currentScore / quizQuestions.length;
    let message = '';
    
    if (percentage === 1) {
        message = '🎉 Perfect Score! You know us so well! 💕';
    } else if (percentage >= 0.7) {
        message = '😊 Amazing! You really pay attention! 💗';
    } else if (percentage > 0.4) {
        message = '💕 Not bad! We still have so much to learn about each other!';
    } else {
        message = '🤔 Hmm... looks like we need more date nights! 😄💕';
    }
    
    if (messageDisplay) {
        messageDisplay.innerText = message;
    }
    
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Love Button with Confetti
function initLoveButton() {
    const loveBtn = document.getElementById('love-btn');
    const loveSuccess = document.getElementById('love-success');
    
    if (!loveBtn || !loveSuccess) return;
    
    loveBtn.addEventListener('click', () => {
        loveBtn.style.transition = 'opacity 0.5s';
        loveBtn.style.opacity = '0';
        
        setTimeout(() => {
            loveBtn.style.display = 'none';
            loveSuccess.style.display = 'block';
            loveSuccess.style.opacity = '0';
            
            // Trigger reflow
            void loveSuccess.offsetWidth;
            
            loveSuccess.style.transition = 'opacity 0.5s';
            loveSuccess.style.opacity = '1';
            
            launchConfetti();
            sendNotification();
        }, 500);
    });
}

function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    // Ensure canvas matches window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const colors = ['#ff6b6b', '#fca5a5', '#fecdd3', '#fda4af', '#fcd34d', '#ffffff'];
    
    for (let i = 0; i < 150; i++) {
        particles.push({
            x: canvas.width / 2,
            y: canvas.height / 2 + 50,
            vx: (Math.random() - 0.5) * 15,
            vy: (Math.random() - 1) * 15 - 5,
            size: Math.random() * 8 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10
        });
    }
    
    let animationId;
    const gravity = 0.3;
    const wind = 0.05;
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        let activeParticles = 0;
        
        particles.forEach(p => {
            p.x += p.vx + wind;
            p.y += p.vy;
            p.vy += gravity;
            p.rotation += p.rotationSpeed;
            
            if (p.y < canvas.height + 20) {
                activeParticles++;
                
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation * Math.PI / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();
            }
        });
        
        if (activeParticles > 0) {
            animationId = requestAnimationFrame(animate);
        } else {
            cancelAnimationFrame(animationId);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    
    animate();
    
    // Stop after ~5 seconds
    setTimeout(() => {
        cancelAnimationFrame(animationId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 5000);
}

// EmailJS Notification
function sendNotification() {
    try {
        if (typeof emailjs === 'undefined') {
            console.warn('EmailJS SDK not found. Skipping notification.');
            return;
        }

        // TO SET UP EMAIL NOTIFICATIONS:
        // 1. Go to https://www.emailjs.com/ and create a free account
        // 2. Create an email service (connect your Gmail)
        // 3. Create an email template with a message like 'He clicked the love button!'
        // 4. Replace the IDs below with your own:
        const SERVICE_ID = 'YOUR_SERVICE_ID';
        const TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
        const PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
        
        const templateParams = {
            message: 'Your boyfriend clicked the Love button! He loves the website! 💕',
            timestamp: new Date().toLocaleString()
        };

        emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
            .then(() => {
                console.log('Notification sent successfully!');
            })
            .catch((err) => {
                console.error('Failed to send notification. Check EmailJS configuration:', err);
            });
            
    } catch (error) {
        console.error('Error sending notification:', error);
    }
}

// Smooth Scroll for Anchor Links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
    createFloatingHearts();
    initQuiz();
    initScrollAnimations();
    initNavDots();
    initLightbox();
    initLoveButton();
    initSmoothScroll();
    
    // Initialize Lucide icons if available
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});
