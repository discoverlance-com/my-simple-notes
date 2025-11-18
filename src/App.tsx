import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";

import "./App.css";
import { eq, useLiveQuery } from "@tanstack/react-db";
import { notesCollection, notesSchema } from "./lib/db";
import { Toaster } from "./components/ui/sonner";
import { ThemeProvider } from "./components/theme-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { toast } from "sonner";
import { useRef, useState } from "react";
import { ScrollArea, ScrollBar } from "./components/ui/scroll-area";
import { Skeleton } from "./components/ui/skeleton";
import { Button } from "./components/ui/button";
import {
  FileCodeIcon,
  PlusIcon,
  StarIcon,
  StarOffIcon,
  TrashIcon,
} from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

function App() {
  const { data: notes } = useLiveQuery((q) =>
    q.from({ notes: notesCollection }),
  );

  const { data: favoriteNotes } = useLiveQuery((q) =>
    q
      .from({ notes: notesCollection })
      .where(({ notes }) => eq(notes.is_favorite, true)),
  );

  return (
    <ThemeProvider>
      <main className="min-h-screen container mx-auto w-full space-y-12">
        <div>
          <h1 className="text-4xl font-bold text-pretty text-center text-foreground sm:text-5xl">
            My Simple Notes
          </h1>
          <p className="mt-3 text-lg text-center text-muted-foreground">
            Capture your thoughts, organize your ideas. All your data is stored
            in the browser
          </p>
        </div>

        {notes.length > 0 && (
          <div className="gap-8 flex items-center">
            <Card className="w-38">
              <CardHeader>
                <CardTitle className="text-xl">{notes.length}</CardTitle>
                <CardDescription>Total Notes</CardDescription>
              </CardHeader>
            </Card>

            <Card className="w-38">
              <CardHeader>
                <CardTitle className="text-xl">
                  {favoriteNotes.length}
                </CardTitle>
                <CardDescription>Favoriate Notes</CardDescription>
              </CardHeader>
            </Card>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-16">
          <AddNote />
          <ListNotes />
        </div>
      </main>

      <Toaster position="bottom-center" duration={3500} richColors />
    </ThemeProvider>
  );
}

function ListNotes() {
  const { data: notes, isLoading } = useLiveQuery((q) =>
    q
      .from({ notes: notesCollection })
      .orderBy(({ notes }) => notes.created_at, "desc"),
  );

  const toggleFavorite = (id: string) => {
    notesCollection.update(id, (note) => {
      note.is_favorite = !note.is_favorite;
      note.updated_at = Date.now();
    });
  };

  const deleteNote = (id: string) => {
    notesCollection.delete(id);
    toast.success("Note deleted");
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-xl mx-auto">
        <CardHeader>
          <h2 className="leading-none font-semibold text-xl text-left">
            A list of all notes
          </h2>
          <CardDescription>Loading notes, please wait</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="space-y-4 h-[500px]">
            <ScrollBar orientation="vertical" />
            <div className="space-y-6">
              <Skeleton className="w-full h-24" />
              <Skeleton className="w-full h-24" />
              <Skeleton className="w-full h-24" />
              <Skeleton className="w-full h-24" />
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <h2 className="leading-none font-semibold text-xl text-left">
          A list of all notes
        </h2>
      </CardHeader>
      <CardContent>
        <ScrollArea className="space-y-4 h-[500px]">
          <ScrollBar orientation="vertical" />
          <div className="space-y-6">
            {notes.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <FileCodeIcon />
                  </EmptyMedia>
                  <EmptyTitle>No Notes Yet</EmptyTitle>
                  <EmptyDescription>
                    You haven&apos;t created any notes yet. Get started by
                    creating your first note.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        (
                          document.querySelector(
                            "#add-note-input",
                          ) as HTMLInputElement
                        )?.focus();
                      }}
                    >
                      <PlusIcon /> Add new note
                    </Button>
                  </div>
                </EmptyContent>
              </Empty>
            ) : (
              notes.map((note) => {
                return (
                  <Card key={note.id}>
                    <CardHeader>
                      <h3 className="leading-none font-semibold text-base flex items-center justify-between gap-4 flex-wrap">
                        <span>{note.title}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => {
                            toggleFavorite(note.id);
                          }}
                        >
                          {note.is_favorite ? (
                            <span className="sr-only">Unfavorite</span>
                          ) : (
                            <span className="sr-only">Make favorite</span>
                          )}
                          {note.is_favorite ? (
                            <StarOffIcon className="text-primary" />
                          ) : (
                            <StarIcon />
                          )}
                        </Button>
                      </h3>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          deleteNote(note.id);
                        }}
                      >
                        <TrashIcon /> <span className="sr-only">Delete</span>
                      </Button>
                    </CardHeader>
                  </Card>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function AddNote() {
  const [value, setValue] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent newline
      if (formRef.current) {
        formRef.current.requestSubmit(); // Submits the form
      }
    }
  };

  const addNewNote = (title: string) => {
    // validate the schema
    const data = {
      id: Date.now().toString(),
      title,
      is_favorite: false,
      created_at: Date.now(),
      updated_at: Date.now(),
    };

    const { error, data: note } = notesSchema.safeParse(data);

    if (error) {
      toast.error("Failed to save note.");
      return;
    }
    notesCollection.insert(note);
    toast.success("Note Added");
  };

  return (
    <form
      id="add-note-form"
      ref={formRef}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();

        if (value) {
          addNewNote(value);
          // reset input
          setValue("");
        }
      }}
    >
      <Card className="w-full max-w-xl mx-auto">
        <CardHeader>
          <h2 className="leading-none font-semibold text-xl text-left">
            Add New Note
          </h2>
        </CardHeader>
        <CardContent>
          <InputGroup>
            <InputGroupTextarea
              id="add-note-input"
              placeholder="Enter Note..."
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              required
              maxLength={100}
            />
            <InputGroupAddon align="block-end">
              <InputGroupText className="mt-1 text-xs text-muted-foreground">
                {value.length}/100 characters
              </InputGroupText>
              <InputGroupButton
                className="ml-auto"
                type="submit"
                variant="default"
              >
                Save
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </CardContent>
      </Card>
    </form>
  );
}

export default App;
