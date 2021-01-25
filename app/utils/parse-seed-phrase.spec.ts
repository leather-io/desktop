import { parseSeedPhraseInput } from './parse-seed-phrase';

const prefixWordWith = (char: string) => (seed: string) =>
  seed
    .split(' ')
    .map((word, i) => `${i + 1}${char} ${word}`)
    .join(' ');

describe(parseSeedPhraseInput.name, () => {
  const actualSeed =
    'bus mistake nothing curious thought loud weather usual improve close frog liar pet property nation stock toast private tilt divert horn oil tornado loop';

  const goodSeeds = [
    actualSeed,
    actualSeed
      .split('')
      .map(letter => (Math.random() > 0.5 ? letter.toUpperCase() : letter))
      .join(''),
    prefixWordWith('.')(actualSeed),
    prefixWordWith(')')(actualSeed),
    prefixWordWith('')(actualSeed),
    prefixWordWith(':')(actualSeed),
    actualSeed.split(' ').join('\n'),
  ];

  goodSeeds.forEach(seed => {
    test(`seed beginning: "${seed.substr(0, 28)}" formats correctly`, () => {
      const parsed = parseSeedPhraseInput(seed);
      expect(parsed).toEqual(actualSeed);
    });
  });
});
