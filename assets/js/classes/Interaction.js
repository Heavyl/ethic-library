import Interactive from "./Interactive.js";

export default class Interaction extends Interactive {
    constructor({
        container,
        attribute,
        activeClass,
        callback,
        triggers,
        targets,
        onScroll,
        onClick,
        onBreakpoint
    }) {
        super({ container, attribute, activeClass, callback, triggers, targets, onScroll, onClick, onBreakpoint });

        this._onClick = onClick;
        this.initEvents();
    }

    /**
     * Initialize events based on the provided parameters.
     * @returns {void}
     */
    initEvents() {
        if (this._onScroll) this.handleOnScroll();
        if (this._onClick) this.handleOnClick();
        if (this._onBreakpoint) this.handleBreakpoint();
    }

    /**
     * Handle click events for activating/deactivating elements.
     * @returns {void}
     */
    handleOnClick() {
        
        let lastTrigger = null;

        this._containerElement.addEventListener('click', e => {
            const currentTrigger = e.target.closest(this.triggers);
            
            if (!currentTrigger) return;

            // Get trigger's corresponding target from dataset attribute
            const data = currentTrigger.dataset[this._dataAttribute];
            if (!data) {
                console.error(`Invalid data attribute for trigger:`, currentTrigger);
                return;
            }

            const targetElements = this.getNodeListFrom(`${this.container} .${data}`);
            const triggerElements = Array.from(this._triggers).filter(
                trigger => trigger.dataset[this._dataAttribute] === data
            );
            
            // Handle different interaction types
            this.handleInteractionType(currentTrigger, lastTrigger, targetElements, triggerElements);

            // Update last trigger
            lastTrigger = currentTrigger;

            // Handle callback
            this.handleCallback();
        });
    }

    /**
     * Handle different interaction types.
     * @param {HTMLElement} currentTrigger - The current trigger element.
     * @param {HTMLElement} lastTrigger - The last trigger element.
     * @param {NodeList|Array<Element>} targetElements - The target elements.
     * @param {NodeList|Array<Element>} triggerElements - The trigger elements.
     * @returns {void}
     */
    handleInteractionType(currentTrigger, lastTrigger, targetElements, triggerElements) {
        switch (this._onClick.type) {
            case 'default':
                this.deactivate(this._triggers, this._targets);
                this.activate(targetElements, triggerElements);
                break;

            case 'keep':
                this.toggleElements(targetElements, triggerElements);
                break;

            case 'toggle':
                if (lastTrigger === currentTrigger) {
                    this.toggleElements(targetElements, triggerElements);
                } else {
                    this.deactivate(this._triggers, this._targets);
                    this.activate(targetElements, triggerElements);
                }
                break;

            default:
                console.warn(`Unknown interaction type: ${this._type}`);
        }
    }
}