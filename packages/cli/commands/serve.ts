import * as path from "path";
import * as os from "os";
import type { Arguments, CommandBuilder } from 'yargs';
const normalizer = require("@ui5/project").normalizer;
import * as server from ""

interface INormalizer {
    
		translatorName: any,
		configPath: any
        frameworkOptions?: any
	
}
interface IServe {
    command: string,
    describe: string,
    middlewares?: any,
    builder?: Function
    handler?: Function
}
// Serve
const serve : IServe = {
	command: "serve",
	describe: "Start a web server for the current project",
	middlewares: [require("../middlewares/base.js")],
};
type Options = {
    describe: string;
    alias: string;
    type: string;
  };

  serve.builder = function(cli: { option: (arg0: string, arg1: { describe: string; alias: string; type: string; }) => { (): any; new(): any; option: { (arg0: string, arg1: { describe: string; alias: string; type: string; }): { (): any; new(): any; option: { (arg0: string, arg1: { describe: string; default: boolean; type: string; }): { (): any; new(): any; option: { (arg0: string, arg1: { describe: string; default: boolean; type: string; }): { (): any; new(): any; option: { (arg0: string, arg1: { describe: string; default: boolean; type: string; }): { (): any; new(): any; option: { (arg0: string, arg1: { describe: string; default: string; type: string; }): { (): any; new(): any; option: { (arg0: string, arg1: { describe: string; default: string; type: string; }): { (): any; new(): any; option: { (arg0: string, arg1: { describe: string; default: boolean; type: string; }): { (): any; new(): any; option: { (arg0: string, arg1: { describe: string; default: boolean; type: string; }): { (): any; new(): any; option: { (arg0: string, arg1: { describe: string; type: string; }): { (): any; new(): any; example: { (arg0: string, arg1: string): { (): any; new(): any; example: { (arg0: string, arg1: string): { (): any; new(): any; example: { (arg0: string, arg1: string): { (): any; new(): any; example: { (arg0: string, arg1: string): { (): any; new(): any; example: { (arg0: string, arg1: string): any; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; }) {
    return cli

		.option("port", {
			describe: "Port to bind on (default for HTTP: 8080, HTTP/2: 8443)",
			alias: "p",
			type: "number"
		})
		.option("open", {
			describe:
				"Open web server root directory in default browser. " +
				"Optionally, supplied relative path will be appended to the root URL",
			alias: "o",
			type: "string"
		})
		.option("h2", {
			describe: "Shortcut for enabling the HTTP/2 protocol for the web server",
			default: false,
			type: "boolean"
		})
		.option("simple-index", {
			describe: "Use a simplified view for the server directory listing",
			default: false,
			type: "boolean"
		})
		.option("accept-remote-connections", {
			describe: "Accept remote connections. By default the server only accepts connections from localhost",
			default: false,
			type: "boolean"
		})
		.option("key", {
			describe: "Path to the private key",
			default: path.join(os.homedir(), ".ui5", "server", "server.key"),
			type: "string"
		})
		.option("cert", {
			describe: "Path to the certificate",
			default: path.join(os.homedir(), ".ui5", "server", "server.crt"),
			type: "string"
		})
		.option("sap-csp-policies", {
			describe:
				"Always send content security policies 'sap-target-level-1' and " +
				"'sap-target-level-2' in report-only mode",
			default: false,
			type: "boolean"
		})
		.option("serve-csp-reports", {
			describe: "Collects and serves CSP reports upon request to '/.ui5/csp/csp-reports.json'",
			default: false,
			type: "boolean"
		})
		.option("framework-version", {
			describe: "Overrides the framework version defined by the project",
			type: "string"
		})
		.example("ui5 serve", "Start a web server for the current project")
		.example("ui5 serve --h2", "Enable the HTTP/2 protocol for the web server (requires SSL certificate)")
		.example("ui5 serve --config /path/to/ui5.yaml", "Use the project configuration from a custom path")
		.example("ui5 serve --translator static:/path/to/projectDependencies.yaml",
			"Use a \"static\" translator with translator parameters.")
		.example("ui5 serve --port 1337 --open tests/QUnit.html",
			"Listen to port 1337 and launch default browser with http://localhost:1337/test/QUnit.html");
    }

    serve.handler = async function(argv: Arguments<Options>) {

	const normalizerOptions : INormalizer = {
		translatorName: argv.translator,
		configPath: argv.config
	};

	if (argv.frameworkVersion) {
		normalizerOptions.frameworkOptions = {
			versionOverride: argv.frameworkVersion
		};
	}

	const tree = await normalizer.generateProjectTree(normalizerOptions);
	let port = argv.port;
	let changePortIfInUse = false;

	if (!port && tree.server && tree.server.settings) {
		if (argv.h2) {
			port = tree.server.settings.httpsPort;
		} else {
			port = tree.server.settings.httpPort;
		}
	}

	if (!port) {
		changePortIfInUse = true; // only change if port isn't explicitly set
		if (argv.h2) {
			port = 8443;
		} else {
			port = 8080;
		}
	}

	const serverConfig = {
		port,
		changePortIfInUse,
		h2: argv.h2,
		simpleIndex: !!argv.simpleIndex,
		acceptRemoteConnections: !!argv.acceptRemoteConnections,
		cert: argv.h2 ? argv.cert : undefined,
		key: argv.h2 ? argv.key : undefined,
		sendSAPTargetCSP: !!argv.sapCspPolicies,
		serveCSPReports: !!argv.serveCspReports
	};



	const {h2, port: actualPort} = await server.serve(tree, serverConfig);

	const protocol = h2 ? "https" : "http";
	let browserUrl = protocol + "://localhost:" + actualPort;
	if (argv.acceptRemoteConnections) {
		const chalk = require("chalk");
		console.log("");
		console.log(chalk.bold("⚠️  This server is accepting connections from all hosts on your network"));
		console.log(chalk.dim.underline("Please Note:"));
		console.log(chalk.bold.dim(
			"* This server is intended for development purposes only. Do not use it in production."));
		console.log(chalk.dim(
			"* Vulnerable (custom-)middleware can pose a threat to your system when exposed to the network"));
		console.log(chalk.dim(
			"* The use of proxy-middleware with preconfigured credentials might enable unauthorized access " +
			"to a target system for third parties on your network"));
		console.log("");
	}
	console.log("Server started");
	console.log("URL: " + browserUrl);

	if (argv.open !== undefined) {
		if (typeof argv.open === "string") {
			let relPath = argv.open || "/";
			if (!relPath.startsWith("/")) {
				relPath = "/" + relPath;
			}
			browserUrl += relPath;
		}
		const open = require("open");
		open(browserUrl, {url: true});
	}
};

module.exports = serve