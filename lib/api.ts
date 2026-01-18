import axios from "axios";
import { Note, CreateNoteData } from "@/types/note";
import { FetchNotesResponse } from "@/types/api";

const BASE_URL = "https://notehub-public.goit.study/api";

const noteApi = axios.create({
  baseURL: BASE_URL,
});

noteApi.interceptors.request.use((config) => {
  const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

export const fetchNotes = async (
  params: FetchNotesParams,
): Promise<FetchNotesResponse> => {
  const { data } = await noteApi.get<FetchNotesResponse>("/notes", { params });
  return data;
};

export const createNote = async (newNote: CreateNoteData): Promise<Note> => {
  const { data } = await noteApi.post<Note>("/notes", newNote);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await noteApi.delete<Note>(`/notes/${id}`);
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await noteApi.get<Note>(`/notes/${id}`);
  return data;
};
