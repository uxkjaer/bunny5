import prettyHrtime from "pretty-hrtime"
import summaryTrace from "./traceSummary";
const hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * Trace
 *
 * @memberof module:@ui5/fs.tracing
 * @class
 */
export default class Trace {
	_name: any;
	_startTime: any;
	_globCalls: number;
	_pathCalls: number;
	_collections: {};
	constructor(name: any) {
		this._name = name;
		this._startTime = process.hrtime();
		this._globCalls = 0;
		this._pathCalls = 0;
		this._collections = {};
		summaryTrace.traceStarted();
	}

	globCall() {
		this._globCalls++;
		summaryTrace.globCall();
	}

	pathCall() {
		this._pathCalls++;
		summaryTrace.pathCall();
	}

	collection(name) {
		const collection = this._collections[name];
		if (collection) {
			this._collections[name].calls++;
		} else {
			this._collections[name] = {
				calls: 1
			};
		}
		summaryTrace.collection(name);
	}

	printReport() {
		let report = "";
		const timeDiff = process.hrtime(this._startTime);
		const time = prettyHrtime(timeDiff);
		const colCount = Object.keys(this._collections).length;

		report += `[Trace: ${this._name}\n`;
		report += `  ${time} elapsed time \n`;
		if (this._globCalls) {
			report += `  ${this._globCalls} glob executions\n`;
		}
		if (this._pathCalls) {
			report += `  ${this._pathCalls} path stats\n`;
		}
		report += `  ${colCount} reader-collections involed:\n`;

		for (const coll in this._collections) {
			if (hasOwnProperty.call(this._collections, coll)) {
				report += `      ${this._collections[coll].calls}x ${coll}\n`;
			}
		}
		report += "======================]";

		if (this._globCalls && this._pathCalls) {
			log.verbose(report);
		} else if (this._globCalls) {
			logGlobs.verbose(report);
		} else {
			logPaths.verbose(report);
		}

		summaryTrace.traceEnded();
	}
}

module.exports = Trace;
