import React, { useState } from 'react';
import NoteForm from './components/NoteForm';
import NoteList from './components/NoteList';
import NoteView from './components/NoteView';
import GraphView from './components/GraphView';
import './App.css';

const App = () => {
  const [selectedNote, setSelectedNote] = useState(null);
  const [refresh, setRefresh] = useState(false);

  return (
    <div className=" p-4 min-h-screen bg-gray-50 animate-fadeIn">
      <h1 className="motion-preset-focus text-4xl font-bold mb-6 text-center text-gray-600 italic">Personal <span className='text-red-500 '>Knowledge</span> <span className='text-green-500'>Graph</span></h1>
      <NoteForm onNoteCreated={() => setRefresh(!refresh)} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="animate-slideUp">
          <NoteList onSelectNote={setSelectedNote} refresh={refresh} />
        </div>
        {selectedNote && (
          <div className="animate-slideUp">
            <NoteView noteId={selectedNote} onLinkCreated={() => setRefresh(!refresh)} />
          </div>
        )}
      </div>
      <div className="mt-6 animate-slideUp">
        <GraphView refresh={refresh} />
      </div>
    </div>
  );
};

export default App;