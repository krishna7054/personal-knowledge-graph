// import React, { useState } from 'react';
// import axios from 'axios';

// const NoteForm = ({ onNoteCreated }) => {
//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');
//   const [tags, setTags] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post('http://localhost:8000/notes/', {
//         title,
//         content,
//         tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
//       });
//       setTitle('');
//       setContent('');
//       setTags('');
//       onNoteCreated();
//     } catch (error) {
//       console.error('Error creating note:', error);
//       alert('Failed to create note: ' + (error.response?.data?.detail || 'Unknown error'));
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-4 sm:p-6 md:p-8 mb-8 space-y-4 transition-all duration-500 ease-in-out animate-fade-in"
//     >
//       <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">Create a New Note</h2>

//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
//         <input
//           type="text"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           placeholder="Note Title"
//           className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
//           required
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
//         <textarea
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//           placeholder="Note Content (Markdown supported)"
//           className="border border-gray-300 rounded-md p-2 w-full h-36 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
//         <input
//           type="text"
//           value={tags}
//           onChange={(e) => setTags(e.target.value)}
//           placeholder="Tags (e.g., productivity, research)"
//           className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />
//       </div>

//       <button
//         type="submit"
//         className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300"
//       >
//         Create Note
//       </button>
//     </form>
//   );
// };

// export default NoteForm;


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
      await axios.post("http://localhost:8000/notes/", {
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
            placeholder="Note Content (Markdown supported)"
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
