
/* -------- Node modules -------- */
const chalk = require('chalk'),
      fs    = require('fs-extra'),
      path  = require('path'),
      task  = require('./wolt');

const log = console.log;

const webpack = require('webpack'),
      devServer = require('webpack-dev-server'),
      clearConsole = require('inferno-dev-utils/clearConsole'),
      formatWebpackMessages = require('inferno-dev-utils/formatWebpackMessages'),
      openBrowser = require('inferno-dev-utils/openBrowser');

/* -------- Misc configs -------- */
const paths = require('./paths');

// Must be set BEFORE webpack config is loaded! Also is needed for Babel.
process.env.NODE_ENV = 'production';

const webpackConfig = './webpack.config';

const isInteractive = process.stdout.isTTY;

const host = {
  domain: 'localhost',
  port: 3000,
}


/*------------------------------*\
  #DEFAULT-TASK
\*------------------------------*/

task.is('default', 'build');


/*------------------------------*\
  #CLEAN-TASKS
\*------------------------------*/

task.is('clean-build', () => fs.emptyDirSync('build'));

task.is('cleanall', () => fs.removeSync('build'));


/*------------------------------*\
  #TASK.WEBPACK-DEV-SERVER
\*------------------------------*/

task.is('watch', 'webpack-dev-server');

task.is('webpack-dev-server', () => {
  process.env.WEBPACK_BUILD = 'debug'; // Ensure no minifications/etc at development

	// modify some webpack config options
  let config = require(webpackConfig);
	config.devtool = 'eval';
 
  let protocol = config.devServer.https ? 'https' : 'http';
  let appUrl = protocol + '://' + host.domain + ':' + host.port + '/';

  let isFirstCompile = true;

  let compiler = webpack(config);

  // "invalid" event fires when you have changed a file, and Webpack is
  // recompiling a bundle. WebpackDevServer takes care to pause serving the
  // bundle, so if you refresh, it'll wait instead of serving the old one.
  // "invalid" is short for "bundle invalidated", it doesn't imply any errors.
  compiler.plugin('invalid', () => {
    if (isInteractive) clearConsole();
    log(chalk.cyan('Compiling...'));
  });

  // "done" event fires when Webpack has finished recompiling the bundle.
  // Whether or not you have warnings or errors, you will get this event.
  compiler.plugin('done', stats => {
    // We have switched off the default Webpack output in WebpackDevServer
    // options so we are going to "massage" the warnings and errors and present
    // them in a readable focused way.
    const messages = formatWebpackMessages(stats.toJson({}, true));
    const isSuccessful = !messages.errors.length && !messages.warnings.length;
    const showInstructions = isSuccessful && (isInteractive || isFirstCompile);

    if (isSuccessful) {
      // Clear console only at success - no lost error messages from linters
      if (isInteractive) clearConsole(); 

      log(chalk.green('Compiled successfully!'));
    }

    if (showInstructions) {
      log("\nThe app is running at:", chalk.cyan(appUrl),
        "\n\nNote that the development build is not optimized.",
        "\nTo create a production build, use", chalk.cyan('npm run build') + ".\n");
      isFirstCompile = false;
    }

    // If errors exist, only show errors.
    if (messages.errors.length) {
      log(chalk.red("Failed to compile.\n"));
      messages.errors.forEach(message => {
        log(message);
        log();
      });
      return;
    }

    // Show warnings if no errors were found.
    if (messages.warnings.length) {
      log(chalk.yellow("Compiled with warnings.\n"));
      messages.warnings.forEach(message => {
        log(message);
        log();
      });

      // Teach some ESLint tricks.
      log('You may use special comments to disable some warnings.');
      log('Use', chalk.yellow('// eslint-disable-next-line'), 'to ignore the next line.');
      log('Use', chalk.yellow('/* eslint-disable */'), ' to ignore all warnings in a file.');
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
  #BUILD-TASKS
\*------------------------------*/

task.is('webpack:build', debug => {
  task.do('clean-build');

  // if (isInteractive) clearConsole();

  if (debug) process.env.WEBPACK_BUILD = 'debug';

  let config = require(webpackConfig);

  // run webpack
  webpack(config, (err, stats) => {
		if (err) throw new gutil.PluginError("webpack:build", err);
		log("[webpack:build]", stats.toString({ colors: true }));
  });
});

task.is('build-pub', () => {
  task.do('clean-build');

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

task.is('build', () => ['build-pub', 'webpack:build'].forEach(task.do));
task.is('build:dev', () => {
  task.do('build-pub');
  task.do('webpack:build', { debug: true });
});

task.cli();

