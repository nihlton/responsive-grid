type AttrValues<K extends string> = Partial<Record<K, string | undefined>>;
type AttrValidations<K extends string> = Record<K, "boolean" | ((val: string) => string | null)>;

export const ContainerClass = "grid-element" as const;

export const ObservedElemAttributes = [
  "display",
  "font",
  "padding",
  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",
  "margin",
  "margin-top",
  "margin-right",
  "margin-bottom",
  "margin-left",
] as const;
export const ObservedGridAttributes = ["row", "cell", "col", "display", "order", "offset", "gap", "padding", "font"] as const;
export const MediaSizes = ["small", "medium", "large", "xlarge"] as const;
export const DimensionSizes = [
  "none",
  "small",
  "medium",
  "large",
  "xlarge",
  "xxlarge",
  "small-",
  "medium-",
  "large-",
  "xlarge-",
  "xxlarge-",
] as const;
export const DisplayValues = [
  "block",
  "inline",
  "inline-block",
  "flex",
  "inline-flex",
  "grid",
  "inline-grid",
  "flow-root",
  "none",
  "contents",
  "table",
  "table-row",
  "list-item",
  "inherit",
  "initial",
  "revert",
  "revert-layer",
  "unset",
] as const;
export const FontSizes = ["xsmall", "small", "medium", "large", "xlarge", "xxlarge"] as const;

export type ObservedGridAttribute = (typeof ObservedGridAttributes)[number];
export type ObservedElemAttribute = (typeof ObservedElemAttributes)[number];

export type DimensionSize = (typeof DimensionSizes)[number];
export type DisplayValue = (typeof DisplayValues)[number];
export type FontSize = (typeof FontSizes)[number];

export const isElemAttribute = (name: string): name is ObservedElemAttribute => ObservedElemAttributes.includes(name as ObservedElemAttribute);
export const isGridAttribute = (name: string): name is ObservedGridAttribute => ObservedGridAttributes.includes(name as ObservedGridAttribute);
export const isDimensionSize = (size: string): size is DimensionSize => DimensionSizes.includes(size as DimensionSize);
export const isDisplayValue = (value: string): value is DisplayValue => DisplayValues.includes(value as DisplayValue);
export const isFontSize = (size: string): size is FontSize => FontSizes.includes(size as FontSize);

const getValidNumber = (val: string): string | null => {
  const value = parseInt(val.trim());
  return value ? String(value) : null;
};

const getValidDisplay = (val: string): string | null => {
  const value = val.trim().toLowerCase();
  return isDisplayValue(value) ? value : null;
};

const getValidDimension = (val: string): DimensionSize | null => {
  const value = val.trim().toLowerCase();
  return isDimensionSize(value) ? value : null;
};

const getValidFont = (val: string): FontSize | null => {
  const value = val.trim().toLowerCase();
  return isFontSize(value) ? value : null;
};

export type GridAttributeValues = AttrValues<ObservedGridAttribute>;
export type ElemAttributeValues = AttrValues<ObservedElemAttribute>;

export const getGridAttributeValue: AttrValidations<ObservedGridAttribute> = {
  row: "boolean",
  cell: "boolean",
  col: getValidNumber,
  gap: getValidDimension,
  font: getValidFont,
  order: getValidNumber,
  offset: getValidNumber,
  display: getValidDisplay,
  padding: getValidDimension,
};

export const getElemAttributeValue: AttrValidations<ObservedElemAttribute> = {
  font: getValidFont,
  margin: getValidDimension,
  padding: getValidDimension,
  display: getValidDisplay,
  "margin-top": getValidDimension,
  "margin-right": getValidDimension,
  "margin-bottom": getValidDimension,
  "margin-left": getValidDimension,
  "padding-top": getValidDimension,
  "padding-right": getValidDimension,
  "padding-bottom": getValidDimension,
  "padding-left": getValidDimension,
};

export const getClasses = <K extends string>(attrNames: readonly K[], attrs: AttrValues<K>, validations: AttrValidations<K>) => {
  const classes: string[] = [];
  for (const attr of attrNames) {
    if (attrs[attr] !== undefined) {
      const validation = validations[attr];
      if (validation === "boolean") {
        classes.push(`${attr}`);
      } else {
        const values = attrs[attr].split(" ").filter(Boolean);
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

export const getHostAttributes = <K extends string>(attrNames: readonly K[], attrs: AttrValues<K>, validations: AttrValidations<K>) => {
  const hostAttributes: Record<string, string | undefined> = {};

  for (const attr of attrNames) {
    MediaSizes.forEach((mediaSize) => {
      hostAttributes[`data-${attr}-${mediaSize}`] = undefined;
    });

    if (attrs[attr] !== undefined) {
      const validation = validations[attr];
      if (validation === "boolean") {
        hostAttributes[`data-${attr}`] = attr;
      } else {
        const values = attrs[attr].split(" ").filter(Boolean);
        values.forEach((val, i) => {
          const mediaSize = MediaSizes[i];
          const value = validation(val);
          if (mediaSize && value) {
            hostAttributes[`data-${attr}-${mediaSize}`] = value;
          }
        });
      }
    }
  }

  return Object.entries(hostAttributes);
};

export const getHostCSS = <K extends string>(attrNames: readonly K[], attrs: AttrValues<K>, validations: AttrValidations<K>) => {
  const hostCSS: Record<string, string | undefined> = {};

  for (const attr of attrNames) {
    MediaSizes.forEach((mediaSize) => {
      hostCSS[`--${attr}-${mediaSize}`] = undefined;
    });

    if (attrs[attr] !== undefined) {
      const validation = validations[attr];
      if (validation !== "boolean") {
        const values = attrs[attr].split(" ").filter(Boolean);
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
