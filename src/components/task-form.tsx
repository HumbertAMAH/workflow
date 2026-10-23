"use client";

import { useId, useState, type FormEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import {
  DESCRIPTION_MAX_LENGTH,
  TITLE_MAX_LENGTH,
  hasErrors,
  validateTaskInput,
  type TaskInputErrors,
} from "@/lib/validation";
import type { TaskInput } from "@/types/task";
import { Button } from "./ui/button";

interface TaskFormProps {
  initialValues?: TaskInput;
  submitLabel: string;
  onSubmit: (values: TaskInput) => void;
  onCancel: () => void;
}

const EMPTY_VALUES: TaskInput = { title: "", description: "" };

const fieldClass =
  "block w-full rounded-lg border-0 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 transition-shadow focus:ring-2 focus:ring-inset focus:ring-indigo-500 focus:outline-none";

export function TaskForm({ initialValues, submitLabel, onSubmit, onCancel }: TaskFormProps) {
  const isEditing = initialValues !== undefined;
  const defaults = initialValues ?? EMPTY_VALUES;
  const [values, setValues] = useState<TaskInput>(defaults);
  const [errors, setErrors] = useState<TaskInputErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const titleId = useId();
  const descriptionId = useId();

  function update(field: keyof TaskInput, value: string) {
    const next = { ...values, [field]: value };
    setValues(next);
    // Après une première tentative, la validation se fait en direct.
    if (submitted) setErrors(validateTaskInput(next));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    const nextErrors = validateTaskInput(values);
    setErrors(nextErrors);

    if (hasErrors(nextErrors)) {
      const firstInvalid = nextErrors.title ? titleId : descriptionId;
      document.getElementById(firstInvalid)?.focus();
      return;
    }
    onSubmit(values);
  }

  const isUnchanged =
    values.title.trim() === defaults.title.trim() && values.description.trim() === defaults.description.trim();

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-5">
      <Field
        id={titleId}
        label="Titre"
        required
        error={errors.title}
        length={values.title.trim().length}
        maxLength={TITLE_MAX_LENGTH}
      >
        {(describedBy) => (
          <input
            id={titleId}
            type="text"
            autoFocus
            autoComplete="off"
            placeholder="Ex. : Préparer la présentation client"
            value={values.title}
            onChange={(e) => update("title", e.target.value)}
            aria-invalid={errors.title ? true : undefined}
            aria-describedby={describedBy}
            aria-required="true"
            className={cn(fieldClass, errors.title && "ring-rose-300 focus:ring-rose-500")}
          />
        )}
      </Field>

      <Field
        id={descriptionId}
        label="Description"
        hint="Facultatif"
        error={errors.description}
        length={values.description.trim().length}
        maxLength={DESCRIPTION_MAX_LENGTH}
      >
        {(describedBy) => (
          <textarea
            id={descriptionId}
            rows={4}
            placeholder="Ajoutez des détails, des liens ou des notes…"
            value={values.description}
            onChange={(e) => update("description", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) e.currentTarget.form?.requestSubmit();
            }}
            aria-invalid={errors.description ? true : undefined}
            aria-describedby={describedBy}
            className={cn(fieldClass, "resize-none", errors.description && "ring-rose-300 focus:ring-rose-500")}
          />
        )}
      </Field>

      <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={isEditing && isUnchanged}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

interface FieldProps {
  id: string;
  label: string;
  hint?: string;
  required?: boolean;
  error?: string;
  length: number;
  maxLength: number;
  children: (describedBy: string) => ReactNode;
}

function Field({ id, label, hint, required, error, length, maxLength, children }: FieldProps) {
  const errorId = `${id}-error`;
  const counterId = `${id}-counter`;
  const overLimit = length > maxLength;

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
          {required && (
            <span className="ml-0.5 text-rose-500" aria-hidden="true">
              *
            </span>
          )}
        </label>
        {hint && <span className="text-xs text-slate-400">{hint}</span>}
      </div>
      {children(error ? `${errorId} ${counterId}` : counterId)}
      <div className="mt-1.5 flex items-start justify-between gap-3 text-xs">
        <p id={errorId} className="animate-fade-in text-rose-600" hidden={!error}>
          {error}
        </p>
        <p id={counterId} className={cn("ml-auto tabular-nums", overLimit ? "text-rose-600" : "text-slate-400")}>
          {length}/{maxLength}
        </p>
      </div>
    </div>
  );
}
