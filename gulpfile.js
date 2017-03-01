
const gulp    = require('gulp'),
      gutil   = require('gulp-util'),
      ps      = require('child_process'),
      plumber = require('gulp-plumber'),
      stylus  = require('gulp-stylus'),

      glob = require("glob"),
      del  = require("del");


const color = gutil.colors;

const src = {
    m4:     "src/**/*.m4", // trigger m4 task
    m4glob: "src/**/*.{styl,stylus,js,jsx,less,sass}.m4", // only feed those to m4
    styl:   "src/**/*.styl",
    html:   "src/**/*.html",
    css:    "src/**/*.css",
    js:     "src/**/*.js",
    json:   "src/**/*.json"
};


gulp.task('default', [ 'm4', 'styl', 'watch' ]);

gulp.task('watch',function() {
    gulp.watch(src.m4,   [ 'm4' ]);
    gulp.watch(src.styl, [ 'styl' ]);

    return;
});

gulp.task('m4', function() {
    glob.sync(src.m4glob).forEach(function(file) {
        let dest = file.replace('.m4', '');

        gutil.log(color.yellow('m4:'), ' processing ', file, ' -> ', dest);
        ps.exec('m4 ' + file + '>' + dest);
    });

    return;
});

gulp.task('styl', function() {
    return gulp.src(src.styl)
        .pipe(plumber())
        .pipe(stylus())
        .pipe(gulp.dest('src'));
});

gulp.task('clean-build', function() {
    del(['build/**/.*', 'build/**/*.swp'], {dryRun: false})
    .then(paths => {
        gutil.log(color.yellow('Performing build cleanup:'));
        paths.forEach(function(file) {
            gutil.log(color.red('x'), file);
        });
    });
});
