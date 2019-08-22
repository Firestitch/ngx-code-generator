export function fixErrorResponseMessage(message: string) {
  return message.replace('The Schematic workflow failed. See above.', '');
}
