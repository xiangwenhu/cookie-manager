/**
 * 派发事件
 * @param target
 * @param type
 * @param detail
 */
export function dispatchCustomEvent(
  type: string,
  detail: any = {},
  target: Node | Window | Document = window
) {
  const event = new CustomEvent(type, {
    detail,
  });
  target.dispatchEvent(event);
}
