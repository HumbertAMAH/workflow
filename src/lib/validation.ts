import type { TaskInput } from "@/types/task";

export const TITLE_MIN_LENGTH = 3;
export const TITLE_MAX_LENGTH = 100;
export const DESCRIPTION_MAX_LENGTH = 500;

export type TaskInputErrors = Partial<Record<keyof TaskInput, string>>;

export function validateTaskInput(input: TaskInput): TaskInputErrors {
  const errors: TaskInputErrors = {};
  const title = input.title.trim();
  const description = input.description.trim();

  if (title.length === 0) {
    errors.title = "Le titre est obligatoire.";
  } else if (title.length < TITLE_MIN_LENGTH) {
    errors.title = `Le titre doit contenir au moins ${TITLE_MIN_LENGTH} caractères.`;
  } else if (title.length > TITLE_MAX_LENGTH) {
    errors.title = `Le titre ne peut pas dépasser ${TITLE_MAX_LENGTH} caractères.`;
  }

  if (description.length > DESCRIPTION_MAX_LENGTH) {
    errors.description = `La description ne peut pas dépasser ${DESCRIPTION_MAX_LENGTH} caractères.`;
  }

  return errors;
}

export function hasErrors(errors: TaskInputErrors): boolean {
  return Object.keys(errors).length > 0;
}
