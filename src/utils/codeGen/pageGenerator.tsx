/**
 * Page Generator - Converts page data into HTML, CSS, and JS files
 * Handles multi-page support with dynamic file generation
 */

import type { Component, PageData, ComponentRegistry } from "./types"

export class PageGenerator {
  private registry: ComponentRegistry

  constructor(registry: ComponentRegistry) {
    this.registry = registry
  }

  /**
   * Generate HTML for a single page
   */
  generatePageHTML(page: PageData): string {
    const { pageName, components, metadata = {} } = page
    const { title = pageName, description = "", keywords = [] } = metadata

    const componentsHTML = components
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((component) => this.generateComponentHTML(component))
      .join("\n")

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${description}">
  <meta name="keywords" content="${keywords.join(", ")}">
  <title>${title}</title>
  <link rel="stylesheet" href="../css/${pageName}.css">
  <style>
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes buttonClick {
      0% { transform: scale(1); }
      50% { transform: scale(0.95); }
      100% { transform: scale(1); }
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
      line-height: 1.6;
      color: #333;
    }
  </style>
</head>
<body>
  ${componentsHTML}
  <script src="../js/${pageName}.js"></script>
</body>
</html>`
  }

  /**
   * Generate CSS for a single page
   */
  generatePageCSS(page: PageData): string {
    const componentCSS = page.components.map((component) => this.generateComponentCSS(component)).join("\n\n")

    return `/* Page: ${page.pageName} */
/* Generated CSS - Edit with caution */

${componentCSS}

/* ============================================================================
   RESPONSIVE DESIGN - Mobile First
   ============================================================================ */

@media (max-width: 768px) {
  html {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  html {
    font-size: 12px;
  }
}

/* ============================================================================
   UTILITY CLASSES
   ============================================================================ */

.container-max {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.flex {
  display: flex;
}

.grid {
  display: grid;
}

.gap-1 { gap: 8px; }
.gap-2 { gap: 16px; }
.gap-3 { gap: 24px; }
.gap-4 { gap: 32px; }
`
  }

  /**
   * Generate JavaScript for a single page
   */
  generatePageJS(page: PageData): string {
    const componentJS = page.components.map((component) => this.generateComponentJS(component)).join("\n\n")

    return `// Page: ${page.pageName}
// Generated JavaScript - Add custom interactivity below

${componentJS}

/* ============================================================================
   GLOBAL INTERACTIONS
   ============================================================================ */

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  console.log('Page loaded: ${page.pageName}');
  
  // Add your custom page logic here
});

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    console.log('Window resized');
  }, 250);
});

// Smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#' && document.querySelector(href)) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
    }
  });
});`
  }

  /**
   * Generate HTML for a single component
   */
  private generateComponentHTML(component: Component): string {
    const generator = this.registry[component.type]

    if (!generator) {
      console.warn(`No generator found for component type: ${component.type}`)
      return `<!-- Unknown component type: ${component.type} -->`
    }

    return generator.generateHTML(component)
  }

  /**
   * Generate CSS for a single component
   */
  private generateComponentCSS(component: Component): string {
    const generator = this.registry[component.type]

    if (!generator) {
      return `/* No generator for: ${component.type} */`
    }

    return generator.generateCSS(component)
  }

  /**
   * Generate JS for a single component
   */
  private generateComponentJS(component: Component): string {
    const generator = this.registry[component.type]

    if (!generator) {
      return `// No generator for: ${component.type}`
    }

    return generator.generateJS(component)
  }
}
