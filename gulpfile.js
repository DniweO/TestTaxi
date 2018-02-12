'use strict';

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

const gulp         = require('gulp'),
      plumber      = require('gulp-plumber'),
      sourcemaps   = require('gulp-sourcemaps'),
      rename       = require('gulp-rename'),
      pug          = require('gulp-pug'),
      sass         = require('gulp-sass'),
      htmlPrettify = require('gulp-html-prettify'),
      concat       = require('gulp-concat'),
      babel        = require('gulp-babel'),
      uglify       = require('gulp-uglify'),
      svgo         = require('gulp-svgo'),
      svgSprite    = require('gulp-svg-sprite'),
      cheerio      = require('gulp-cheerio'),
      replace      = require('gulp-replace'),
      browserSync  = require('browser-sync').create(),
      debug        = require('gulp-debug'),
      csso         = require('gulp-csso'),
      postcss      = require('gulp-postcss'),
      autoprefixer = require('autoprefixer'),
      mqpacker     = require('css-mqpacker'),
      pxtorem      = require('postcss-pxtorem'),
      gulpIf       = require('gulp-if'),
      del          = require('del'),
      newer        = require('gulp-newer'), // gulp-changed
      notify       = require('gulp-notify');

const paths = {
  js:     './src/js/',
  libs:   './src/vendor/',
  images: './src/img/',
  svg:    './src/svg/',
  fonts:  './src/fonts/',
  sass:   './src/scss/',
  pug:    './src/pug/',
  dest:   {
    root: './build/'
  }
};

const sources = {
  jsSrc:       [
    paths.js + 'browser-updater.js',
    paths.js + 'map.js'
  ],
  libsJsSrc:   [
    paths.libs + 'jquery/dist/jquery.min.js'
  ],
  imgSrc:      paths.images + '**/*.{png,jpg,jpeg,gif,svg,ico}',
  fontsSrc:    paths.fonts + '**/*.{woff,woff2,ttf, eot}',
  sassSrc:     paths.sass + 'style.scss',
  libsSassSrc: [
    paths.libs + 'normalize-css/normalize.css'
  ],
  pugSrc:      [paths.pug + '*.pug', '!' + paths.pug + '_*.pug']

};

gulp.task('pug', function() {

  return gulp.src(sources.pugSrc)
             .pipe(plumber())
             .pipe(pug({pretty: true}))
             .pipe(htmlPrettify({indent_char: ' ', indent_size: 2}))
             .pipe(plumber.stop())
             .pipe(gulp.dest(paths.dest.root));

});

gulp.task('sass', function() {
  const AUTOPREFIXER_BROWSERS = [
    'last 2 versions',
    'ie >= 10'
  ];

  const POSTCSS_PLUGINS = [
    pxtorem({
              rootValue:         10,
              mediaQuery:        false,
              minPixelValue:     0,
              selectorBlackList: []
            }),
    mqpacker({sort: true}),
    autoprefixer({browsers: AUTOPREFIXER_BROWSERS})
  ];

  return gulp.src(sources.sassSrc)
             .pipe(debug())
             .pipe(plumber(notify.onError(function(err) {
               return {
                 title:   'SCSS',
                 message: err.message
               };
             })))
             .pipe(gulpIf(isDevelopment, sourcemaps.init()))
             .pipe(sass({}))
             .pipe(debug({title: 'sass'}))
             .pipe(postcss(POSTCSS_PLUGINS))
             .pipe(debug({title: 'postcss'}))
             .pipe(rename({suffix: '.min'}))
             .pipe(gulpIf(!isDevelopment, csso()))
             .pipe(debug({title: 'csso'}))
             .pipe(gulpIf(isDevelopment, sourcemaps.write('.')))
             .pipe(plumber.stop())
             //.on('error', console.log)
             .pipe(debug())
             .pipe(gulp.dest(paths.dest.root + 'css'));
});

gulp.task('libsCss', function() {

  return gulp.src(sources.libsSassSrc)
             .pipe(plumber())
             .pipe(concat('libs.css'))
             .pipe(csso())
             .pipe(plumber.stop())
             .pipe(gulp.dest(paths.dest.root + 'css'));
});

