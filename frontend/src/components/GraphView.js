// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import CytoscapeComponent from 'react-cytoscapejs';
// import './GraphView.css';

// const GraphView = ({ refresh }) => {
//   const [graph, setGraph] = useState({ adjacency_list: {} });
//   const [showVisual, setShowVisual] = useState(false);
//   const cyRef = useRef(null);

//   useEffect(() => {
//     const fetchGraph = async () => {
//       try {
//         const response = await axios.get('https://personal-knowledge-graph-production.up.railway.app/notes/graph/');
//         console.log('Graph data:', response.data);
//         setGraph(response.data);
//       } catch (error) {
//         console.error('Error fetching graph:', error);
//       }
//     };
//     fetchGraph();
//   }, [refresh]);

//   // Convert adjacency list to Cytoscape elements with validation
//   const elements = (() => {
//     if (!graph.adjacency_list || typeof graph.adjacency_list !== 'object') {
//       console.warn('Invalid adjacency_list:', graph.adjacency_list);
//       return [];
//     }

//     const seenNodes = new Set();
//     const elementsArray = Object.entries(graph.adjacency_list).flatMap(([source, targets]) => {
//       const nodeElements = [];
//       // Add source node if not already added
//       if (!seenNodes.has(source)) {
//         nodeElements.push({ data: { id: source, label: source } });
//         seenNodes.add(source);
//       }
//       // Add target nodes and edges
//       const edgeElements = (Array.isArray(targets) ? targets : []).map(target => {
//         if (!seenNodes.has(target)) {
//           nodeElements.push({ data: { id: target, label: target } });
//           seenNodes.add(target);
//         }
//         return {
//           data: { source, target, id: `${source}-${target}` }
//         };
//       });
//       return [...nodeElements, ...edgeElements];
//     });

//     // Remove duplicates (in case of malformed data)
//     const uniqueElements = [];
//     const elementIds = new Set();
//     for (const element of elementsArray) {
//       const id = element.data.id;
//       if (!elementIds.has(id)) {
//         uniqueElements.push(element);
//         elementIds.add(id);
//       }
//     }

//     console.log('Cytoscape elements:', uniqueElements);
//     return uniqueElements;
//   })();

//   // Cytoscape layout configuration
//   const layout = {
//     name: elements.length > 0 ? 'cose' : 'grid',
//     idealEdgeLength: 100,
//     nodeOverlap: 20,
//     refresh: 20,
//     fit: true,
//     padding: 30,
//     randomize: false,
//     componentSpacing: 100,
//     nodeRepulsion: 400000,
//     edgeElasticity: 100,
//     nestingFactor: 5,
//     gravity: 80,
//     numIter: 1000,
//     initialTemp: 200,
//     coolingFactor: 0.95,
//     minTemp: 1.0
//   };

//   return (
//     <div className="graph-view">
//       <div className="flex justify-between items-center mb-2">
//         <h2 className="text-xl font-bold">Graph View</h2>
//         <button
//           onClick={() => setShowVisual(!showVisual)}
//           className="bg-gray-200 text-gray-800 p-2 rounded hover:bg-gray-300"
//         >
//           {showVisual ? 'Show Text View' : 'Show Visual Graph'}
//         </button>
//       </div>
//       {showVisual ? (
//         elements.length > 0 ? (
//           <CytoscapeComponent
//             elements={elements}
//             style={{ width: '100%', height: '400px' }}
//             layout={layout}
//             stylesheet={[
//               {
//                 selector: 'node',
//                 style: {
//                   'background-color': '#0074D9',
//                   'label': 'data(label)',
//                   'color': '#fff',
//                   'text-valign': 'center',
//                   'text-halign': 'center',
//                   'font-size': '12px'
//                 }
//               },
//               {
//                 selector: 'edge',
//                 style: {
//                   'width': 2,
//                   'line-color': '#ccc',
//                   'target-arrow-color': '#ccc',
//                   'target-arrow-shape': 'triangle',
//                   'curve-style': 'bezier'
//                 }
//               }
//             ]}
//             cy={(cy) => {
//               cyRef.current = cy;
//               console.log('Cytoscape instance initialized:', cy);
//             }}
//           />
//         ) : (
//           <div className="text-gray-500">No graph data available</div>
//         )
//       ) : (
//         <ul className="graph-list">
//           {Object.entries(graph.adjacency_list).length > 0 ? (
//             Object.entries(graph.adjacency_list).map(([title, links]) => (
//               <li key={title} className="graph-item">
//                 <strong>{title}</strong> → {links.length > 0 ? links.join(', ') : 'None'}
//               </li>
//             ))
//           ) : (
//             <li className="text-gray-500">No graph data available</li>
//           )}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default GraphView;



