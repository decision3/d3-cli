import got from "got"
import fs from "fs"
import { get_url } from "./utils.js"
import ora from 'ora';

const spinner_type = 'arc';
const spinner_indent = 1;

export async function configure(configFile) {
    try {
        var spinner = ora({
            text: 'Configuring container',
            spinner: spinner_type,
            indent: spinner_indent
        }).start();
        await got.post(get_url('enclave/configure'), {
            json: JSON.parse(fs.readFileSync(configFile))
        })
        .json()
        .then(res => {
            spinner.succeed(res.response);
        });
     } catch (error) {
        console.log(error);   
        return error
     }
}

export async function deploy() {
    try {
        var spinner = ora({
            text: 'Creating container',
            spinner: spinner_type,
            indent: spinner_indent
        }).start();
        await got.post(get_url('enclave/image'))
        .json()
        .then(res => spinner.succeed(res.response+"  "))
        .then(() => {
            spinner = ora({
                text: 'Deploying enclave',
                spinner: spinner_type,
                indent: spinner_indent
            }).start()
        });

        await got.post(get_url('enclave/build'))
        .json()
        .then(res => spinner.succeed(res.response))
        .then(() => {
            spinner = ora({
                text: 'Starting enclave',
                spinner: spinner_type,
                indent: spinner_indent
            }).start()
        });
        
        await got.post(get_url('enclave/run'))
        .json()
        .then(res => spinner.succeed(res.response));

        process.exit(0);

     } catch (error) {
        return error;
     }
}

export async function terminate() {
    try {
        var spinner = ora({
            text: 'Terminating enclave',
            spinner: spinner_type,
            indent: spinner_indent
        }).start();
        await got.post(get_url('enclave/terminate'))
        .json()
        .then(res => spinner.succeed(res.response+"  "))

        process.exit(0);

     } catch (error) {
        return error;
     }
}