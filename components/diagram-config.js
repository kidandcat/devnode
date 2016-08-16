var path = require('path');
var ipc = require('electron').ipcRenderer;

initDiagram = function() {
    loadDB();
    ipc.on('dbLoaded', function(event, nothing) {
        ipc.send('loadDiagram');
        ipc.on('loaded', function(event, docs) {
            var aNodes = [];
            var aEdges = [];
            if (docs[0]) {
                for (var property in docs[0].nodes) {
                    if (docs[0].nodes.hasOwnProperty(property)) {
                        aNodes.push(docs[0].nodes[property]);
                    }
                }
                for (var property in docs[0].edges) {
                    if (docs[0].edges.hasOwnProperty(property)) {
                        aEdges.push(docs[0].edges[property]);
                    }
                }
                nodes = new vis.DataSet(aNodes);
                edges = new vis.DataSet(aEdges);
            }else{
              nodes = new vis.DataSet();
              edges = new vis.DataSet();
            }

            var container = document.querySelector('.diagram');
            var data = {
                nodes: nodes,
                edges: edges
            };
            var options = {
                nodes: {
                    'shape': 'box',
                    'shadow': true,
                    'font': {
                        'face': 'monospace',
                        'align': 'left'
                    }
                },
                physics: false,
                edges: {
                    smooth: {
                        'type': 'cubicBezier'
                    }
                }
            };
            dDdiagram = new vis.Network(container, data, options);

            setInterval(function() {
                saveDiagram();
            }, 2000);
        })
    });
}

loadDB = function() {
    ipc.send('loadDB', '.');
}

saveDiagram = function() {
    dDdiagram.storePositions();
    ipc.send('saveDiagram', {
        _id: 'diagram',
        nodes: nodes['_data'],
        edges: edges['_data']
    })
}

initDiagram();
