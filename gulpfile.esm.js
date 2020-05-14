import { series, parallel } from "gulp";
const browserSync = require("browser-sync").create();

export function clean() {
  const del = require("del");
  return del([`dist/**/*.{js,css,html}`]);
}

export function ts() {
  const { src, dest } = require("gulp");
  const typescript = require("gulp-typescript");
  const sourcemaps = require("gulp-sourcemaps");

  return src("src/**/*.ts")
    .pipe(sourcemaps.init())
    .pipe(typescript())
    .pipe(sourcemaps.write({ sourceRoot: "./", includeContent: true }))
    .pipe(dest("dist"));
}
export function css() {
  const { src, dest } = require("gulp");
  return src("src/**/*.css").pipe(dest("dist"));
}
export function html() {
  const { src, dest } = require("gulp");
  return src("src/**/*.html").pipe(dest("dist"));
}
export function ejs() {
  const { src, dest } = require("gulp");
  const ejs = require("gulp-ejs");
  const log = require("fancy-log");
  const rename = require("gulp-rename");
  return src(["src/**/*.ejs", "!**/_*.ejs"])
    .pipe(ejs())
    .on("error", log)
    .pipe(rename({ extname: ".html" }))
    .pipe(dest("dist"));
}
export function reload(done) {
  browserSync.reload();
  done();
}
export const all = parallel(ts, css, html, ejs);

export function watch() {
  const { watch } = require("gulp");
  watch("src/**/*.ts", { events: "all" }, series(ts, reload));
  watch("src/**/*.css", { events: "all" }, series(css, reload));
  watch("src/**/*.html", { events: "all" }, series(html, reload));
  watch("src/**/*.ejs", { events: "all" }, series(ejs, reload));
}
export function server() {
  browserSync.init({
    notify: false,
    server: {
      baseDir: "dist",
    },
  });
}

export const build = series(clean, all);
export default series(clean, all, parallel(server, watch));
