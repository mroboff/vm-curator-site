// Copy to clipboard functionality
class ClipboardManager {
    static async copyText(text) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                return true;
            } else {
                // Fallback for older browsers or non-HTTPS
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                
                try {
                    document.execCommand('copy');
                    textArea.remove();
                    return true;
                } catch (error) {
                    console.error('Fallback copy failed:', error);
                    textArea.remove();
                    return false;
                }
            }
        } catch (error) {
            console.error('Copy failed:', error);
            return false;
        }
    }
    
    static showFeedback(button, success = true) {
        const originalText = button.textContent;
        button.textContent = success ? 'Copied!' : 'Failed';
        button.style.background = success ? '#28a745' : '#dc3545';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    }
}

// Screenshot Gallery functionality
class ScreenshotGallery {
    static init() {
        // Make showImage function available globally
        window.showImage = this.showImage.bind(this);
    }
    
    static showImage(imageSrc, caption) {
        const mainImage = document.getElementById('gallery-main-image');
        const captionElement = document.getElementById('gallery-caption');
        const thumbnails = document.querySelectorAll('.gallery-thumbnail');
        
        if (mainImage && captionElement) {
            // Fade out effect
            mainImage.style.opacity = '0.5';
            
            setTimeout(() => {
                mainImage.src = imageSrc;
                mainImage.alt = caption;
                captionElement.textContent = caption;
                
                // Update active thumbnail
                thumbnails.forEach(thumb => {
                    thumb.classList.remove('active');
                    const thumbImg = thumb.querySelector('img');
                    if (thumbImg && thumbImg.src.includes(imageSrc.split('/').pop())) {
                        thumb.classList.add('active');
                    }
                });
                
                // Fade in effect
                mainImage.style.opacity = '1';
            }, 150);
        }
    }
    
    static addKeyboardNavigation() {
        const thumbnails = Array.from(document.querySelectorAll('.gallery-thumbnail'));
        let currentIndex = 0;
        
        document.addEventListener('keydown', (e) => {
            const activeElement = document.activeElement;
            if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
                return;
            }
            
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.preventDefault();
                
                if (e.key === 'ArrowLeft') {
                    currentIndex = currentIndex > 0 ? currentIndex - 1 : thumbnails.length - 1;
                } else {
                    currentIndex = currentIndex < thumbnails.length - 1 ? currentIndex + 1 : 0;
                }
                
                thumbnails[currentIndex].click();
            }
        });
    }
}

// Smooth scroll for navigation links
class SmoothScroll {
    static init() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Header scroll effect
class HeaderEffects {
    static init() {
        const header = document.querySelector('.header');
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // Add/remove scrolled class for styling
            if (currentScrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Hide/show header on scroll direction change
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
        });
    }
}

// Intersection Observer for animations
class AnimationTriggers {
    static init() {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe animated elements
        const animatedElements = document.querySelectorAll(`
            .feature-card, 
            .community-card, 
            .install-method, 
            .positioning-card, 
            .gpu-mode,
            .prereq-item,
            .quickstart-step
        `);
        
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }
}

// Performance and loading optimizations
class Performance {
    static init() {
        // Lazy load images
        this.lazyLoadImages();
        
        // Preload critical images
        this.preloadCriticalImages();
        
        // Monitor performance
        this.monitorPerformance();
    }
    
    static lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    static preloadCriticalImages() {
        const criticalImages = [
            'images/vm-curator-main.png',
            'images/vm-curator-single-gpu.png'
        ];
        
        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }
    
    static monitorPerformance() {
        window.addEventListener('load', () => {
            if ('performance' in window) {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('🚀 vm-curator site performance:');
                console.log(`📡 DNS lookup: ${Math.round(perfData.domainLookupEnd - perfData.domainLookupStart)}ms`);
                console.log(`🔗 Connection: ${Math.round(perfData.connectEnd - perfData.connectStart)}ms`);
                console.log(`📄 DOM ready: ${Math.round(perfData.domContentLoadedEventEnd - perfData.navigationStart)}ms`);
                console.log(`✅ Full load: ${Math.round(perfData.loadEventEnd - perfData.navigationStart)}ms`);
            }
        });
    }
}

