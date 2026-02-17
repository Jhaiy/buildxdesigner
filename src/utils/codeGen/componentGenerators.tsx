/**
 * Component Generators - Defines how each component type generates code
 * Extensible: Add new generators without modifying existing ones
 */

import type { Component, ComponentGenerator, ComponentRegistry } from "./types"

// ============================================================================
// HEADER COMPONENT GENERATOR
// ============================================================================
const headerGenerator: ComponentGenerator = {
  generateHTML: (component: Component) => {
    const { title = "Header", links = [] } = component.props
    const navLinks = links.map((link: any) => `<a href="${link.url}">${link.text}</a>`).join("")

    return `
<header class="header" data-component-id="${component.id}">
  <div class="header-container">
    <h1 class="header-title">${title}</h1>
    <nav class="header-nav">
      ${navLinks || '<a href="#home">Home</a><a href="#about">About</a>'}
    </nav>
  </div>
</header>`
  },

  generateCSS: (component: Component) => {
    const { backgroundColor = "#333", textColor = "#fff", padding = "20px" } = component.style || {}

    return `
.header[data-component-id="${component.id}"] {
  background-color: ${backgroundColor};
  color: ${textColor};
  padding: ${typeof padding === "number" ? padding + "px" : padding};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header[data-component-id="${component.id}"] .header-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header[data-component-id="${component.id}"] .header-title {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
}

.header[data-component-id="${component.id}"] .header-nav {
  display: flex;
  gap: 20px;
}

.header[data-component-id="${component.id}"] .header-nav a {
  color: ${textColor};
  text-decoration: none;
  transition: opacity 0.3s;
}

.header[data-component-id="${component.id}"] .header-nav a:hover {
  opacity: 0.8;
}

@media (max-width: 768px) {
  .header[data-component-id="${component.id}"] .header-container {
    flex-direction: column;
    gap: 15px;
  }
  
  .header[data-component-id="${component.id}"] .header-nav {
    flex-direction: column;
    gap: 10px;
  }
}`
  },

  generateJS: (component: Component) => {
    return `
// Header component interactivity
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('[data-component-id="${component.id}"]');
  if (header) {
    const navLinks = header.querySelectorAll('nav a');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        if (link.getAttribute('href').startsWith('#')) {
          e.preventDefault();
          const targetId = link.getAttribute('href').substring(1);
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });
  }
});`
  },
}

// ============================================================================
// HERO/SECTION COMPONENT GENERATOR
// ============================================================================
const sectionGenerator: ComponentGenerator = {
  generateHTML: (component: Component) => {
    const { title = "Section", description = "", content = "" } = component.props

    return `
<section class="section" data-component-id="${component.id}">
  <div class="section-container">
    ${title ? `<h2 class="section-title">${title}</h2>` : ""}
    ${description ? `<p class="section-description">${description}</p>` : ""}
    <div class="section-content">${content}</div>
  </div>
</section>`
  },

  generateCSS: (component: Component) => {
    const { backgroundColor = "#f9f9f9", textColor = "#333", padding = "60px 20px" } = component.style || {}

    return `
.section[data-component-id="${component.id}"] {
  background-color: ${backgroundColor};
  color: ${textColor};
  padding: ${typeof padding === "number" ? padding + "px" : padding};
}

.section[data-component-id="${component.id}"] .section-container {
  max-width: 1200px;
  margin: 0 auto;
}

.section[data-component-id="${component.id}"] .section-title {
  font-size: 32px;
  font-weight: bold;
  margin: 0 0 20px 0;
  text-align: center;
}

.section[data-component-id="${component.id}"] .section-description {
  font-size: 16px;
  line-height: 1.6;
  text-align: center;
  margin: 0 0 30px 0;
}

.section[data-component-id="${component.id}"] .section-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}`
  },

  generateJS: (component: Component) => {
    return `
// Section component interactivity
document.addEventListener('DOMContentLoaded', () => {
  const section = document.querySelector('[data-component-id="${component.id}"]');
  if (section) {
    // Intersection Observer for fade-in animation
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'fadeIn 0.6s ease-in';
          observer.unobserve(entry.target);
        }
      });
    });
    observer.observe(section);
  }
});`
  },
}

// ============================================================================
// BUTTON COMPONENT GENERATOR
// ============================================================================
const buttonGenerator: ComponentGenerator = {
  generateHTML: (component: Component) => {
    const { text = "Click Me", onClick = "" } = component.props

    return `<button class="btn" data-component-id="${component.id}" onclick="${onClick}">${text}</button>`
  },

  generateCSS: (component: Component) => {
    const { backgroundColor = "#007bff", textColor = "#fff", padding = "12px 24px" } = component.style || {}

    return `
.btn[data-component-id="${component.id}"] {
  background-color: ${backgroundColor};
  color: ${textColor};
  padding: ${typeof padding === "number" ? padding + "px" : padding};
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-block;
}

.btn[data-component-id="${component.id}"]:hover {
  opacity: 0.9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn[data-component-id="${component.id}"]:active {
  transform: translateY(0);
}`
  },

  generateJS: (component: Component) => {
    return `
// Button component interactivity
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('[data-component-id="${component.id}"]');
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.target.style.animation = 'buttonClick 0.3s ease';
    });
  }
});`
  },
}

