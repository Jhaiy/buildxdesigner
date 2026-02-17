/**
 * Enhanced Code Generator - Generates complete, runnable HTML/CSS/JS from design components
 * Ensures exported code matches the design panel exactly
 */

import type { ComponentData } from "../App"
import { generateFullDesignCSS } from "./designToCSS"

/**
 * Generate complete HTML from components with proper structure
 */
export const generateEnhancedHTMLCode = (components: ComponentData[], projectName: string): string => {
  const componentHTML = components.map((comp) => generateComponentHTML(comp)).join("\n")

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName}</title>
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
  <div class="page-wrapper">
    ${componentHTML}
  </div>

  <script src="js/main.js"></script>
  <script src="js/interactions.js"></script>
</body>
</html>`
}

/**
 * Generate HTML for individual component with design styles
 */
const generateComponentHTML = (component: ComponentData): string => {
  const { type, props, style, id, children } = component

  // Build inline styles from design panel properties
  const inlineStyles = buildInlineStyles(style)
  const dataAttrs = `data-component-id="${id}" data-component-type="${type}"`
  const className = props?.className ? `class="${props.className}"` : ""

  let html = ""

  switch (type) {
    case "container":
    case "group":
      const childrenHTML =
        children && children.length > 0 ? children.map((child) => generateComponentHTML(child)).join("\n") : ""
      html = `<div ${dataAttrs} ${className} style="${inlineStyles}">
  ${childrenHTML}
</div>`
      break

    case "text":
      const textContent = escapeHTML(props?.content || "Sample text")
      html = `<p ${dataAttrs} ${className} style="${inlineStyles}">${textContent}</p>`
      break

    case "heading":
      const level = props?.level || 1
      const headingContent = escapeHTML(props?.content || "Heading")
      const headingTag = `h${level}`
      html = `<${headingTag} ${dataAttrs} ${className} style="${inlineStyles}">${headingContent}</${headingTag}>`
      break

    case "button":
      const buttonText = escapeHTML(props?.text || "Click me")
      const buttonType = props?.type || "button"
      html = `<button ${dataAttrs} type="${buttonType}" ${className} style="${inlineStyles}">
  ${buttonText}
</button>`
      break

    case "image":
      const imageSrc = props?.src || "/placeholder.svg"
      const imageAlt = escapeHTML(props?.alt || "Image")
      html = `<img ${dataAttrs} src="${imageSrc}" alt="${imageAlt}" ${className} style="${inlineStyles}" />`
      break

    case "input":
      const inputType = props?.inputType || "text"
      const placeholder = escapeHTML(props?.placeholder || "Enter text")
      html = `<input ${dataAttrs} type="${inputType}" placeholder="${placeholder}" ${className} style="${inlineStyles}" />`
      break

    case "textarea":
      const textareaPlaceholder = escapeHTML(props?.placeholder || "Enter text here")
      html = `<textarea ${dataAttrs} placeholder="${textareaPlaceholder}" ${className} style="${inlineStyles}"></textarea>`
      break

    case "card":
      const cardTitle = escapeHTML(props?.title || "Card Title")
      const cardDescription = escapeHTML(props?.description || "Card description goes here")
      const cardChildrenHTML =
        children && children.length > 0 ? children.map((child) => generateComponentHTML(child)).join("\n") : ""
      html = `<div ${dataAttrs} class="card ${className}" style="${inlineStyles}">
  <h3>${cardTitle}</h3>
  <p>${cardDescription}</p>
  ${cardChildrenHTML}
</div>`
      break

    case "navbar":
      const navBrand = escapeHTML(props?.brand || "Logo")
      const navLinksHTML = (props?.links || [])
        .map((link: any) => `<li><a href="${escapeHTML(link.href || "#")}">${escapeHTML(link.label)}</a></li>`)
        .join("")
      html = `<nav ${dataAttrs} class="navbar ${className}" style="${inlineStyles}">
  <div class="navbar-brand">${navBrand}</div>
  <ul class="navbar-links">
    ${navLinksHTML}
  </ul>
</nav>`
      break

    case "grid":
      const gridChildrenHTML =
        children && children.length > 0 ? children.map((child) => generateComponentHTML(child)).join("\n") : ""
      html = `<div ${dataAttrs} class="grid ${className}" style="${inlineStyles}">
  ${gridChildrenHTML}
</div>`
      break

    default:
      // Generic component fallback
      const fallbackChildrenHTML =
        children && children.length > 0 ? children.map((child) => generateComponentHTML(child)).join("\n") : ""
      html = `<div ${dataAttrs} class="component-${type} ${className}" style="${inlineStyles}">
  ${fallbackChildrenHTML}
</div>`
  }

  return html
}

