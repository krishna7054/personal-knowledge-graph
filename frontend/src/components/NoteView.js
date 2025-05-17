import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NoteView = ({ noteId, onLinkCreated }) => {
  const [note, setNote] = useState(null);
  const [linkId, setLinkId] = useState('');

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/notes/${noteId}`);
        setNote(response.data);
      } catch (error) {
        console.error('Error fetching note:', error);
      }
    };
    fetchNote();
  }, [noteId]);

  const handleLink = async () => {
    try {
      await axios.patch(`http://localhost:8000/notes/${noteId}/link`, { target_id: parseInt(linkId) });
      setLinkId('');
      onLinkCreated();
    } catch (error) {
      console.error('Error creating link:', error);
    }
  };

  if (!note) return <div>Loading...</div>;

  return (
    <div className="border p-4 mb-4">
      <h2 className="text-xl font-bold">{note.title}</h2>
      <p>{note.content}</p>
      <p><strong>Tags:</strong> {note.tags.map(tag => tag.name).join(', ')}</p>
      <p><strong>Links:</strong> {note.links.join(', ')}</p>
      <p><strong>Backlinks:</strong> {note.backlinks.join(', ')}</p>
      <div className="mt-2">
        <input
          type="number"
          value={linkId}
          onChange={(e) => setLinkId(e.target.value)}
          placeholder="Link to Note ID"
          className="border p-2 mr-2"
        />
        <button onClick={handleLink} className="bg-blue-500 text-white p-2">Add Link</button>
      </div>
    </div>
  );
};

export default NoteView;