// Enhanced keyboard shortcuts
class KeyboardShortcuts {
    static init() {
        document.addEventListener('keydown', (e) => {
            const activeElement = document.activeElement;
            if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
                return;
            }
            
            switch (e.key.toLowerCase()) {
                case 'g':
                    if (!e.ctrlKey && !e.altKey && !e.metaKey) {
                        window.open('https://github.com/mroboff/vm-curator', '_blank');
                    }
                    break;
                    
                case 'i':
                    if (!e.ctrlKey && !e.altKey && !e.metaKey) {
                        document.getElementById('install')?.scrollIntoView({ behavior: 'smooth' });
                    }
                    break;
                    
                case 'f':
                    if (!e.ctrlKey && !e.altKey && !e.metaKey) {
                        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                    }
                    break;
                    
                case 'p':
                    if (!e.ctrlKey && !e.altKey && !e.metaKey) {
                        document.getElementById('gpu')?.scrollIntoView({ behavior: 'smooth' });
                    }
                    break;
                    
                case 's':
                    if (!e.ctrlKey && !e.altKey && !e.metaKey) {
                        document.getElementById('screenshots')?.scrollIntoView({ behavior: 'smooth' });
                    }
                    break;
            }
        });
    }
}

// Easter eggs and fun features
class EasterEggs {
    static init() {
        this.initKonamiCode();
        this.initSecretCommands();
    }
    
    static initKonamiCode() {
        let konamiCode = [];
        const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
        
        document.addEventListener('keydown', (e) => {
            konamiCode.push(e.code);
            konamiCode = konamiCode.slice(-konamiSequence.length);
            
            if (konamiCode.join(',') === konamiSequence.join(',')) {
                this.showKonamiEasterEgg();
            }
        });
    }
    
    static initSecretCommands() {
        // Type "gpu" to jump to GPU section with flashy animation
        let typedSequence = '';
        
        document.addEventListener('keydown', (e) => {
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
                return;
            }
            
            typedSequence += e.key.toLowerCase();
            typedSequence = typedSequence.slice(-10); // Keep last 10 characters
            
            if (typedSequence.includes('gpu')) {
                this.flashyGpuJump();
                typedSequence = '';
            }
            
            if (typedSequence.includes('virt-manager')) {
                this.showVirtManagerJoke();
                typedSequence = '';
            }
        });
    }
    
    static showKonamiEasterEgg() {
        const easterEgg = document.createElement('div');
        easterEgg.innerHTML = `
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                        background: #0d1117; border: 2px solid #58a6ff; border-radius: 12px; 
                        padding: 2rem; z-index: 10000; text-align: center; font-family: 'JetBrains Mono', monospace;
                        box-shadow: 0 20px 60px rgba(88, 166, 255, 0.3);">
                <pre style="color: #58a6ff; margin: 0; font-size: 0.9rem;">
    ╔══════════════════════════════════════╗
    ║              vm-curator              ║
    ║          🎮 KONAMI CODE! 🎮          ║
    ║                                      ║
    ║     You found the secret command!    ║
    ║                                      ║
    ║   GPU passthrough achievement        ║
    ║         🏆 UNLOCKED! 🏆             ║
    ║                                      ║
    ║       Press ESC or click to quit     ║
    ╚══════════════════════════════════════╝
                </pre>
            </div>
        `;
        
        document.body.appendChild(easterEgg);
        
        const closeHandler = (e) => {
            if (e.key === 'Escape' || e.type === 'click') {
                document.body.removeChild(easterEgg);
                document.removeEventListener('keydown', closeHandler);
                document.removeEventListener('click', closeHandler);
            }
        };
        
        setTimeout(() => {
            document.addEventListener('keydown', closeHandler);
            document.addEventListener('click', closeHandler);
        }, 100);
    }
    
    static flashyGpuJump() {
        const gpuSection = document.getElementById('gpu');
        if (gpuSection) {
            // Add flashy border animation
            gpuSection.style.border = '3px solid #58a6ff';
            gpuSection.style.borderRadius = '16px';
            gpuSection.style.animation = 'pulse 0.5s ease-in-out 3';
            
            gpuSection.scrollIntoView({ behavior: 'smooth' });
            
            setTimeout(() => {
                gpuSection.style.border = '';
                gpuSection.style.animation = '';
            }, 2000);
        }
    }
    
    static showVirtManagerJoke() {
        const joke = document.createElement('div');
        joke.innerHTML = `
            <div style="position: fixed; bottom: 2rem; right: 2rem; 
                        background: linear-gradient(135deg, #58a6ff 0%, #7c3aed 100%); 
                        color: white; padding: 1rem 1.5rem; border-radius: 8px; 
                        z-index: 10000; font-family: 'Inter', sans-serif; 
                        box-shadow: 0 10px 30px rgba(88, 166, 255, 0.3);
                        animation: slideInRight 0.3s ease-out;">
                <strong>🔍 virt-manager detected!</strong><br>
                <span style="font-size: 0.9rem;">Consider trying vm-curator! 😉</span>
            </div>
        `;
        
        document.body.appendChild(joke);
        
        setTimeout(() => {
            joke.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => document.body.removeChild(joke), 300);
        }, 3000);
    }
}

