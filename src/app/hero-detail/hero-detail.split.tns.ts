import * as camera from 'nativescript-camera';
import { knownFolders, path } from 'tns-core-modules/file-system';
import { ImageSource } from 'tns-core-modules/image-source/image-source';

export async function takePhoto(heroName: string) {
  const isAvailable = camera.isAvailable();
    if (isAvailable) {
      return await camera.requestPermissions().then(async () => {
        // permission request accepted or already granted 
        return await camera.takePicture()
          .then(async imageAsset => {
            const source = new ImageSource();
            const imageSource = await source.fromAsset(imageAsset);
            const folderPath = knownFolders.documents().path;
            const fileName = `${heroName}.jpg`;
            const heroImagePath = path.join(folderPath, fileName);
            const saved: boolean = imageSource.saveToFile(heroImagePath, 'jpg');
            if (saved) {
              return heroImagePath;
            }
            return null;
          })
          .catch(err => {
            console.log('Error -> ' + err.message);
            return null;
          });
        },
        () => {
        // permission request rejected
        // ... tell the user ...
        });
    }
}
