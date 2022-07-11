import Bao from "baojs";


const app = new Bao();
// const batch = new ODataBatch();
app.get("/sap/*opu", (ctx) => {
  try {
    const reg = /(?:\/sap\/opu\/odata\/service\/)([\s\S]*)/
    const path = reg.exec(ctx.path)[1]

    if (path.includes("$metadata")) {
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
    const path = libRegex.exec(ctx.path);
    const ui5Path = Bun.pathToFileURL(path)

})
app.get("/webapp/*app", (ctx) => {
  try {
    const reg = /(?:\/app\/)([\s\S]*)/
    const path = reg.exec(ctx.path)[1]

    if (path.includes("resources/")) {
      const blob = Bun.file("/Users/I565634/git/bunny5-server/" + path);
      if (blob) {


        return ctx.sendRaw(new Response(blob))
      }
      else {
        return ctx.sendText("Not Found")
      }
    }
    else {
      const blob = Bun.file("/Users/I565634/git/fe/bunny5/webapp/" + path);
      return ctx.sendRaw(new Response(blob))
    }
  }
  catch (err) { }
});
console.log("server is listening")
app.listen();