// Add pulse animation for easter egg
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes pulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(88, 166, 255, 0.4); }
        50% { box-shadow: 0 0 0 20px rgba(88, 166, 255, 0); }
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .animate-in {
        animation: slideInUp 0.6s ease-out;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    /* Gallery image transition */
    .gallery-main-image {
        transition: opacity 0.3s ease;
    }
    
    /* Enhanced button hover effects */
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .btn::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        transition: width 0.6s, height 0.6s;
    }
    
    .btn:hover::before {
        width: 300px;
        height: 300px;
    }
    
    /* Smooth header transition */
    .header {
        transition: transform 0.3s ease, background 0.3s ease;
    }
`;

document.head.appendChild(additionalStyles);

// Main initialization
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    ScreenshotGallery.init();
    SmoothScroll.init();
    HeaderEffects.init();
    AnimationTriggers.init();
    Performance.init();
    KeyboardShortcuts.init();
    EasterEggs.init();
    
    // Initialize copy buttons
    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            const textToCopy = button.getAttribute('data-clipboard-text');
            const success = await ClipboardManager.copyText(textToCopy);
            ClipboardManager.showFeedback(button, success);
        });
    });
    
    // Add keyboard navigation to gallery
    ScreenshotGallery.addKeyboardNavigation();
    
    // Add loading animation to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            if (!this.classList.contains('loading')) {
                this.classList.add('loading');
                setTimeout(() => this.classList.remove('loading'), 1000);
            }
        });
    });
});

// Console message for developers
console.log(`
╔══════════════════════════════════════════════════════════╗
║                      vm-curator                          ║
║         The Desktop VM Manager That Doesn't Suck        ║
║                                                          ║
║  🎯 GPU Passthrough | 🚀 Direct QEMU | ⚡ No libvirt   ║
║                                                          ║
║  Keyboard shortcuts:                                     ║
║  • G - GitHub repo        • I - Install section         ║
║  • F - Features          • P - GPU passthrough          ║
║  • S - Screenshots       • ← → - Navigate gallery       ║
║  • Try typing "gpu" or the Konami code! ⬆⬆⬇⬇⬅➡⬅➡BA    ║
║                                                          ║
║  Found a bug? Want to contribute?                        ║
║  → https://github.com/mroboff/vm-curator                 ║
╚══════════════════════════════════════════════════════════╝
`);

// Export for global access
window.vm_curator = {
    gallery: ScreenshotGallery,
    clipboard: ClipboardManager,
    performance: Performance
};