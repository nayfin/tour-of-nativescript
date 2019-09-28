# Migrating to Mobile with NativeScript
## https://github.com/nayfin/tour-of-nativescript

## What is NativeScript?

NativeScript is tool helps developers use their web development skills to create native and hybrid apps, it can be leveraged with Angular, Vue or Vanilla JS. 

NativeScript compiles the TS/JS down to the native language and has it's own XML markup, and CSS style systems. To convert a web app into a hybrid app, you create routes and templates for each view you want to share with the native app.

![alt text](https://miro.medium.com/max/3405/1*GW5nqEDJ48NndzZK1zj3vQ.png "NativeScript code splitting diagram")

When code is properly split/shared `ng serve` simply ignores the NativeScript files during its build process, while `tns run` intelligently chooses which files it need to build the native apps.

<img src="https://miro.medium.com/max/3405/1*E6BqogQ_1g1N8nWyhVOCMw.png" alt="NativeScript build process diagram">

## NativeScript Strengths:
- Code sharing/splitting
  - routes
  - modules
  - providers (services, guards, etc...)
  - component logic
- Dev tools
  - NativeScript Playground App
  - [Browser Based IDE](https://play.nativescript.org/)
- Separate templates for web/native
- Designed for incremental conversion 
- Compiles to native language (so it's fast!!)
- Really good plugins for native features (camera, gyroscope, etc...)

## When should I pick NativeScript?
- You need a hybrid app that:
  - needs OS specific design
  - has some shared and some split functionality
  - needs access to native API
- You have Angular/Vue/Web expertise that you want to leverage to create a native app

## Prerequisites

- Node is installed
- `npm i @angular/cli --global`

`@Optional` follow [NativeScript Quick Setup](https://docs.nativescript.org/start/quick-setup) to prepare emulators

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
        }),
        ...
      ]
    })
    ```

### 3. Style Dashboard Component (03-style-dashboard)

  - Open `dashboard.component.tns.html` and replace generated markup with the following:
    ```xml
    <ActionBar title="Top Heroes"></ActionBar>
    <FlexboxLayout class="hero-container" flexDirection="column">
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
    <ActionBar [title]="hero.name + ' Details'"></ActionBar>
    <StackLayout *ngIf="hero">
      <Label [text]="hero.name" textWrap="true"></Label>
      <Label [text]="hero.id" textWrap="true"></Label>
      <Button [text]="'TAKE PHOTO'"(tap)="handleTakePhoto(hero.name)"></Button>
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
      async handleTakePhoto(heroName: string) {
        const isAvailable = camera.isAvailable();
        if (isAvailable) {
          this.heroImagePath = await camera.requestPermissions().then(async () => {
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
    ...
    }
    ```
  - Take a picture!

### 6. Split Native Logic (06-split-native-logic)
  - Run `ng serve`, and you'll see that the web app can't resolve the NativeScript plugins

  - Create two new files `hero-detail.split.tns.ts` and `hero-detail.split.ts`

  - Add the following to `hero-detail.split.tns.ts`
    ```typescript
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
    ```
    
  - Add the following to `hero-detail.split.ts`
    ```typescript
    export async function takePhoto(heroName: string) {
      console.error('This should never fire in a web context')
      return 'not-a-filepath';
    }
    ```
  - Add import for `detail.split` to `HeroDetailComponent` and update `handleTakePhoto` function
    ```typescript
    import { takePhoto } from './hero-detail.split';

    ...
  
    handleTakePhoto(heroName: string) {
      this.heroImagePath = await takePhoto(heroName);
    }
    ```
  - Now it should use the `hero-detail.split.tns.ts` logic when in a native context and `hero-detail.split.ts` when in web context. Running `ng serve` should succeed now

## Helpful Links
### - A great place to get started is with NativeScript's web based IDE and playground at [play.nativescript.org](https://play.nativescript.org) (the 'Build a Full App' tutorial is a great way to get acquainted with markup and layouts)

### - Sebastian Witalec has a great overview on  [blog.angular.io](https://blog.angular.io/apps-that-work-natively-on-the-web-and-mobile-9b26852495e7)


### - Maximilian Schwarzmüller has a couple good resources
  -  A comparison of NativeScript against similar technologies can be found on [academind.com](https://www.academind.com/learn/flutter/react-native-vs-flutter-vs-ionic-vs-nativescript-vs-pwa)
  - A full NativeScript course can be found on [Udemy.com](https://www.udemy.com/course/nativescript-angular-build-native-ios-android-web-apps/)
