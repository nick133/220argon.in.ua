/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var path = require('path');
var fs = require('fs');

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
var appDirectory = fs.realpathSync(process.cwd());
function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath);
}

module.exports = {
  appBuild:       resolveApp('build'),
  appPublic:      resolveApp('public'),
  appHtml:        resolveApp('public/index.html'),
  appTestHtml:    resolveApp('public/test.html'),
  appIndexJs:     resolveApp('src/index.js'),
  appTestJs:      resolveApp('src/index.test.js'),
  appPackageJson: resolveApp('package.json'),
  appSrc:         resolveApp('src'),
  appComponents:  resolveApp('src/components'),
  appEtc:         resolveApp('etc'),
  appNodeModules: resolveApp('node_modules'),

  publicPath: '/',
  asset: filename => 'assets/' + filename,
};

