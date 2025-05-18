

import { useState } from "react"
import axios from "axios"
import { PlusCircle, Tag, FileText, Type } from "lucide-react"

export default function NoteForm({ onNoteCreated }) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError("")
    setSuccess("")

    if (!title.trim()) {
      setError("Title is required.")
      return
    }

    setIsSubmitting(true)

    try {
      await axios.post("https://personal-knowledge-graph-production.up.railway.app/notes/", {
        title,
        content,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      })

      setTitle("")
      setContent("")
      setTags("")
      onNoteCreated()
      setSuccess("Note created successfully!")
    } catch (err) {
      console.error("Error creating note:", err)
      setError("Failed to create note.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full  mx-auto bg-white border border-gray-200 shadow-md rounded-xl p-6">
      <h2 className="text-2xl font-semibold mb-1">Create a New Note</h2>
      <p className="text-sm text-gray-500 mb-4">Add a new note to your knowledge graph</p>

      {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
      {success && <div className="mb-4 text-green-600 text-sm">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block font-medium text-sm mb-1 flex items-center gap-2">
            <Type className="h-4 w-4" />
            Title
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note Title"
            required
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block font-medium text-sm mb-1 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Note Content (Markdown supported, e.g., [[Note Title]] for links, # Heading, **bold**)"
            className="w-full border rounded-md px-3 py-2 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block font-medium text-sm mb-1 flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Tags
          </label>
          <input
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma separated, e.g., productivity, research)"
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors w-full sm:w-auto disabled:opacity-50"
          >
            <PlusCircle className="h-4 w-4" />
            {isSubmitting ? "Creating..." : "Create Note"}
          </button>
        </div>
      </form>
    </div>
  )
}
