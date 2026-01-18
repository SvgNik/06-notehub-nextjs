"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import css from "./NoteDetails.module.css";

const NoteDetailsClient = () => {
  const { id } = useParams();

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id as string),
    enabled: !!id,
    refetchOnMount: false,
  });

  if (isLoading) {
    return (
      <p style={{ textAlign: "center", marginTop: "40px" }}>
        Loading, please wait...
      </p>
    );
  }

  if (isError || !note) {
    return (
      <p style={{ textAlign: "center", marginTop: "40px" }}>
        Something went wrong.
      </p>
    );
  }

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>{note.createdAt}</p>
      </div>
    </div>
  );
};

export default NoteDetailsClient;
