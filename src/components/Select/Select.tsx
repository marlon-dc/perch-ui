import type { ReactNode } from 'react';
import * as RadixSelect from '@radix-ui/react-select';
import { cn } from '../../lib/cn';
import { resolveSize, type Responsive, type Size } from '../../lib/size';
import { Field } from '../Field';
import { CheckIcon, ChevronDownIcon } from '../Icon';

export type SelectOption = { value: string; label: string; disabled?: boolean };

export type SelectProps = {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  size?: Responsive<Size>;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  options: SelectOption[];
  disabled?: boolean;
  required?: boolean;
};

export function Select({
  label,
  hint,
  error,
  size,
  value,
  defaultValue,
  onValueChange,
  placeholder,
  options,
  disabled,
  required,
}: SelectProps) {
  return (
    <div className={resolveSize(size)}>
      <Field label={label} hint={hint} error={error} required={required}>
        {({ id, describedBy, invalid }) => (
          <RadixSelect.Root
            value={value}
            defaultValue={defaultValue}
            onValueChange={onValueChange}
            disabled={disabled}
            required={required}
          >
            <RadixSelect.Trigger
              id={id}
              aria-describedby={describedBy}
              aria-invalid={invalid ? 'true' : undefined}
              className={cn(
                'ctl-text-input flex h-(--pu-ctl-h) w-full items-center justify-between gap-2 rounded-(--pu-ctl-r) border bg-surface px-(--pu-ctl-px) text-left font-ui text-ink',
                invalid ? 'border-negative' : 'border-line-strong',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'data-[placeholder]:text-muted',
              )}
            >
              <RadixSelect.Value placeholder={placeholder} />
              <RadixSelect.Icon aria-hidden="true" className="shrink-0 text-muted">
                <ChevronDownIcon />
              </RadixSelect.Icon>
            </RadixSelect.Trigger>
            <RadixSelect.Portal>
              <RadixSelect.Content
                position="popper"
                sideOffset={4}
                className={cn(
                  resolveSize(size),
                  'z-50 min-w-(--radix-select-trigger-width) overflow-hidden rounded-(--pu-radius-container) border border-line bg-surface font-ui text-ink shadow-soft',
                )}
              >
                <RadixSelect.Viewport className="p-1">
                  {options.map((option) => (
                    <RadixSelect.Item
                      key={option.value}
                      value={option.value}
                      disabled={option.disabled}
                      className={cn(
                        'ctl-text-input flex min-h-(--pu-ctl-h) cursor-default items-center justify-between gap-2 rounded-(--pu-ctl-r) px-(--pu-ctl-px) outline-none select-none data-[disabled]:opacity-50',
                        // Highlight is not fill-only (surface-2 on surface is ~1.1:1): an inset accent outline (>=3:1).
                        // outline-solid is needed because outline-none zeroes --tw-outline-style.
                        'data-[highlighted]:bg-surface-2 data-[highlighted]:outline-2 data-[highlighted]:outline-solid data-[highlighted]:-outline-offset-2 data-[highlighted]:outline-accent',
                        'forced-colors:data-[highlighted]:bg-[Highlight] forced-colors:data-[highlighted]:text-[HighlightText]',
                        'forced-colors:data-[highlighted]:[forced-color-adjust:none]',
                      )}
                    >
                      <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                      <RadixSelect.ItemIndicator aria-hidden="true">
                        <CheckIcon />
                      </RadixSelect.ItemIndicator>
                    </RadixSelect.Item>
                  ))}
                </RadixSelect.Viewport>
              </RadixSelect.Content>
            </RadixSelect.Portal>
          </RadixSelect.Root>
        )}
      </Field>
    </div>
  );
}
