import { createCollection } from "@tanstack/react-db";
import { localStorageCollectionOptions } from "@tanstack/react-db";
import { z } from "zod/v4";

export const notesSchema = z.object({
  id: z.string().min(1, "ID is required"),
  title: z
    .string()
    .min(1, "Note title is required")
    .trim()
    .max(100, "Note should not be more than 100 characters"),
  is_favorite: z.boolean().default(false),
  created_at: z.number().optional(),
  updated_at: z.number().optional(),
});

export type Note = z.output<typeof notesSchema>;

export const notesCollection = createCollection(
  localStorageCollectionOptions({
    schema: notesSchema,
    id: "notes",
    storageKey: "my notes",
    getKey: (item) => item.id,
  }),
);
