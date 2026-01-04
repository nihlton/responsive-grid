import sheet from '../grid-style';
import {
  getElemAttributeValue as getValues,
  getHostAttributes,
  isElemAttribute,
  ObservedElemAttributes as Attributes,
  getHostCSS,
  elmAttrShort,
} from '../util';
import type { ElemAttributeValues } from '../util';

/**
 * @attr {string} text-align - set element's text alignment for each breakpoint
 * @attr {string} display - set element's display value for each breakpoint, space-separated
 * @attr {string} font - set element's font-size for each breakpoint, space-separated (Font values)
 * @attr {string} padding - set element's padding for each breakpoint, space-separated (Dimension values)
 * @attr {string} margin - set element's margin for each breakpoint, space-separated  (Integers)
 * @attr {string} margin-top - set element's margin-top for each breakpoint, space-separated (Dimension values)
 * @attr {string} margin-right - set element's margin-right for each breakpoint, space-separated (Dimension values)
 * @attr {string} margin-bottom - set element's margin-bottom for each breakpoint, space-separated (Dimension values)
 * @attr {string} margin-left - set element's margin-left for each breakpoint, space-separated (Dimension values)
 * @attr {string} padding-top - set element's padding-top for each breakpoint, space-separated (Dimension values)
 * @attr {string} padding-right - set element's padding-right for each breakpoint, space-separated (Dimension values)
 * @attr {string} padding-bottom - set element's padding-bottom for each breakpoint, space-separated (Dimension values)
 * @attr {string} padding-left - set element's padding-left for each breakpoint, space-separated (Dimension values)
 *
 * @summary attributes are space-separated values for each break-point
 * - Dimension values: none, small, medium, large, xlarge, xxlarge, small-, medium-, large-, xlarge-, xxlarge-
 * - Font values: xsmall, small, medium, large, xlarge, xxlarge
 * - ex:
 * - font="medium large xlarge"
 * - col="12 6 4"
 *
 * @tag r-elm
 */
export class ResponsiveElement extends HTMLElement {
  static observedAttributes = Attributes;
  private attr: Partial<ElemAttributeValues> = {};

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot!.adoptedStyleSheets = [sheet];
  }

  attributeChangedCallback(name: string, _old: string, value: string) {
    if (isElemAttribute(name)) {
      this.attr[name] = value;
      this.render();
    }
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const hostAttributes = getHostAttributes(Attributes, this.attr, getValues, elmAttrShort);
    const hostCSS = getHostCSS(['display', 'text-align'], this.attr, getValues);

    hostCSS.forEach(([attr, value]) => {
      if (value) this.style.setProperty(attr, value);
      if (value === undefined) this.style.removeProperty(attr);
    });

    hostAttributes.forEach(([attr, value]) => {
      if (value) this.setAttribute(attr, value);
      if (value === undefined) this.removeAttribute(attr);
    });

    this.shadowRoot!.innerHTML = `<slot></slot>`;
  }
}

customElements.define('r-elm', ResponsiveElement);
