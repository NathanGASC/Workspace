import { Octokit } from "octokit";
import fs from "fs"
require('dotenv').config();
import del from 'del';
import path from "path";
import copy from "copy"

const args: any = {}
args.auth = process.env.AUTH
args.owner = process.env.OWNER
args.repo = process.env.REPO

console.log("check arguments:", args);

console.log("Delete all, except dist folder")
const all = path.resolve(__dirname, "./../**")
const dist = path.resolve(__dirname, "./../dist")
const base = path.resolve(__dirname, "./../")
del.sync([all, `!${dist}`]);
console.log("Delete done")

console.log("Copy dist content in base directory")
copy(dist, base, function (err, files) {
    if (err) throw err;
    console.log("Copy done")

    start();
});

var start = async () => {
    const pkgFile = fs.readFileSync("./package.json", "utf-8");
    const versionRaw = /"version": ".*"/.exec(pkgFile)!
    const nameRaw = /"name": ".*"/.exec(pkgFile)!

    const version = versionRaw[0]!.split("\"")[3];
    const name = nameRaw[0]!.split("\"")[3];

    console.log(`Generate release for ${name}:${version}`);

    const octokit = new Octokit({
        auth: args.auth
    })

    console.log("Query github for release")
    try {
        const res = octokit.request('POST /repos/' + args.owner + '/' + args.repo + '/releases', {
            owner: args.owner,
            repo: args.repo,
            tag_name: "v" + version,
        })

        res.then((res) => {
            console.log("request status:" + res.status)
        })
    } catch (e) {
        console.error("Github returned an error on query")
        console.error(e);
    }



};
