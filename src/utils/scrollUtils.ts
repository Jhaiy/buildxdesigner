/**
 * Robust scroll-to-element function that handles various selector types,
 * dynamic content, and iframe contexts.
 * 
 * @param {string} selector 
 * @param {number} timeout 
 * @param {Document | Element} root 
 * @returns {Promise<boolean>} 
 */
export const scrollToTarget = async (selector: string, timeout = 2000, root: Document | Element = document): Promise<boolean> => {
    if (!selector) {
        console.warn('scrollToTarget: No selector provided');
        return false;
    }

    const cleanId = selector.startsWith('#') ? selector.substring(1) : selector;
    const cleanSelector = selector.replace(/'/g, "\\'");
    const startTime = Date.now();

    console.log(`scrollToTarget: Starting search for "${selector}"`);
    console.log(`scrollToTarget: Clean ID: "${cleanId}"`);

    const findInRoot = (root: Document | Element) => {
        let el = root.querySelector(`#${cleanId}`);
        if (el) return el;

        try {
            el = root.querySelector(selector);
            if (el) return el;
        } catch (e) {
        }

        if (!selector.startsWith('#') && !selector.startsWith('.')) {
            el = root.querySelector(`#${cleanSelector}`);
            if (el) return el;
        }

        el = root.querySelector(`[data-component-id="${cleanId}"]`);
        if (el) return el;

        return null;
    };

    const findElement = () => {
        let element = findInRoot(root);
        if (element) return element;

        if (root === document) {
            const iframes = document.querySelectorAll('iframe');
            for (const iframe of Array.from(iframes)) {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                    if (iframeDoc) {
                        element = findInRoot(iframeDoc);
                        if (element) return element;
                    }
                } catch (e) {
                    console.warn('Cannot access iframe content:', e);
                }
            }
        }

        return null;
    };

    return new Promise((resolve) => {
        const check = () => {
            const element = findElement();

            if (element) {
                console.log(`scrollToTarget: Found element for "${selector}"`, element);

                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'nearest'
                });

                let parent = element.parentElement;
                while (parent) {
                    const style = window.getComputedStyle(parent);
                    const overflowY = style.overflowY;
                    if (overflowY === 'auto' || overflowY === 'scroll') {
                        const parentRect = parent.getBoundingClientRect();
                        const elementRect = element.getBoundingClientRect();

                        const relativeTop = elementRect.top - parentRect.top + parent.scrollTop;

                        parent.scrollTo({
                            top: relativeTop,
                            behavior: 'smooth'
                        });
                        console.log('scrollToTarget: Manually scrolled container', parent);
                        break;
                    }
                    parent = parent.parentElement;
                }

                resolve(true);
                return;
            }
            if (Date.now() - startTime > timeout) {
                console.warn(`scrollToTarget: Element not found for "${selector}" after ${timeout}ms`);
                resolve(false);
                return;
            }

            requestAnimationFrame(check);
        };

        check();
    });
};
