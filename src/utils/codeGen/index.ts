/**
 * Code Generation Module - Public API
 * Exports all generators and utilities for the builder
 */

export * from "./types"
export { createComponentRegistry, registerCustomComponent } from "./componentGenerators"
export { PageGenerator } from "./pageGenerator"
export { SiteGenerator, createSiteGenerator } from "./siteGenerator"
export { BrowserExporter, createBrowserExporter } from "./browserExporter"

// Example usage documentation
/**
 * USAGE EXAMPLE:
 *
 * import { createSiteGenerator, createBrowserExporter } from '@/utils/codeGen';
 * import type { SiteData } from '@/utils/codeGen';
 *
 * // 1. Prepare site data
 * const siteData: SiteData = [
 *   {
 *     pageName: 'home',
 *     components: [
 *       {
 *         id: '1',
 *         type: 'header',
 *         props: { title: 'My Site', links: [{ text: 'Home', url: '/' }] },
 *         style: { backgroundColor: '#333', textColor: '#fff' },
 *         order: 0
 *       },
 *       {
 *         id: '2',
 *         type: 'section',
 *         props: { title: 'Welcome', description: 'This is my site' },
 *         style: { backgroundColor: '#f9f9f9', padding: '60px 20px' },
 *         order: 1
 *       }
 *     ],
 *     metadata: {
 *       title: 'Home - My Site',
 *       description: 'Welcome to my site',
 *       keywords: ['home', 'welcome']
 *     }
 *   }
 * ];
 *
 * // 2. Generate site files
 * const generator = createSiteGenerator();
 * const files = generator.generateSiteFiles(siteData, {
 *   includeReadme: true,
 *   includePackageJson: true
 * });
 *
 * // 3. Export as ZIP
 * const exporter = createBrowserExporter();
 * await exporter.exportAsZip(files, 'My Website');
 */
