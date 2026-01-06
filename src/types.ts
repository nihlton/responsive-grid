import type * as React from 'react';
import type { DimensionSize, DisplayValue, FontSize, TextAlignValue } from './util';
type ColumnNumber = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12';
type OffsetNumber = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11';

type Hint<T extends string> = T | `${T} ${string}`;

export interface RezElement {
  /** set element's text alignment for each breakpoint */
  'text-align'?: Hint<TextAlignValue>;
  /** set element's display value, space-separated */
  display?: Hint<DisplayValue>;
  /** set element's font-size, space-separated (Font values) */
  font?: Hint<FontSize>;
  /** set element's padding, space-separated (Dimension values) */
  padding?: Hint<DimensionSize>;
  /** set element's margin, space-separated (Dimension values) */
  margin?: Hint<DimensionSize>;
  'margin-top'?: Hint<DimensionSize>;
  'margin-right'?: Hint<DimensionSize>;
  'margin-bottom'?: Hint<DimensionSize>;
  'margin-left'?: Hint<DimensionSize>;
  'padding-top'?: Hint<DimensionSize>;
  'padding-right'?: Hint<DimensionSize>;
  'padding-bottom'?: Hint<DimensionSize>;
  'padding-left'?: Hint<DimensionSize>;
}

export interface RezGrid {
  /** set element's text alignment for each breakpoint */
  'text-align'?: Hint<TextAlignValue>;
  /** skip the given columns before the element (0 to 11) */
  'skip-before'?: Hint<OffsetNumber>;
  /** skip the given columns after the element (0 to 11) */
  'skip-after'?: Hint<OffsetNumber>;
  /** set element's display value (e.g., block, flex, none) */
  display?: Hint<DisplayValue>;
  /** set element's padding (none, small, medium, large, etc.) */
  padding?: Hint<DimensionSize>;
  /** set element's flex order (0-11) */
  order?: Hint<ColumnNumber>;
  /** set element's font-size (xsmall to xxlarge) */
  font?: Hint<FontSize>;
  /** set element's column spans (1-12) */
  col?: Hint<ColumnNumber>;
  /** set element's flex gap (Dimension values) */
  gap?: Hint<DimensionSize>;
}

declare global {
  interface HTMLElementTagNameMap {
    'r-grid': HTMLElement & RezGrid;
    'r-elm': HTMLElement & RezElement;
  }
}

export type Rezel<T> = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & T;

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      /**
       * `<r-grid>`: A responsive grid layout container using space-separated breakpoint values.
       * * @summary Breakpoints: `[small] [medium] [large] [xlarge]`
       * @example: <r-grid col="12 6 4" gap="small medium">...</r-grid>
       */
      'r-grid': Rezel<RezGrid>;
      /**
       * `<r-elm>`: A general purpose responsive element using space-separated breakpoint values.
       * * @summary Breakpoints: `[small] [medium] [large] [xlarge]`
       * @example <r-elm margin-top="medium" font="large">...</r-elm>
       */
      'r-elm': Rezel<RezElement>;
    }
  }
}
