/** plugins and imports
 *  ------------------------------------------------------------------------------------------------
**/
const path = require('path');
const themeConfig = require('./theme-options.json');

const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// the `remove: false` rule stops autoprefixer from removing prefixes that we manually insert
// this gives us more granular control to support older browsers on a case-by-case basis.
const Autoprefixer = require('autoprefixer')({ remove: false });
const Stylelint = require('stylelint');
const StylelintPlugin = require('stylelint-webpack-plugin');

/** the config object - returned from function
 *  ------------------------------------------------------------------------------------------------
 *  This syntax, where module.exports is a function that takes an env object as an argument
 *  and returns the webpack config object, allows us to pass environment variables via the CLI
 *  or package.json scripts in format `webpack -p --env.production --env.platform=web --progress`
 *  ref: https://webpack.js.org/guides/environment-variables/
**/
module.exports = (env) => {
    /** isProduction
     *  ----------------------------------------------------------------------------------------------
     *  Used throughout this config to check whether we're building for production or development
     **/
    const isProduction = env.production === true;
    let minificationPlugins = [
        new CssMinimizerPlugin()
    ];

    if (isProduction) {
        minificationPlugins.push(
            new TerserPlugin({
                terserOptions: {
                    compress: true,
                    format: {
                        comments: false,
                    }
                }
            })
        )
    }

    /** Returning the config object
     *  ----------------------------------------------------------------------------------------------
     **/
    return {
        /** Mode
         *  --------------------------------------------------------------------------------------------
         *  see https://webpack.js.org/concepts/mode/
         **/
        mode: isProduction ? 'production' : 'development',

        /** sourcemaps
         *  --------------------------------------------------------------------------------------------
         *  - full sourcemaps for production,
         *  - cheap/fast/no column numbers for dev
         *  ---
         *  FIREFOX ISSUES:
         *  firefox annoyingly can't handle the injected source maps from style loader very well.
         *  We don't get module names etc.
         *  issue here: https://github.com/webpack-contrib/style-loader/issues/303
         **/
        devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map',

        // Client side gets web, server would need 'node'
        target: 'web',

        // Set context as root directory
        context: __dirname,

        /** Entry point/s.
         *  --------------------------------------------------------------------------------------------
         *  the entry point(s) are where webpack starts bundling.
         *  for multiple pages you can use multiple entries, useful if you want different scripts to
         *  run on different pages of the site.
         *  https://webpack.js.org/configuration/entry-context/#root
         **/
        entry: {
            admin: { import: path.resolve(__dirname, './assets/js/admin-styles.js'), filename: 'admin-styles.js' },
            block_editor: { import: path.resolve(__dirname, './assets/js/block-editor-styles.js'), filename: 'block-editor-styles.js' },
            theme: { import: path.resolve(__dirname, `${themeConfig.paths.js}/theme.js`) }
        },

        /** Externals
         *  --------------------------------------------------------------------------------------------
         *  Give access to jquery in the js files.
         **/
        externals: {
            jquery: "jQuery"
        },

        // Where and how we ouput our bundled files.
        output: {
            /** where should we output?
             *  ------------------------------------------------------------------------------------------
             *  Only relevant for prod because dev server compiles in memory...
             **/
            path: path.resolve(__dirname, `${themeConfig.paths.dist}/js`),


            /** filename format
            *  ------------------------------------------------------------------------------------------
            *  [name] is replaced by the key in the entry {} object
            *  [chunkhash] changes only when file content changes
            *  cannot use chunkhash in dev with hot reloading.
            **/
            filename: '[name].min.js',

            /** Debug comments in output?
             *  ------------------------------------------------------------------------------------------
             *  outputs comments in the bundled files with details of path/tree shaking
             *  should be false in production, true for development
             **/
            pathinfo: !isProduction,
        },

        // rules for how webpack should resolve/find file names.
        resolve: {
            /** import files without extensions
            *  ------------------------------------------------------------------------------------------
            *  these are the filetypes that we can import without their extensions if we want.
            *   i.e import Header from '../shared/components/Header/Header';
            *  the '*' allows us to also include an explicit extension if we want (i.e. .jpg)
            *  ref: https://webpack.js.org/configuration/resolve/#resolve-extensions
            *  ref: http://stackoverflow.com/questions/37529513/why-does-webpack-need-an-empty-extension
            **/
            extensions: ['.js', '.json', '*'],
        },

        // Control how much info we output. Errors disabled as we are using custom webpack logger.
        stats: {
            // preset: 'minimal',
            errors: true,
        },

        // Performance hints for large file sizes
        performance: (() => {
            // see the devServer entry for explanation of this function syntax (() => {})()
            if (isProduction) {
                return {
                    // could set to error for production...
                    hints: 'warning',

                    // each 'entry' bundle (250kb)
                    maxEntrypointSize: 250000,

                    // any individual assets (250kb)
                    maxAssetSize: 250000,
                };
            }
            // development doesn't show performance hints currently
            return {};
        })(),

        /** webpack plugins
         *  --------------------------------------------------------------------------------------------
         *  Array of plugins used to expand webpack functionality
         *  we finish this array with [].filter(plugin => plugin != null),
         *  which removes any empty entries
         *  i.e. `[1,2,,4,5,6].filter(p => p != null)` -- would return --> [1, 2, 4, 5, 6]
         *  this allows us to conditionally include plugins based on the dev/production env.
        **/
        plugins: [
            new MiniCssExtractPlugin({
                filename: '../css/[name].min.css'
            }),

            /** Include a custom logger
            *  ------------------------------------------------------------------------------------------
            *  In order to make the errors clearer I've installed a separate logger by disabling the 
            *  the default output.
            **/
            new CssMinimizerPlugin(),

            new StylelintPlugin({
                configFile: path.resolve(__dirname, '.stylelintrc'),
                context: path.resolve(__dirname, 'assets/sass'),
                exclude: ['node_modules'],
                files: '**/*.scss'
            }),

            // Set up browsersync using options specified by options.
            // See included theme-options.json file for info.
            new BrowserSyncPlugin(themeConfig.browserSyncOptions),

            // Delete and recreate the dist folder everytime Webpack generated an output.
            // new CleanWebpackPlugin()
        ].filter(plugin => plugin != null), // see note at start for .filter explanation...


        /** Loaders to handle files
         *  --------------------------------------------------------------------------------------------
         *  loaders are used to tell webpack how to interpret different file types.
         **/
        module: {
            rules: [
                /** babel
                 *  ----------------------------------------------------------------------------------------
                 *  Run all of our .js files through babel.
                 *  use ES6+ features that aren't widely supported and transpile them back to ES5...
                 **/
                {
                    test: /\.(js|jsx)$/,
                    // only transpile files in our own dirs (theme and Boostrap)
                    include: [
                        path.resolve(__dirname, themeConfig.paths.js),
                    ],
                    enforce: 'pre', // Run this before other loaders
                    loader: 'eslint-loader',
                    options: {
                        emitWarning: true, // Emit ESLint warnings as webpack warnings (not errors)
                    },
                    // Transpile all .js files with babel - commented out in favour of eslint above.
                    // use: 'babel-loader',
                },

                /** SCSS to CSS, with autoprefixer and stylelint
                 *  ----------------------------------------------------------------------------------------
                 **/
                {
                    test: /.s?css$/,
                    /** LOADERS RUN BOTTOM TO TOP!
                     *  --------------------------------------------------------------------------------------
                     *  to get an idea of the process start with the last array item and work up!
                     **/
                    use: [
                        /** finally we actually load the css!
                         *  ------------------------------------------------------------------------------------
                         *  in production MiniCssExtractPlugin loads the css as file/s
                         *  in development the css is loaded through JS using style-loader
                        **/
                        {
                            loader: MiniCssExtractPlugin.loader
                            // loader: isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                        },

                        /** next parse import/url() rules
                         *  ------------------------------------------------------------------------------------
                         **/
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                            },
                        },

                        /** Third autoprefix the css
                         *  ------------------------------------------------------------------------------------
                         *  Autoprefixer uses the browserlist in package.json by default,
                         *  we also pass extra options to it when we `require()` it at the top ^^
                         *  this has to run after the sass is converted to css which is why there
                         *  are two separate postcss-loader blocks. One to lint, one to prefix
                        **/
                        {
                            loader: 'postcss-loader',
                            options: {
                                // need this all the way up, so successive loaders hang on to source maps!
                                sourceMap: true,
                                postcssOptions: {
                                    plugins: [
                                        // we specify some rules for Autoprefixer where we `require` it
                                        // at the top of this file...
                                        Autoprefixer,
                                    ],
                                },
                            },
                        },

                        /** Second convert our sass to standard css
                         *  ------------------------------------------------------------------------------------
                         *  this runs node-sass with the options we pass it!
                         **/
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true,
                                sassOptions: {
                                    outputStyle: 'compressed',
                                }
                            },
                        },

                        /** First lint our non-transformed css
                         *  ------------------------------------------------------------------------------------
                         *  this runs first so that we lint before sass-loader compresses the code!
                         **/
                        {
                            loader: 'postcss-loader',
                            options: {
                                // we install postcss-scss in package.json.
                                // it is a parser that allows postcss to understand scss syntax
                                // we're running stylelint on our .scss code, so we need this parser here
                                postcssOptions: {
                                    parser: 'postcss-scss',
                                    plugins: [
                                        // this const is brought in with `require()` at the top of this file
                                        Stylelint,
                                    ],
                                },
                            },
                        }
                    ],
                },

                /** Asset files
                 *  ----------------------------------------------------------------------------------------
                 *  Asset Modules is a type of module that allows one to use asset files (fonts, icons, etc) without configuring additional loaders.
                 *  use ES6+ features that aren't widely supported and transpile them back to ES5...
                 **/
                {
                    test: /\.(woff|woff2|eot|ttf|otf|svg)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: './fonts/[name][ext]',
                    },
                }
            ]
        },

        /** Optimisations
         *  --------------------------------------------------------------------------------------------
         *  Run optimization based on the current mode.
         *  override the default minimizer by providing a different one or more customized
         **/
        optimization: {
            minimize: true,
            minimizer: minificationPlugins,
        }
    }; // client config object
}; // module.exports = (env = {}) => {