const path = require("path");
var copy = require('recursive-copy');
const del = require('del');
require('dotenv').config();

del.sync([path.resolve(__dirname, "./../dist/client")]);
del.sync([path.resolve(__dirname, "./../dist/server")]);

copy(path.resolve(__dirname, "./../src/client/views"), path.resolve(__dirname, "./../dist/client/views"), function (error, results) { });
copy(path.resolve(__dirname, "./../src/client/assets"), path.resolve(__dirname, "./../dist/client/assets"), function (error, results) { });
copy(path.resolve(__dirname, "./../src/client/css"), path.resolve(__dirname, "./../dist/client/css"), function (error, results) { });

copy(path.resolve(__dirname, "./../src/client/components/views"), path.resolve(__dirname, "./../dist/client/components/views"), function (error, results) { });
copy(path.resolve(__dirname, "./../src/client/components/assets"), path.resolve(__dirname, "./../dist/client/components/assets"), function (error, results) { });
copy(path.resolve(__dirname, "./../src/client/components/css"), path.resolve(__dirname, "./../dist/client/components/css"), function (error, results) { });

copy(path.resolve(__dirname, "./../src/client/index.html"), path.resolve(__dirname, "./../dist/client/index.html"), function (error, results) { });
copy(path.resolve(__dirname, "./../src/client/index.css"), path.resolve(__dirname, "./../dist/client/index.css"), function (error, results) { });

copy(path.resolve(__dirname, "./../src/server/entities/ressources/index.html"), path.resolve(__dirname, "./../dist/client/ui/index.html"), function (error, results) { });
copy(path.resolve(__dirname, "./../src/server/entities/ressources/index.css"), path.resolve(__dirname, "./../dist/client/ui/index.css"), function (error, results) { });

if (process.env.COPY_SERVER == "TRUE") {
    copy(path.resolve(__dirname, "./../src/server/"), path.resolve(__dirname, "./../dist/server/"), function (error, results) { });
}