/**
 * Build inline styles from component style object
 */
const buildInlineStyles = (style: Record<string, any> | undefined): string => {
  if (!style || Object.keys(style).length === 0) return ""

  return Object.entries(style)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => {
      const cssKey = camelToKebab(key)
      const cssValue = formatCSSValue(value)
      return `${cssKey}: ${cssValue}`
    })
    .join("; ")
}

/**
 * Convert camelCase to kebab-case
 */
const camelToKebab = (str: string): string => {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
}

/**
 * Format CSS value with proper units
 */
const formatCSSValue = (value: any): string => {
  if (value === null || value === undefined || value === "") return ""

  if (typeof value === "number") {
    return value > 0 && value < 10000 ? `${value}px` : String(value)
  }

  const str = String(value).trim()

  // Already has units or is valid CSS
  if (
    str.includes("px") ||
    str.includes("%") ||
    str.includes("rem") ||
    str.includes("em") ||
    str.includes("rgba") ||
    str.includes("rgb") ||
    str.includes("gradient") ||
    str.includes("transparent") ||
    str.includes("inherit") ||
    str.includes("auto") ||
    str.includes("none") ||
    str.includes("flex") ||
    str.includes("grid") ||
    str.includes("block") ||
    str.includes("inline") ||
    str.includes("absolute") ||
    str.includes("relative")
  ) {
    return str
  }

  return str
}

/**
 * Escape HTML special characters
 */
const escapeHTML = (text: string): string => {
  const div = document.createElement("div")
  div.textContent = text
  return div.innerHTML
}

/**
 * Generate comprehensive CSS from components
 */
export const generateEnhancedCSSCode = (components: ComponentData[], projectName: string): string => {
  return generateFullDesignCSS(components, projectName)
}

/**
 * Generate JavaScript for interactivity
 */
export const generateEnhancedJSCode = (components: ComponentData[]): string => {
  return `/**
 * Main JavaScript File - Auto-generated from FullDev AI Web Builder
 * Handles all interactive functionality
 */

(function() {
  'use strict';

  // Wait for DOM to load
  document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded and ready');
    
    // Initialize all components
    initializeComponents();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize smooth scrolling
    initializeSmoothScroll();
  });

  /**
   * Initialize components with their event handlers
   */
  function initializeComponents() {
    const components = document.querySelectorAll('[data-component-id]');
    
    components.forEach(component => {
      const componentType = component.getAttribute('data-component-type');
      const componentId = component.getAttribute('data-component-id');
      
      console.log('Initializing component:', componentType, componentId);
      
      // Set up specific component handlers based on type
      switch(componentType) {
        case 'button':
          setupButtonHandlers(component);
          break;
        case 'input':
          setupInputHandlers(component);
          break;
        case 'navbar':
          setupNavbarHandlers(component);
          break;
      }
    });
  }

  /**
   * Setup button event handlers
   */
  function setupButtonHandlers(button) {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Button clicked');
    });

    button.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
    });

    button.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  }

  /**
   * Setup input event handlers
   */
  function setupInputHandlers(input) {
    input.addEventListener('focus', function() {
      this.style.borderColor = '#2563eb';
      this.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
    });

    input.addEventListener('blur', function() {
      this.style.borderColor = '#d1d5db';
      this.style.boxShadow = 'none';
    });
  }

  /**
   * Setup navbar event handlers
   */
  function setupNavbarHandlers(navbar) {
    const links = navbar.querySelectorAll('a');
    
    links.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && href !== '#') {
          console.log('Navigation to:', href);
        }
      });
    });
  }

  /**
   * Setup general event listeners
   */
  function setupEventListeners() {
    // Handle scroll to element events
    window.addEventListener('scrollToElement', function(e) {
      const elementId = e.detail?.elementId;
      if (elementId) {
        const element = document.getElementById(elementId) || 
                       document.querySelector('[data-component-id="' + elementId + '"]');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }

  /**
   * Initialize smooth scrolling for anchor links
   */
  function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && href !== '#') {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });
  }

  // Expose global utilities
  window.FullDevAI = {
    initializeComponents,
    setupEventListeners,
  };
})();
}

/**
 * Generate interactions JavaScript (actions and event handlers)
 */
export const generateInteractionsJS = (): string => {
  return `(
    /**
     * Interactions JavaScript - Handles user interactions and animations
     * Auto-generated from FullDev AI Web Builder
     */

    () => {
      // Handle scroll to element events
      window.addEventListener("scrollToElement", (e) => {
        const elementId = e.detail?.elementId
        if (elementId) {
          const element =
            document.getElementById(elementId) || document.querySelector('[data-component-id="' + elementId + '"]')
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" })
            // Add highlight effect
            element.style.animation = "highlight 0.6s ease-in-out"
          }
        }
      })

      // Handle toggle visibility events
      window.addEventListener("toggleVisibility", (e) => {
        const selector = e.detail?.selector
        if (selector) {
          const elements = document.querySelectorAll(selector)
          elements.forEach((el) => {
            el.style.display = el.style.display === "none" ? "block" : "none"
          })
        }
      })

      // Add keyboard shortcuts
      document.addEventListener("keydown", (e) => {
        // Escape key to close any modals or overlays
        if (e.key === "Escape") {
          const modals = document.querySelectorAll("[data-modal]")
          modals.forEach((modal) => {
            modal.style.display = "none"
          })
        }
      })
    },
  )()
}

