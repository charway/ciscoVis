//import CiscoVis from './ciscoVis';
//const ciscoVis = require('./dist/ciscoVis');
const LENGTH_MAIN = 350,
    LENGTH_SERVER = 150,
    LENGTH_SUB = 50,
    WIDTH_SCALE = 2,
    GREEN = 'green',
    RED = '#C5000B',
    ORANGE = 'orange',
    GRAY = 'SkyBlue',
    BLACK = '#2B1B17';
const nodes = [];

const edges = [];

nodes.push({ id: 1, label: '192.168.0.1', group: 'switch', value: 10 });
nodes.push({ id: 2, label: '192.168.0.2', group: 'switch', value: 8 });
nodes.push({ id: 3, label: '192.168.0.3', group: 'switch', value: 6 });
edges.push({ from: 1, to: 2, length: LENGTH_MAIN, width: WIDTH_SCALE, label: '0.71 mbps' });
edges.push({ from: 1, to: 3, length: LENGTH_MAIN, width: WIDTH_SCALE, label: '0.55 mbps' });

// group around 2
for (let i = 100; i <= 105; i++) {
    let value = 1;
    let width = WIDTH_SCALE;
    let label = null;

    if (i === 103) {
        value = 5;
        width = 3;
    }
    if (i === 102) {
        label = 'error';
    }

    nodes.push({ id: i, label: '192.168.0.' + i, group: 'host', value: value, cid: 1 });
    edges.push({ from: 2, to: i, length: LENGTH_SUB, width: width, label: label });
}

// group around 3
nodes.push({ id: 202, label: '192.168.0.202', group: 'host', value: 4 });
edges.push({ from: 3, to: 202, length: LENGTH_SUB, width: WIDTH_SCALE });
for (let i = 230; i <= 231; i++) {
    nodes.push({ id: i, label: '192.168.0.' + i, group: 'phone', value: 2 });
    edges.push({ from: 3, to: i, length: LENGTH_SUB, fontColor: GRAY, width: WIDTH_SCALE });
}

// group around 1
nodes.push({ id: 10, label: '192.168.0.10', group: 'server', value: 10 });
edges.push({ from: 1, to: 10, length: LENGTH_SERVER, width: WIDTH_SCALE, label: '0.92 mbps' });
nodes.push({ id: 11, label: '192.168.0.11', group: 'server', value: 7 });
edges.push({ from: 1, to: 11, length: LENGTH_SERVER, width: WIDTH_SCALE, label: '0.68 mbps' });
nodes.push({ id: 12, label: '192.168.0.12', group: 'server', value: 3 });
edges.push({ from: 1, to: 12, length: LENGTH_SERVER, width: WIDTH_SCALE, label: '0.3 mbps' });

nodes.push({ id: 204, label: 'Internet', group: 'cloud', value: 10 });
edges.push({ from: 1, to: 204, length: 200, width: WIDTH_SCALE, label: '0.63 mbps' });

const network = new CiscoVis('visualization',
    [{
        label: 'option 1',
        callback: (nodeId) => { console.log(nodeId) }
    }, {
        label: 'option 2',
        callback: () => { console.log('2') }
    }]
);
network.nodes = nodes;
network.edges = edges;

network.draw();
const clusterOptionsByData = {
    joinCondition: function (childOptions) {
        return childOptions.cid == 1;
    },
    clusterNodeProperties: {
        id: 'cidCluster',
        label: 'hosts',
        shape: 'icon',
        icon: {
            face: 'Next-font',
            code: CiscoVis.nextFont.hostgroup.font[0],
        }
    },
    clusterEdgeProperties: {
        length: LENGTH_SERVER
    }

};
network.cluster(clusterOptionsByData);