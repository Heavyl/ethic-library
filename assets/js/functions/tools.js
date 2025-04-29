
/**
 * Add CSS style to an element
 * @param {HTMLElement | NodeList | String} element 
 * @param {Object} style An object containing a set of key property/value to add
 * @example The style element can take an object such as:
 *          { color : 'red'} // simple property/value pair
 *          { backgroundColor : 'yellow' } ; //use camelCase instead of hyphen
 */
export default function addStyle(element, style) {
    try {
        let elements;

        // Vérifiez si l'élément est un sélecteur CSS ou un élément HTML
        if (typeof element === 'string') {
            elements = document.querySelectorAll(element);
            if (elements.length === 0) {
                throw new Error("No HTML element found for the selector: " + element);
            }
        } else if (element instanceof HTMLElement) {
            elements = [element];
        } else if (element instanceof NodeList) {
            elements = element;
        } else {
            throw new Error("The provided element must be either a valid CSS selector, an HTMLElement, or a NodeList.");
        }

        // Appliquer les styles à chaque élément
        elements.forEach(el => {
            for (const property in style) {
                if (style.hasOwnProperty(property)) {
                    el.style[property] = style[property];
                }
            }
        });

        return true;

    } catch (error) {
        console.error("Can't apply style: ", error.message);
        return false;
    }
}

