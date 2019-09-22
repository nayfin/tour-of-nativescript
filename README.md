## Prerequisites

node

```
npm i @angular/cli --global

```

## Getting Started

```
git clone https://github.com/nayfin/tour-of-nativescript.git

cd tour-of-nativescript

npm i

git checkout 01-initial-clone-of-heroes

ng serve
```

You should see the classic Tour of Heroes app spin up on `localhost:4200`.

## Steps

1) Install NativeScript
  - `npm i --global nativescript`
  - `ng add @nativescript/schematics`
  - `ng serve`
    You will see the following error due to the way the project was configured
    ```bash
      ERROR in error TS6053: File 'C:/Users/<user>/Documents/dev/tour-of-nativescript/src/src/main.ts' not found.
      error TS6053: File 'C:/Users/<user>/Documents/dev/tour-of-nativescript/src/src/polyfills.ts' not found.
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