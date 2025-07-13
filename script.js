var el = document.querySelector('.more');
var btn = el.querySelector('.more-btn');
var menu = el.querySelector('.more-menu');
var visible = false;

function toggleDrawer() {
    const drawerNav = document.querySelector('.drawer-nav');
    if (drawerNav.style.left === '0px') {
        drawerNav.style.left = '-600px';
    } else {
        drawerNav.style.left = '0px';
    }
}

btn.addEventListener('click', showMenu, false);

// Pop-up

function openPopup() {
    document.getElementById('popup').style.display = 'flex';
}

function openPopup2() {
    document.getElementById('popup2').style.display = 'flex';
}

function openPopup3() {
    document.getElementById('popup3').style.display = 'flex';
}

function closePopup() {
    document.getElementById('popup').style.display = 'none';
}

function closePopup2() {
    document.getElementById('popup2').style.display = 'none';
}
function closePopup3() {
    document.getElementById('popup3').style.display = 'none';
}