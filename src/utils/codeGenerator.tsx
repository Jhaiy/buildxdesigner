/**
 * Code Generator - Generates HTML, CSS, JS, and configuration files
 * Converts design panel components into runnable code
 */

import type { ComponentData } from "../App"
import { generateEnhancedHTMLCode, generateEnhancedCSSCode, generateEnhancedJSCode } from "./enhancedCodeGenerator"

/**
 * Generate complete HTML code from components
 */
export const generateHTMLCode = (components: ComponentData[], projectName: string): string => {
  return generateEnhancedHTMLCode(components, projectName)
}

/**
 * Generate comprehensive CSS with base styles and component-specific rules
 */
export const generateCSSCode = (components: ComponentData[]): string => {
  return generateEnhancedCSSCode(components, "Web Project")
}

/**
 * Generate JavaScript for interactivity
 */
export const generateJSCode = (components: ComponentData[]): string => {
  return generateEnhancedJSCode(components)
}

/**
 * Generate package.json for the project
 */
export const generatePackageJson = (projectName: string): string => {
  return JSON.stringify(
    {
      name: projectName.toLowerCase().replace(/\\s+/g, "-"),
      version: "1.0.0",
      description: `${projectName} - A modern website created with FullDev AI Web Builder`,
      main: "index.html",
      scripts: {
        dev: "npx http-server",
        build: "echo 'No build step needed for static HTML'",
        start: "npx http-server",
      },
      keywords: ["website", "html", "css", "javascript"],
      author: "",
      license: "MIT",
      devDependencies: {
        "http-server": "^14.1.1",
      },
    },
    null,
    2,
  )
}

/**
 * Generate README.md with project documentation
 */
export const generateREADME = (projectName: string): string => {
  return `# ${projectName}

A modern website created with [FullDev AI Web Builder](https://fulldevaiwbbuilder.com)

## Quick Start

1. **Extract the ZIP file** to your desired location
2. **Open \`index.html\`** in your web browser
3. **Customize** the HTML, CSS, and JavaScript files to suit your needs

## Project Structure

\`\`\`
${projectName.toLowerCase().replace(/\\s+/g, "-")}/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # All styles
├── js/
│   └── main.js         # JavaScript functionality
├── package.json        # Project metadata
└── README.md           # This file
\`\`\`

## Features

- ✨ Modern, responsive design
- 🎨 Professional styling
- 📱 Mobile-friendly layout
- ⚡ Fast performance
- 🔧 Easy to customize

## Customization

### Changing Colors

Edit the color values in \`css/style.css\`:

\`\`\`css
.btn-primary {
  background: #2563eb; /* Change this color */
}
\`\`\`

### Adding Content

Edit the HTML in \`index.html\` to add your own content:

\`\`\`html
<h1>Your Title Here</h1>
<p>Your content here</p>
\`\`\`

### Adding Functionality

Extend the JavaScript in \`js/main.js\`:

\`\`\`javascript
function myCustomFunction() {
  // Your code here
}
\`\`\`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Deployment

To deploy your website:

### Option 1: Using GitHub Pages
1. Create a GitHub repository
2. Push your files to the repository
3. Enable GitHub Pages in repository settings

### Option 2: Using Netlify
1. Connect your GitHub repository to Netlify
2. Set build command to: \`npm run build\`
3. Set publish directory to: \`./\`

### Option 3: Using Vercel
1. Import your GitHub repository
2. Vercel will auto-detect your project
3. Deploy with one click

## Customization Tips

- **Fonts**: Change font families in \`css/style.css\`
- **Layout**: Adjust grid and flexbox properties
- **Spacing**: Modify padding and margin values
- **Shadows**: Update box-shadow values for depth
- **Animations**: Add CSS transitions and keyframes

## Support

For more information and support, visit:
- [FullDev AI Web Builder Documentation](https://fulldevaiwbbuilder.com/docs)
- [Web Development Guide](https://developer.mozilla.org/en-US/docs/Web/)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Created with FullDev AI Web Builder** - Making web development accessible to everyone.

**Build date**: ${new Date().toLocaleDateString()}
**Version**: 1.0.0`
}
