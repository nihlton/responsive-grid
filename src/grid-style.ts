import gridStyles from "./grid.scss?inline";

const sheet = new CSSStyleSheet();
sheet.replaceSync(gridStyles);

export default sheet;
