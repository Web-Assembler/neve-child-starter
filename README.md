## About

A modern child theme for Neve.

## Installation

This theme should be installed in the `wp-content/themes` directory.

### Project set up

The `nevechild` textdomain is a placeholder for the project name and is used as the function prefix.

Create a screenshot.png image that is exactly 1280px by 960px and place it in the theme root.


## Getting started

- Update the `Theme Name` in style.css to match the project name.
- Do a global find and replace for `nevechild` and change to the project name.
- In the theme root, type `npm i`
- This will install webpack and dependencies
- Open the `theme-options.json` file and change the proxy and host URLs to match the project URL in Local.
- Make sure the URL in the key and cert values is correct for the project.

## Compiling with Webpack/BrowserSync

Make changes in assets/scss/theme.scss to affect any styles on the front end. These will be minified and loaded after the main style.css

Make changes in assets/scss/admin.scss to affect any styles in the admin area.

### Dev mode
To start compiling assets, type `npm run watch` in the root. This will launch the dev mode and provide some BrowserSync URLs in the terminal. As Local WP (flywheel) uses hostnames, the localhost URL won't work so make sure to use the one like https://neve-child.local:3000.

### Production mode (pre and post launch)

To build production-ready scripts, use the command `npm run build`. This command will ensure the right source-map is loaded, do extra compiling options and return warnings in the terminal if the compiled scripts are too large. The dev/prod can be changed in the "scripts" section of package.json.

## Code Linting

When running the watch scripts, the terminal displays warnings and errors from conventions set in the theme. These try and guide you to make the files more standardised and error-free. The settings for Sass linting can be changed in `.stylelintrc` and the JS linting in `assets/js/.eslintrc.json`.

This link has all the documentation on the linting rules: https://stylelint.io/user-guide/rules. Simply search for the rule and add to the `.stylelintrc` file.

