import { useId, useLayoutEffect, useRef, useState } from 'react';
import type { InputHTMLAttributes } from 'react';
import { personNameError, phoneError, emailError } from '../../../../shared/validation';

type Kind = 'person' | 'phone' | 'email' | 'account' | 'pin' | 'text';
export function ValidatedInput({ kind, value, onChange, ...props }: InputHTMLAttributes<HTMLInputElement> & { kind: Kind }) {
  const ref = useRef<HTMLInputElement>(null);
  const id = useId();
  const [touched, setTouched] = useState(false);
  const validate = (raw: string) => {
    if (!raw && !props.required) return '';
    if (kind === 'text') return raw.trim() && raw.length <= 300 ? '' : 'Vui lòng nhập nội dung, tối đa 300 ký tự';
    if (kind === 'person') return personNameError(raw);
    if (kind === 'phone') return phoneError(raw);
    if (kind === 'email') return emailError(raw);
    return new RegExp(kind === 'pin' ? '^\\d{4}$' : '^\\d{6,20}$').test(raw) ? '' : kind === 'pin' ? 'Mã PIN gồm đúng 4 chữ số' : 'Số tài khoản gồm 6–20 chữ số';
  };
  const error = validate(String(value ?? ''));
  useLayoutEffect(() => { ref.current?.setCustomValidity(error); }, [error]);
  return <>
    <input {...props} ref={ref} value={value} maxLength={props.maxLength ?? (kind === 'text' ? 300 : kind === 'person' ? 100 : kind === 'email' ? 254 : kind === 'phone' ? 11 : kind === 'pin' ? 4 : 20)} aria-invalid={!!error} aria-describedby={error ? id : props['aria-describedby']}
      onInvalid={() => setTouched(true)} onChange={event => { setTouched(true); event.target.setCustomValidity(validate(event.target.value)); onChange?.(event); }} />
    {touched && error && <span id={id} role="alert" className="block text-xs text-rose-600 mt-1">{error}</span>}
  </>;
}
