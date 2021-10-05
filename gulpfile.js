 // Определяем переменную "preprocessor"
 "use strict";
const preprocessor = 'scss';
 const gulp = require("gulp");
// Определяем константы Gulp
const { src, dest, parallel, series, watch } = require('gulp');
 
// Подключаем Browsersync
const browserSync = require('browser-sync').create();
 
// Подключаем gulp-concat
const concat = require('gulp-concat');
 
// Подключаем gulp-uglify-es
const uglify = require('gulp-uglify-es').default;
 
// Подключаем модули gulp-sass или gulp-less
const sass = require('gulp-sass')(require('sass'));

const plumber = require("gulp-plumber");

// Подключаем Autoprefixer
const autoprefixer = require('gulp-autoprefixer');
 
// Подключаем модуль gulp-clean-css
const cleancss = require('gulp-clean-css');
 
// Подключаем gulp-imagemin для работы с изображениями
const imagemin = require('gulp-imagemin');
 
// Подключаем модуль gulp-newer
const newer = require('gulp-newer');
 
// Подключаем модуль del
const del = require('del');
// Подключаем модуль csso
const minify = require("gulp-csso");
// Подключаем модуль gulp-rename
const rename = require("gulp-rename");
// Подключаем модуль gulp-webp
const webp = require("gulp-webp");
// Подключаем модуль gulp-posthtml
const posthtml = require("gulp-posthtml");
// Подключаем модуль gulp4-run-sequence
const run = require("gulp4-run-sequence");
// Подключаем модуль posthtml-include
const include = require("posthtml-include")
// Подключаем модуль gulp-svgstore
const svgstore = require("gulp-svgstore")
// Подключаем модуль gulp-svgmin
const svgmin = require("gulp-svgmin")

 gulp.task("scripts", function() {
	 return src([ // Берем файлы из источников
		 'src/js/script.js', // Пользовательские скрипты, использующие библиотеку, должны быть подключены в конце
	 ])
		 .pipe(concat('script.js')) // Конкатенируем в один файл
		 .pipe(uglify()) // Сжимаем JavaScript
		 .pipe(rename("script.min.js"))
		 .pipe(dest('src/js')) // Выгружаем готовый файл в папку назначения
		 //.pipe(dest('build/js')) // Выгружаем готовый файл в папку назначения
		 .pipe(browserSync.stream()) // Триггерим Browsersync для обновления страницы
 });

 gulp.task("html", function (){
	 return src("src/*.html")
	 .pipe(posthtml([
		include()
		]))
		.pipe(dest("build"));
 });
gulp.task("style", function() {
	return src('src/scss/style.scss') // Выбираем источник: "src/sass/style.sass" или "src/less/style.less"
	.pipe(plumber())
	.pipe(sass()) // Преобразуем значение переменной "preprocessor" в функцию
	.pipe(concat('style.css')) // Конкатенируем в файл style.css
	.pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true })) // Создадим префиксы с помощью Autoprefixer
	// .pipe(cleancss( { level: { 1: { specialComments: 0 } }, format: 'beautify'} )) // Минифицируем стили
	.pipe(dest('build/css')) // Выгрузим результат в папку "src/css/"
	.pipe(dest('src/css'))
	.pipe(browserSync.stream()) // Сделаем инъекцию в браузер
	.pipe(minify())
	.pipe(rename("style.min.css"))
	.pipe(dest("src/css"));
});
gulp.task('images', function() {
	return src('src/img/src/**/*') // Берем все изображения из папки источника
	.pipe(newer('src/img/dest')) // Проверяем, было ли изменено (сжато) изображение ранее
	.pipe(imagemin()) // Сжимаем и оптимизируем изображеня
	.pipe(dest('src/img/dest')) // Выгружаем оптимизированные изображения в папку назначения
	.pipe(dest('build/img/dest')) // Выгружаем оптимизированные изображения в папку назначения
});
gulp.task("imgcl", series("images"), function() {
	return del('src/img/dest/**/*', { force: true }) // Удаляем все содержимое папки "src/images/dest/"
});
 gulp.task("webpcln", function() {
	return del('src/img/webp/**/*', {force: true})
 });
gulp.task("webp", function() {
	return src("src/img/**/*.{png,jpg}")
	.pipe(webp({quality: 90}))
	.pipe(dest("src/img/webp"));
});
gulp.task("sprite", function() {
	return src("src/img/src/**/*icon*.svg")
		.pipe(svgstore({
			inlineSvg:true
		}))
		.pipe(rename("sprite.svg"))
		.pipe(dest("src/img/dest"))
		.pipe(dest("build/img/dest"))
});

gulp.task("clean", function () {
	return del('build/**/*', { force: true }) // Удаляем все содержимое папки "build/"
});

gulp.task ("copy", function() {
	return src([ // Выбираем нужные файлы
		'src/fonts/**/*.{woff,woff2,ttf}',
		'src/css/**/*.css',
		'src/js/**/*.js',
		'src/img/dest/**/*',
		'src/**/*.html',
		'src/favicon*',
		], {
			base: 'src'
		}) // Параметр "base" сохраняет структуру проекта при копировании
	.pipe(dest('build')) // Выгружаем в папку с финальной сборкой
});

gulp.task("build", function(done) {
	run("clean",
		"images",
		"style",
		"scripts",
		"sprite",
		"copy",
		"html",
		function() {
		console.log('done');
		done();
	});
});
// Определяем логику работы Browsersync
gulp.task("serve", function() {
	browserSync.init({ // Инициализация Browsersync
		server: { baseDir: 'build/'}, // Указываем папку сервера
		notify: false, // Отключаем уведомления
		online: true, // Режим работы: true или false
		open: true,
		cors: true,
		ui:false
	});
	watch(['src/**/*.js', '!src/**/*.js'], parallel('scripts'));

	// Мониторим файлы препроцессора на изменения
	watch('src/**/' + preprocessor + '/**/*', parallel('style'));

	// Мониторим файлы HTML на изменения
	watch('src/**/*.html').on('change', browserSync.reload);

	watch('src/img/**/*', parallel("images"));
	watch('src/*.html', parallel("html"));
	watch('src/img/*.html', parallel("sprite"));
});

 gulp.task('default', parallel('serve', "style", "scripts", "html"));
