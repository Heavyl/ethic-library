export default class Interactive {
    constructor({
        container,
        attribute = 'target',
        activeClass = 'active',
        callback = false,
        triggers = '.trigger',
        targets = '.target',
        onScroll,
        onClick,
        onBecomeVisible
    }) {
        this.container = container;
        this._containerElement = document.querySelector(container);
        if (!this._containerElement) {
            throw new Error("Container element not found");
        }

        // Interaction elements
        this.triggers = triggers;
        this._triggers = this._containerElement.querySelectorAll(triggers);
        this.targets = targets;
        this._targets = this._containerElement.querySelectorAll(targets);
        
        // Attributes
        this._dataAttribute = attribute;
        this._activeClass = activeClass;

        // Events
        this._callback = callback;
        this._onScroll = onScroll;
        this._onClick = onClick;
        this._onBecomeVisible = onBecomeVisible;
    }


    /**
     * Add active class to elements.
     * @param {...NodeList|Array<Element>|HTMLElement} elementSets - Elements to activate.
     * @param {String} givenClass - Class to add.
     * @returns {void}
     */
    activate(givenClass, ...elementSets) {
        elementSets.forEach(elements => {
            if (elements instanceof HTMLElement) {
                if (!elements.classList.contains(givenClass)){
                    elements.classList.add(givenClass);
                }
            } else if (elements && typeof elements[Symbol.iterator] === 'function') {
                [...elements].forEach(el =>{ 
                    if (!el.classList.contains(givenClass)) {
                        el.classList.add(givenClass);
                    }
                })
            } else {
                console.error("Invalid argument passed to activate:", elements);
            }
        });
    }

    /**
     * Remove active class from elements.
     * @param {...NodeList|Array<Element>|HTMLElement} elementSets - Elements to deactivate.
     * @param {String} givenClass - Class to remove.
     * @returns {void}
     */
    deactivate(givenClass, ...elementSets) {
        elementSets.forEach(elements => {
            if (elements instanceof HTMLElement) {
                // If is html element
                elements.classList.remove(givenClass);
            } else if (elements && typeof elements[Symbol.iterator] === 'function') {
                // If is iterable
                for (const el of elements) {
                    el.classList.remove(givenClass);
                }
            } else {
                // If invalid argument
                console.error("Invalid argument passed to deactivate:", elements);
            }
        });
    }

    /**
     * Toggle active class on elements.
     * @param {...NodeList|Array<Element>|HTMLElement} elementSets - Elements to toggle.
     * @param {String} givenClass - Class to toggle.
     * @returns {void}
     */
    toggleElements(givenClass, ...elementSets) {
        elementSets.forEach(elements => {
            if (elements instanceof HTMLElement) {
                elements.classList.toggle(givenClass);
            } else if (elements && typeof elements[Symbol.iterator] === 'function') {
                [...elements].forEach(el => el.classList.toggle(givenClass));
            } else {
                console.error("Invalid argument passed to toggleElements:", elements);
            }
        });
    }

    /**
     * Handle callback function if defined.
     * @returns {void}
     */
    handleCallback() {
        if (typeof this._callback === 'function') {
            this._callback();
        }
    }

    /**
     * Handle scroll logic for activating/deactivating elements.
     * @returns {void}
     */
    handleOnScroll() {
        const { direction = 'down', threshold, absolute } = this._onScroll || {};
        if (!['up', 'down'].includes(direction)) {
            console.error('Invalid onScroll: Use "up" or "down"');
            return;
        }
        if (threshold && typeof threshold !== 'number') {
            console.error('Invalid "threshold" value. Must be a number');
            return;
        }
        if (absolute && typeof absolute !== 'boolean') {
            console.error('Invalid "absolute" value. Must be "true" or "false"');
        }
        
        let previousScrollY = window.scrollY;
        window.addEventListener('scroll', () => {
            const isScrollingDown = previousScrollY < window.scrollY;
            
            let hasReachedThreshold  = true;
            if(direction === 'down'){
                hasReachedThreshold = window.scrollY >= (window.innerHeight * (threshold / 100));
                if(absolute){
                    hasReachedThreshold = window.scrollY >= threshold;
                }
            }
            const shouldActivate =
                (direction === 'down' && isScrollingDown && hasReachedThreshold) ||
                (direction === 'up' && !isScrollingDown);

            this.handleCallback();

            this[shouldActivate ? 'activate' : 'deactivate'](this._activeClass, this._containerElement );
            previousScrollY = window.scrollY;
        });
        
            
    }

    /**
     * Handle breakpoint logic for activating/deactivating elements.
     * @returns {void}
     */
    handleBreakpoint() {
        const { from = 'top', threshold } = this._onBecomeVisible || {};

        if ( from && !['top', 'bottom'].includes(from)) {
            console.error('Invalid "from" value. Use "top" or "bottom"');
            return;
        }
        if (threshold && threshold < 0 || threshold > 100) {
            console.error('Invalid "threshold" value. Use a value between 0 and 100');
            return;
        }
        
        window.addEventListener('scroll', () => {
            const shouldActivate = this.hasReachedBounding();
            this[shouldActivate ? 'activate' : 'deactivate'](this._activeClass, this._containerElement);
            this.handleCallback();
        });
        
    }

    /**
     * Check if the element has reached the bounding threshold.
     * @returns {Boolean} true if the element is within the threshold, false otherwise.
     */
    hasReachedBounding() {
        const bounding = this._containerElement.getBoundingClientRect();
        const ratio = (window.innerHeight / 100) * this._onBecomeVisible.threshold;

        const distanceFromBottom = window.innerHeight - ratio;
        const distanceFromTop = ratio;

        return this._onBecomeVisible.from === 'top'
            ? distanceFromTop >= bounding.top
            : distanceFromBottom >= bounding.bottom;
    }

    /**
     * Return a validated NodeList or HTMLElement.
     * @param {String} argument - CSS selector string.
     * @deprecated
     * @returns {NodeList|HTMLElement}
     */
    getNodeListFrom(argument) {
        const nodeList = document.querySelectorAll(argument);
        if (nodeList.length === 0) {
            console.error(`Invalid Argument: '${argument}' did not match any elements`);
        }
        return nodeList;
    }

}