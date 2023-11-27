import '../sass/theme.scss'; // Load in styles

const weba = {};

/* global jQuery */
const $ = jQuery;
const $window = $(window);

/* ---------------------------
  Main Menu
--------------------------- */
// Each object contains an init function which initalizes all the functions within the object.
// This means that each function can have the logic within it and functions can be turned on and
// off within the init which makes for customization for future client work

weba.themeMain = {
    init() {
        // Custom js functionality here.
    },
};

$window.on('DOMContentLoaded', () => {
    weba.themeMain.init();
});
