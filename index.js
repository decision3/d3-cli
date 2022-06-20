#! /usr/bin/env node

import _yargs from 'yargs'
import { version,describe } from './commands/enclave.js'
import { hideBin } from 'yargs/helpers';
const yargs = _yargs(hideBin(process.argv));

const usage_text = "\nUsage: d3-cli [options] [commands]";
const argv = yargs
                .usage(usage_text)  
                .option("l", {
                    alias:"list", 
                    describe: "List all deployed enclaves", 
                    type: "boolean", 
                    demandOption: false 
                })
                .option("v", {
                    alias:"host-version", 
                    describe: "Get host server version", 
                    type: "boolean", 
                    demandOption: false 
                })      
                .option("d", {
                    alias:"describe", 
                    describe: "Get list of enclaves", 
                    type: "boolean", 
                    demandOption: false 
                })                                                                          
                .help(true)  
                .argv;

// Process CLI arguments
if(argv.v){
    version();
}

if(argv.d){
    describe();
}