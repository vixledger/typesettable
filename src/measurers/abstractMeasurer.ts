/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the MIT License (the "License"); you may obtain a copy of the
 * license at https://github.com/palantir/svg-typewriter/blob/develop/LICENSE
 */

import { d3Selection, DOM } from "../utils";

/**
 * Dimension of area's BBox.
 */
export interface IDimensions {
  width: number;
  height: number;
};

type ITextMeasurer = (text: string) => IDimensions;

export class AbstractMeasurer {

  public static HEIGHT_TEXT = "bqpdl";

  private textMeasurer: ITextMeasurer;

  constructor(area: d3Selection<any>, className?: string) {
    this.textMeasurer = this.getTextMeasurer(area, className);
  }

  public measure(text: string = AbstractMeasurer.HEIGHT_TEXT) {
    return this.textMeasurer(text);
  }

  private checkSelectionIsText(d: any) {
    return (d.node() as Element).tagName === "text" || !d.select("text").empty();
  }

  private getTextMeasurer(area: any, className: string) {
    if (!this.checkSelectionIsText(area)) {
      const textElement = area.append("text");
      if (className) {
        textElement.classed(className, true);
      }
      textElement.remove();
      return (text: string)  => {
        (area.node() as Element).appendChild(textElement.node() as Element);
        const areaDimension = this.measureBBox(textElement, text);
        textElement.remove();
        return areaDimension;
      };
    } else {
      const parentNode = (area.node() as Element).parentNode;
      let textSelection: d3Selection<any>;
      if ((area.node() as Element).tagName === "text") {
        textSelection = area;
      } else {
        textSelection = area.select("text");
      }
      area.remove();
      return (text: string) => {
        parentNode.appendChild(area.node() as Element);
        const areaDimension = this.measureBBox(textSelection, text);
        area.remove();
        return areaDimension;
      };
    }
  }

  private measureBBox(d: d3Selection<any>, text: string) {
    d.text(text);
    const bb = DOM.getBBox(d);
    return { width: bb.width, height: bb.height };
  }
}
