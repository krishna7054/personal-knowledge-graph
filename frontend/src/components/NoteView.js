// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const NoteView = ({ noteId, onLinkCreated }) => {
//   const [note, setNote] = useState(null);
//   const [linkId, setLinkId] = useState('');

//   useEffect(() => {
//     const fetchNote = async () => {
//       try {
//         const response = await axios.get(`https://personal-knowledge-graph-production.up.railway.app/notes/${noteId}`);
//         setNote(response.data);
//       } catch (error) {
//         console.error('Error fetching note:', error);
//       }
//     };
//     fetchNote();
//   }, [noteId]);

//   const handleLink = async () => {
//     try {
//       await axios.patch(`https://personal-knowledge-graph-production.up.railway.app/notes/${noteId}/link`, { target_id: parseInt(linkId) });
//       setLinkId('');
//       onLinkCreated();
//     } catch (error) {
//       console.error('Error creating link:', error);
//     }
//   };

//   if (!note) return <div>Loading...</div>;

//   return (
//     <div className="border p-4 mb-4">
//       <h2 className="text-xl font-bold">{note.title}</h2>
//       <p>{note.content}</p>
//       <p><strong>Tags:</strong> {note.tags.map(tag => tag.name).join(', ')}</p>
//       <p><strong>Links:</strong> {note.links.join(', ')}</p>
//       <p><strong>Backlinks:</strong> {note.backlinks.join(', ')}</p>
//       <div className="mt-2">
//         <input
//           type="number"
//           value={linkId}
//           onChange={(e) => setLinkId(e.target.value)}
//           placeholder="Link to Note ID"
//           className="border p-2 mr-2"
//         />
//         <button onClick={handleLink} className="bg-blue-500 text-white p-2">Add Link</button>
//       </div>
//     </div>
//   );
// };

// export default NoteView;




import { useState, useEffect } from "react"
import axios from "axios"
import { Loader2, LinkIcon, ArrowLeftRight, Tag } from "lucide-react"

export default function NoteView({ noteId, onLinkCreated }) {
  const [note, setNote] = useState(null)
  const [linkId, setLinkId] = useState("")
  const [loading, setLoading] = useState(true)
  const [linking, setLinking] = useState(false)

  useEffect(() => {
    const fetchNote = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`https://personal-knowledge-graph-production.up.railway.app/notes/${noteId}`)
        setNote(response.data)
      } catch (error) {
        console.error("Error fetching note:", error)
        alert("Failed to load note details")
      } finally {
        setLoading(false)
      }
    }

    fetchNote()
  }, [noteId])

  const handleLink = async () => {
    if (!linkId.trim()) {
      alert("Please enter a valid note ID")
      return
    }

    setLinking(true)
    try {
      await axios.patch(`https://personal-knowledge-graph-production.up.railway.app/notes/${noteId}/link`, {
        target_id: Number.parseInt(linkId),
      })

      setLinkId("")
      onLinkCreated()

      alert("Link created successfully")

      const response = await axios.get(`https://personal-knowledge-graph-production.up.railway.app/notes/${noteId}`)
      setNote(response.data)
    } catch (error) {
      console.error("Error creating link:", error)
      alert(error.response?.data?.detail || "Failed to create link")
    } finally {
      setLinking(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!note) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>Note not found</p>
      </div>
    )
  }

  return (
    <div className="p-12  ">
      <h1 className="text-3xl flex justify-center text-orange-700">Note Details</h1>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{note.title}</h2>

      <div className="mb-6 text-gray-800 whitespace-pre-wrap">
        {note.content ? note.content : <em className="text-gray-400">No content</em>}
      </div>

      {note.tags && note.tags.length > 0 && (
        <div className="mb-6 mt-5">
          <h3 className="text-sm font-semibold text-gray-600 flex items-center gap-2 mb-2">
            <Tag className="h-4 w-4" />
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {note.tags.map((tag, index) => (
              <span
                key={index}
                className="border border-gray-300 text-gray-700 px-2 py-1 text-sm rounded"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="border rounded shadow-sm p-4">
          <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
            <LinkIcon className="h-4 w-4 text-blue-600" />
            Links
          </h4>
          {note.links && note.links.length > 0 ? (
            <ul className="text-sm space-y-1">
              {note.links.map((link, index) => (
                <li key={index}>{link}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">No outgoing links</p>
          )}
        </div>

        <div className="border rounded shadow-sm p-4">
          <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
            <ArrowLeftRight className="h-4 w-4 text-green-600" />
            Backlinks
          </h4>
          {note.backlinks && note.backlinks.length > 0 ? (
            <ul className="text-sm space-y-1">
              {note.backlinks.map((link, index) => (
                <li key={index}>{link}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">No incoming links</p>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-end">
        <div className="flex-1">
          <label htmlFor="linkId" className="block text-sm font-medium text-gray-700 mb-1">
            Link to Note ID
          </label>
          <input
            id="linkId"
            type="number"
            value={linkId}
            onChange={(e) => setLinkId(e.target.value)}
            placeholder="Enter note ID"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleLink}
          disabled={linking}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
        >
          {linking && <Loader2 className="h-4 w-4 animate-spin" />}
          <LinkIcon className="h-4 w-4" />
          Add Link
        </button>
      </div>
    </div>
  )
}
