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
const nodes = [
    {
        id: 1,
        label: '192.168.0.1',
        group: 'switch',
        //value: 10
    }, {
        id: 2,
        label: '192.168.0.2',
        group: 'router',
        //value: 9
    }, {
        id: 3,
        label: '192.168.0.3',
        group: 'accesspoint',
        //value: 9
    }, {
        id: 4,
        label: '192.168.0.4',
        group: 'ipphone',
        //value: 6
    }, {
        id: 5,
        label: '192.168.0.5',
        group: 'camera',
        //value: 6
    }, {
        id: 6,
        label: '192.168.0.6',
        group: 'wirelesshost',
        //value: 8
    }, {
        id: 7,
        label: '192.168.0.7',
        group: 'groups',
    }, {
        id: 8,
        label: '192.168.0.8',
        group: 'groupm',
    }, {
        id: 202,
        label: '192.168.0.202',
        group: 'firewall',
        //value: 6
    }, {
        id: 203,
        label: '192.168.0.203',
        group: 'server',
    }, {
        id: 230,
        label: '192.168.0.230',
        group: 'wlc',
        //value: 6
    }, {
        id: 231,
        label: '192.168.0.231',
        group: 'groupl',
    }, {
        id: 10,
        label: '192.168.0.10',
        group: 'unknown',
        value: 10
    }, {
        id: 11,
        label: '192.168.0.11',
        group: 'phone',
        //value: 7
    }, {
        id: 12,
        label: '192.168.0.12',
        group: 'nexus5000',
        //value: 10
    }, {
        id: 204,
        label: 'Internet',
        group: 'cloud',
        //value: 10
    }
];

const edges = [
    {
        from: 1,
        to: 2,
        //length: LENGTH_MAIN,
        width: WIDTH_SCALE,
        label: '0.71 mbps',
    }, {
        from: 1,
        to: 3,
        //length: LENGTH_MAIN,
        width: WIDTH_SCALE,
        label: '0.55 mbps'
    }, {
        from: 3,
        to: 202,
        //length: LENGTH_SUB,
        width: WIDTH_SCALE
    }, {
        from: 4,
        to: 12,
        //length: LENGTH_SUB,
        width: WIDTH_SCALE
    }, {
        from: 5,
        to: 12,
        //length: LENGTH_SUB,
        width: WIDTH_SCALE
    }, {
        from: 6,
        to: 2,
        //length: LENGTH_SUB,
        width: WIDTH_SCALE
    }, {
        from: 8,
        to: 12,
        //length: LENGTH_SUB,
        width: WIDTH_SCALE
    }, {
        from: 7,
        to: 10,
        //length: LENGTH_SUB,
        width: WIDTH_SCALE
    }, {
        from: 3,
        to: 230,
        //length: LENGTH_SUB,
        fontColor: GRAY,
        width: WIDTH_SCALE
    }, {
        from: 3,
        to: 231,
        //length: LENGTH_SUB,
        fontColor: GRAY,
        width: WIDTH_SCALE
    }, {
        from: 1,
        to: 10,
        //length: LENGTH_SERVER,
        width: WIDTH_SCALE,
        label: '0.92 mbps'
    }, {
        from: 10,
        to: 11,
        //length: LENGTH_SERVER,
        width: WIDTH_SCALE,
        label: '0.68 mbps'
    }, {
        from: 1,
        to: 12,
        //length: LENGTH_SERVER,
        width: WIDTH_SCALE,
        label: '0.3 mbps'
    }, {
        from: 1,
        to: 204,
        //length: 200,
        width: WIDTH_SCALE,
        label: '0.63 mbps'
    }, {
        from: 1,
        to: 203,
        //length: 200,
        width: WIDTH_SCALE,
    }
];


// group around 2
for (let i = 100; i <= 105; i++) {
    let value = 8;
    let width = WIDTH_SCALE;
    let label = null;

    if (i === 102) {
        label = 'error';
    }

    nodes.push({ id: i, label: '192.168.0.' + i, group: 'host', cid: 1 });
    edges.push({ from: 2, to: i,width: width, label: label });
}


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
        image: CiscoVis.nextFont.createSVG('hosts'),
        shape: 'image'
    },
    clusterEdgeProperties: {
        length: LENGTH_SERVER
    }
};
network.cluster(clusterOptionsByData);