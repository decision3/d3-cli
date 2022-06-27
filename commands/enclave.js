import got from "got"
import fs from "fs"
import { get_url } from "./utils.js"
import ora from 'ora';

export async function configure(configFile) {
    try {
        var spinner = ora({
            text: 'Configuring container',
            spinner:'arc',
            indent: 2
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
            spinner:'arc',
            indent: 2
        }).start();
        await got.post(get_url('enclave/image'))
        .json()
        .then(res => spinner.succeed(res.response+"  "))
        .then(() => {
            spinner = ora({
                text: 'Deploying enclave',
                spinner:'arc',
                indent: 2
            }).start()
        });

        await got.post(get_url('enclave/build'))
        .json()
        .then(res => spinner.succeed(res.response))
        .then(() => {
            spinner = ora({
                text: 'Starting enclave',
                spinner:'arc',
                indent: 2
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