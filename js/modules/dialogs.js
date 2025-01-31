/**
 * Removes the open attribute of all elements matching the given CSS selector.
 *
 * @param {string} selector The CSS selector.
 */
function removeOpen(selector) {
    document.querySelectorAll(selector).forEach((element) =>
        element.removeAttribute("open"))
}

/**
 * Sets the open attribute to "open" of all elements matching the given CSS selector.
 *
 * @param {string} selector The CSS selector.
 */
function setOpen(selector) {
    document.querySelectorAll(selector).forEach((element) =>
        element.setAttribute("open", "open"))
}

/**
 * Toggles the open attribute of elements matching the given CSS selector.
 * 
 * If the attribute is present, it is removed.
 * If the attribute is not present, it is set to "open".
 *
 * @param {string} selector The CSS selector.
 */
function toggleOpen(selector) {
    document.querySelectorAll(selector).forEach((element) => {
        if (element.getAttribute('open'))
            removeOpen(selector)
        else
            setOpen(selector)
    })
}

export { removeOpen, setOpen }