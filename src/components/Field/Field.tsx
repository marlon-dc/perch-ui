import { useId, type ReactNode } from 'react';

export type FieldProps = {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  children: (ids: { id: string; describedBy?: string; invalid: boolean }) => ReactNode;
};

export function Field({ label, hint, error, required, children }: FieldProps) {
  const uid = useId();
  const id = `${uid}-control`;
  const hintId = `${uid}-hint`;
  const errorId = `${uid}-error`;
  const hasHint = hint !== undefined && hint !== null && hint !== false;
  const hasError = error !== undefined && error !== null && error !== false;
  const describedBy = [hasHint ? hintId : null, hasError ? errorId : null].filter(Boolean).join(' ');

  return (
    <div className="flex flex-col gap-1.5 font-ui">
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
        {required ? (
          <span aria-hidden="true" className="text-negative">
            {' *'}
          </span>
        ) : null}
      </label>
      {children({ id, describedBy: describedBy || undefined, invalid: hasError })}
      {hasHint ? (
        <p id={hintId} className="text-sm text-muted">
          {hint}
        </p>
      ) : null}
      {hasError ? (
        <p id={errorId} className="text-sm text-negative">
          {error}
        </p>
      ) : null}
    </div>
  );
}
