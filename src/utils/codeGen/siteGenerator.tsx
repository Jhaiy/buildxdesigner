/**
 * Site Generator - Manages multi-page site generation
 * Handles entire site exports with proper file structure
 */

import type { SiteData, GeneratedFiles, ExportOptions } from "./types"
import { PageGenerator } from "./pageGenerator"
import { createComponentRegistry } from "./componentGenerators"

export class SiteGenerator {
  private pageGenerator: PageGenerator

  constructor() {
    const registry = createComponentRegistry()
    this.pageGenerator = new PageGenerator(registry)
  }

  /**
   * Generate all files for a multi-page site
   * Output structure:
   * /html
   *   home.html
   *   about.html
   * /css
   *   home.css
   *   about.css
   * /js
   *   home.js
   *   about.js
   *   shared.js
   */
  generateSiteFiles(siteData: SiteData, options: ExportOptions = {}): GeneratedFiles {
    const files: GeneratedFiles = {}

    // Generate page-specific files
    siteData.forEach((page) => {
      // Generate HTML
      files[`html/${page.pageName}.html`] = this.pageGenerator.generatePageHTML(page)

      // Generate CSS
      files[`css/${page.pageName}.css`] = this.pageGenerator.generatePageCSS(page)

      // Generate JS
      files[`js/${page.pageName}.js`] = this.pageGenerator.generatePageJS(page)
    })

    // Generate shared files
    files["shared/global.css"] = this.generateGlobalCSS()
    files["shared/utilities.js"] = this.generateUtilitiesJS()

    // Generate documentation and config files
    if (options.includePackageJson !== false) {
      files["package.json"] = this.generatePackageJson()
    }

    if (options.includeReadme !== false) {
      files["README.md"] = this.generateREADME(siteData)
    }

    // Generate index/sitemap
    files["index.html"] = this.generateSiteIndex(siteData)

    // Generate components JSON for sync
    files["shared/components.json"] = JSON.stringify(siteData[0].components, null, 2)

    return files
  }

  /**
   * Generate global CSS for the entire site
   */
  private generateGlobalCSS(): string {
    return `/* Global Styles - Applied to all pages */

:root {
  /* Color Palette */
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --warning-color: #ffc107;
  --info-color: #17a2b8;
  
  /* Typography */
  --font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  --font-size-base: 16px;
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-bold: 700;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* Border Radius */
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 12px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-normal);
  line-height: 1.6;
  color: #333;
  background-color: #fff;
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-weight: var(--font-weight-bold);
  margin-bottom: 16px;
  line-height: 1.2;
}

h1 { font-size: 32px; }
h2 { font-size: 28px; }
h3 { font-size: 24px; }
h4 { font-size: 20px; }
h5 { font-size: 18px; }
h6 { font-size: 16px; }

p {
  margin-bottom: 16px;
}

a {
  color: var(--primary-color);
  text-decoration: none;
  transition: color 0.3s ease;
}

a:hover {
  text-decoration: underline;
}

/* Images */
img {
  max-width: 100%;
  height: auto;
  display: block;
}

/* Forms */
input, textarea, select {
  font-family: inherit;
  font-size: inherit;
}

button {
  font-family: inherit;
  cursor: pointer;
}

/* Lists */
ul, ol {
  margin-left: 20px;
  margin-bottom: 16px;
}

li {
  margin-bottom: 8px;
}

/* Code */
code, pre {
  background-color: #f4f4f4;
  border-radius: var(--border-radius-md);
  padding: 4px 8px;
  font-family: 'Courier New', monospace;
}

pre {
  padding: 16px;
  overflow-x: auto;
}

/* Accessibility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
`
  }

  /**
   * Generate shared utilities JavaScript
   */
  private generateUtilitiesJS(): string {
    return `/* Shared Utilities - Available across all pages */

// Navigation helper
const navigateTo = (pageName) => {
  const link = document.createElement('a');
  link.href = \`html/\${pageName}.html\`;
  link.click();
};

// Analytics placeholder
const trackEvent = (eventName, eventData = {}) => {
  console.log('Event tracked:', eventName, eventData);
  // Integrate with your analytics service here
};

// DOM utilities
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const addClass = (element, className) => element?.classList.add(className);
const removeClass = (element, className) => element?.classList.remove(className);
const toggleClass = (element, className) => element?.classList.toggle(className);

// Animation utilities
const fadeIn = (element, duration = 300) => {
  element.style.animation = \`fadeIn \${duration}ms ease-in\`;
};

const slideIn = (element, direction = 'left', duration = 300) => {
  const distances = { left: '-100%', right: '100%', top: '-100%', bottom: '100%' };
  element.style.animation = \`slideIn\${capitalize(direction)} \${duration}ms ease-in\`;
};

// Utility function
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Debounce function
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Local storage helper
const storage = {
  set: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
  get: (key) => JSON.parse(localStorage.getItem(key)),
  remove: (key) => localStorage.removeItem(key),
  clear: () => localStorage.clear(),
};

console.log('Utilities loaded successfully');
`
  }

  /**
   * Generate package.json for the project
   */
  private generatePackageJson(): string {
    return JSON.stringify(
      {
        name: "generated-site",
        version: "1.0.0",
        description: "A static website generated by the Code Generator",
        main: "index.html",
        scripts: {
          dev: "npx http-server -p 8080",
          serve: "npx http-server",
          build: "echo 'Static site - no build needed'",
        },
        keywords: ["static", "website", "generated"],
        author: "Code Generator",
        license: "MIT",
      },
      null,
      2,
    )
  }

  /**
   * Generate README documentation
   */
  private generateREADME(siteData: SiteData): string {
    const pageList = siteData.map((page) => `- [${page.pageName}](html/${page.pageName}.html)`).join("\n")

    return `# Generated Website

This is a static website generated by the Code Generator.

## Pages

${pageList}

## Structure

\`\`\`
/html
  - home.html
  - about.html
  - [other pages...]
  
/css
  - home.css
  - about.css
  - [other stylesheets...]
  
/js
  - home.js
  - about.js
  - [other scripts...]
  
/shared
  - global.css
  - utilities.js
  
index.html
package.json
README.md
\`\`\`

## Getting Started

1. Open \`index.html\` in your browser
2. Or run \`npm install && npm run dev\` to start a local server

## Customization

- Edit HTML files in \`/html\` folder
- Update styles in \`/css\` folder
- Add interactivity in \`/js\` folder

## Deployment

This is a static website. You can deploy it to:
- GitHub Pages
- Vercel
- Netlify
- AWS S3
- Any static hosting provider
`
  }

  /**
   * Generate site index/home page
   */
  private generateSiteIndex(siteData: SiteData): string {
    const pages = siteData
      .map(
        (page) =>
          `<li><a href="html/${page.pageName}.html">${page.pageName.charAt(0).toUpperCase() + page.pageName.slice(1)}</a></li>`,
      )
      .join("\n")

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Site Index</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      max-width: 800px;
      margin: 50px auto;
      padding: 20px;
    }
    h1 { color: #333; }
    ul { list-style: none; padding: 0; }
    li { margin: 10px 0; }
    a { color: #007bff; text-decoration: none; font-size: 18px; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>Website Pages</h1>
  <ul>
    ${pages}
  </ul>
</body>
</html>`
  }
}

// Export factory function for easy instantiation
export const createSiteGenerator = () => new SiteGenerator()
