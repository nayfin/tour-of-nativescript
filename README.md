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
  - rerun `ng serve` to confirm web app is now running as expected again

### 2. Create Native Dashboard Route (02-create-dashboard)
  - remove `auto-generated` folder and references to the component in `app.module.ts`, `app.module.ts.tns`, and `app-routing.module.ts.tns` files
  - run ```ng g migrate-component --name=dashboard``` to add NativeScript template and style files to the dashboard folder
  - open `app-routing.module.tns.ts` and add import for `DashboardComponent` then replace routes with route to 

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
  - open `app.module.tns` add imports for `HttpClientInMemoryWebApiModule`, `InMemoryDataService`, and `NativeScriptHttpClientModule`, and configure `HttpClientInMemoryWebApiModule`.
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

