import { Network } from 'vis/index-network';
import styles from './ciscoVis.css';
import nextFont from './nextFont';
export class CiscoVis {
    constructor(elementId, popoverMenu, options = {}) {
        if (elementId) {
            this.container = document.getElementById(elementId);
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
        this.nodes = [];
        this.edges = [];

        this.iconSize = options.iconSize || 50;
    }

    set nodes(nodes) {
        this._nodes = nodes;
    }

    get nodes() {
        return this._nodes;
    }

    set edges(edges) {
        this._edges = edges;
    }

    get edges() {
        return this._edges;
    }

    set network(network) {
        this._network = network;
    }

    get network() {
        return this._network;
    }

    get nextFont() {
        return nextFont;
    }

    addPopover() {
        this.popover = document.createElement('div');
        this.popover.className = 'popover-menu';
        const arrow = document.createElement('div');
        arrow.className = 'popover-arrow';
        this.popover.appendChild(arrow);
        this.container.appendChild(this.popover);
    }

    clearPopover() {
        const childNodes = this.popover.childNodes;
        for (let i = childNodes.length - 1; i >= 0; i--) {
            if (childNodes[i].className !== 'popover-arrow') {
                this.popover.removeChild(childNodes[i]);
            }
        }
    }
    createMenu(items, nodeId) {
        this.clearPopover();
        items.forEach(
            (e) => {
                const item = document.createElement('div');
                item.className = e.className || 'popover-item';
                item.innerText = e.label;
                item.onclick = () => { return e.callback(nodeId) };
                this.popover.appendChild(item);
            }
        );
    }
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

    hidePopover() {
        if (this.popover !== null) {
            this.popover.style.display = 'none';
        }
    }

    cluster(options) {
        if (this.network) {
            this.network.cluster(options);
        }
    }

    destroy() {
        if (this.network !== null) {
            this.network.destroy();
            this.network = null;
        }
    }

    draw() {
        this.destroy();

        const options = {
            interaction: { hover: true },
            edges: {
                smooth: false
            },
            physics: {
                barnesHut: { gravitationalConstant: -30000 },
                stabilization: { iterations: 2500 }
            },
            groups: {
                'switch': {
                    shape: 'icon',
                    icon: {
                        face: 'Next-font',
                        code: nextFont.switch.font[0],
                        size: this.iconSize,
                        color: 'Darkorange',
                    }
                },
                router: {
                    shape: 'icon',
                    icon: {
                        face: 'Next-font',
                        code: nextFont.router.font[0],
                        size: this.iconSize,
                    }
                },
                wlc: {
                    shape: 'icon',
                    icon: {
                        face: 'Next-font',
                        code: nextFont.wlc.font[0],
                        size: this.iconSize,
                    }
                },
                unknown: {
                    shape: 'icon',
                    icon: {
                        face: 'Next-font',
                        code: nextFont.unknown.font[0],
                        size: this.iconSize,
                    }
                },
                host: {
                    shape: 'icon',
                    icon: {
                        face: 'Next-font',
                        code: nextFont.host.font[0],
                        size: this.iconSize,
                        color: 'DarkSlateBlue',// blue
                    }
                },
                nexus5000: {
                    shape: 'icon',
                    icon: {
                        face: 'Next-font',
                        code: nextFont.nexus5000.font[0],
                        size: this.iconSize,
                    }
                },
                ipphone: {
                    shape: 'icon',
                    icon: {
                        face: 'Next-font',
                        code: nextFont.ipphone.font[0],
                        size: this.iconSize,
                    }
                },
                phone: {
                    shape: 'icon',
                    icon: {
                        face: 'Next-font',
                        code: nextFont.phone.font[0],
                        size: this.iconSize,
                        color: "Black",
                    }
                },
                server: {
                    shape: 'icon',
                    icon: {
                        face: 'Next-font',
                        code: nextFont.server.font[0],
                        size: this.iconSize,
                        color: "SlateBlue",
                    }
                },

                camera: {
                    shape: 'icon',
                    icon: {
                        face: 'Next-font',
                        code: nextFont.camera.font[0],
                        size: this.iconSize,
                    }
                },
                accesspoint: {
                    shape: 'icon',
                    icon: {
                        face: 'Next-font',
                        code: nextFont.accesspoint.font[0],
                        size: this.iconSize,
                    }
                },
                groups: {
                    shape: 'icon',
                    icon: {
                        face: 'Next-font',
                        code: nextFont.groups.font[0],
                        size: this.iconSize,
                    }
                },
                groupm: {
                    shape: 'icon',
                    icon: {
                        face: 'Next-font',
                        code: nextFont.groupm.font[0],
                        size: this.iconSize,
                    }
                },
                groupl: {
                    shape: 'icon',
                    icon: {
                        face: 'Next-font',
                        code: nextFont.groupl.font[0],
                        size: this.iconSize,
                    }
                },
                collapse: {
                    shape: 'icon',
                    icon: {
                        face: 'Next-font',
                        code: nextFont.collapse.font[0],
                        size: this.iconSize,
                    }
                },
                expand: {
                    shape: 'icon',
                    icon: {
                        face: 'Next-font',
                        code: nextFont.expand.font[0],
                        size: this.iconSize,
                    }
                },
                cloud: {
                    shape: 'icon',
                    icon: {
                        face: 'Next-font',
                        code: nextFont.cloud.font[0],
                        size: this.iconSize,
                        color: "DodgerBlue", // green
                    }
                },
                unlinked: {
                    shape: 'icon',
                    icon: {
                        face: 'Next-font',
                        code: nextFont.unlinked.font[0],
                        size: this.iconSize,
                    }
                },
                firewall: {
                    shape: 'icon',
                    icon: {
                        face: 'Next-font',
                        code: nextFont.firewall.font[0],
                        size: this.iconSize,
                    }
                },
                hostgroup: {
                    shape: 'icon',
                    icon: {
                        face: 'Next-font',
                        code: nextFont.hostgroup.font[0],
                        size: this.iconSize,

                    }
                },
                wirelesshost: {
                    shape: 'icon',
                    icon: {
                        face: 'Next-font',
                        code: nextFont.wirelesshost.font[0],
                        size: this.iconSize,
                    }
                }
            }
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