// ============================================================================
// IMAGE COMPONENT GENERATOR
// ============================================================================
const imageGenerator: ComponentGenerator = {
  generateHTML: (component: Component) => {
    const { src = "/placeholder.svg", alt = "Image", width = "100%", height = "auto" } = component.props

    return `<img class="image" data-component-id="${component.id}" src="${src}" alt="${alt}" width="${width}" height="${height}" />`
  },

  generateCSS: (component: Component) => {
    const { maxWidth = "100%", borderRadius = "0" } = component.style || {}

    return `
.image[data-component-id="${component.id}"] {
  max-width: ${maxWidth};
  height: auto;
  border-radius: ${borderRadius};
  display: block;
}`
  },

  generateJS: (component: Component) => {
    return `
// Image component interactivity
document.addEventListener('DOMContentLoaded', () => {
  const img = document.querySelector('[data-component-id="${component.id}"]');
  if (img) {
    img.addEventListener('load', () => {
      img.style.animation = 'fadeIn 0.5s ease-in';
    });
  }
});`
  },
}

// ============================================================================
// CONTAINER/DIV COMPONENT GENERATOR
// ============================================================================
const containerGenerator: ComponentGenerator = {
  generateHTML: (component: Component) => {
    const { content = "" } = component.props
    const childrenHTML = component.children
      ? component.children.map((child) => `<!-- Child: ${child.type} -->`).join("\n")
      : ""

    return `
<div class="container" data-component-id="${component.id}">
  ${childrenHTML || content}
</div>`
  },

  generateCSS: (component: Component) => {
    const { backgroundColor = "transparent", padding = "20px", margin = "0", display = "block" } = component.style || {}

    return `
.container[data-component-id="${component.id}"] {
  background-color: ${backgroundColor};
  padding: ${typeof padding === "number" ? padding + "px" : padding};
  margin: ${typeof margin === "number" ? margin + "px" : margin};
  display: ${display};
}`
  },

  generateJS: (component: Component) => {
    return `
// Container component interactivity
document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('[data-component-id="${component.id}"]');
  if (container) {
    // Container ready for interactions
  }
});`
  },
}

// ============================================================================
// FOOTER COMPONENT GENERATOR
// ============================================================================
const footerGenerator: ComponentGenerator = {
  generateHTML: (component: Component) => {
    const { copyright = `© ${new Date().getFullYear()} All rights reserved.`, links = [] } = component.props
    const footerLinks = links.map((link: any) => `<a href="${link.url}">${link.text}</a>`).join("")

    return `
<footer class="footer" data-component-id="${component.id}">
  <div class="footer-container">
    <div class="footer-content">
      ${footerLinks ? `<nav class="footer-nav">${footerLinks}</nav>` : ""}
      <p class="footer-copyright">${copyright}</p>
    </div>
  </div>
</footer>`
  },

  generateCSS: (component: Component) => {
    const { backgroundColor = "#333", textColor = "#fff", padding = "40px 20px" } = component.style || {}

    return `
.footer[data-component-id="${component.id}"] {
  background-color: ${backgroundColor};
  color: ${textColor};
  padding: ${typeof padding === "number" ? padding + "px" : padding};
  margin-top: 60px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer[data-component-id="${component.id}"] .footer-container {
  max-width: 1200px;
  margin: 0 auto;
}

.footer[data-component-id="${component.id}"] .footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.footer[data-component-id="${component.id}"] .footer-nav {
  display: flex;
  gap: 20px;
}

.footer[data-component-id="${component.id}"] .footer-nav a {
  color: ${textColor};
  text-decoration: none;
  transition: opacity 0.3s;
}

.footer[data-component-id="${component.id}"] .footer-nav a:hover {
  opacity: 0.8;
}

.footer[data-component-id="${component.id}"] .footer-copyright {
  margin: 0;
  font-size: 14px;
}

@media (max-width: 768px) {
  .footer[data-component-id="${component.id}"] .footer-content {
    flex-direction: column;
    text-align: center;
  }
}`
  },

  generateJS: (component: Component) => {
    return `
// Footer component interactivity
document.addEventListener('DOMContentLoaded', () => {
  const footer = document.querySelector('[data-component-id="${component.id}"]');
  if (footer) {
    const footerLinks = footer.querySelectorAll('a');
    footerLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        if (link.getAttribute('href').startsWith('#')) {
          e.preventDefault();
        }
      });
    });
  }
});`
  },
}

// ============================================================================
// TEXT/PARAGRAPH COMPONENT GENERATOR
// ============================================================================
const textGenerator: ComponentGenerator = {
  generateHTML: (component: Component) => {
    const { content = "Text content", tag = "p" } = component.props

    return `<${tag} class="text" data-component-id="${component.id}">${content}</${tag}>`
  },

  generateCSS: (component: Component) => {
    const { fontSize = "16px", fontWeight = "normal", lineHeight = "1.6" } = component.style || {}

    return `
.text[data-component-id="${component.id}"] {
  font-size: ${fontSize};
  font-weight: ${fontWeight};
  line-height: ${lineHeight};
  margin: 0;
}`
  },

  generateJS: (component: Component) => {
    return `// Text component loaded`
  },
}

// ============================================================================
// COMPONENT REGISTRY
// Maps component types to their generators
// Add new generators here without modifying existing ones
// ============================================================================
export const createComponentRegistry = (): ComponentRegistry => ({
  header: headerGenerator,
  hero: sectionGenerator,
  section: sectionGenerator,
  button: buttonGenerator,
  image: imageGenerator,
  container: containerGenerator,
  div: containerGenerator,
  footer: footerGenerator,
  text: textGenerator,
  p: textGenerator,
  sidebar: containerGenerator, // Reuse container for sidebar
})

/**
 * Add a custom component generator to the registry
 * Example: registerCustomComponent('custom-card', myCardGenerator)
 */
export const registerCustomComponent = (
  registry: ComponentRegistry,
  type: string,
  generator: ComponentGenerator,
): void => {
  registry[type] = generator
}
