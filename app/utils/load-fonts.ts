function getFontAssetPath(name: string) {
  return `url(assets/fonts/${name}.woff2)`;
}

export async function loadFonts() {
  const interRegular = new FontFace('Inter', getFontAssetPath('Inter-Regular'), {
    weight: '400',
  });
  const interMedium = new FontFace('Inter', getFontAssetPath('Inter-Medium'), {
    weight: '500',
  });
  const interSemiBold = new FontFace('Inter', getFontAssetPath('Inter-SemiBold'), {
    weight: '600',
  });

  await Promise.all([interRegular.load(), interMedium.load(), interSemiBold.load()]);

  document.fonts.add(interRegular);
  document.fonts.add(interMedium);
  document.fonts.add(interSemiBold);
}
