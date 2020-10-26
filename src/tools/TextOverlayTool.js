import BaseTool from './base/BaseTool.js';
import { getNewContext, draw, setShadow } from '../drawing/index.js';
import drawTextBox from '../drawing/drawTextBox.js';
import { getToolState } from '../stateManagement/toolState.js';

/**
 * @public
 * @class TextOverlayTool
 * @memberof Tools
 *
 * @classdesc Tool for displaying text over the image
 * @extends Tools.Base.BaseTool
 */
export default class TextOverlayTool extends BaseTool {
  constructor(props = {}) {
    const defaultProps = {
      name: 'TextOverlay',
      supportedInteractionTypes: [],
      configuration: {
        defaultColor: 'white',
      },
      svgCursor: undefined,
    };

    super(props, defaultProps);
  }

  renderToolData(evt) {
    const eventData = evt.detail;
    const config = this.configuration;

    // If we have no toolData for this element, return immediately as there is nothing to do
    const toolData = getToolState(eventData.element, this.name);

    if (!toolData) {
      return;
    }

    // We have tool data for this element - iterate over each one and draw it
    const context = getNewContext(eventData.canvasContext.canvas);

    for (let i = 0; i < toolData.data.length; i++) {
      const data = toolData.data[i];

      if (data.visible === false) {
        continue;
      }

      const color = data.color || this._configuration.defaultColor;

      draw(context, context => {
        setShadow(context, config);
        data.boundingBox = drawTextBox(
          context,
          data.text,
          data.x,
          data.y,
          color,
          data.options || {}
        );
      });
    }
  }
}
