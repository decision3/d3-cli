import fs from "fs"
import path from "path"
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const API_URL = JSON.parse(fs.readFileSync(__dirname+'/config.json')).host_url;

export function get_url(endpoint) {
    if(API_URL == null) {
        console.log("d3 is not configured, please use '--config' to pass the configuration");
        process.exit(128);
    }
    return API_URL+endpoint;
}