import React, { useState, useRef, useEffect } from 'react';
import { Plus, Edit3, Palette, Image, Map, Trash2, X, ArrowLeft, Save } from 'lucide-react';

// Main Notes App Component
export default function NotesApp() {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('notenest-notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  const [selectedNote, setSelectedNote] = useState(null);

  // Save to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem('notenest-notes', JSON.stringify(notes));
  }, [notes]);

  const createNewNote = () => {
    const newNote = {
      id: Date.now().toString(),
      title: '',
      content: '',
      color: '#ffffff',
      createdAt: new Date().toISOString(),
      images: [],
      drawings: [],
      mindMaps: []
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
    if (selectedNote?.id === id) {
      setSelectedNote(null);
    }
  };

  const updateNote = (id, updates) => {
    setNotes(notes.map(note =>
      note.id === id ? { ...note, ...updates } : note
    ));
    if (selectedNote?.id === id) {
      setSelectedNote({ ...selectedNote, ...updates });
    }
  };

  const colors = [
    '#ffffff', '#fef3c7', '#fecaca', '#fed7d7', '#e9d5ff',
    '#ddd6fe', '#bfdbfe', '#a7f3d0', '#fed7aa', '#fde68a'
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Edit3 className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                NoteNest
              </h1>
            </div>
            <button
              onClick={createNewNote}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Note
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedNote ? (
          <NoteEditor
            note={selectedNote}
            onUpdate={(updates) => updateNote(selectedNote.id, updates)}
            onClose={() => setSelectedNote(null)}
            colors={colors}
          />
        ) : (
          <NotesGrid
            notes={notes}
            onSelectNote={setSelectedNote}
            onDeleteNote={deleteNote}
            onUpdateNote={updateNote}
            colors={colors}
          />
        )}
      </div>
    </div>
  );
}

