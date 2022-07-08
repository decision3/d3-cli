import got from "got"
import { get_url } from "./utils.js"
import ora from 'ora';
import fs from "fs"
import path from "path"
import { fileURLToPath } from 'url'
import { PassThrough } from "stream";

const spinner_type = 'arc';
const spinner_indent = 1;

export async function configure(config) {
    try {
        var spinner = ora({
            text: 'Configuring container',
            spinner: spinner_type,
            indent: spinner_indent
        }).start();
        await got.post(get_url('enclave/configure'), {
            json: config
        })
        .json()
        .then(res => {
            spinner.succeed(res.response);
        });

        console.log("");
        process.exit(0);

     } catch (error) {
        return error
     }
}

export async function deploy() {
    try {
        var image_endpoint = get_url('enclave/image');
        var spinner = ora({
            text: 'Creating container',
            spinner: spinner_type,
            indent: spinner_indent
        }).start();
        await got.post(image_endpoint)
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
        .then(res => spinner.succeed(res.response))
        .then(() => {
            spinner = ora({
                text: 'Starting proxy',
                spinner: spinner_type,
                indent: spinner_indent
            }).start()
        });
        
        await got.post(get_url('services/proxy'))
        .json()
        .then(res => spinner.succeed(res.response));

        console.log("");
        process.exit(0);

     } catch (error) {
        return error;
     }
}

export async function ls() {
    try {
        await got.get(get_url('enclave/'))
        .json()
        .then(res => {
            if(res.response != 'null') {
                console.log("Enclave ID: ", res.response);
            } else {
                console.log("No enclave found");
            }
        });

        console.log("");
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

        console.log("");
        process.exit(0);

     } catch (error) {
        return error;
     }
}