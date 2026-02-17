import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { 
  FileText, 
  Download, 
  Search, 
  ZoomIn, 
  ZoomOut,
  WrapText,
  Lightbulb
} from 'lucide-react';
import { ComponentData } from '../App';

interface CodeEditorProps {
  components: ComponentData[];
  activeTab: 'html' | 'css' | 'js';
  isLiveSync: boolean;
}

export function CodeEditor({ components, activeTab, isLiveSync }: CodeEditorProps) {
  const [fontSize, setFontSize] = useState(14);
  const [wordWrap, setWordWrap] = useState(true);
  const [highlightedLines, setHighlightedLines] = useState<number[]>([]);

  // Generate code based on active tab
  const generateCode = () => {
    switch (activeTab) {
      case 'html':
        return generateHTML();
      case 'css':
        return generateCSS();
      case 'js':
        return generateJS();
      default:
        return '';
    }
  };

  const generateHTML = () => {
    const componentToHTML = (component: ComponentData, indent = 0): string => {
      const { type, props, style } = component;
      const indentStr = '  '.repeat(indent);
      const styleString = style && Object.keys(style).length > 0 
        ? ` style="${Object.entries(style).map(([key, value]) => `${key}: ${value}`).join('; ')}"` 
        : '';
      
      switch (type) {
        case 'text':
          return `${indentStr}<p${styleString} class="text-component">\n${indentStr}  ${props.content || 'Sample Text'}\n${indentStr}</p>`;
        
        case 'heading':
          return `${indentStr}<h${props.level || 1}${styleString} class="heading-component">\n${indentStr}  ${props.content || 'Heading'}\n${indentStr}</h${props.level || 1}>`;
        
        case 'button':
          return `${indentStr}<button${styleString} class="btn btn-${props.variant || 'default'}" type="button">\n${indentStr}  ${props.text || 'Button'}\n${indentStr}</button>`;
        
        case 'image':
          return `${indentStr}<img\n${indentStr}  src="${props.src || 'https://via.placeholder.com/300x200'}"\n${indentStr}  alt="${props.alt || 'Image'}"\n${indentStr}  width="${props.width || 300}"\n${indentStr}  height="${props.height || 200}"\n${indentStr}  class="image-component"${styleString}\n${indentStr}/>`;
        
        case 'container':
          return `${indentStr}<div${styleString} class="container-component">\n${indentStr}  <!-- Container content -->\n${indentStr}  <p>Drop components here</p>\n${indentStr}</div>`;
        
        case 'navbar':
          const links = (props.links || ['Home', 'About', 'Contact']).map((link: string) => 
            `${indentStr}      <a href="#${link.toLowerCase()}" class="nav-link">${link}</a>`
          ).join('\n');
          return `${indentStr}<nav${styleString} class="navbar-component">\n${indentStr}  <div class="nav-container">\n${indentStr}    <div class="nav-brand">${props.brand || 'Brand'}</div>\n${indentStr}    <div class="nav-links">\n${links}\n${indentStr}    </div>\n${indentStr}  </div>\n${indentStr}</nav>`;
        
        case 'hero':
          return `${indentStr}<section${styleString} class="hero-component">\n${indentStr}  <div class="hero-content">\n${indentStr}    <h1 class="hero-title">${props.title || 'Welcome'}</h1>\n${indentStr}    <p class="hero-subtitle">${props.subtitle || 'Build amazing websites'}</p>\n${indentStr}    <button class="btn btn-primary">Get Started</button>\n${indentStr}  </div>\n${indentStr}</section>`;
        
        case 'footer':
          return `${indentStr}<footer${styleString} class="footer-component">\n${indentStr}  <div class="footer-content">\n${indentStr}    <p>${props.copyright || '© 2024 Your Company'}</p>\n${indentStr}  </div>\n${indentStr}</footer>`;
        
        case 'input':
          return `${indentStr}<input\n${indentStr}  type="${props.type || 'text'}"\n${indentStr}  placeholder="${props.placeholder || 'Enter text...'}"\n${indentStr}  class="input-component"${styleString}\n${indentStr}/>`;
        
        case 'textarea':
          return `${indentStr}<textarea\n${indentStr}  placeholder="${props.placeholder || 'Enter message...'}"\n${indentStr}  class="textarea-component"${styleString}\n${indentStr}></textarea>`;
        
        case 'form':
          return `${indentStr}<form${styleString} class="form-component">\n${indentStr}  <div class="form-header">\n${indentStr}    <h3>${props.title || 'Contact Form'}</h3>\n${indentStr}  </div>\n${indentStr}  <div class="form-body">\n${indentStr}    <input type="text" placeholder="Name" class="form-input" required>\n${indentStr}    <input type="email" placeholder="Email" class="form-input" required>\n${indentStr}    <textarea placeholder="Message" class="form-textarea" required></textarea>\n${indentStr}    <button type="submit" class="btn btn-primary">Submit</button>\n${indentStr}  </div>\n${indentStr}</form>`;
        
        case 'grid':
          const gridItems = Array.from({ length: props.columns || 3 }).map((_, index) => 
            `${indentStr}    <div class="grid-item">\n${indentStr}      <p>Grid Item ${index + 1}</p>\n${indentStr}    </div>`
          ).join('\n');
          return `${indentStr}<div${styleString} class="grid-component grid-cols-${props.columns || 3}">\n${gridItems}\n${indentStr}</div>`;
        
        default:
          return `${indentStr}<div${styleString} class="unknown-component">\n${indentStr}  <!-- Unknown component type: ${type} -->\n${indentStr}</div>`;
      }
    };

    const htmlContent = components.map(comp => componentToHTML(comp, 2)).join('\n\n');
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Website - FullDev AI</title>
  <link rel="stylesheet" href="styles.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
  <div id="app" class="app-container">
${htmlContent || '    <!-- No components added yet -->'}
  </div>
  
  <script src="script.js"></script>
</body>
</html>`;
  };

  const generateCSS = () => {
    return `/* Generated CSS - FullDev AI Website Builder */

/* === RESET & BASE STYLES === */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: #1f2937;
  background-color: #ffffff;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* === COMPONENT STYLES === */

/* Text Components */
.text-component {
  margin-bottom: 1rem;
  color: inherit;
}

.heading-component {
  margin-bottom: 1.5rem;
  font-weight: 600;
  line-height: 1.3;
}

.heading-component:is(h1) { font-size: 2.5rem; }
.heading-component:is(h2) { font-size: 2rem; }
.heading-component:is(h3) { font-size: 1.75rem; }
.heading-component:is(h4) { font-size: 1.5rem; }
.heading-component:is(h5) { font-size: 1.25rem; }
.heading-component:is(h6) { font-size: 1.125rem; }

/* Button Components */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  min-height: 44px; /* Touch target size */
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
  transform: translateY(-1px);
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background-color: #e5e7eb;
}

.btn-outline {
  background-color: transparent;
  color: #3b82f6;
  border: 2px solid #3b82f6;
}

.btn-outline:hover {
  background-color: #3b82f6;
  color: white;
}

/* Image Components */
.image-component {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Container Components */
.container-component {
  padding: 2rem;
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
  background-color: #f9fafb;
  text-align: center;
  color: #6b7280;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Navigation Components */
.navbar-component {
  background-color: #1f2937;
  color: white;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-link {
  color: #d1d5db;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
}

.nav-link:hover {
  color: white;
  background-color: rgba(255, 255, 255, 0.1);
}

/* Hero Components */
.hero-component {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-component::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: 2.5rem;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* Footer Components */
.footer-component {
  background-color: #374151;
  color: white;
  padding: 3rem 2rem 2rem;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

/* Form Components */
.input-component,
.textarea-component,
.form-input,
.form-textarea {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  background-color: white;
}

.input-component:focus,
.textarea-component:focus,
.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-component {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.form-header h3 {
  margin-bottom: 1.5rem;
  color: #1f2937;
}

.form-body {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-textarea {
  min-height: 120px;
  resize: vertical;
}

/* Grid Components */
.grid-component {
  display: grid;
  gap: 1.5rem;
  padding: 2rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  margin: 2rem 0;
}

.grid-cols-1 { grid-template-columns: 1fr; }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
.grid-cols-5 { grid-template-columns: repeat(5, 1fr); }
.grid-cols-6 { grid-template-columns: repeat(6, 1fr); }

.grid-item {
  background: white;
  padding: 2rem 1.5rem;
  border-radius: 0.75rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

.grid-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* === RESPONSIVE DESIGN === */
@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-links {
    gap: 1rem;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-component {
    padding: 4rem 1rem;
  }
  
  .grid-cols-2,
  .grid-cols-3,
  .grid-cols-4,
  .grid-cols-5,
  .grid-cols-6 {
    grid-template-columns: 1fr;
  }
  
  .form-component {
    margin: 1rem;
    padding: 1.5rem;
  }
  
  .btn {
    padding: 1rem 1.5rem;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
  
  .nav-brand {
    font-size: 1.25rem;
  }
}

/* === UTILITY CLASSES === */
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }
.mt-4 { margin-top: 1rem; }
.mb-4 { margin-bottom: 1rem; }
.p-4 { padding: 1rem; }

/* === ANIMATIONS === */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}`;
  };

  const generateJS = () => {
    return `// Generated JavaScript - FullDev AI Website Builder
// This file contains interactive functionality for your website

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 FullDev AI website loaded successfully!');
    
    // Initialize all interactive components
    initializeNavigation();
    initializeForms();
    initializeButtons();
    initializeAnimations();
    initializeAccessibility();
    
    console.log('✅ All components initialized');
});

// === NAVIGATION FUNCTIONALITY ===
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Handle internal links (starting with #)
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
            
            // Add active state
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Highlight current section on scroll
    window.addEventListener('scroll', debounce(updateActiveNavLink, 100));
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id], div[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let currentSection = '';
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = section.id;
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + currentSection) {
            link.classList.add('active');
        }
    });
}

// === FORM FUNCTIONALITY ===
function initializeForms() {
    const forms = document.querySelectorAll('.form-component, form');
    
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
        
        // Add real-time validation
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearValidationError);
        });
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Validate form
    if (!validateForm(form)) {
        showNotification('Please fix the errors and try again.', 'error');
        return;
    }
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        console.log('Form submitted:', data);
        showNotification('Message sent successfully!', 'success');
        form.reset();
        
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 1500);
}

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    
    inputs.forEach(input => {
        if (!validateField({ target: input })) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    let isValid = true;
    
    // Remove previous error styling
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        isValid = false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            isValid = false;
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\\+]?[1-9]?[0-9]{7,12}$/;
        if (!phoneRegex.test(value.replace(/\\s/g, ''))) {
            showFieldError(field, 'Please enter a valid phone number');
            isValid = false;
        }
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    field.parentNode.appendChild(errorElement);
}

