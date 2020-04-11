import { series, parallel, src, dest, watch as gulpWatch } from "gulp";
const browserSync = require("browser-sync").create();
const typescript = require("gulp-typescript");
const sourcemaps = require("gulp-sourcemaps");
const gulpEjs = require("gulp-ejs");
const rename = require('gulp-rename')
const log = require('fancy-log')
const del = require('del')
const destination = "dist/";

export function clean(done) {
  return del([`${destination}**/*.{js,css,html}`]);
}
export function ts(done) {
  src("src/**/*.ts")
    .pipe(sourcemaps.init())
    .pipe(typescript())
    .pipe(sourcemaps.write({ sourceRoot: "./", includeContent: true }))
    .pipe(dest(destination));
  done();
}
export function css(done) {
  src("src/**/*.css").pipe(dest(destination));
  done();
}
export function html(done) {
  src("src/**/*.html")
    .pipe(dest(destination));
  done();
}
export function ejs(done) {
  src(["src/**/*.ejs", "!**/_*.ejs"])
    .pipe(gulpEjs())
    .on('error', log)
    .pipe(rename({ extname: '.html' }))
    .pipe(dest(destination))
  done();
}
export function reload(done) {
  browserSync.reload();
  done();
}
export const all = parallel(ts, css, html, ejs);

export function watch() {
  gulpWatch("src/**/*.ts", { events: "all" }, series(ts, reload));
  gulpWatch("src/**/*.css", { events: "all" }, series(css, reload));
  gulpWatch("src/**/*.html", { events: "all" }, series(html, reload));
  gulpWatch("src/**/*.ejs", { events: "all" }, series(ejs, reload));
}
export function server(done) {
  browserSync.init({
    notify: false,
    server: {
      baseDir: destination,
    },
  });
  done();
}

export const build = series(clean, all);
export default series(clean, all, server, watch);
