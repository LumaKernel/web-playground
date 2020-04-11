import { series, parallel, src, dest, watch } from "gulp";
const browserSync = require("browser-sync").create();
const typescript = require("gulp-typescript");
const sourcemaps = require("gulp-sourcemaps");
const clean = require("gulp-clean");
const destination = "dist/";

export function cleanAll(done) {
  src(["dist/**/*.{js,css,html}"], {
    read: false,
  }).pipe(clean());
  done();
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
  src("src/**/*.html").pipe(dest(destination));
  done();
}
export function reload(done) {
  browserSync.reload();
  done();
}
export const all = parallel(ts, css, html);

export function watchAll() {
  watch("src/**/*.ts", { events: "all" }, series(ts, reload));
  watch("src/**/*.css", { events: "all" }, series(css, reload));
  watch("src/**/*.html", { events: "all" }, series(html, reload));
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

export const build = series(cleanAll, all);
export default series(cleanAll, all, server, watchAll);
