export async function takePhoto(heroName: string) {
  console.error('This should never fire in a web context')
  return 'not-a-filepath';
}
