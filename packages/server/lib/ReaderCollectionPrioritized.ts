import { AbstractReader } from "./AbstractReader";

/**
 * Prioritized Resource Locator Collection
 *
 * @public
 * @memberof module:@ui5/fs
 * @augments module:@ui5/fs.AbstractReader
 */
export default class ReaderCollectionPrioritized extends AbstractReader {
	_name: any;
	_readers: any;
	/**
	 * The constructor.
	 *
	 * @param {object} parameters
	 * @param {string} parameters.name The collection name
	 * @param {module:@ui5/fs.AbstractReader[]} parameters.readers Prioritized list of resource readers
	 * 																(first is tried first)
	 */
	//@ts-ignore
	constructor({readers, name}) {
		super();
		this._name = name;
		this._readers = readers;
	}

	/**
	 * Locates resources by glob.
	 *
	 * @private
	 * @param {string|string[]} pattern glob pattern as string or an array of
	 *         glob patterns for virtual directory structure
	 * @param {object} options glob options
	 * @param {module:@ui5/fs.tracing.Trace} trace Trace instance
	 * @returns {Promise<module:@ui5/fs.Resource[]>} Promise resolving to list of resources
	 */
	_byGlob(pattern: any, options: { nodir: boolean; }) {
		return Promise.all(this._readers.map(function(resourceLocator: { _byGlob: (arg0: any, arg1: any) => any; }) {
			return resourceLocator._byGlob(pattern, options);
		})).then((result) => {
			const files : any = {};
			const resources = [];
			// Prefer files found in preceding resource locators
			for (let i = 0; i < result.length; i++) {
				for (let j = 0; j < result[i].length; j++) {
					const resource = result[i][j];
					const path = resource.getPath();
					if (!files[path]) {
						files[path] = true;
						resources.push(resource);
					}
				}
			}

			// trace.collection(this._name);
			return resources;
		});
	}

	/**
	 * Locates resources by path.
	 *
	 * @private
	 * @param {string} virPath Virtual path
	 * @param {object} options Options
	 * @param {module:@ui5/fs.tracing.Trace} trace Trace instance
	 * @returns {Promise<module:@ui5/fs.Resource>} Promise resolving to a single resource
	 */
	_byPath(virPath: any, options: { nodir: boolean; }) {
		const that = this;
		const byPath = (i: number) => {
			if (i > this._readers.length - 1) {
				return null;
			}
			return this._readers[i]._byPath(virPath, options).then((resource: { pushCollection: (arg0: any) => void; }) => {
				if (resource) {
					resource.pushCollection(that._name);
					return resource;
				} else {
					return byPath(++i);
				}
			});
		};
		return byPath(0);
	}
}
