#! /usr/bin/env node

import _yargs from 'yargs'
import { configure, deploy, terminate, ls, pcr } from './commands/enclave.js'
import { hideBin } from 'yargs/helpers';
import fs from "fs"
import path from "path"
import { fileURLToPath } from 'url'

const yargs = _yargs(hideBin(process.argv));

const usage_text = "\nUsage: d3 [options] [commands]";
const argv = yargs
                .usage(usage_text)  
                .option("c", {
                    alias:"config", 
                    describe: "Configure container", 
                    type: "string", 
                    demandOption: false
                })
                .option("d", {
                    alias:"deploy", 
                    describe: "Deploy oracle", 
                    type: "boolean", 
                    demandOption: false
                })
                .option("t", {
                    alias:"terminate", 
                    describe: "Terminate oracle", 
                    type: "boolean", 
                    demandOption: false
                })
                .option("l", {
                    alias:"list", 
                    describe: "List oracle id", 
                    type: "boolean", 
                    demandOption: false
                })
                .option("p", {
                    alias:"pcr", 
                    describe: "Get PCR information for oracle", 
                    type: "boolean", 
                    demandOption: false
                })
                .help(true)  
                .argv;

console.log("");

// Process CLI arguments
if(argv.c){
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const config = fs.readFileSync(argv.c);
    fs.writeFileSync(__dirname+'/commands/config.json', JSON.stringify(JSON.parse(config)))
    configure(JSON.parse(config));
}

if(argv.d){
    deploy();
}

if(argv.t){
    terminate();
}

if(argv.l){
    ls();
}

if(argv.p){
    pcr();
}