export function blastUndoStackToRemovePasswordFromMemory(element: HTMLInputElement | null) {
  //
  // Blast the undo stack a https://bugs.chromium.org/p/chromium/issues/detail?id=961494
  if (element === null) return;
  element.focus();
  const pwLength = element.value.length;
  // Undo password input, kill undo stack
  for (let i = 0; i < 256; i++) document.execCommand('undo');
  const newFakeValue = '0'.repeat(pwLength);
  element.value = newFakeValue;
  global.gc();
}
