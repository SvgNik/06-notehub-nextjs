"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { fetchNotes, createNote, deleteNote } from "@/lib/api";
import { CreateNoteData, Note } from "@/types/note";
import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./Notes.module.css";

const NotesClient = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();
  const PER_PAGE = 6;

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notes", page, debouncedSearch],
    queryFn: () =>
      fetchNotes({ page, perPage: PER_PAGE, search: debouncedSearch }),
  });

  const deleteMutation = useMutation<Note, Error, string>({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (err) => {
      alert(`Error deleting note: ${err.message}`);
    },
  });

  const createMutation = useMutation<Note, Error, CreateNoteData>({
    mutationFn: createNote,
    onSuccess: () => {
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (err) => {
      alert(`Error creating note: ${err.message}`);
    },
  });

  const handleDeleteNote = (id: string) => {
    if (confirm("Are you sure you want to delete this note?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleCreateNote = (noteData: CreateNoteData) => {
    createMutation.mutate(noteData);
  };

  const handlePageClick = (pageNumber: number) => {
    setPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const notes = data?.notes || [];
  const totalPages = data?.totalPages || 0;

  return (
    <div className={css.container}>
      <div className={css.toolbar}>
        <h1 className={css.title}>My Notes</h1>
        <SearchBox value={search} onChange={handleSearch} />
        <button className={css.createBtn} onClick={() => setIsModalOpen(true)}>
          Create Note +
        </button>
      </div>

      {isLoading && <p className={css.empty}>Loading notes...</p>}

      {isError && (
        <p className={css.error}>
          Error:{" "}
          {error instanceof Error ? error.message : "Something went wrong"}
        </p>
      )}

      {notes.length > 0 ? (
        <>
          <NoteList notes={notes} onDelete={handleDeleteNote} />

          {totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              handlePageClick={handlePageClick}
              currentPage={page}
            />
          )}
        </>
      ) : (
        !isLoading && !isError && <p className={css.empty}>No notes found</p>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <NoteForm
          onSubmit={handleCreateNote}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default NotesClient;
