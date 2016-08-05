var browserSync = require('browser-sync'),
  gulp = require('gulp'),
  autoprefixer = require('gulp-autoprefixer'),
  clean = require('gulp-clean'),
  csso = require('gulp-csso'),
  plumber = require('gulp-plumber'),
  jade = require('gulp-jade'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  reload = browserSync.reload;

gulp.task('sass', function() {
  return gulp.src('app/sass/**/*.sass')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({
      precision: 10,
      includePaths: ['.'],
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: [
        'last 15 versions', '> 1%', 'ie 8', 'ie 9', 'Firefox ESR'
      ]
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/css'))
    .pipe(reload({stream: true}));
});

gulp.task('jade', function() {
  return gulp.src('app/**/*.jade')
    .pipe(plumber())
    .pipe(jade())
    .pipe(gulp.dest('dist/'))
    .pipe(reload({stream: true}));
});

gulp.task('js', function() {
  return gulp.src('app/js/**/*.js')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/js'))
    .pipe(reload({stream: true}));
});

gulp.task('serve', ['sass', 'jade', 'js'], function() {
  browserSync({
    notify: false,
    server: {
      baseDir: ['app', 'dist'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch('app/sass/**/*.sass', ['sass']);
  gulp.watch('app/**/*.jade', ['jade']);
  gulp.watch('app/js/**/*.js', ['js']);
  gulp.watch('app/fonts/**/*', ['fonts']);
  gulp.watch(['app/images/**/*', 'dist/fonts/**/*']).on('change', reload);
});

gulp.task('images', function() {
  return gulp.src('app/images/**/*')
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function() {
  return gulp.src(mainBowerFiles('**/*.{eot,svg,ttf,woff,woff2}')
    .concat('app/fonts/**/*'))
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('copy', function() {
  return gulp.src([
    'app/*.*'
  ], {
    dot: true
  }).pipe(gulp.dest('dist/'));
});

gulp.task('clean', function() {
  return gulp.src('dist/', {read: false})
    .pipe(clean());
});

gulp.task('build', ['clean', 'sass', 'jade', 'js']);
gulp.task('default', ['serve']);