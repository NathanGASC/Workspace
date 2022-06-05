import path from "path";
var copy = require('recursive-copy');
import del from 'del';
require('dotenv').config();

if (process.env.COPY_SERVER == "TRUE") {
    del.sync([path.resolve(__dirname, "./../dist/client")]);
} else {
    del.sync([path.resolve(__dirname, "./../dist")]);
}

copyClientFiles("default");

if (process.env.CLIENT) {
    copyClientFiles(process.env.CLIENT);
}

copy(path.resolve(__dirname, "./../src/server/entities/ressources/index.html"), path.resolve(__dirname, "./../dist/client/ui/index.html"), { overwrite: true });
copy(path.resolve(__dirname, "./../src/server/entities/ressources/index.css"), path.resolve(__dirname, "./../dist/client/ui/index.css"), { overwrite: true });

if (process.env.COPY_SERVER == "TRUE") {
    copy(path.resolve(__dirname, "./../src/server/"), path.resolve(__dirname, "./../dist/server/"), { overwrite: true });
}

async function copyClientFiles(client: string) {

    Promise.all([
        copy(path.resolve(__dirname, `./../src/client/${client}/views`), path.resolve(__dirname, "./../dist/client/views"), { overwrite: true }),
        copy(path.resolve(__dirname, `./../src/client/${client}/assets`), path.resolve(__dirname, "./../dist/client/assets"), { overwrite: true }),
        copy(path.resolve(__dirname, `./../src/client/${client}/css`), path.resolve(__dirname, "./../dist/client/css"), { overwrite: true }),

        copy(path.resolve(__dirname, `./../src/client/${client}/components/views`), path.resolve(__dirname, "./../dist/client/components/views"), { overwrite: true }),
        copy(path.resolve(__dirname, `./../src/client/${client}/components/assets`), path.resolve(__dirname, "./../dist/client/components/assets"), { overwrite: true }),
        copy(path.resolve(__dirname, `./../src/client/${client}/components/css`), path.resolve(__dirname, "./../dist/client/components/css"), { overwrite: true }),

        copy(path.resolve(__dirname, `./../src/client/${client}/index.html`), path.resolve(__dirname, "./../dist/client/index.html"), { overwrite: true }),
        copy(path.resolve(__dirname, `./../src/client/${client}/index.css`), path.resolve(__dirname, "./../dist/client/index.css"), { overwrite: true }),
    ])

}