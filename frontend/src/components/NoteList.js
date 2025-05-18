import { useState, useEffect } from "react"
import axios from "axios"
import { Search, Tag, Loader2 } from "lucide-react"

export default function NoteList({ onSelectNote, refresh }) {
  const [notes, setNotes] = useState([])
  const [tag, setTag] = useState("")
  const [keyword, setKeyword] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedNoteId, setSelectedNoteId] = useState(null)

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true)
      try {
        const params = {}
        if (tag) params.tag = tag
        if (keyword) params.keyword = keyword

        const response = await axios.get("https://personal-knowledge-graph-production.up.railway.app/notes/", { params })
        setNotes(response.data)
      } catch (error) {
        console.error("Error fetching notes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotes()
  }, [tag, keyword, refresh])

  const handleNoteSelect = (noteId) => {
    setSelectedNoteId(noteId)
    onSelectNote(noteId)
  }

  const handleClearFilters = () => {
    setTag("")
    setKeyword("")
  }

  return (
    <div className="flex flex-col h-full">
      {/* Filters */}
      <div className="p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search notes..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="relative">
          <Tag className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <input
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="Filter by tag..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {(tag || keyword) && (
          <div className="flex justify-end">
            <button
              onClick={handleClearFilters}
              className="text-sm text-blue-600 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto border-t border-gray-200">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          </div>
        ) : notes.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No notes found</p>
            {(tag || keyword) && (
              <p className="mt-2 text-sm">Try adjusting your filters</p>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 h-80  overflow-y-auto ">
            {notes.map((note) => (
              <li
                key={note.id}
                onClick={() => handleNoteSelect(note.id)}
                className={`p-5 cursor-pointer transition-colors  ${
                  selectedNoteId === note.id
                    ? "bg-blue-100"
                    : "hover:bg-gray-100"
                }`}
              >
                <h3><span className="text-green-600">Note ID: </span>{note.id}</h3>
                <h3 className="font-semibold text-gray-600 mb-1 "><span className="text-green-600">Title:</span> {note.title}</h3>
                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2 ">
                    <span className="text-green-600 ">Tag:</span>
                    {note.tags.map((tag, idx) => (

                      <span
                        key={idx}
                        className="bg-yellow-100 text-gray-800 px-2 py-1 text-md rounded-full "
                      >
                         {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
