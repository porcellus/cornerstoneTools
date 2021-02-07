// State
import { getters, state } from '../../store/index.js';
// Util
import getInteractiveToolsForElement from '../../store/getInteractiveToolsForElement.js';

/** *
 * @private
 * @param {WheelEvent} evt
 * @listens {CornerstoneTools.event:cornerstonetoolsMouseWheel}
 * @returns {undefined}
 */
export default function (evt) {
  if (state.isToolLocked) {
    return;
  }

  const element = evt.detail.element;

  // High level filtering
  const activeAndPassiveTools = getInteractiveToolsForElement(
    element,
    getters.mouseWheelTools()
  );

  const activeTools = activeAndPassiveTools.filter(
    tool =>
      tool.mode === 'active' &&
      tool.options.isMouseWheelActive &&
      (!Array.isArray(tool.options.allowedModifiers) ||
        tool.options.allowedModifiers.includes(evt.detail.modifier))
  );

  if (activeTools.length > 0) {
    activeTools[0].mouseWheelCallback(evt);
  }
}
