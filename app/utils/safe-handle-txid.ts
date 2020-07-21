export function safelyFormatHexTxid(id: string) {
  const prefix = '0x';
  if (id.startsWith('0x')) return id;
  return prefix + id;
}