/**
 * Generate package.json for the project
 */
export const generatePackageJson = (projectName: string): string => {
  return JSON.stringify(
    {
      name: projectName.toLowerCase().replace(/\\s+/g, "-"),
      version: "1.0.0",
      description: `${projectName} - Created with FullDev AI Web Builder`,
      main: "index.html",
      scripts: {
        dev: "npx http-server",
        start: "npx http-server",
      },
      keywords: ["website", "html", "css", "javascript"],
      author: "",
      license: "MIT",
    },
    null,
    2,
  )
}

/**
 * Generate README with documentation
 */
export const generateREADME = (projectName: string): string => {
  return `# ${projectName}

A modern website created with **FullDev AI Web Builder**.

## 🚀 Quick Start

1. **Extract the ZIP file** to your desired location
2. **Open \`index.html\`** in your web browser
3. **Start customizing** - Edit HTML, CSS, and JavaScript as needed

## 📁 Project Structure

\`\`\`
${projectName.toLowerCase().replace(/\\s+/g, "-")}/
├── index.html           # Main HTML file
├── css/
│   └── style.css        # All styles (auto-generated from design)
├── js/
│   ├── main.js          # Main JavaScript functionality
│   └── interactions.js   # Interaction handlers
├── package.json         # Project metadata
└── README.md            # This file
\`\`\`

## ✨ Features

- 📱 Fully responsive design
- 🎨 Professional styling matching your design
- ⚡ Optimized performance
- 🔧 Easy to customize
- 📦 Ready to deploy

## 🛠️ Customization Guide

### Change Colors

Edit color values in \`css/style.css\`:

\`\`\`css
.btn-primary {
  background: #2563eb; /* Change this */
}
\`\`\`

### Update Content

Edit \`index.html\` to add your content:

\`\`\`html
<h1>Your Title</h1>
<p>Your content</p>
\`\`\`

### Add Functionality

Extend \`js/main.js\` with custom code:

\`\`\`javascript
function myFunction() {
  // Your code here
}
\`\`\`

## 🌐 Deployment Options

### GitHub Pages
1. Create a GitHub repository
2. Push your files
3. Enable GitHub Pages in settings

### Netlify
1. Connect your GitHub repo
2. Deploy automatically

### Vercel
1. Import your repo
2. Deploy with one click

## 🎯 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📚 Resources

- [MDN Web Docs](https://developer.mozilla.org/)
- [CSS Tricks](https://css-tricks.com/)
- [JavaScript.info](https://javascript.info/)

## 📝 License

This project is licensed under the MIT License.

---

**Created with FullDev AI Web Builder** - Making web development accessible to everyone!

Build Date: ${new Date().toLocaleDateString()}
`
}
