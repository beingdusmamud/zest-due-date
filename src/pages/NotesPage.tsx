
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { PlusCircle, Edit, Trash, Save, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export function NotesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    fetchNotes();
  }, [user, navigate]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;

      setNotes(data || []);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch notes");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (note?: Note) => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setCurrentNote(note);
      setIsEditing(true);
    } else {
      setTitle("");
      setContent("");
      setCurrentNote(null);
      setIsEditing(false);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setTitle("");
    setContent("");
    setCurrentNote(null);
    setIsEditing(false);
  };

  const handleSaveNote = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      if (isEditing && currentNote) {
        // Update existing note
        const { error } = await supabase
          .from("notes")
          .update({
            title,
            content,
            updated_at: new Date().toISOString(),
          })
          .eq("id", currentNote.id);

        if (error) throw error;
        toast.success("Note updated successfully");
      } else {
        // Create new note
        const { error } = await supabase.from("notes").insert({
          title,
          content,
          user_id: user!.id,
        });

        if (error) throw error;
        toast.success("Note created successfully");
      }

      handleCloseDialog();
      fetchNotes();
    } catch (error: any) {
      toast.error(error.message || "Failed to save note");
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (!confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      const { error } = await supabase.from("notes").delete().eq("id", id);

      if (error) throw error;

      setNotes(notes.filter((note) => note.id !== id));
      toast.success("Note deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete note");
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Notes</h1>
        <Button onClick={() => handleOpenDialog()} className="flex items-center gap-2">
          <PlusCircle size={16} />
          <span>New Note</span>
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-pulse text-xl">Loading notes...</div>
        </div>
      ) : notes.length === 0 ? (
        <Card className="text-center py-16 bg-muted/30">
          <CardContent>
            <p className="text-xl mb-4">You don't have any notes yet.</p>
            <Button onClick={() => handleOpenDialog()} className="flex items-center gap-2 mx-auto">
              <PlusCircle size={16} />
              <span>Create your first note</span>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <Card key={note.id} className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="line-clamp-1 text-lg">{note.title}</CardTitle>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleOpenDialog(note)}
                    >
                      <Edit size={16} />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive"
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      <Trash size={16} />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(note.updated_at)}
                </p>
              </CardHeader>
              <CardContent className="pt-0 pb-4 flex-grow">
                <p className="line-clamp-5 text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">
                  {note.content || "No content"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Note" : "Create Note"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Input
                id="title"
                placeholder="Note title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Textarea
                id="content"
                placeholder="Note content"
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full resize-none"
              />
            </div>
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <DialogClose asChild>
              <Button variant="outline" type="button" className="flex items-center gap-1">
                <X size={16} /> Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleSaveNote} className="flex items-center gap-1">
              <Save size={16} /> Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default NotesPage;
