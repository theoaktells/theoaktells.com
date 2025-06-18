const mobileMenuToggleButton = document.getElementById('mobile-menu-toggle-button')
const mediaQuery = window.matchMedia('(max-width: 960px)')

/**
 * @return {boolean}
 */
function isMobileMenuOpen() {
    return !document.body.classList.contains('jw-menu-is-collapsed')
}

function closeMobileMenu() {
    document.body.classList.add('jw-menu-is-collapsed')
    mobileMenuToggleButton.children[0]?.classList.remove('jw-icon-burger--cross')
}

function openMobileMenu() {
    document.body.classList.remove('jw-menu-is-collapsed')
    mobileMenuToggleButton.children[0]?.classList.add('jw-icon-burger--cross')
}

function setToMobileLayout() {
    document.body.classList.remove('jw-menu-is-desktop')
    document.body.classList.add('jw-menu-is-mobile')
}

function setToDesktopLayout() {
    document.body.classList.add('jw-menu-is-desktop')
    document.body.classList.remove('jw-menu-is-mobile')
}

/**
 * @param {boolean} matches
 */
function handleScreenChange(matches) {
    if (matches) {
        setToMobileLayout()
        return
    }

    setToDesktopLayout()
    closeMobileMenu()
}

mobileMenuToggleButton.onclick = () => {
    if(isMobileMenuOpen()) {
        closeMobileMenu()
        return
    }

    openMobileMenu()
}

mediaQuery.addEventListener('change', (e) => handleScreenChange(e.matches))

handleScreenChange(mediaQuery.matches)
