import { Octokit } from "octokit";
import fs from "fs"
require('dotenv').config();

const args: any = {}
args.auth = process.env.AUTH
args.owner = process.env.OWNER
args.repo = process.env.REPO

console.log("arguments:", args, process.env);

var start = async () => {
    const pkgFile = fs.readFileSync("./package.json", "utf-8");
    const versionRaw = /"version": ".*"/.exec(pkgFile)!
    const nameRaw = /"name": ".*"/.exec(pkgFile)!

    const version = versionRaw[0]!.split("\"")[3];
    const name = nameRaw[0]!.split("\"")[3];

    console.log(`Generate release for ${name}:${version}`);

    // Octokit.js
    // https://github.com/octokit/core.js#readme
    const octokit = new Octokit({
        auth: args.auth
    })

    const res = octokit.request('POST /repos/' + args.owner + '/' + args.repo + '/releases', {
        owner: args.owner,
        repo: args.repo,
        tag_name: "v" + version,
    })

    res.then((res) => {
        console.log("request status:" + res.status)
    })
};

start();
