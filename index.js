#! /usr/bin/env node

import _yargs from 'yargs'
import { configure, deploy } from './commands/enclave.js'
import { hideBin } from 'yargs/helpers';
const yargs = _yargs(hideBin(process.argv));

const usage_text = "\nUsage: d3-cli [options] [commands]";
const argv = yargs
                .usage(usage_text)  
                .option("c", {
                    alias:"config", 
                    describe: "Configure dockerfile", 
                    type: "string", 
                    demandOption: false
                })
                .option("d", {
                    alias:"deploy", 
                    describe: "Deploy enclave", 
                    type: "boolean", 
                    demandOption: false
                })
                .help(true)  
                .argv;

// Process CLI arguments
if(argv.c){
    configure(argv.c);
}

if(argv.d){
    deploy();
}