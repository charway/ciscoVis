import { Network } from 'vis/index-network';
import styles from './ciscoVis.css';
import { NextFont } from './nextFont';

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

        /**
         * highlight option
         */
        this.highlightActive = false;

        /**
         * auto cluster option
         */
        this.autoCluster = options.autoCluster === undefined ? true : options.autoCluster;
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
                image: NextFont.createSVG(e.type, { color: e.color, greyOut: e.greyOut, inactive: e.inactive }),
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
     * set cluster option
     */
    setCluster() {
        let cid = 0;
        const groups = {};
        const markers = {};
        /**
         * get nodes' information from the edges
         * @param {String} id
         */
        const getConnection = (id) => {
            const conns = [];
            for (let key in this.edges) {
                if (this.edges[key].from === id) {
                    conns.push(this.edges[key].to);
                }
                if (this.edges[key].to === id) {
                    conns.push(this.edges[key].from);
                }
            }
            return conns;
        }
        /**
         * get nodes' information include id, label etc.
         * @param {String} id
         */
        const findNode = (id) => {
            for (let key in this.nodes) {
                if (this.nodes[key].id === id) {
                    return key;
                }
            }
        }
        /**
         * find similar group
         */
        const compare = (items) => {
            let _cid = -1;
            for (let key in markers) {
                if (markers[key].length === items.length) {
                    for (let v of markers[key]) {
                        if (items.indexOf(v) === -1) {
                            _cid = -1;
                            break;
                        }
                        _cid = key;
                    }
                }
                if (_cid !== -1) {
                    break;
                }
            }
            return _cid;
        }
        // check all node
        this.nodes.forEach((item, index) => {
            if (this.nodes[index].cid) {
                return;
            }
            //find all child node
            for (let key in this.edges) {
                if (this.edges[key].from === item.id || this.edges[key].to === item.id) {
                    //get child node's id
                    const nid = findNode(this.edges[key].to);
                    if (this.nodes[nid].cid) {
                        break;
                    }
                    const indicates = getConnection(this.edges[key].to);
                    indicates.push(this.nodes[nid].type);
                    const _cid = compare(indicates);
                    //console.log(_cid);
                    if (_cid !== -1) {
                        //set node cid value
                        this.nodes[nid].cid = _cid;
                        groups[_cid].number++;
                        //TODO this is not reasonable
                        if (this.nodes[nid].greyOut) {
                            groups[_cid].greyOut = true;
                        }
                    } else {
                        //set node cid value
                        this.nodes[nid].cid = `c_${++cid}`;
                        markers[`c_${cid}`] = indicates;
                        groups[`c_${cid}`] = { type: this.nodes[nid].type, number: 1 };
                        //TODO this is not reasonable
                        if (this.nodes[nid].greyOut) {
                            groups[`c_${cid}`].greyOut = true;
                        }
                    }
                }
            }
        });
        return groups;
    }
    /**
     * cluster some nodes
     * @param {Object} options 
     */
    cluster(groups) {
        //for (let i = 1; i < cid; i++) {
        for (let i in groups) {
            const _options = {
                joinCondition: function (childOptions) {
                    return childOptions.cid == i;
                },
                clusterNodeProperties: {
                    id: i,
                    label: groups[i].number + ' ' + groups[i].type + ' devices',
                    image: CiscoVis.NextFont.createSVG(groups[i].type + 's', { greyOut: groups[i].greyOut }),
                    shape: 'image'
                },
                clusterEdgeProperties: {
                    //length: LENGTH_SERVER
                }
            };
            this.network.cluster(_options);
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
     * highlight when click the node
     */
    nodeHighlight(params) {
        // if something is selected:
        if (params.nodes.length > 0) {
            this.highlightActive = true;
            const preNodePosition = this.network.storePositions();
            const selectedNodeId = params.nodes[0];
            const allNodes = [];
            // mark all nodes as hard to read.
            for (let i = 0; i < this.nodes.length; i++) {
                if (this.nodes[i].id !== selectedNodeId) {
                    this.nodes[i].inactive = true;
                }
                allNodes.push(this.nodes[i]);
            }
            this.nodes = allNodes;
            this.network.setData({
                nodes: this.nodes,
                edges: this.edges
            });

            // for (let key in preNodePosition) {
            //     this.network.moveNode(key, preNodePosition[key].x, preNodePosition[key].y);
            // }
            // this.draw(true);
        }
        else if (this.highlightActive === true) {
            this.highlightActive = false;
            const allNodes = [];
            //const preNodePosition = this.network.getPositions();
            // mark all nodes as hard to read.
            for (let i = 0; i < this.nodes.length; i++) {
                this.nodes[i].inactive = false;
                allNodes.push(this.nodes[i]);
            }
            this.nodes = allNodes;
            // this.network.setData({
            //     nodes: this.nodes,
            //     edges: this.edges
            // });

            for (let key in preNodePosition) {
                this.network.moveNode(key, preNodePosition[key].x, preNodePosition[key].y);
            }
            this.draw(true);
        }

        // transform the object into an array
        // var updateArray = [];
        // for (nodeId in allNodes) {
        //     if (allNodes.hasOwnProperty(nodeId)) {
        //         updateArray.push(allNodes[nodeId]);
        //     }
        // }
        // nodesDataset.update(updateArray);
    }

    /**
     * draw the canvas
     * @param {Boolean} fixLayout if you would like to start in the same way next time
     */
    draw(fixLayout) {
        const options = {
            interaction: { hover: true },
            edges: {
                smooth: false,
                //color: '#5BC1DF'
            },
            nodes: {
                //color: '#0386D2'
            },
            layout: {
                randomSeed: 1895,
                // hierarchical: {
                //     enabled: false,
                //     direction: 'UD',
                //     sortMethod: 'directed'
                // }
            },
            physics: {
                //enable:false,
                barnesHut: {
                    damping: 0.8,
                    gravitationalConstant: -10000
                },
                stabilization: {
                    iterations: 2500
                }
            },
            //groups: this.groups,
        };
        let preNodePosition;
        if (fixLayout) {
            options.layout.randomSeed = this.network.getSeed();
            preNodePosition = this.network.getPositions();
        }
        //reset
        this.destroy();
        let groups = {};
        //get groups automaticlly
        if (this.autoCluster) {
            groups = this.setCluster();
        }
        this.network = new Network(this.container, {
            nodes: this.nodes,
            edges: this.edges
        }, options);
        //cluster groups automaticlly
        if (this.autoCluster) {
            this.cluster(groups);
        }
        if (fixLayout) {
            for (let key in preNodePosition) {
                this.network.moveNode(key, preNodePosition[key].x, preNodePosition[key].y);
            }
        }
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
            //this.nodeHighlight(params);
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