import fs from 'node:fs/promises';

export async function loadFonts() {

  const [regular, semiBold] = await Promise.all([
    fs.readFile('./src/assets/fonts/Rubik-Regular.ttf'),
    fs.readFile('./src/assets/fonts/Rubik-SemiBold.ttf'),
  ]);

  return {
    regular,
    semiBold,
  };
}