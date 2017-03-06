
/* -------- GULP plugins -------- */
const gulp    = require('gulp'),
      gutil   = require('gulp-util'),
      plumber = require('gulp-plumber'),
      stylus  = require('gulp-stylus');

/* -------- Node modules -------- */
const glob = require('glob'),
      del  = require('del'),
      fs   = require('fs-extra'),
      path = require('path');

const webpack = require('webpack'),
      devServer = require('webpack-dev-server'),
      clearConsole = require('inferno-dev-utils/clearConsole'),
      formatWebpackMessages = require('inferno-dev-utils/formatWebpackMessages'),
      openBrowser = require('inferno-dev-utils/openBrowser');

/* -------- Misc configs -------- */
process.env.NODE_ENV = 'production'; // Must be set BEFORE webpack config is loaded!
//process.env.WEBPACK_BUILD = 'debug'; // Global debug - no minification, etc.

const webpackConfig = './webpack.config';

const isInteractive = process.stdout.isTTY;

const paths = require('./paths');

const color = gutil.colors;

const host = {
  domain: 'localhost',
  port: 3000,
}

/* -------- Sources globs -------- */
const src = {
    html:   "src/**/*.html",
    css:    "src/**/*.css",
    js:     "src/**/*.js",
    json:   "src/**/*.json",
};


/*------------------------------*\
  #DEFAULT-TASK
\*------------------------------*/

gulp.task('default', [ 'build' ]);


/*------------------------------*\
  #UTILITY-TASKS
\*------------------------------*/

gulp.task('clean-build', () => del('build/*'));
gulp.task('cleanall', () => del('build'));


/*------------------------------*\
  #TASK.WEBPACK:BUILD
\*------------------------------*/

gulp.task('webpack:build', [ 'clean-build' ], callback => {
  let config = require(webpackConfig);

  // run webpack
  webpack(config, (err, stats) => {
		if (err) throw new gutil.PluginError("webpack:build", err);
		gutil.log("[webpack:build]", stats.toString({ colors: true }));
		callback();
  });
});


/*------------------------------*\
  #TASK.WEBPACK-DEV-SERVER
\*------------------------------*/

gulp.task('webpack-dev-server', callback => {
  process.env.WEBPACK_BUILD = 'debug'; // Ensure no minifications/etc at development

	// modify some webpack config options
  let config = require(webpackConfig);
	config.devtool = 'eval';
 
  let protocol = config.devServer.https ? 'https' : 'http';
  let appUrl = protocol + '://' + host.domain + ':' + host.port + '/';

  let isFirstCompile = true;

  let compiler = webpack(config);

  compiler.plugin('invalid', () => {
    if (isInteractive) clearConsole();
    gutil.log(color.cyan('Compiling...'));
  });

  // "done" event fires when Webpack has finished recompiling the bundle.
  // Whether or not you have warnings or errors, you will get this event.
  compiler.plugin('done', stats => {
    if (isInteractive) clearConsole();

    // We have switched off the default Webpack output in WebpackDevServer
    // options so we are going to "massage" the warnings and errors and present
    // them in a readable focused way.
    const messages = formatWebpackMessages(stats.toJson({}, true));
    const isSuccessful = !messages.errors.length && !messages.warnings.length;
    const showInstructions = isSuccessful && (isInteractive || isFirstCompile);

    if (isSuccessful) gutil.log(color.green('Compiled successfully!'));

    if (showInstructions) {
      gutil.log("\nThe app is running at:", color.cyan(appUrl),
        "\n\nNote that the development build is not optimized.",
        "\nTo create a production build, use", color.cyan('npm run build') + ".\n");
      isFirstCompile = false;
    }

    // If errors exist, only show errors.
    if (messages.errors.length) {
      gutil.log(color.red("Failed to compile.\n"));
      messages.errors.forEach(message => {
        gutil.log(message);
        gutil.log();
      });
      return;
    }

    // Show warnings if no errors were found.
    if (messages.warnings.length) {
      gutil.log(color.yellow("Compiled with warnings.\n"));
      messages.warnings.forEach(message => {
        gutil.log(message);
        gutil.log();
      });

      // Teach some ESLint tricks.
      gutil.log('You may use special comments to disable some warnings.');
      gutil.log('Use', color.yellow('// eslint-disable-next-line'), 'to ignore the next line.');
      gutil.log('Use', color.yellow('/* eslint-disable */'), ' to ignore all warnings in a file.');
    }
  });

	// Start a webpack-dev-server
  new devServer(compiler, config.devServer)
    .listen(host.port, host.domain, err => {
      if (err) throw new gutil.PluginError("webpack-dev-server", err);

      openBrowser(appUrl);
	  });
});


/*------------------------------*\
  #TASK.BUILD
\*------------------------------*/

gulp.task('build', [ 'webpack:build' ], () => {
  fs.copySync(paths.appPublic, paths.appBuild, {
    preserveTimestamps: true,
    dereference: true,
    filter: file => (
      file !== paths.appHtml &&
      path.basename(file) !== 'Thumbs.db' &&
      path.basename(file)[0] !== '.' // exclude .dotfiles
    )
  });
});

