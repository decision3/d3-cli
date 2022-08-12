# Decision3 CLI

You can find more information [here](https://decision3.ai/documentation)

`d3-cli` provides a fast and easy way to configure, deploy and manage `enclaves` across multiple cloud and on-premise infrastructure platforms. Secure enclaves (or just *enclaves*) are isolated containers which ensure data encryption and protection during execution. 

`Enclaves` by default provide limited connectivity capabilities and require modifications in code in order to provide secure execution.  

`d3-cli` allows deploying code with no modifications and provides rich configurable network interfaces.

The supported backends:
- [x] AWS Nitro VM (AWS host server code can be found [here](https://github.com/decision3/host-server))
- [ ] GCP confidential VMs
- [ ] Azure confidential VMs
- [ ] [Enarx](https://enarx.dev/)

# Usage

```bash
Usage: d3-cli [options] [commands]

Options:
      --version    Show version number                                 [boolean]
  -c, --config     Configure enclave.                                  [string]
  -d, --deploy     Deploy enclave                                      [boolean]
  -t, --terminate  Terminate enclave                                   [boolean]
  -l, --list       List enclave id                                     [boolean]
      --help       Show help                                           [boolean]
```

## **Configuration** `—-config`

`—-config` Configuration flag can be used to provide a configuration file (json format) to provide the following details:

- **Platform:** The cloud provider where the `enclave` need to be deployed
- **Backend:** This refers to the runtime to be used to deploy/manage the  `enclaves`
- **Host URL:** The URL for the cloud instance on which the `enclave` needs to be deployed
- **Email:** This is the email associated with the remote Github code repository
- **Repository:** The name of the Github code repository to fetch the code from. This is the code which is going to run inside the `enclave`.
- **Entry-point command:** The command to executed to run the code pulled from the repository
- **Token:** In the event the Github repository is a private repository, a developer token is required to pull the code.

```bash
$ more ./config.json
{
    "platform": "AWS",
    "backend": "nitro",
    "host_url": "http://51.72.216.87:9000/",
    "email": "dev@gdecision3.ai",
    "repo": "ubuntu-node-server",
    "cmd": "\"node /home/ubuntu-node-server/index.js\"",
    "token": "ghp_sD5Kss05Mfm8GgBKbT5ue6OecQv0Kd0vbVAI"
}

$ d3-cli --config ./config.json 
```

<aside>
💡 Currently only AWS platform with nitro backend is supported. The repositories supported at the moment are Github.

</aside>

## Deploy `—-deploy`

`—-deploy` Deploy flag can be used to deploy the `enclave`. This can only be executed after the configuration is done using `—-config`

```bash
$ d3-cli --deploy

✔ Enclave image created
✔ Enclave deployed
✔ Enclave running
✔ Proxy is on
```

The deploy command creates a docker container, converts it into an `enclave`, deploys the `enclave` using the specified backend and starts the `enclave`. Additionally, it deploys the monitoring host daemon to monitor the health of the `enclave` and communicate with it.

## List `—-list`

`—-list` List flag can be used to list the existing running `enclaves`.

```bash
$ d3-cli --list

Enclave-ID: i-0dca5a2cb426e6ffc-enc181dca21d128821e
```

If there is no `enclave` running then it will return the following message:

```bash
$ d3-cli --list

No enclave found
```

## Terminate `—-terminate`

`—-terminate` Terminate flag can be used to terminate the running `enclave`

```bash
$ d3-cli --terminate

✔ Enclave terminated
```
