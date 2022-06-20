import got from "got"
import { get_url } from "./utils.js"

export function version() {
    got.get(get_url('version'), {responseType: 'json'})
    .then(res => {
      const response = res.body;
      console.log(JSON.stringify({"Host server Nitro-CLI version": response.version},null,4));
    })
    .catch(err => {
      console.log('Error: ', err.message);
    });
}

export function describe() {
    got.get(get_url('describe'), {responseType: 'json'})
    .then(res => {
      const response = res.body;
      console.log(JSON.stringify({"Description": response.description},null,4));
    })
    .catch(err => {
      console.log('Error: ', err.message);
    });
}
