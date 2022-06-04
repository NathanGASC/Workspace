import { Octokit } from "octokit";
import fs from "fs"
require('dotenv').config();
import path from "path";

const args: any = {}
args.auth = process.env.AUTH
args.owner = process.env.OWNER
args.repo = process.env.REPO

console.log("check arguments:", args);
const dist = path.resolve(__dirname, "./../dist")

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
        const res = octokit.rest.repos.createRelease({
            owner: args.owner,
            repo: args.repo,
            tag_name: "v" + version,
            draft: true,
        })

        res.then((res) => {
            res.data.id
        })
    } catch (e) {
        console.error("Github returned an error on query")
        console.error(e);
    }
};

start();