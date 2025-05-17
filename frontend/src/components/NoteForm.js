import React, { useState } from 'react';
import axios from 'axios';

const NoteForm = ({ onNoteCreated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/notes/', {
        title,
        content,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      });
      setTitle('');
      setContent('');
      setTags('');
      onNoteCreated();
    } catch (error) {
      console.error('Error creating note:', error);
      alert('Failed to create note: ' + (error.response?.data?.detail || 'Unknown error'));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note Title"
          className="border p-2 w-full"
          required
        />
      </div>
      <div className="mb-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Note Content (Markdown supported, e.g., [[Note Title]] for links, # Heading, **bold**)"
          className="border p-2 w-full h-32"
        />
      </div>
      <div className="mb-2">
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags (comma-separated, e.g., productivity, research)"
          className="border p-2 w-full"
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 hover:bg-blue-600">
        Create Note
      </button>
    </form>
  );
};

export default NoteForm;