function clearValidationError(e) {
    const field = e.target;
    field.classList.remove('error');
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// === BUTTON FUNCTIONALITY ===
function initializeButtons() {
    const buttons = document.querySelectorAll('.btn:not([type="submit"])');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const buttonText = this.textContent;
            console.log('Button clicked:', buttonText);
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Handle specific button actions
            if (buttonText.toLowerCase().includes('get started')) {
                scrollToSection('contact') || showNotification('Ready to get started!', 'info');
            } else if (buttonText.toLowerCase().includes('learn more')) {
                scrollToSection('about') || showNotification('More information coming soon!', 'info');
            }
        });
    });
}

// === ANIMATIONS ===
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all components for animation
    const animatableElements = document.querySelectorAll(
        '.text-component, .heading-component, .btn, .form-component, .grid-item, .image-component'
    );
    
    animatableElements.forEach(el => {
        observer.observe(el);
    });
}

// === ACCESSIBILITY ===
function initializeAccessibility() {
    // Add keyboard navigation for custom elements
    const interactiveElements = document.querySelectorAll('.btn, .nav-link');
    
    interactiveElements.forEach(element => {
        element.setAttribute('tabindex', '0');
        
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Add skip link for keyboard users
    if (!document.querySelector('.skip-link')) {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = 'position: absolute; top: -40px; left: 6px; background: #000; color: #fff; padding: 8px; text-decoration: none; z-index: 1000;';
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
}

// === UTILITY FUNCTIONS ===
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = \`notification notification-\${type}\`;
    notification.textContent = message;
    
    // Styles
    const bgColors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    
    notification.style.cssText = \`
        position: fixed;
        top: 20px;
        right: 20px;
        background: \${bgColors[type] || bgColors.info};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        font-weight: 500;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease-in-out;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    \`;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        return true;
    }
    return false;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// === ERROR HANDLING ===
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    showNotification('An error occurred. Please refresh the page if issues persist.', 'error');
});

// === PERFORMANCE MONITORING ===
window.addEventListener('load', function() {
    // Log performance metrics
    const navigation = performance.getEntriesByType('navigation')[0];
    const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
    console.log(\`Page loaded in \${loadTime}ms\`);
});

// Export functions for external use
window.FullDevAI = {
    showNotification,
    scrollToSection,
    validateForm
};`;
  };

  const [code, setCode] = useState('');

  useEffect(() => {
    if (isLiveSync) {
      setCode(generateCode());
    }
  }, [components, activeTab, isLiveSync]);

  const downloadCode = () => {
    const extensions = { html: 'html', css: 'css', js: 'js' };
    const filename = `fulldev-ai-${activeTab}.${extensions[activeTab]}`;
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getLanguageColor = () => {
    switch (activeTab) {
      case 'html': return 'text-orange-400';
      case 'css': return 'text-blue-400';
      case 'js': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getLanguageIcon = () => {
    switch (activeTab) {
      case 'html': return '🌐';
      case 'css': return '🎨';
      case 'js': return '⚡';
      default: return '📄';
    }
  };

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Code Editor Header */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/30">
        <div className="flex items-center gap-3">
          <span className="text-lg">{getLanguageIcon()}</span>
          <div>
            <h4 className="font-medium">{activeTab.toUpperCase()} Source</h4>
            <p className="text-xs text-muted-foreground">
              {isLiveSync ? 'Live sync enabled' : 'Manual sync'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {code.split('\n').length} lines
          </Badge>
          
          <Button variant="outline" size="sm" onClick={downloadCode}>
            <Download className="w-4 h-4 mr-1" />
            Save
          </Button>
        </div>
      </div>

      {/* Code Editor Controls */}
      <div className="flex items-center justify-between p-2 border-b bg-background/50">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFontSize(Math.max(10, fontSize - 1))}
          >
            <ZoomOut className="w-3 h-3" />
          </Button>
          <span className="text-xs text-muted-foreground min-w-[3rem] text-center">
            {fontSize}px
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFontSize(Math.min(24, fontSize + 1))}
          >
            <ZoomIn className="w-3 h-3" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={wordWrap ? 'default' : 'outline'}
            size="sm"
            onClick={() => setWordWrap(!wordWrap)}
          >
            <WrapText className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Code Content */}
      <ScrollArea className="flex-1">
        <div className="code-editor-content">
          <pre 
            className={`p-4 text-sm font-mono leading-relaxed ${getLanguageColor()} bg-gray-900 text-gray-100 min-h-full`}
            style={{ 
              fontSize: `${fontSize}px`,
              whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
              wordBreak: wordWrap ? 'break-word' : 'normal'
            }}
          >
            <code>{code || `// No ${activeTab.toUpperCase()} code generated yet\n// Add components to the canvas to see generated code`}</code>
          </pre>
        </div>
      </ScrollArea>

      {/* Code Stats */}
      <div className="p-2 border-t bg-muted/30 text-xs text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>
            {code.length} characters • {code.split('\n').length} lines • {components.length} components
          </span>
          {isLiveSync && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Live</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
