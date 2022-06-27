import got from "got"
import fs from "fs"
import { get_url } from "./utils.js"

export async function configure(configFile) {
    try {
        var res = await got.post(get_url('enclave/configure'), {
            json: JSON.parse(fs.readFileSync(configFile))
        }).json()
        console.log(res.response);
     } catch (error) {
        console.log(error.response.body);   
        return error
     }
}

export async function deploy() {
    try {
        
        await got.post(get_url('enclave/image'))
        .json()
        .then(res => console.log(res.response))

        await got.post(get_url('enclave/build'))
        .json()
        .then(res => console.log(res.response))
        
        await got.post(get_url('enclave/run'))
        .json()
        .then(res => console.log(res.response))

     } catch (error) {
        return error;
     }
}