import { useState, useEffect, useRef } from "react"
import axios from "axios"
import CytoscapeComponent from "react-cytoscapejs"
import { Loader2 } from "lucide-react"

export default function GraphView({ refresh, viewType }) {
  const [graph, setGraph] = useState({ adjacency_list: {} })
  const [loading, setLoading] = useState(true)
  const cyRef = useRef(null)

  useEffect(() => {
    const fetchGraph = async () => {
      setLoading(true)
      try {
        const response = await axios.get("https://personal-knowledge-graph-production.up.railway.app/notes/graph/")
        setGraph(response.data)
      } catch (error) {
        console.error("Error fetching graph:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchGraph()
  }, [refresh])

  const elements = (() => {
    if (!graph.adjacency_list || typeof graph.adjacency_list !== "object") {
      return []
    }

    const seenNodes = new Set()
    const elementsArray = Object.entries(graph.adjacency_list).flatMap(([source, targets]) => {
      const nodeElements = []
      if (!seenNodes.has(source)) {
        nodeElements.push({
          data: {
            id: source,
            label: source,
            connections: Array.isArray(targets) ? targets.length : 0,
          },
        })
        seenNodes.add(source)
      }

      const edgeElements = (Array.isArray(targets) ? targets : []).map((target) => {
        if (!seenNodes.has(target)) {
          nodeElements.push({
            data: {
              id: target,
              label: target,
              connections: 0,
            },
          })
          seenNodes.add(target)
        }
        return {
          data: { source, target, id: `${source}-${target}` },
        }
      })

      return [...nodeElements, ...edgeElements]
    })

    const uniqueElements = []
    const elementIds = new Set()
    for (const element of elementsArray) {
      const id = element.data.id
      if (!elementIds.has(id)) {
        uniqueElements.push(element)
        elementIds.add(id)
      }
    }

    return uniqueElements
  })()

  const layout = {
    name: elements.length > 0 ? "cose" : "grid",
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
    minTemp: 1.0,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  const hasData = Object.keys(graph.adjacency_list).length > 0

  if (!hasData) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No connections found in your knowledge graph yet.</p>
        <p className="text-gray-500 text-sm mt-2">Create notes and link them together to build your knowledge network.</p>
      </div>
    )
  }

  if (viewType === "visual") {
    return (
      <div className="h-[500px] w-full">
        <CytoscapeComponent
          elements={elements}
          style={{ width: "100%", height: "100%" }}
          layout={layout}
          stylesheet={[
            {
              selector: "node",
              style: {
                "background-color": "#7c3aed",
                label: "data(label)",
                color: "#fff",
                "text-valign": "center",
                "text-halign": "center",
                "font-size": "12px",
                width: "mapData(connections, 0, 10, 30, 60)",
                height: "mapData(connections, 0, 10, 30, 60)",
                "border-width": 2,
                "border-color": "#6d28d9",
                "text-outline-width": 2,
                "text-outline-color": "#7c3aed",
              },
            },
            {
              selector: "edge",
              style: {
                width: 2,
                "line-color": "#d1d5db",
                "target-arrow-color": "#d1d5db",
                "target-arrow-shape": "triangle",
                "curve-style": "bezier",
                opacity: 0.8,
              },
            },
            {
              selector: ":selected",
              style: {
                "background-color": "#f97316",
                "border-color": "#ea580c",
                "line-color": "#f97316",
                "target-arrow-color": "#f97316",
              },
            },
            {
              selector: "node:selected",
              style: {
                "border-width": 3,
                "border-color": "#ea580c",
                "text-outline-color": "#f97316",
              },
            },
          ]}
          cy={(cy) => {
            cyRef.current = cy

            cy.on("tap", "node", (evt) => {
              const node = evt.target
              console.log("Tapped node:", node.id())
            })

            cy.on("mouseover", "node", () => {
              document.body.style.cursor = "pointer"
            })

            cy.on("mouseout", "node", () => {
              document.body.style.cursor = "default"
            })
          }}
        />
      </div>
    )
  } else {
    return (
      <div className="h-[500px] overflow-y-auto p-6 ">
        <ul className="space-y-5">
          {Object.entries(graph.adjacency_list).map(([title, links]) => (
            <li key={title} className="p-3 bg-gray-100  rounded-lg">
              <div className="flex items-center gap-2 font-medium text-blue-600">
                <span>{title}</span>
                <span className="text-gray-400">--→</span>
              </div>
              {links.length > 0 ? (
                <div className="mt-2 pl-4 flex flex-wrap gap-2">
                  {links.map((link, index) => (
                    <span
                      key={index}
                      className="text-sm px-2 py-1 border border-gray-300  rounded-full bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    >
                      {link}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-1 pl-4 text-sm text-gray-500 dark:text-gray-400">No outgoing connections</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    )
  }
}
