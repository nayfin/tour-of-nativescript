## Prerequisites

Install node

```
npm i @angular/cli --global

```

## Getting Started

```
git clone https://github.com/nayfin/tour-of-nativescript.git

cd tour-of-nativescript

git checkout 00-initial-clone-of-heroes

npm i

ng serve
```

You should see the classic Tour of Heroes app spin up on `localhost:4200`.

## Steps

### 1. Install NativeScript (01-install-nativescript)
  - `npm i --global nativescript`
  - `ng add @nativescript/schematics`
  - `ng serve`
    You will see an error similar the following due to the way the NativeScript schematics configure the project
    ```bash
    ERROR in error TS6053: File '<some-file-path>/tour-of-nativescript/src/src/main.ts' not found.
    error TS6053: File '<some-file-path>/tour-of-nativescript/src/src/polyfills.ts' not found.
    ```

    In file `src/tsconfig.app.json` change files array from this:
    ```json
    "files": [
      "src/main.ts",
      "src/polyfills.ts"
    ]
    ```
    to this:
    ```json
    "files": [
      "main.ts",
      "polyfills.ts"
    ]
    ```
  - Rerun `ng serve` to confirm web app is now running as expected again

### 2. Create Native Dashboard Route (02-create-dashboard)
  - Remove `auto-generated` folder and references to the component in `app.module.ts`, `app.module.ts.tns`, and `app-routing.module.ts.tns` files
  - Run ```ng g migrate-component --name=dashboard``` to add NativeScript template and style files to the dashboard folder
  - Open `app-routing.module.tns.ts` and add import for `DashboardComponent` then replace routes with route to 

    ```javascript
    import { DashboardComponent } from '@src/app/dashboard/dashboard.component';

    export const routes: Routes = [
      {
          path: '',
          redirectTo: '/dashboard',
          pathMatch: 'full',
      },
      {
          path: 'dashboard',
          component: DashboardComponent,
      },
    ];
    ```
  - Open `app.module.tns` add imports for `HttpClientInMemoryWebApiModule`, `InMemoryDataService`, and `NativeScriptHttpClientModule`, and configure `HttpClientInMemoryWebApiModule`.
    ```javascript
    import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
    import { InMemoryDataService } from '@src/app/in-memory-data.service';
    import { NativeScriptHttpClientModule } from 'nativescript-angular/http-client';

    @NgModule({
      ...
      imports: [
        ...
        NativeScriptHttpClientModule,
        HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, {
          dataEncapsulation: false,
          delay: 300,
          passThruUnknownUrl: true
        })
      ]
    })
    ```

### 3. Style Dashboard Component (03-style-dashboard)

  - Open `dashboard.component.tns.html` and replace generated markup with the following:
    ```xml
    <ActionBar title="Top Heroes"></ActionBar>
    <FlexboxLayout class="hero-container" flexDirection="column" flexGrow="2">
      <Button 
        flexGrow="1"
        *ngFor="let hero of heroes" 
        (tap)="gotoDetail(hero)" 
        [text]="hero.name">
      </Button>
    </FlexboxLayout>
    ```
  - Open `dashboard.component.tns.css` and add the following:
    ```css
    Button {
      border-color: rgb(216,59,1);
      border-width: 13px;
      color: #eee;
      background: rgb(0,120,215);
    }
    .hero-container {
      height: 100%;
    }
    ```

### 4. Create Native HeroDetailComponent (04-migrate-hero-detail)

  - Run `ng g migrate-component --name=hero-detail` create the NativeScript files for the `HeroDetailComponent`, and automatically add it to the `app.module.ts`

  - Add `detail` route to `app-routing.module.ts` like this:
    ```js
    import { HeroDetailComponent } from '@src/app/hero-detail/hero-detail.component';

    export const routes: Routes = [
      ...
      { 
        path: 'detail/:id', 
        component: HeroDetailComponent 
      },
    ];
    ```

  - Fix import `HeroDetailComponent` import in `app.module.ts`
    ```js
    import { HeroDetailComponent } from '@src/app/hero-detail/hero-detail.component';
    ```

  - Add some markup for the native `HeroDetailComponent`:
    ```xml
    <StackLayout *ngIf="hero">
      <Label [text]="hero.name" textWrap="true"></Label>
      <Label [text]="hero.id" textWrap="true"></Label>
      <Button [text]="'TAKE PHOTO'"(tap)="handleTakePhoto()"></Button>
      <Image 
        *ngIf="heroImagePath" 
        [src]="heroImagePath" 
        loadMode="async" 
        stretch="aspectFit">
      </Image>
    </StackLayout>
    ```
### 5. Add Camera Functionality (05-add-camera-functionality)

  - Add camera plugin `npm i --save nativescript-camera`
  - Add imports, and `handleTakePhoto` function to `HeroDetailComponent`
    ```typescript
    import * as camera from 'nativescript-camera';
    import { knownFolders, path } from 'tns-core-modules/file-system';
    import { ImageSource } from 'tns-core-modules/image-source/image-source';

    export class HeroDetailComponent implements OnInit {
      ...
      heroImagePath = ''; // stores path to image

      ...
      handleTakePhoto() {
        camera.isAvailable();
        camera
          .takePicture()
          .then(imageAsset => {
            const source = new ImageSource();
            source.fromAsset(imageAsset).then((imageSource: ImageSource) => {
              const folderPath = knownFolders.documents().path;
              const fileName = 'test.jpg';
              this.heroImagePath = path.join(folderPath, fileName);
              const saved: boolean = imageSource.saveToFile(
                this.heroImagePath,
                'jpg'
              );
              if (saved) {
                console.log('Saved: ' + this.heroImagePath);
                console.log('Image saved successfully!');
              }
            });
          })
          .catch(err => {
            console.log('Error -> ' + err.message);
          });
      }
    }
    ```
  - Take a picture!

### Split Native Logic (06-split-native-logic)
  - Run `ng serve`, and you'll see that the web app can't resolve the NativeScript plugins

  - Create two new files `photo.split.tns.ts` and `photo.split.ts`

  - Add the following to 
    ```typescript
    import * as camera from 'nativescript-camera';
    import { knownFolders, path } from 'tns-core-modules/file-system';
    import { ImageSource } from 'tns-core-modules/image-source/image-source';



    export function takePhoto() {
      camera.isAvailable();
      camera
        .takePicture()
        .then(imageAsset => {
          const source = new ImageSource();
          source.fromAsset(imageAsset).then((imageSource: ImageSource) => {
            const folderPath = knownFolders.documents().path;
            const fileName = 'test.jpg';
            this.heroImagePath = path.join(folderPath, fileName);
            const saved: boolean = imageSource.saveToFile(
              this.heroImagePath,
              'jpg'
            );
            if (saved) {
              console.log('Saved: ' + this.heroImagePath);
              console.log('Image saved successfully!');
            }
          });
        })
        .catch(err => {
          console.log('Error -> ' + err.message);
        });
    }
    ```
  - Add the following to `photo.split.ts`:
    ```typescript
    export function takePhoto() {
      console.error('ERROR: this function should never be called from a web context');
    }
    ```
  - Add import for `detail.split` to `HeroDetailComponent` and update `handleTakePhoto` function
    ```typescript
    import { takePhoto } from './hero-detail.split.tns';

    ...
    handleTakePhoto() {
      takePhoto();
    }
    ```
  - Now it should use the `hero-detail.split.tns.ts` logic when in a native context and `hero-detail.split.ts` when in web context. Running `ng serve` should succeed now

