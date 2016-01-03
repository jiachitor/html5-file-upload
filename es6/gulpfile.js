var fs = require("fs"),
    gulp = require('gulp'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync'),
    gutil = require('gulp-util'),
    source = require('vinyl-source-stream'),
    assign = require('lodash.assign'),
    notify = require('gulp-notify'),
    minifycss = require('gulp-minify-css'),
    sass = require('gulp-sass'),
    eslint = require('gulp-eslint'),
    concat = require("gulp-concat"),
    order = require("gulp-order"),
    uglify = require("gulp-uglify"),
    browserify = require('browserify'),
    babelify = require('babelify'),
    watchify = require('watchify'),
    streamify = require('gulp-streamify'),
    buffer = require('vinyl-buffer');

var demo_config_list = ['demo1', 'demo2', 'demo3'],
    project = 'demo2';

var browserify_entries = './src/' + project + '/statics/concat/concat.js',
    browserify_dest = 'src/' + project + '/statics/js/';

// ES6 转换
var b = watchify(browserify(assign({}, watchify.args, {
    cache: {}, // required for watchify
    packageCache: {}, // required for watchify
    entries: [browserify_entries],
    debug: true
})));

// 在这里加入变换操作
//一定要有 npm install babel-preset-es2015 --save-dev 和 npm install babel-preset-react --save-dev 这两个依赖。
b.transform(babelify, {
    presets: ["es2015", "react"]
});

gulp.task('browserifyEs6Fn', bundle); // 这样你就可以运行 `gulp browserifyTask` 来编译文件了
b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal

function bundle() {
    return b.bundle()
        // log errors if they happen
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('bundle.js'))
        .pipe(buffer())
        //.pipe(uglify())
        .pipe(gulp.dest('src/' + project + '/statics/js/'))
        .pipe(browserSync.reload({
            stream: true
        }));
}

// 建立服务器
function browserSyncTask(callback) {
    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: project
        }
    });
    callback();
}

// js 合并
function jsConcatTask(callback) {
    var config = fs.readFileSync('src/' + project + '/statics/concat/concatConfig.json').toString();
    gulp
        .src('src/' + project + '/statics/concat/*.js')
        .pipe(order(JSON.parse(config)))
        .pipe(concat("bundle.js"))
        .pipe(gulp.dest('src/' + project + '/statics/js'))
        .on('finish', callback);
}

// js 合并压缩
function jsUglifyTask(callback) {
    var f_path = [project + '/statics/js/bundle.js', project + '/statics/js/app.js'];
    gulp
        .src(f_path)
        .pipe(order(f_path))
        .pipe(concat("app.bundle.js"))
        .pipe(uglify())
        .pipe(gulp.dest(project + '/statics/js'))
        .on('finish', callback);
}

// 代码检测
function jsEslintTask(callback) {
    gulp.src([project + '/statics/js/*.js'])
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failOnError last.
        .pipe(eslint.failOnError())
        .on('finish', callback);
}

function sassTask(callback) {
    // Serve files from the root of this project
    gulp.src([project + '/sass/app.scss'])
        .pipe(sass())
        .on('error', gutil.log)
        .pipe(rename('app.bundle.css'))
        .pipe(minifycss())
        .pipe(gulp.dest(project + '/statics'))
        .pipe(browserSync.stream({
            stream: true
        }))
        .pipe(notify('app.css to build complete'))
        .on('finish', callback);
}

function watchEsTask() {
    gulp.watch([project + '/js/*.js'], gulp.series(jsEslintTask, browserSync.reload));
    gulp.watch([project + '/sass/*.scss'], gulp.series(sassTask), browserSync.reload);
    gulp.watch([project + "/*.html"], browserSync.reload);
}

// ES6 项目使用
gulp.task('watch', gulp.series(
    browserSyncTask,
    gulp.parallel(sassTask, watchEsTask)
));

gulp.task('test', gulp.series(
    jsUglifyTask
));
