import { Network } from 'vis/index-network';
import styles from './ciscoVis.css';
import {NextFont} from './nextFont';

export class CiscoVis {
    /**
     * @constructor CiscoVis
     * Create a CiscoVis visualization, displaying nodes and edges.
     *
     * @param {Element} containerId   The DOM element in which the CiscoVis will
     *                                  be created. Normally a div element.
     * @param {Object} popoverMenu    An object containing parameters
     *                              {Array} items
     * @param {Object} options      Options
     */
    constructor(containerId, popoverMenu, options = {}) {
        if (containerId) {
            this.container = document.getElementById(containerId);
        } else {
            throw new Error('Please use set [elementsId]');
        }
        if (popoverMenu) {
            this.popoverMenu = popoverMenu;
        } else {
            throw new Error('Please use set [Popover Elements]');
        }
        this.network = null;
        this.popover = null;
        if (options.apicEmData) {
            this.nodes = options.apicEmData.nodes;
            this.edges = options.apicEmData.edges;
        } else {
            this.nodes = options.nodes || [];
            this.edges = options.edges || [];
        }


        this.iconSize = options.iconSize || 50;
    }

    /**
     * Set nodes
     * @param {Array} nodes
     */
    set nodes(nodes) {
        this._nodes = nodes.map((e) => {
            return {
                ...e,
                shape: 'image',
                image: NextFont.createSVG(e.type, { color: e.color, greyOut: e.greyOut }),
            }
        });
    }

    get nodes() {
        return this._nodes;
    }

    /**
     * Set edges
     * @param {Array} edges
     */
    set edges(edges) {
        this._edges = edges.map((e) => {
            return {
                ...e,
                color: e.greyOut ? NextFont.greyOutColor : e.color || '#5BC1DF',
            }
        });
    }

    get edges() {
        return this._edges;
    }

    /**
     * Set Vis Network Object
     * @param {Object} network
     */
    set network(network) {
        this._network = network;
    }

    /**
     * get the Vis Network Objext
     */
    get network() {
        return this._network;
    }

    /**
     * get the Next UI's Font
     */
    static get NextFont() {
        return NextFont;
    }

    /**
     * get groups information
     */
    get groups() {
        const res = {};
        for (let key in NextFont) {
            res[key] = {
                image: NextFont.createSVG(key), shape: 'image'
            }
        }
        return res;
    }

    /**
     * add a Popover element
     */
    addPopover() {
        this.popover = document.createElement('div');
        this.popover.className = 'popover-menu';
        const arrow = document.createElement('div');
        arrow.className = 'popover-arrow';
        this.popover.appendChild(arrow);
        this.container.appendChild(this.popover);
    }

    /**
     * clear all items except the arrow element
     */
    clearPopover() {
        const childNodes = this.popover.childNodes;
        for (let i = childNodes.length - 1; i >= 0; i--) {
            if (childNodes[i].className !== 'popover-arrow') {
                this.popover.removeChild(childNodes[i]);
            }
        }
    }

    /**
     * create the Popover menu for a specific node in the network
     * @param {Array} items
     * @param {String} nodeId
    */
    createMenu(items, nodeId) {
        this.clearPopover();
        items.forEach(
            (e) => {
                const item = document.createElement('div');
                item.className = e.className || 'popover-item';
                item.innerText = e.label;
                item.onclick = () => {
                    e.callback(nodeId);
                    this.hidePopover();
                };
                this.popover.appendChild(item);
            }
        );
    }

    /**
     * show the Popover menu in a specific place
     * @param {Object} params include the position of node
     * @param {String} nodeId
    */
    showPopover(params, nodeId) {
        const clusterOptions = [];
        if (this.network.isCluster(nodeId) === true) {
            clusterOptions.push({
                label: 'Open Cluster',
                callback: () => {
                    this.network.openCluster(nodeId);
                    this.hidePopover();
                }
            });
            if (this.popoverMenu.length > 1) {
                clusterOptions.push({
                    label: '',
                    className: 'popover-divider',
                });
            }
        }
        const items = clusterOptions.concat(this.popoverMenu);
        this.createMenu(items, nodeId);
        if (items.length > 0) {
            this.popover.style.display = 'block';
        }
        this.popover.style.top = (this.container.offsetTop + params.y - this.popover.offsetHeight / 2) + 'px';
        this.popover.style.left = (this.container.offsetLeft + params.x) + 'px';
    }

    /**
     * hide the Popover menu
     */
    hidePopover() {
        if (this.popover !== null) {
            this.popover.style.display = 'none';
        }
    }

    /**
     * cluster some nodes
     * @param {Object} options 
     */
    cluster(options) {
        if (this.network) {
            this.network.cluster(options);
        }
    }
    /**
     * destroy the vanvas
     */
    destroy() {
        if (this.network !== null) {
            this.network.destroy();
            this.network = null;
        }
    }

    /**
     * draw the canvas
     */
    draw() {
        this.destroy();

        const options = {
            interaction: { hover: true },
            edges: {
                smooth: false,
                //color: '#5BC1DF'
            },
            nodes: {
                //color: '#0386D2'
            },
            physics: {
                barnesHut: {
                    damping: 0.3,
                    gravitationalConstant: -10000
                },
                stabilization: {
                    iterations: 2500
                }
            },
            //groups: this.groups,
        };
        this.network = new Network(this.container, {
            nodes: this.nodes,
            edges: this.edges
        }, options);
        this.network.on("oncontext", (params) => {
            params.event.preventDefault();
            const nodeId = this.network.getNodeAt(params.pointer.DOM);
            if (nodeId) {
                //network.selectNodes([nodeId], true);
                const scale = this.network.getScale();
                let bound = this.network.getBoundingBox(nodeId);
                const left_top = this.network.canvasToDOM({ x: bound.left, y: bound.top });
                const right_bottom = this.network.canvasToDOM({ x: bound.right, y: bound.bottom });
                const w = right_bottom.x - left_top.x;
                this.showPopover({ x: right_bottom.x - (w - this.iconSize * scale) / 2 + 0.8 * scale, y: left_top.y + (this.iconSize * scale) / 2 }, nodeId);
            } else {
                this.hidePopover();
            }
        });
        this.network.on("click", (params) => {
            this.hidePopover();
        });

        this.network.on("doubleClick", (params) => {
            if (params.nodes.length == 1) {
                if (this.network.isCluster(params.nodes[0]) == true) {
                    this.network.openCluster(params.nodes[0]);
                }
            }
        });
        this.addPopover();
    }
}