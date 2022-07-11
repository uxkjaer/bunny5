import Bao from "baojs";
import * as yaml from "js-yaml";
import * as path from 'path'
import * as os from 'os'
import fs from "fs"
import { serve } from "bun";
import { ServerResponse } from "http";
interface INormalizer {

  translatorName: any,
  configPath: any
  frameworkOptions?: any

}
export default class bunny5_server {
  tree: any;
  projectYaml: any;
  constructor(argv: any) {
    console.log("server is starting")
    this._getTree()
    
  } 

  async _getTree() {
    // console.log(process.cwd() +"/ui5.yaml")
    const ui5yaml = Bun.file(process.cwd() +"/ui5.yaml")
    
    const fsUi5 = fs.readFileSync(process.cwd() +"/ui5.yaml", {encoding:'utf8', flag:'r'})
    // console.log(Bun.readableStreamToText(await ui5yaml.stream()))
    this.projectYaml = yaml.load(fsUi5)
    console.log("test" + this.projectYaml)
  }

  serve() {
    const app = new Bao();
    // const batch = new ODataBatch();
    app.get("/sap/*opu", (ctx) => {
      try {
        const reg = /(?:\/sap\/opu\/odata\/service\/)([\s\S]*)/
        const urlPath = reg.exec(ctx.path)[1]

        if (urlPath.includes("$metadata")) {
          const blob = Bun.file("/Users/I565634/git/fe/bunny5/webapp/localService/metadata.xml");
          return ctx.sendRaw(new Response(blob))

        }
        else {

          const blob = Bun.file("/Users/I565634/git/fe/bunny5/webapp/localService/mockdata/" + path + "Bun.json");
          return ctx.sendRaw(new Response(blob))
        }
      }
      catch (e) { }
    })
    app.get("/welcome/*wll", (ctx) => {
      console.log(process.cwd())
      const blob = Bun.pathToFileURL(ctx.path)
      console.log(blob)
      return ctx.sendText("Hello World")
    })

    app.get("/resources/*sap", (ctx) => {
      const libRegex = /(?:\/resources)([\s\S]*)/
      const urlPath : string | undefined = libRegex.exec(ctx.path)?.toString()
      if (urlPath){
        const ui5Path = Bun.pathToFileURL(urlPath)
        const filePath = path.join(__dirname, urlPath)
        // const filePath = path.join(os.homedir(), ".ui5", "framework", "packages", `@${this.projectYaml.framework.name}`, `${this.projectYaml.framework.version}`)
        console.log(ui5Path)
        console.log(filePath)
        return ctx.sendRaw(new Response(Bun.file(filePath)))

      }
    })
    app.get("/webapp/*app", (ctx) => {
      console.log("im here)")
      try {
        // const reg = /(?:\/webapp\/)([\s\S]*)/
        // const path = reg.exec(ctx.path)[1]
        console.log(process.cwd() + ctx.path)
          const blob = Bun.file(process.cwd() + ctx.path);
          return ctx.sendRaw(new Response(blob))
        }
      
      catch (err) { }
    });
    console.log("server is listening")
    app.listen();

  }
}

const server = new bunny5_server(null)
server._getTree()
server.serve()