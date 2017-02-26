import { NextFont } from './nextFont';
export class ApicEM {
    constructor(source = {}) {
        this._data = source;
    }

    get nodes() {
        return this._data.nodes.map((e) => {
            return {
                ...e,
                label: e.ip,
                type: this.getType(e.family, e.nodeType)
            }
        });
    }

    get edges() {
        return this._data.links.map((e) => {
            return {
                ...e,
                from: e.source,
                to: e.target
            }
        });
    }

    getType(family, nodeType = '') {
        for (let key in NextFont) {
            if (family.toLowerCase().indexOf(key) !== -1 || nodeType.toLowerCase().indexOf(key) !== -1) {
                return key;
            }
        }
        return 'unknown';
    }
}