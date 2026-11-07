import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  padding: 2,
  borderRadius: 'var(--infinity-radius-sm, 8px)',
  border: '1px solid var(--infinity-line, currentColor)',
  background: 'var(--infinity-accent-soft, transparent)',
  transition: 'border-radius 0.4s ease, background 0.4s ease',
});

export const chip = style({
  minWidth: 26,
  padding: '2px 4px',
  border: '1px solid transparent',
  borderRadius: 'calc(var(--infinity-radius-sm, 8px) - 2px)',
  fontFamily: 'var(--infinity-font-mono, monospace)',
  fontSize: 9,
  lineHeight: '14px',
  letterSpacing: '0.06em',
  color: 'var(--affine-text-secondary-color, inherit)',
  cursor: 'pointer',
  transition: 'background 0.2s ease, color 0.2s ease, border-color 0.2s ease',
  selectors: {
    '&:hover': {
      borderColor: 'var(--infinity-accent)',
      color: 'var(--infinity-accent)',
    },
    '&:focus-visible': {
      outline: '2px solid var(--infinity-accent)',
      outlineOffset: 1,
    },
  },
});

export const chipActive = style({
  color: 'var(--infinity-accent-ink)',
  background: 'var(--infinity-accent)',
  borderColor: 'var(--infinity-accent)',
  selectors: {
    '&:hover': {
      color: 'var(--infinity-accent-ink)',
    },
  },
});
