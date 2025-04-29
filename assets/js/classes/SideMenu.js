/**
 * Create a menu based on given content Hn structure with automatic anchoring. Currently only works with H2 and H3.
 * Next step : Add detection of scroll and style the menu element depending of the section the user is on.
 */
export default class SideMenu {
    constructor({scope , headingLevel = 'h2', recursive = false, classes = 'side-menu', parent = 'body' }) {
        
        this.scope = document.querySelector(scope) ;
        if(!this.scope){
            console.error('Scope not valid : scope must be a valid CSS selector')
        }
        this.headingLevel = headingLevel;
        this.recursive = recursive;
        this.classes = classes;
        this.parent = parent ;

        
        this.menuContainer = document.createElement("div");
        this.menuContainer.classList.add(this.classes);
        this.innerContainer = document.createElement("ul");

        this.init();
    }
    /**
     * Initiate side menu with given parameters.
     * @returns void
     */
    init() {
        const titles = this.scope.querySelectorAll(this.headingLevel);
        
        if (titles.length < 2) return;

        titles.forEach((title, index) => {
            index++;
            // Create anchor for heading
            this.createAnchorTo(title, `section-${index}`);

            // Create menu item for heading
            this.createMenuItem(title, `section-${index}`, 'h2', this.innerContainer);

            // Check for subtitles (h3) between heading elements if recursive is true
            if (this.recursive && index < titles.length) {
                const nextTitle = titles[index];
                const walker = document.createTreeWalker(
                    document.body,
                    NodeFilter.SHOW_ELEMENT,
                    null,
                    false
                );

                walker.currentNode = title;
                let subCount = 1;
                while (walker.nextNode()) {
                    const node = walker.currentNode;
                    if (node === nextTitle) {
                        break;
                    }
                    if (node.tagName === 'H3') {
                        const link = `sub-section-${index}-${subCount}`;
                        // Create anchor and menu item for h3
                        this.createAnchorTo(node, link);
                        this.createMenuItem(node, link, 'h3', this.innerContainer);
                        subCount++;
                    }
                }
            }
        });

        this.menuContainer.appendChild(this.innerContainer);
        document.querySelector(this.parent).appendChild(this.menuContainer);
    }
    /**
     * Create an anchor for a given Node. designed for loops.
     * @param {Node} selector A DOM node element
     * @param {string} link Used as the ID of the anchor
     */
    createAnchorTo(selector, link) {
        const anchor = document.createElement('div');
        anchor.classList.add('side-menu-anchor');
        anchor.setAttribute('id', link);
        selector.before(anchor);
    }
    /**
     * Create list item based on given Hn title from the DOM and add it to the menu. Designed for loops.
     * @param {Node} title The targeted Hn from the DOM
     * @param {string} link link of the <a> element
     * @param {string} level Hn level of the target element from the DOM
     * @param {Node} container 
     */
    createMenuItem(title, link, level, container) {
        const linkContainer = document.createElement('li');
        linkContainer.classList.add(`side-menu-${level}`);
  
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', `#${link}`);
        
        linkElement.textContent = title.textContent;

        linkContainer.appendChild(linkElement);
        container.appendChild(linkContainer);
    }
}