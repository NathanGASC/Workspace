import { exec, spawn } from "child_process";
require('dotenv').config();

if (process.env.ENV == "dev") {
    const child = spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', [
        "run",
        "build:ops:before",
        "&&",
        "npm",
        "run",
        "build:typescript",
        "&&",
        "npm",
        "run",
        "build:browserify",
        "&&",
        "npm",
        "run",
        "build:ops:after"
    ]);
    child.stdout.on('data', function (data) {
        console.log(data.toString());
    });

    child.stderr.on('data', function (data) {
        console.log(data.toString());
    });

    child.on('exit', function (code) {
        console.log('child process exited with code ' + code?.toString());
    });
} else {
    const child = spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', [
        "run",
        "build:ops:before",
        "&&",
        "npm",
        "run",
        "build:typescript",
        "&&",
        "npm",
        "run",
        "build:browserify",
        "&&",
        "npm",
        "run",
        "build:uglify",
        "&&",
        "npm",
        "run",
        "build:ops:after",
    ]);
    child.stdout.on('data', function (data) {
        console.log(data.toString());
    });

    child.stderr.on('data', function (data) {
        console.log(data.toString());
    });

    child.on('exit', function (code) {
        console.log('child process exited with code ' + code?.toString());
    });
}