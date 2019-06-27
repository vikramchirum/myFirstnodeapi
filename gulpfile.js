const gulp = require('gulp');
const del = require('del');
const gulp_octo = require('@octopusdeploy/gulp-octo');
const git = require('git-rev-sync');
const ver = require('./package').version;
const argv = require('minimist')(process.argv.slice(2));

const two_digit = function (number) {
    return ('00' + number).slice(-2);
};

const get_version = function () {
    const now = new Date();
    const branch_name = git.branch(),
        short = git.short(),
        year = now.getFullYear(),
        month = now.getMonth() + 1,
        day = now.getDate(),
        hour = now.getHours(),
        min = now.getMinutes(),
        sec = now.getSeconds();
    const timestamp = '' + year + two_digit(month) + two_digit(day) + two_digit(hour) + two_digit(min) + two_digit(sec);
    const parts = [ver, branch_name, timestamp, short];
    return parts.join('-');
};

const tasks = {};

tasks.clean = function () {
    return del(['pkg']);
};

tasks.pack = function () {
    return gulp.src(['**/*', '!coverage{,/**}', '!pkg{,/**}'])
        .pipe(gulp_octo.pack('.zip', {version: get_version()}))
        .pipe(gulp.dest('./pkg'));
};

tasks.push = async function () {
    if (argv.octo_api_url && argv.octo_api_key) {
        return gulp.src('./pkg/*.zip')
            .pipe(gulp_octo.push({host: argv.octo_api_url, apiKey: argv.octo_api_key}));
    }
    else {
        console.log('Must pass arguments to do a push');
    }
};

tasks.build = gulp.series(tasks.clean, tasks.pack);
tasks.publish = gulp.series(tasks.clean, tasks.pack, tasks.push);

module.exports = tasks;
