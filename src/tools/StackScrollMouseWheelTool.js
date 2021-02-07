import BaseTool from './base/BaseTool.js';
import { getToolState } from '../stateManagement/toolState.js';
import scroll from '../util/scroll.js';

/**
 * @public
 * @class StackScrollMouseWheelTool
 * @memberof Tools
 *
 * @classdesc Tool for scrolling through a series using the mouse wheel.
 * @extends Tools.Base.BaseTool
 */
export default class StackScrollMouseWheelTool extends BaseTool {
  constructor(props = {}) {
    const defaultProps = {
      name: 'StackScrollMouseWheel',
      supportedInteractionTypes: ['MouseWheel'],
      configuration: {
        loop: false,
        allowSkipping: true,
        invert: false,
        allowedModifiers: new Set([
          '',
          'alt',
          'ctrl',
          'shift',
          'alt-ctrl',
          'alt-shift',
          'ctrl-shift',
          'alt-ctrl-shift',
        ]),
      },
    };

    super(props, defaultProps);
  }

  mouseWheelCallback(evt) {
    const { direction: images, element, modifier } = evt.detail;
    const { loop, allowSkipping, invert } = this.configuration;
    const direction = invert ? -images : images;

    const toolData = getToolState(evt.currentTarget, this.name);
    const firstData = toolData && toolData.data ? toolData.data[0] : undefined;
    const stackToolData = getToolState(element, 'stack');
    const stackData =
      stackToolData && stackToolData.data ? stackToolData.data[0] : undefined;

    if (firstData) {
      if (firstData.allowedIndexes) {
        const indexes =
          firstData.allowedIndexes[modifier] || firstData.allowedIndexes.all;

        if (indexes && stackData) {
          const step = Math.min(
            ...indexes
              .map(i => direction * (i - stackData.currentImageIdIndex))
              .filter(i => i > 0)
          );

          if (Number.isFinite(step)) {
            scroll(element, direction * step, loop, allowSkipping);
          }

          return;
        }
      }

      if (firstData.speed) {
        const speed =
          firstData.speed[modifier] !== undefined
            ? firstData.speed[modifier]
            : firstData.speed.all;

        if (speed !== undefined) {
          scroll(element, direction * speed, loop, allowSkipping);

          return;
        }
      }
    }
    scroll(element, direction, loop, allowSkipping);
  }
}
