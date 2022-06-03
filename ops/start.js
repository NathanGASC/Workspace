const { execSync, exec, spawn } = require('child_process');
require('dotenv').config();

execSync("cd ..");
if(process.env.COPY_SERVER != "TRUE"){
    const server = spawn("node",["./dist/server/index.js"]);

    server.stdout.on('data', function (data) {
        console.log(data.toString());
    });
    
    server.stderr.on('data', function (data) {
        console.log(data.toString());
    });

    server.on('exit', function (code) {
        console.log('child process exited with code ' + code.toString());
    });
}else{
    console.log("With COPY_SERVER=TRUE, we can't start the server for you. You have to launch it manually.")
}