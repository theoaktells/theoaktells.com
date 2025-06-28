const mobileMenuToggleButton = document.getElementById('mobile-menu-toggle-button')
const mobileMenu = document.getElementById('mobile-menu')

/**
 * @return {boolean}
 */
function isMobileMenuOpen() {
    return !mobileMenu.classList.contains('mobile-menu__closed')
}

function closeMobileMenu() {
    mobileMenu.classList.add('mobile-menu__closed')
    mobileMenuToggleButton.children[0]?.classList.remove('hamburger-icon__cross')
}

function openMobileMenu() {
    mobileMenu.classList.remove('mobile-menu__closed')
    mobileMenuToggleButton.children[0]?.classList.add('hamburger-icon__cross')
}

mobileMenuToggleButton.onclick = () => {
    if(isMobileMenuOpen()) {
        closeMobileMenu()
        return
    }

    openMobileMenu()
}
