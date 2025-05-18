import { useState, useEffect, useRef, useMemo } from "react"
import axios from "axios"
import CytoscapeComponent from "react-cytoscapejs"
import { Loader2 } from "lucide-react"

export default function GraphView({ refresh, viewType }) {
  const [graph, setGraph] = useState({ adjacency_list: {} })
  const [loading, setLoading] = useState(true)
  const [, setCyReady] = useState(false)
  const [forceUpdate, setForceUpdate] = useState(0)
  const cyRef = useRef(null)
  const mountedRef = useRef(true)

  // Track component mounting state
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  // Safely destroy Cytoscape instance on unmount
  useEffect(() => {
    return () => {
      if (cyRef.current) {
        try {
          cyRef.current.destroy()
        } catch (e) {
          console.error("Error destroying Cytoscape instance:", e)
        }
        cyRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    const fetchGraph = async () => {
      if (!mountedRef.current) return
      setLoading(true)
      try {
        const response = await axios.get("https://personal-knowledge-graph-production.up.railway.app/notes/graph/")
        if (mountedRef.current) {
          setGraph(response.data || { adjacency_list: {} })
        }
      } catch (error) {
        console.error("Error fetching graph:", error)
      } finally {
        if (mountedRef.current) {
          setLoading(false)
        }
      }
    }

    fetchGraph()
  }, [refresh])

  const elements = useMemo(() => {
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

    // Deduplicate elements
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
  }, [graph.adjacency_list])

  // Use a very simple layout to avoid the complexity of cose
  const layout = useMemo(() => ({
    name: "preset", // Use preset instead of cose for reliability
    fit: true,
    padding: 50,
    animate: false,
    positions: function(node) {
      // Generate random positions in a circle
      const radius = 200;
      const angle = Math.random() * 2 * Math.PI;
      return {
        x: 250 + radius * Math.cos(angle),
        y: 250 + radius * Math.sin(angle)
      };
    }
  }), [])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  const hasData = Object.keys(graph.adjacency_list || {}).length > 0

  if (!hasData) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No connections found in your knowledge graph yet.</p>
        <p className="text-gray-500 text-sm mt-2">Create notes and link them together to build your knowledge network.</p>
      </div>
    )
  }

  if (viewType === "visual") {
    // If there are no elements, don't try to render the graph
    if (elements.length === 0) {
      return (
        <div className="p-8 text-center">
          <p className="text-gray-500">No valid connections found in your knowledge graph.</p>
        </div>
      )
    }
    
    return (
      <div className="h-[500px] w-full" key={forceUpdate}>
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
                width: 40,
                height: 40,
                "border-width": 2,
                "border-color": "#6d28d9",
                "text-outline-width": 2,
                "text-outline-color": "#7c3aed"
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
            try {
              // Prevent multiple initialization
              if (!cyRef.current) {
                cyRef.current = cy
                
                // Safe removal of previous event handlers
                cy.removeAllListeners()
                
                // Handle node interactions
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
                
                setCyReady(true)
              }
            } catch (err) {
              console.error("Error setting up Cytoscape:", err)
              // Force a re-render if there's an initialization error
              if (mountedRef.current) {
                setTimeout(() => setForceUpdate(prev => prev + 1), 100)
              }
            }
          }}
        />
      </div>
    )
  } else {
    return (
      <div className="h-[500px] overflow-y-auto p-6">
        <ul className="space-y-5">
          {Object.entries(graph.adjacency_list || {}).map(([title, links]) => (
            <li key={title} className="p-3 bg-gray-100 rounded-lg">
              <div className="flex items-center gap-2 font-medium text-blue-600">
                <span>{title}</span>
                <span className="text-gray-400">--→</span>
              </div>
              {Array.isArray(links) && links.length > 0 ? (
                <div className="mt-2 pl-4 flex flex-wrap gap-2">
                  {links.map((link, index) => (
                    <span
                      key={`${title}-${link}-${index}`}
                      className="text-sm px-2 py-1 border border-gray-300 rounded-full bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
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