import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import CytoscapeComponent from 'react-cytoscapejs';
import './GraphView.css';

const GraphView = ({ refresh }) => {
  const [graph, setGraph] = useState({ adjacency_list: {} });
  const [showVisual, setShowVisual] = useState(false);
  const cyRef = useRef(null);

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        const response = await axios.get('http://localhost:8000/notes/graph/');
        console.log('Graph data:', response.data);
        setGraph(response.data);
      } catch (error) {
        console.error('Error fetching graph:', error);
      }
    };
    fetchGraph();
  }, [refresh]);

  // Convert adjacency list to Cytoscape elements with validation
  const elements = (() => {
    if (!graph.adjacency_list || typeof graph.adjacency_list !== 'object') {
      console.warn('Invalid adjacency_list:', graph.adjacency_list);
      return [];
    }

    const seenNodes = new Set();
    const elementsArray = Object.entries(graph.adjacency_list).flatMap(([source, targets]) => {
      const nodeElements = [];
      // Add source node if not already added
      if (!seenNodes.has(source)) {
        nodeElements.push({ data: { id: source, label: source } });
        seenNodes.add(source);
      }
      // Add target nodes and edges
      const edgeElements = (Array.isArray(targets) ? targets : []).map(target => {
        if (!seenNodes.has(target)) {
          nodeElements.push({ data: { id: target, label: target } });
          seenNodes.add(target);
        }
        return {
          data: { source, target, id: `${source}-${target}` }
        };
      });
      return [...nodeElements, ...edgeElements];
    });

    // Remove duplicates (in case of malformed data)
    const uniqueElements = [];
    const elementIds = new Set();
    for (const element of elementsArray) {
      const id = element.data.id;
      if (!elementIds.has(id)) {
        uniqueElements.push(element);
        elementIds.add(id);
      }
    }

    console.log('Cytoscape elements:', uniqueElements);
    return uniqueElements;
  })();

  // Cytoscape layout configuration
  const layout = {
    name: elements.length > 0 ? 'cose' : 'grid',
    idealEdgeLength: 100,
    nodeOverlap: 20,
    refresh: 20,
    fit: true,
    padding: 30,
    randomize: false,
    componentSpacing: 100,
    nodeRepulsion: 400000,
    edgeElasticity: 100,
    nestingFactor: 5,
    gravity: 80,
    numIter: 1000,
    initialTemp: 200,
    coolingFactor: 0.95,
    minTemp: 1.0
  };

  return (
    <div className="graph-view">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">Graph View</h2>
        <button
          onClick={() => setShowVisual(!showVisual)}
          className="bg-gray-200 text-gray-800 p-2 rounded hover:bg-gray-300"
        >
          {showVisual ? 'Show Text View' : 'Show Visual Graph'}
        </button>
      </div>
      {showVisual ? (
        elements.length > 0 ? (
          <CytoscapeComponent
            elements={elements}
            style={{ width: '100%', height: '400px' }}
            layout={layout}
            stylesheet={[
              {
                selector: 'node',
                style: {
                  'background-color': '#0074D9',
                  'label': 'data(label)',
                  'color': '#fff',
                  'text-valign': 'center',
                  'text-halign': 'center',
                  'font-size': '12px'
                }
              },
              {
                selector: 'edge',
                style: {
                  'width': 2,
                  'line-color': '#ccc',
                  'target-arrow-color': '#ccc',
                  'target-arrow-shape': 'triangle',
                  'curve-style': 'bezier'
                }
              }
            ]}
            cy={(cy) => {
              cyRef.current = cy;
              console.log('Cytoscape instance initialized:', cy);
            }}
          />
        ) : (
          <div className="text-gray-500">No graph data available</div>
        )
      ) : (
        <ul className="graph-list">
          {Object.entries(graph.adjacency_list).length > 0 ? (
            Object.entries(graph.adjacency_list).map(([title, links]) => (
              <li key={title} className="graph-item">
                <strong>{title}</strong> → {links.length > 0 ? links.join(', ') : 'None'}
              </li>
            ))
          ) : (
            <li className="text-gray-500">No graph data available</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default GraphView;