gulp.task('js', function() {
  return gulp.src(sources.jsSrc)
             .pipe(plumber())
             .pipe(gulpIf(isDevelopment, sourcemaps.init()))
             .pipe(babel({presets: ['env']}))
             .pipe(concat('scripts.js', {newLine: '\n\r'}))
             .pipe(gulpIf(isDevelopment, uglify()))
             .pipe(gulpIf(isDevelopment, sourcemaps.write('.')))
             .pipe(plumber.stop())
             //.on('error', console.log)
             .pipe(gulp.dest(paths.dest.root + 'js'));
});

gulp.task('libsJs', function() {
  return gulp.src(sources.libsJsSrc)
             .pipe(plumber())
             .pipe(concat('libs.js'))
             .pipe(plumber.stop())
             .pipe(gulp.dest(paths.dest.root + 'js/'));
});

gulp.task('img', function() {
  return gulp.src(sources.imgSrc)
             .pipe(gulp.dest(paths.dest.root + 'img'));
});

gulp.task('fonts', function() {
  return gulp.src(sources.fontsSrc)
             .pipe(gulp.dest(paths.dest.root + 'fonts'));
});

//  ######### svg sprite #########
gulp.task('svg', function() {
  return gulp.src(paths.svg + '*.svg')
             .pipe(plumber())
             .pipe(svgo({
                          js2svg: {
                            indent: 2, // optional, default is 4
                            pretty: true
                          }
                        }))
             // remove all fill and style declarations in out shapes
             .pipe(cheerio({
                             run:           function($) {
                               //$('[fill]').removeAttr('fill');
                               $('[stroke]').removeAttr('stroke');
                               //$('[style]').removeAttr('style');
                             },
                             parserOptions: {xmlMode: true}
                           }))
             // cheerio plugin create unnecessary string '&gt;', so replace it.
             .pipe(replace('&gt;', '>'))
             // build svg sprite
             .pipe(svgSprite({
                               mode: {
                                 symbol: {
                                   sprite:  '../sprite.svg',
                                   render:  {
                                     scss: {
                                       dest:     '../../scss/_svg-sprite.scss',
                                       template: paths.sass + 'templates/_sprite_template.scss'
                                     }
                                   },
                                   example: true
                                 }
                               }
                             }))
             .pipe(replace('<?xml version="1.0" encoding="utf-8"?>', ''))
             .pipe(cheerio({
                             run:           function($) {
                               $('[xmlns]').removeAttr('xmlns');
                               $('svg').css('display', 'none');
                             },
                             parserOptions: {xmlMode: true}
                           }))
             .pipe(plumber.stop())
             .pipe(gulp.dest(paths.images));
});
//  ######### !svg sprite #########

//clean build folder
gulp.task('clean', function() {
  return del(paths.dest.root);
});

gulp.task('copy', function() {
  return gulp.src('./src/**/*.*')
             .pipe(gulp.dest(paths.dest.root));
});

gulp.task('assets', function() {
  return gulp.src(paths.fonts + '**/*.*', {since: gulp.lastRun('assets')})
             .pipe(newer(paths.dest.root))
             .pipe(debug({title: 'assets'}))
             .pipe(gulp.dest(paths.dest.root));
});

gulp.task('watch', function() {
  gulp.watch(paths.pug + '**/*.pug', gulp.series('pug'));
  gulp.watch(paths.sass + '**/*.scss', gulp.series('sass'));
  gulp.watch(paths.js + '**/*.js', gulp.series('js'));
});

gulp.task('serve', function() {
  browserSync.init({
                     server: {
                       baseDir: paths.dest.root
                     },
                     port:   3000,
                     open:   true,
                     notify: false,
                     ui:     false
                   });

  browserSync.watch(paths.dest.root + '**/*.*').on('change', browserSync.reload);
});

gulp.task('build', gulp.series(
  'clean',
  gulp.parallel('pug', 'sass', 'js', 'img', 'svg', 'fonts', 'libsCss', 'libsJs')
));

gulp.task('default', gulp.series('build', gulp.parallel('watch', 'serve')));