// Notes Grid Component
function NotesGrid({ notes, onSelectNote, onDeleteNote, onUpdateNote, colors }) {
  return (
    <div>
      {notes.length === 0 ? (
        <div className="text-center py-20">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto">
              <Edit3 className="w-10 h-10 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">No notes yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-sm mx-auto">Start organizing your thoughts by creating your first note</p>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Your Notes</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{notes.length} note{notes.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {notes.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                onSelect={() => onSelectNote(note)}
                onDelete={() => onDeleteNote(note.id)}
                onUpdateColor={(color) => onUpdateNote(note.id, { color })}
                colors={colors}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Individual Note Card
function NoteCard({ note, onSelect, onDelete, onUpdateColor, colors }) {
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Determine if the note color is dark
  const isLightColor = (color) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return brightness > 180;
  };

  const textColorClass = isLightColor(note.color) ? 'text-gray-900' : 'text-white';
  const mutedTextColorClass = isLightColor(note.color) ? 'text-gray-700' : 'text-gray-200';

  return (
    <div
      className="group relative rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 cursor-pointer overflow-hidden"
      style={{ backgroundColor: note.color }}
      onClick={onSelect}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className={`font-semibold truncate flex-1 pr-2 ${textColorClass}`}>
            {note.title || 'Untitled'}
          </h3>
          <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowColorPicker(!showColorPicker);
              }}
              className={`p-1.5 rounded-full hover:bg-black/10 transition-colors ${textColorClass}`}
            >
              <Palette className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className={`p-1.5 rounded-full hover:bg-black/10 transition-colors ${textColorClass}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className={`text-sm line-clamp-4 mb-4 leading-relaxed ${mutedTextColorClass}`}>
          {note.content || 'No content yet...'}
        </p>

        {/* Content indicators */}
        {(note.images?.length > 0 || note.drawings?.length > 0 || note.mindMaps?.length > 0) && (
          <div className="flex gap-2 flex-wrap">
            {note.images?.length > 0 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                <Image className="w-3 h-3 mr-1" />
                {note.images.length}
              </span>
            )}
            {note.drawings?.length > 0 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                <Edit3 className="w-3 h-3 mr-1" />
                {note.drawings.length}
              </span>
            )}
            {note.mindMaps?.length > 0 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">
                <Map className="w-3 h-3 mr-1" />
                {note.mindMaps.length}
              </span>
            )}
          </div>
        )}

        {/* Color Picker */}
        {showColorPicker && (
          <div className="absolute top-14 right-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 p-3 z-20">
            <div className="grid grid-cols-5 gap-2">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateColor(color);
                    setShowColorPicker(false);
                  }}
                  className="w-7 h-7 rounded-full border-2 border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Note Editor Component
function NoteEditor({ note, onUpdate, onClose, colors }) {
  const [activeTab, setActiveTab] = useState('text');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const fileInputRef = useRef(null);

  const handleTitleChange = (e) => {
    onUpdate({ title: e.target.value });
  };

  const handleContentChange = (e) => {
    onUpdate({ content: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const newImages = [...(note.images || []), reader.result];
      onUpdate({ images: newImages });
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (index) => {
    const newImages = note.images.filter((_, i) => i !== index);
    onUpdate({ images: newImages });
  };

  const addDrawing = (drawingData) => {
    const newDrawings = [...(note.drawings || []), drawingData];
    onUpdate({ drawings: newDrawings });
  };

  const addMindMap = (mindMapData) => {
    const newMindMaps = [...(note.mindMaps || []), mindMapData];
    onUpdate({ mindMaps: newMindMaps });
  };

  // Determine if the note color is light for text contrast
  const isLightColor = (color) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return brightness > 180;
  };

  const textColorClass = isLightColor(note.color) ? 'text-gray-900' : 'text-white';
  const placeholderColorClass = isLightColor(note.color) ? 'placeholder-gray-500' : 'placeholder-gray-300';

  const tabs = [
    { id: 'text', label: 'Text', icon: Edit3 },
    { id: 'images', label: 'Images', icon: Image },
    { id: 'drawing', label: 'Drawing', icon: Edit3 },
    { id: 'mindmap', label: 'Mind Map', icon: Map }
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onClose}
          className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-sm transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Notes
        </button>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-sm transition-all duration-200"
            >
              <Palette className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>

            {showColorPicker && (
              <div className="absolute top-12 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 p-3 z-20">
                <div className="grid grid-cols-5 gap-2">
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => {
                        onUpdate({ color });
                        setShowColorPicker(false);
                      }}
                      className="w-7 h-7 rounded-full border-2 border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Note Content */}
      <div
        className="rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 overflow-hidden"
        style={{ backgroundColor: note.color }}
      >
        <div className="p-8">
          {/* Title */}
          <input
            type="text"
            value={note.title}
            onChange={handleTitleChange}
            placeholder="Note title..."
            className={`w-full text-3xl font-bold bg-transparent border-none outline-none resize-none mb-6 ${textColorClass} ${placeholderColorClass}`}
          />

          {/* Tabs */}
          <div className="flex gap-1 mb-6 p-1 bg-black/5 rounded-lg">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-md transition-all duration-200 flex-1 justify-center font-medium ${activeTab === tab.id
                    ? 'bg-white/90 text-blue-600 shadow-sm'
                    : `${textColorClass} hover:bg-white/20`
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="min-h-96">
            {activeTab === 'text' && (
              <div>
                <textarea
                  value={note.content}
                  onChange={handleContentChange}
                  placeholder="Start writing your note..."
                  className={`w-full h-80 bg-transparent border-none outline-none resize-none text-lg leading-relaxed ${textColorClass} ${placeholderColorClass}`}
                />
              </div>
            )}

            {activeTab === 'images' && (
              <div>
                <div className="mb-6">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <Image className="w-4 h-4 mr-2" />
                    Add Image
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {note.images?.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt=""
                        className="w-full h-48 object-cover rounded-lg shadow-sm"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'drawing' && (
              <DrawingCanvas onSave={addDrawing} />
            )}

            {activeTab === 'mindmap' && (
              <MindMapEditor onSave={addMindMap} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Drawing Canvas Component
function DrawingCanvas({ onSave }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#000000');
  const [thickness, setThickness] = useState(2);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 800;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.strokeStyle = tool === 'eraser' ? 'white' : color;
    ctx.lineWidth = thickness;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const saveDrawing = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL();
    onSave({
      id: Date.now().toString(),
      data: dataURL,
      createdAt: new Date().toISOString()
    });
    clearCanvas();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 flex-wrap p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <select
          value={tool}
          onChange={(e) => setTool(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="pen">Pen</option>
          <option value="eraser">Eraser</option>
        </select>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">Color:</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-10 h-10 rounded border border-gray-300 dark:border-gray-600"
            disabled={tool === 'eraser'}
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">Size:</label>
          <input
            type="range"
            min="1"
            max="20"
            value={thickness}
            onChange={(e) => setThickness(e.target.value)}
            className="w-24"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400 w-8">{thickness}px</span>
        </div>

        <div className="flex gap-2 ml-auto">
          <button
            onClick={clearCanvas}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm"
          >
            Clear
          </button>
          <button
            onClick={saveDrawing}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm inline-flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Drawing
          </button>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg cursor-crosshair bg-white shadow-sm"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
    </div>
  );
}

// Mind Map Editor Component
function MindMapEditor({ onSave }) {
  const [nodes, setNodes] = useState([
    { id: '1', x: 350, y: 200, text: 'Central Idea' }
  ]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState('1');

  const addNode = () => {
    if (!selectedNode) return;

    const newId = Date.now().toString();
    const parentNode = nodes.find(n => n.id === selectedNode);
    const angle = Math.random() * 2 * Math.PI;
    const distance = 120;

    const newNode = {
      id: newId,
      x: parentNode.x + Math.cos(angle) * distance,
      y: parentNode.y + Math.sin(angle) * distance,
      text: 'New Idea'
    };

    setNodes([...nodes, newNode]);
    setEdges([...edges, { from: selectedNode, to: newId }]);
  };

  const deleteNode = () => {
    if (!selectedNode || selectedNode === '1') return;

    setNodes(nodes.filter(n => n.id !== selectedNode));
    setEdges(edges.filter(e => e.from !== selectedNode && e.to !== selectedNode));
    setSelectedNode('1');
  };

  const updateNodeText = (id, text) => {
    setNodes(nodes.map(n => n.id === id ? { ...n, text } : n));
  };

  const saveMindMap = () => {
    onSave({
      id: Date.now().toString(),
      nodes,
      edges,
      createdAt: new Date().toISOString()
    });

    // Reset to initial state
    setNodes([{ id: '1', x: 350, y: 200, text: 'Central Idea' }]);
    setEdges([]);
    setSelectedNode('1');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <button
          onClick={addNode}
          disabled={!selectedNode}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
        >
          Add Node
        </button>

        <button
          onClick={deleteNode}
          disabled={!selectedNode || selectedNode === '1'}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
        >
          Delete Node
        </button>

        <button
          onClick={saveMindMap}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm inline-flex items-center gap-2 ml-auto"
        >
          <Save className="w-4 h-4" />
          Save Mind Map
        </button>
      </div>

      <div className="relative w-full h-96 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {edges.map(edge => {
            const fromNode = nodes.find(n => n.id === edge.from);
            const toNode = nodes.find(n => n.id === edge.to);
            if (!fromNode || !toNode) return null;

            return (
              <line
                key={`${edge.from}-${edge.to}`}
                x1={fromNode.x + 75}
                y1={fromNode.y + 20}
                x2={toNode.x + 75}
                y2={toNode.y + 20}
                stroke="#3b82f6"
                strokeWidth="2"
              />
            );
          })}
        </svg>

        {nodes.map(node => (
          <div
            key={node.id}
            className={`absolute w-36 h-10 rounded-lg border-2 bg-white dark:bg-gray-800 cursor-pointer flex items-center justify-center text-sm font-medium transition-all hover:shadow-md ${selectedNode === node.id
              ? 'border-blue-500 shadow-md ring-2 ring-blue-200 dark:ring-blue-400'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
            style={{
              left: Math.max(0, Math.min(node.x, 700)),
              top: Math.max(0, Math.min(node.y, 350))
            }}
            onClick={() => setSelectedNode(node.id)}
          >
            <input
              type="text"
              value={node.text}
              onChange={(e) => updateNodeText(node.id, e.target.value)}
              className="w-full text-center text-xs bg-transparent border-none outline-none px-2 text-gray-900 dark:text-white"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        ))}
      </div>
    </div>
  );
}