import Interactive from "./Interactive.js";

export default class Menu extends Interactive{
    constructor({ container, button , menu , activeClass = 'show', callback, hideOnScroll = false, onScrollDown, onClick, onBreakpoint }){
        super({container, activeClass, callback, onClick, onBreakpoint})
               
        if(menu && button){ 
            this._button = document.querySelector(container + ' ' + button);
            if (!this._button) {
                throw new Error("Button element not found. Use correct CSS selector as 'button' parameter.");
            }     
            this._menu = document.querySelector(container + ' ' + menu);
            if (!this._menu) {
                throw new Error("Menu element not found. Use correct CSS selector as 'menu' parameter.");
            }
            this.handleOnClick()
        }

        this._hideOnScroll = hideOnScroll;
        this._onScrollDown = onScrollDown;
        
        this.activate(this._activeClass, this._containerElement);
        this.initEvents();
    }
    /**
     * Initialize events based on the provided parameters.
     * @returns {void}
     */
    initEvents() {
        if (this._hideOnScroll || this._onScrollDown) this.handleScrollEvent();
        if (this._onClick) this.handleOnClick();
        if (this._onBreakpoint) this.handleBreakpoint();
    }

    /**
     * Handle click events for activating/deactivating elements.
     * @returns {void}
     */
    handleOnClick() { 
        this._button.addEventListener('click', e => {
            this.toggleElements(this._activeClass, this._menu, this._button);

            // Handle callback
            this.handleCallback();
        });
    }
    /**
     * Handle scroll events for activating/deactivating elements.
     * @returns {void}
     */
    handleScrollEvent(){
        let { threshold, absolute, scrollDownClass } = this._onScrollDown || {};
        
        this._previousScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            
            this.handleOnScrollDown(threshold, absolute, scrollDownClass);
            this.handleHideOnScroll(this._hideOnScroll);
            
            this.handleCallback();
        });
    }
    /**
     * Handle scrolldown logic
     * @param {number} threshold The threshold percentage value of viwport scrolled to activate the class.
     * @param {boolean} absolute If set to true, the threshold will be treated as an absolute pixel value.
     * @param {string} scrollDownClass If set, overrides the default 'scrolldown' class name.
     * @returns 
     */
    handleOnScrollDown(threshold, absolute, scrollDownClass) {
        const className = scrollDownClass || 'scrolldown';

        if (threshold && typeof threshold !== 'number') {
            console.error('Invalid "value". Must be a number');
            return;
        }
        if (absolute && typeof absolute !== 'boolean') {
            console.error('Invalid "absolute" value. Must be "true" or "false"');
        }
        if (className && typeof className !== 'string') {
            console.error('Invalid "scrollDownClass" value. Must be a string');
        }
        if(threshold){
            let hasReachedThreshold = window.scrollY >= (window.innerHeight * (threshold / 100));
            if (absolute) {
                hasReachedThreshold = window.scrollY >= threshold;
            }
            this[hasReachedThreshold ? 'activate' : 'deactivate']( className, this._containerElement);
        }       
    }
    /**
     * Handle hide on scroll logic
     * @param {boolean} hideOnScroll If set to true, the element will be hidden on scroll down.
     * @returns 
     */
    handleHideOnScroll(hideOnScroll){
        const className = 'hidden';

        if (hideOnScroll && typeof hideOnScroll !== 'boolean') {
            console.error('Invalid "hideOnScroll" value. Must be "true" or "false"');
        }
        if(hideOnScroll) {
            //hide on scroll down
            const isScrollingDown = this._previousScrollY < window.scrollY;
            this[isScrollingDown ? 'activate' : 'deactivate']( className, this._containerElement);
            this._previousScrollY = window.scrollY;
        }
    }
}

