import React, { useState, useEffect, useRef } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Card, CardHeader, CardTitle } from "../components/ui/card";
import {
  Search,
  Plus,
  Trash2,
  Download,
  Upload,
  Mic,
  MicOff,
  Sparkles,
  Tag,
  X,
  ChevronDown,
  ChevronUp,
  Save,
  Cloud,
} from "lucide-react";

export default function AINotesApp() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [lastSaved, setLastSaved] = useState("");
  const [showSystemPrompt, setShowSystemPrompt] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState(
    "You are a helpful AI assistant for note-taking. Provide clear, concise summaries and helpful content enhancements. When summarizing, focus on key points and main ideas."
  );
  const [apiKey, setApiKey] = useState("");

  const recognitionRef = useRef(null);

  // Load API key from environment
  useEffect(() => {
    const loadApiKey = async () => {
      // Try to get from Electron environment first
      if (window.electronAPI) {
        const key = await window.electronAPI.getEnv('VITE_GEMINI_API_KEY');
        if (key) {
          setApiKey(key);
          return;
        }
      }
      // Fallback to Vite environment variable
      const key = import.meta.env.VITE_GEMINI_API_KEY;
      if (key) {
        setApiKey(key);
      } else {
        console.warn('No API key found. Please set VITE_GEMINI_API_KEY in .env file');
      }
    };
    loadApiKey();
  }, []);

  // Load notes from Electron file storage or localStorage fallback
  useEffect(() => {
    const loadNotes = async () => {
      try {
        if (window.electronAPI) {
          const loadedNotes = await window.electronAPI.loadNotes();
          setNotes(loadedNotes);
          if (loadedNotes.length > 0) {
            setSelectedNote(loadedNotes[0]);
          }
        } else {
          // Fallback for non-Electron (e.g., browser)
          const savedNotes = localStorage.getItem("ai-notes");
          if (savedNotes) {
            const parsed = JSON.parse(savedNotes);
            setNotes(parsed);
            if (parsed.length > 0) {
              setSelectedNote(parsed[0]);
            }
          }
        }
      } catch (error) {
        console.error("Failed to load notes:", error);
      }
    };
    loadNotes();
  }, []);

  // Auto-save to Electron file storage or localStorage fallback
  useEffect(() => {
    const saveNotes = async () => {
      if (notes.length > 0) {
        try {
          if (window.electronAPI) {
            await window.electronAPI.saveNotes(notes);
          } else {
            localStorage.setItem("ai-notes", JSON.stringify(notes));
          }
          setLastSaved(new Date().toLocaleTimeString());
        } catch (error) {
          console.error("Failed to save notes:", error);
        }
      }
    };
    saveNotes();
  }, [notes]);

  const createNewNote = () => {
    const newNote = {
      id: Date.now().toString(),
      title: "Untitled Note",
      content: "",
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
  };

  const updateNote = (updates) => {
    if (!selectedNote) return;

    const updatedNote = {
      ...selectedNote,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    setNotes(notes.map((n) => (n.id === selectedNote.id ? updatedNote : n)));
    setSelectedNote(updatedNote);
  };

  const deleteNote = (id) => {
    const filtered = notes.filter((n) => n.id !== id);
    setNotes(filtered);
    if (selectedNote?.id === id) {
      setSelectedNote(filtered[0] || null);
    }
  };

  const addTag = () => {
    if (!selectedNote || !newTag.trim()) return;
    const tagToAdd = newTag.trim().toLowerCase();
    if (!selectedNote.tags.includes(tagToAdd)) {
      updateNote({ tags: [...selectedNote.tags, tagToAdd] });
    }
    setNewTag("");
  };

  const removeTag = (tag) => {
    if (!selectedNote) return;
    updateNote({ tags: selectedNote.tags.filter((t) => t !== tag) });
  };

  const toggleTagFilter = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const summarizeNote = async () => {
    if (!selectedNote || !selectedNote.content) return;
    
    if (!apiKey) {
      alert("API key not configured. Please set VITE_GEMINI_API_KEY in your .env file.");
      return;
    }

    setIsSummarizing(true);
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: `${systemPrompt}\n\nPlease summarize the following note:\n\n${selectedNote.content}` },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "API error");

      const summary = data.candidates?.[0]?.content?.parts?.[0]?.text || "Summary unavailable.";

      const summaryNote = {
        id: Date.now().toString(),
        title: `Summary: ${selectedNote.title}`,
        content: summary,
        tags: [...selectedNote.tags, "ai-summary"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setNotes([summaryNote, ...notes]);
      setSelectedNote(summaryNote);
    } catch (error) {
      console.error("Summarization error:", error);
      alert("Failed to summarize note. Check API key or network.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const generateNote = async () => {
    const prompt = window.prompt("What would you like AI to help you write about?");
    if (!prompt) return;
    
    if (!apiKey) {
      alert("API key not configured. Please set VITE_GEMINI_API_KEY in your .env file.");
      return;
    }

    setIsSummarizing(true);
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: `${systemPrompt}\n\n${prompt}` },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "API error");

      const content = data.candidates?.[0]?.content?.parts?.[0]?.text || "Content unavailable.";

      const aiNote = {
        id: Date.now().toString(),
        title: prompt.slice(0, 50) + (prompt.length > 50 ? "..." : ""),
        content: content,
        tags: ["ai-generated"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setNotes([aiNote, ...notes]);
      setSelectedNote(aiNote);
    } catch (error) {
      console.error("Generation error:", error);
      alert("Failed to generate note. Check API key or network.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const startRecording = () => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event) => {
      const transcription = event.results[0][0].transcript;
      if (selectedNote) {
        updateNote({
          content: selectedNote.content + "\n\n" + transcription,
        });
      } else {
        const voiceNote = {
          id: Date.now().toString(),
          title: "Voice Note",
          content: transcription,
          tags: ["voice-note"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setNotes([voiceNote, ...notes]);
        setSelectedNote(voiceNote);
      }
    };
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      alert("Failed to transcribe audio. Check microphone permissions.");
    };
    recognition.onend = () => setIsRecording(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const exportNotes = () => {
    const dataStr = JSON.stringify(notes, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `notes-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importNotes = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result);
        setNotes([...imported, ...notes]);
        alert("Notes imported successfully!");
      } catch (error) {
        alert("Failed to import notes. Invalid file format.");
      }
    };
    reader.readAsText(file);
  };

  const allTags = Array.from(new Set(notes.flatMap((n) => n.tags)));

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags =
      selectedTags.length === 0 || selectedTags.some((tag) => note.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-80 border-r border-border flex flex-col bg-muted/30">
        {/* Header */}
        <div className="p-4 border-b border-border bg-background">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-foreground">AI Notes</h1>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={exportNotes} title="Export">
                <Download className="h-4 w-4" />
              </Button>
              <label>
                <Button size="sm" variant="outline" asChild>
                  <span>
                    <Upload className="h-4 w-4" />
                  </span>
                </Button>
                <input
                  type="file"
                  accept=".json"
                  onChange={importNotes}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Tags Filter */}
        {allTags.length > 0 && (
          <div className="p-4 border-b border-border bg-background">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Filter by tags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTagFilter(tag)}
                  className={`px-2 py-1 text-xs rounded-md transition-colors ${
                    selectedTags.includes(tag)
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto p-2">
          <Button
            onClick={createNewNote}
            className="w-full mb-2"
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Note
          </Button>
          {filteredNotes.map((note) => (
            <Card
              key={note.id}
              className={`mb-2 cursor-pointer transition-colors ${
                selectedNote?.id === note.id
                  ? "border-primary bg-accent"
                  : "hover:bg-accent/50"
              }`}
              onClick={() => setSelectedNote(note)}
            >
              <CardHeader className="p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm truncate text-foreground">
                      {note.title}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note.id);
                    }}
                    className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {note.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-1.5 py-0.5 text-xs rounded bg-primary/10 text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Sync Status */}
        <div className="p-3 border-t border-border bg-background">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Cloud className="h-3 w-3" />
            <span>Last saved: {lastSaved || "Not saved yet"}</span>
          </div>
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex flex-col">
        {selectedNote ? (
          <>
            {/* Editor Header */}
            <div className="p-4 border-b border-border bg-background">
              <Input
                value={selectedNote.title}
                onChange={(e) => updateNote({ title: e.target.value })}
                className="text-2xl font-bold border-0 px-0 focus-visible:ring-0 mb-4"
                placeholder="Note title..."
              />

              <div className="flex items-center gap-2 mb-4">
                <Button
                  size="sm"
                  onClick={summarizeNote}
                  disabled={isSummarizing || !selectedNote.content}
                  className="bg-primary text-primary-foreground"
                >
                  {isSummarizing ? (
                    "Summarizing..."
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Summarize
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  onClick={generateNote}
                  disabled={isSummarizing}
                  variant="secondary"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate with AI
                </Button>
                <Button
                  size="sm"
                  onClick={isRecording ? stopRecording : startRecording}
                  variant={isRecording ? "destructive" : "outline"}
                >
                  {isRecording ? (
                    <>
                      <MicOff className="h-4 w-4 mr-2" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4 mr-2" />
                      Voice Note
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowSystemPrompt(!showSystemPrompt)}
                >
                  {showSystemPrompt ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                  System Prompt
                </Button>
              </div>

              {showSystemPrompt && (
                <div className="mb-4">
                  <Textarea
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    placeholder="Customize AI behavior..."
                    className="min-h-24 text-sm"
                  />
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2">
                {selectedNote.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 text-sm rounded-md bg-primary text-primary-foreground"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:bg-primary-foreground/20 rounded p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                <div className="flex items-center gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addTag()}
                    placeholder="Add tag..."
                    className="w-32 h-8 text-sm"
                  />
                  <Button size="sm" onClick={addTag} variant="outline">
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Editor Content */}
            <div className="flex-1 p-4 overflow-y-auto">
              <Textarea
                value={selectedNote.content}
                onChange={(e) => updateNote({ content: e.target.value })}
                placeholder="Start writing your note..."
                className="min-h-full text-base border-0 focus-visible:ring-0 resize-none"
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Save className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                No note selected
              </h2>
              <p className="text-muted-foreground mb-4">
                Create a new note or select an existing one
              </p>
              <Button onClick={createNewNote}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Note
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
