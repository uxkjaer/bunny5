# Welcome to 🐰5
A UI5 tooling runtime build around [bun.sh](https://bun.sh)

The idea of the project is to have certain aspects of ui5 tooling running using bun. This will give significant performance improvements. This is only meant as a development and build package. Not as an entire server.

## Very much WIP, but here is how to check it out.
Be aware that if you run windows, then you need to run it in WSL.
1. install bun using the instructions on [bun.sh](https://bun.sh)
2. clone this repo.
3. run npm link to the bunny5/packages/server repo
4. Download the sapui5 runtime from [tools.hana.ondemand.com](https://tools.hana.ondemand.com/#sapui5) and unzip them into your ui5 app repo in the root.
5. run command bun run ./node_modules/bunny5-server/index.ts
6. open browser on http://localhost:3000/webapp/index.html