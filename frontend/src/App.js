import React, { useState } from 'react';
import NoteForm from './components/NoteForm';
import NoteList from './components/NoteList';
import NoteView from './components/NoteView';
import GraphView from './components/GraphView';

const App = () => {
  const [selectedNote, setSelectedNote] = useState(null);
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Personal Knowledge Graph</h1>
      <NoteForm onNoteCreated={() => setRefresh(!refresh)} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NoteList onSelectNote={setSelectedNote} refresh={refresh} />
        {selectedNote && <NoteView noteId={selectedNote} onLinkCreated={() => setRefresh(!refresh)} />}
      </div>
      <GraphView refresh={refresh} />
    </div>
  );
};

export default App;