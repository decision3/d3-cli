import got from "got"
import { get_url } from "./utils.js"
import ora from 'ora';
import fs from "fs"
import path from "path"
import { fileURLToPath } from 'url'
import { PassThrough } from "stream";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const spinner_type = 'arc';
const spinner_indent = 1;

export async function configure(config) {
    try {
        var spinner = ora({
            text: 'Configuring oracle',
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
            text: 'Creating oracle',
            spinner: spinner_type,
            indent: spinner_indent
        }).start();
        await got.post(image_endpoint)
        .json()
        .then(res => spinner.succeed(res.response+"  "))
        .then(() => {
            spinner = ora({
                text: 'Deploying oracle',
                spinner: spinner_type,
                indent: spinner_indent
            }).start()
        });

        await got.post(get_url('enclave/build'))
        .json()
        .then(res => {
            try {
                fs.writeFileSync(__dirname+'/pcr.json', JSON.stringify(res.pcr));
            } catch (error) {
                console.log(error);
            }
            spinner.succeed(res.response)
        })
        .then(() => {
            spinner = ora({
                text: 'Starting oracle',
                spinner: spinner_type,
                indent: spinner_indent
            }).start()
        });

        await got.post(get_url('enclave/run'))
        .json()
        .then(res => spinner.succeed(res.response))
        .then(() => {
            spinner = ora({
                text: 'Starting network interface',
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

export function pcr() {
    try {
        pcr = JSON.parse(fs.readFileSync(__dirname+'/pcr.json'));
        console.log(pcr);

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
                console.log("Oracle ID: ", res.response);
            } else {
                console.log("No oracle found");
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
            text: 'Terminating oracle',
            spinner: spinner_type,
            indent: spinner_indent
        }).start();
        await got.post(get_url('enclave/terminate'))
        .json()
        .then(res => {
            fs.unlinkSync(__dirname+'/pcr.json');
            spinner.succeed(res.response+"  ");
        })

        console.log("");
        process.exit(0);

     } catch (error) {
        return error;
     }
}