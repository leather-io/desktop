export function parseSeedPhraseInput(input: string) {
  const parsedInput = input.trim().match(/\S+/g);
  if (!parsedInput) return null;
  const seed = parsedInput
    .map(item => (item.match(/[^0-9]+/g) ? item : null))
    .filter(word => typeof word === 'string')
    .filter(word => !!word)
    .filter(word => /^[A-Za-z ]+$/.test(word as string))
    .map(word => (word as string).toLowerCase());
  return seed.join(' ');
}
