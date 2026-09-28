import { useId, useLayoutEffect, useRef, useState } from 'react';
import type { InputHTMLAttributes } from 'react';
import { numericError } from '../../utils/numericValidation';

type Props = InputHTMLAttributes<HTMLInputElement> & { integer?: boolean };

export function NumericInput({ value, onChange, min = 0, max, integer = false, ...props }: Props) {
  const [draft, setDraft] = useState(String(value ?? ''));
  const [previousValue, setPreviousValue] = useState(value);
  const [touched, setTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const errorId = useId();
  // External changes (edit dialog, quick amount buttons) replace the draft.
  if (!Object.is(value, previousValue)) {
    setPreviousValue(value);
    setDraft(String(value ?? ''));
  }
  const error = numericError(draft, Number(min), max === undefined ? Infinity : Number(max), integer);
  useLayoutEffect(() => {
    inputRef.current?.setCustomValidity(error);
  }, [error]);

  return <>
    <input {...props} ref={inputRef} type="text" inputMode={integer ? 'numeric' : 'decimal'}
      data-numeric value={draft} aria-invalid={!!error}
      aria-describedby={error ? errorId : props['aria-describedby']}
      onInvalid={() => setTouched(true)}
      onChange={(event) => {
        const raw = event.target.value;
        setDraft(raw);
        setTouched(true);
        // Preserve invalid drafts for an explicit error; never coerce blank to zero.
        const nextError = numericError(raw, Number(min), max === undefined ? Infinity : Number(max), integer);
        event.target.setCustomValidity(nextError);
        if (!nextError) onChange?.(event);
      }} />
    {touched && error && <span id={errorId} role="alert" className="block text-xs text-rose-600 mt-1">{error}</span>}
  </>;
}
