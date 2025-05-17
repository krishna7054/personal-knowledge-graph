import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NoteList = ({ onSelectNote, refresh }) => {
  const [notes, setNotes] = useState([]);
  const [tag, setTag] = useState('');
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const params = {};
        if (tag) params.tag = tag;
        if (keyword) params.keyword = keyword;
        const response = await axios.get('http://localhost:8000/notes/', { params });
        setNotes(response.data);
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };
    fetchNotes();
  }, [tag, keyword, refresh]);

  return (
    <div className="mb-4">
      <div className="mb-2 flex space-x-2">
        <input
          type="text"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          placeholder="Filter by tag (e.g., productivity)"
          className="border p-2 flex-1"
        />
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search by keyword"
          className="border p-2 flex-1"
        />
      </div>
      <ul className="border rounded">
        {notes.length === 0 ? (
          <li className="p-2 text-gray-500">No notes found</li>
        ) : (
          notes.map((note) => (
            <li
              key={note.id}
              onClick={() => onSelectNote(note.id)}
              className="cursor-pointer p-2 hover:bg-gray-100"
            >
              {note.title}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default NoteList;