type AttrValues<K extends string> = Partial<Record<K, string | undefined>>;
type AttrValidations<K extends string> = Record<K, 'boolean' | ((val: string) => string | null)>;

export const GlobalValues = ['inherit', 'initial', 'revert', 'revert-layer', 'unset'] as const;

export const ObservedElemAttributes = [
  'display',
  'font',
  'text-align',
  'padding',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'margin',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
] as const;
export const ObservedGridAttributes = [
  'row',
  'cell',
  'col',
  'display',
  'text-align',
  'order',
  'skip-before',
  'skip-after',
  'gap',
  'padding',
  'font',
] as const;
export const MediaSizes = ['small', 'medium', 'large', 'xlarge'] as const;
export const DimensionSizes = ['none', 'small', 'medium', 'large', 'xlarge', 'xxlarge'] as const;
export const DisplayValues = [
  'none',
  'block',
  'flex',
  'grid',
  'inline',
  'inline-block',
  'inline-flex',
  'inline-grid',
  'flow-root',
  'contents',
  'table',
  'table-row',
  'list-item',
  ...GlobalValues,
] as const;
export const TextAlignValues = [
  'start',
  'end',
  'left',
  'right',
  'center',
  'justify',
  'match-parent',
] as const;
export const FontSizes = ['xsmall', 'small', 'medium', 'large', 'xlarge', 'xxlarge'] as const;

export type ObservedGridAttribute = (typeof ObservedGridAttributes)[number];
export type ObservedElemAttribute = (typeof ObservedElemAttributes)[number];

export type DimensionSize = (typeof DimensionSizes)[number];
export type DisplayValue = (typeof DisplayValues)[number];
export type TextAlignValue = (typeof TextAlignValues)[number];
export type FontSize = (typeof FontSizes)[number];

export const isElemAttribute = (name: string): name is ObservedElemAttribute =>
  ObservedElemAttributes.includes(name as ObservedElemAttribute);

export const isGridAttribute = (name: string): name is ObservedGridAttribute =>
  ObservedGridAttributes.includes(name as ObservedGridAttribute);

const getValidNumber = (val: string): string | null => {
  const value = parseInt(val.trim());
  return value !== undefined ? String(value) : null;
};

const getValidDisplay = (val: string): string | null => {
  const value = val.trim().toLowerCase();
  return DisplayValues.includes(value as DisplayValue) ? (value as DisplayValue) : null;
};

const getValidDimension = (val: string): string | null => {
  const value = val.trim().toLowerCase();
  return DimensionSizes.includes(value as DimensionSize)
    ? String(DimensionSizes.indexOf(value as DimensionSize))
    : null;
};

const getValidTextAlign = (val: string): TextAlignValue | null => {
  const value = val.trim().toLowerCase();
  return TextAlignValues.includes(value as TextAlignValue) ? (value as TextAlignValue) : null;
};

const getValidFont = (val: string): string | null => {
  const value = val.trim().toLowerCase();
  return FontSizes.includes(value as FontSize)
    ? String(FontSizes.indexOf(value as FontSize))
    : null;
};

export type GridAttributeValues = AttrValues<ObservedGridAttribute>;
export type ElemAttributeValues = AttrValues<ObservedElemAttribute>;

export const getGridAttributeValue: AttrValidations<ObservedGridAttribute> = {
  row: 'boolean',
  cell: 'boolean',
  'text-align': getValidTextAlign,
  'skip-before': getValidNumber,
  'skip-after': getValidNumber,
  col: getValidNumber,
  gap: getValidDimension,
  font: getValidFont,
  order: getValidNumber,
  display: getValidDisplay,
  padding: getValidDimension,
};

export const getElemAttributeValue: AttrValidations<ObservedElemAttribute> = {
  font: getValidFont,
  margin: getValidDimension,
  padding: getValidDimension,
  display: getValidDisplay,
  'text-align': getValidTextAlign,
  'margin-top': getValidDimension,
  'margin-right': getValidDimension,
  'margin-bottom': getValidDimension,
  'margin-left': getValidDimension,
  'padding-top': getValidDimension,
  'padding-right': getValidDimension,
  'padding-bottom': getValidDimension,
  'padding-left': getValidDimension,
};

export const gridAttrShort: Record<ObservedGridAttribute, string> = {
  font: 'f',
  padding: 'p',
  display: 'd',
  row: 'row',
  cell: 'cell',
  col: 'c',
  gap: 'g',
  order: 'or',
  'skip-before': 'sb',
  'skip-after': 'sa',
  'text-align': 'ta',
};

export const elmAttrShort: Record<ObservedElemAttribute, string> = {
  font: 'f',
  margin: 'm',
  padding: 'p',
  display: 'd',
  'text-align': 'ta',
  'margin-top': 'mt',
  'margin-right': 'mr',
  'margin-bottom': 'mb',
  'margin-left': 'ml',
  'padding-top': 'pt',
  'padding-right': 'pr',
  'padding-bottom': 'pb',
  'padding-left': 'pl',
};

export const getClasses = <K extends string>(
  attrNames: readonly K[],
  attrs: AttrValues<K>,
  validations: AttrValidations<K>,
) => {
  const classes: string[] = [];
  for (const attr of attrNames) {
    if (attrs[attr] !== undefined) {
      const validation = validations[attr];
      if (validation === 'boolean') {
        classes.push(`${attr}`);
      } else {
        const values = attrs[attr].split(' ').filter(Boolean);
        values.forEach((val, i) => {
          const mediaSize = MediaSizes[i];
          const value = validation(val);
          if (mediaSize && value) {
            classes.push(`${attr}-${mediaSize}-${value}`);
          }
        });
      }
    }
  }

  return classes;
};

export const getHostAttributes = <K extends string>(
  attrNames: readonly K[],
  attrs: AttrValues<K>,
  validations: AttrValidations<K>,
  short: Record<K, string>,
) => {
  const hostAttributes: Record<string, string | undefined> = {};

  for (const attr of attrNames) {
    MediaSizes.forEach((_mediaSize, i) => {
      hostAttributes[`r-${short[attr]}${i + 1}`] = undefined;
    });

    if (attrs[attr] !== undefined) {
      const validation = validations[attr];
      if (validation === 'boolean') {
        hostAttributes[`r-${attr}`] = attr;
      } else {
        const values = attrs[attr].split(' ').filter(Boolean);
        values.forEach((val, i) => {
          const mediaSize = MediaSizes[i];
          const value = validation(val);
          if (mediaSize && value) {
            hostAttributes[`r-${short[attr]}${i + 1}`] = value;
          }
        });
      }
    }
  }

  return Object.entries(hostAttributes);
};

export const getHostCSS = <K extends string>(
  attrNames: readonly K[],
  attrs: AttrValues<K>,
  validations: AttrValidations<K>,
) => {
  const hostCSS: Record<string, string | undefined> = {};

  for (const attr of attrNames) {
    MediaSizes.forEach((mediaSize) => {
      hostCSS[`--${attr}-${mediaSize}`] = undefined;
    });

    if (attrs[attr] !== undefined) {
      const validation = validations[attr];
      if (validation !== 'boolean') {
        const values = attrs[attr].split(' ').filter(Boolean);
        values.forEach((val, i) => {
          const mediaSize = MediaSizes[i];
          const value = validation(val);
          if (mediaSize && value) {
            hostCSS[`--${attr}-${mediaSize}`] = value;
          }
        });
      }
    }
  }

  return Object.entries(hostCSS);
};
