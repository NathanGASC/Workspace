import { Octokit } from "octokit";
import yargs from "yargs";
import fs from "fs"

var start = async ()=>{
    const argv = await yargs.command('pipeline:release:github', 'Generate a github release', {
        auth: {
            description: 'your auth token for github',
            alias: 'a',
            type: 'string'
        },
        owner: {
            description: 'the project owner',
            alias: 'o',
            type: 'string'
        },
        repo: {
            description: 'the repo name',
            alias: 'r',
            type: 'string'
        }
    })
    
    const args = await argv.parse()
    if(!args.a && !args.auth){
        throw new Error("You need to pass your github's auth token with -a parameter");
    }

    if(!args.o){
        throw new Error("You need to pass the repo owner account name with -o parameter");
    }

    if(!args.r){
        throw new Error("You need to pass the repo name with -r parameter");
    }

    const pkgFile = fs.readFileSync("./package.json","utf-8");
    const versionRaw = /"version": ".*"/.exec(pkgFile)!
    const nameRaw = /"name": ".*"/.exec(pkgFile)!

    const version = versionRaw[0]!.split("\"")[3];
    const name = nameRaw[0]!.split("\"")[3];

    console.log(`Generate release for ${name}:${version}`);
    
    // Octokit.js
    // https://github.com/octokit/core.js#readme
    const octokit = new Octokit({
        auth: args.a || args.auth
    })
    
    const res = octokit.request('POST /repos/'+args.o+'/'+args.r+'/releases', {
        owner: args.o,
        repo: args.r,
        tag_name: "v"+version,
    })
    
    res.then((res) => {
        console.log("request status:" + res.status)
    })
};

start();
