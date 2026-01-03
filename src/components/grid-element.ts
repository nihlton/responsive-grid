import sheet from "../grid-style";
import {
  ContainerClass,
  getClasses,
  getGridAttributeValue as getValues,
  getHostAttributes,
  isGridAttribute,
  ObservedGridAttributes as Attributes,
  getHostCSS,
} from "../util";
import type { GridAttributeValues } from "../util";

/**
 * @attr {string} display - set element's display value for each breakpoint
 * @attr {string} padding - set element's padding for each breakpoint (Dimension values)
 * @attr {string} offset - set element's column offset for each breakpoint  (Integers)
 * @attr {string} order - set element's flex order for each breakpoint (Integers)
 * @attr {string} font - set element's font-size for each breakpoint (Font values)
 * @attr {string} col - set element's column spans for each breakpoint  (Integers)
 * @attr {string} gap - set element's flex gap for each breakpoint (Dimension values)
 *
 * @summary attributes are space-separated values for each break-point
 * - Dimension values: none, small, medium, large, xlarge, xxlarge, small-, medium-, large-, xlarge-, xxlarge-
 * - Font values: xsmall, small, medium, large, xlarge, xxlarge
 * - ex:
 * - font="medium large xlarge"
 * - col="12 6 4"
 *
 * @tag r-grid
 */
export class GridElement extends HTMLElement {
  static observedAttributes = Attributes;

  /**
   * @internal
   */
  private attr: Partial<GridAttributeValues> = {};

  /**
   * @internal
   */
  private readonly mainSlot = (): HTMLSlotElement | null => this.shadowRoot?.querySelector("slot") || null;
  /**
   * @internal
   */
  private readonly container = (): Element | null => this.shadowRoot?.querySelector(`.${ContainerClass}`) || null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot!.adoptedStyleSheets = [sheet];
  }

  /**
   * @internal
   */
  private detectRowChange() {
    const slot = this.mainSlot();
    const container = this.container();

    if (!slot || !container) return;

    const tenants = slot.assignedElements();
    const isRow = tenants.some((el) => el.matches("r-grid"));
    const isNowRow = this.attr.row !== "row" && isRow;
    const noLongerRow = this.attr.row === "row" && !isRow;

    if (isNowRow) this.attr.row = "row";
    if (noLongerRow) delete this.attr.row;
    return isNowRow || noLongerRow;
  }

  /**
   * @internal
   */
  private detectCellChange() {
    const isCell = this.parentElement?.matches("r-grid");
    const isNowCell = this.attr.cell !== "cell" && isCell;
    const noLongerCell = this.attr.cell === "cell" && !isCell;

    if (isNowCell) this.attr.cell = "cell";
    if (noLongerCell) delete this.attr.cell;
    return isNowCell || noLongerCell;
  }

  attributeChangedCallback(name: string, _old: string, value: string) {
    if (isGridAttribute(name)) {
      this.attr[name] = value;
      this.render();
    }
  }

  /**
   * @internal
   */
  connectedMoveCallback() {
    this.detectCellChange();
  }

  connectedCallback() {
    this.mainSlot()?.addEventListener("slotchange", () => {
      if (this.detectRowChange()) this.render();
    });

    this.render();
    const hasRowChange = this.detectRowChange();
    const hasCellChange = this.detectCellChange();
    if (hasRowChange || hasCellChange) this.render();
  }

  render() {
    const classes = getClasses(Attributes, this.attr, getValues);
    const hostAttributes = getHostAttributes(Attributes, this.attr, getValues);
    const hostCSS = getHostCSS(["display"], this.attr, getValues);

    hostCSS.forEach(([attr, value]) => {
      if (value) this.style.setProperty(attr, value);
      if (value === undefined) this.style.removeProperty(attr);
    });

    hostAttributes.forEach(([attr, value]) => {
      if (value) this.setAttribute(attr, value);
      if (value === undefined) this.removeAttribute(attr);
    });

    this.shadowRoot!.innerHTML = `
      <div class="${ContainerClass} ${classes.join(" ")}"><slot></slot></div>
    `;
  }
}

customElements.define("r-grid", GridElement);
