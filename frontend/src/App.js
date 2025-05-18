import { useState } from "react"
import NoteForm from "./components/NoteForm"
import NoteList from "./components/NoteList"
import NoteView from "./components/NoteView"
import GraphView from "./components/GraphView"
import { MoveUpRight, BrainCircuit } from "lucide-react"

export default function Home() {
  const [selectedNote, setSelectedNote] = useState(null)
  const [refresh, setRefresh] = useState(false)
  const [activeTab, setActiveTab] = useState("visual")

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100  p-4 md:p-6 lg:p-8 animate-fadeIn">
      <header className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-center md:justify-start gap-3">
          <BrainCircuit className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 ">
            <span className="text-purple-600">Knowledge</span> <span className="text-orange-500">Graph</span>
          </h1>
        </div>
        <p className="mt-3 text-md font-medium font-serif text-center md:text-left text-gray-600  max-w-2xl">
          Connect your ideas, build your personal knowledge network, and discover new insights.
        </p>
      </header>

      <div className="max-w-7xl mx-auto">
        <NoteForm onNoteCreated={() => setRefresh(!refresh)} />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white  rounded-xl shadow-sm border border-gray-200  overflow-hidden">
              <div className="p-4 border-b border-gray-200 ">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <MoveUpRight className="h-5 w-5 text-purple-600" />
                  Notes
                </h2>
              </div>
              <NoteList onSelectNote={setSelectedNote} refresh={refresh} />
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedNote ? (
              <div className="bg-white  rounded-xl shadow-sm border border-gray-200  overflow-hidden animate-fadeIn">
                <NoteView noteId={selectedNote} onLinkCreated={() => setRefresh(!refresh)} />
              </div>
            ) : (
              <div className="bg-white  rounded-xl shadow-sm border border-gray-200  p-8 flex flex-col items-center justify-center text-center h-full">
                <BrainCircuit className="h-16 w-16 text-gray-300  mb-4" />
                <h3 className="text-xl font-medium text-gray-600 ">Select a note to view</h3>
                <p className="text-gray-500  mt-2 max-w-md">
                  Click on any note from the list to view its details and connections
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <div className="w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-purple-600" />
                Knowledge Network
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab("visual")}
                  className={`px-4 py-2 text-sm font-medium rounded-md border ${
                    activeTab === "visual"
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-white  text-gray-700  border-gray-300 "
                  }`}
                >
                  Visual Graph
                </button>
                <button
                  onClick={() => setActiveTab("text")}
                  className={`px-4 py-2 text-sm font-medium rounded-md border ${
                    activeTab === "text"
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-white  text-gray-700  border-gray-300 "
                  }`}
                >
                  Text View
                </button>
              </div>
            </div>

            <div className="bg-white  rounded-xl shadow-sm border border-gray-200  overflow-hidden">
              {activeTab === "visual" && <GraphView refresh={refresh} viewType="visual" />}
              {activeTab === "text" && <GraphView refresh={refresh} viewType="text" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
