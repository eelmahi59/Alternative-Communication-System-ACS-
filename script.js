/* Detect Real iPads and automatically use fullscreen mode */
function isIPad() {
    return (
        /iPad/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' &&
         navigator.maxTouchPoints > 1)
    );
}

if (isIPad()) {

    const selector =
        document.querySelector('.device-selector');

    if (selector) {
        selector.style.display = 'none';
    }

    device.classList.add('web-view');
}