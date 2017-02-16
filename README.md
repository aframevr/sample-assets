# sample-assets

Curated collection of assets (images, models and sounds) to use in A-Frame.

> Work in progress.

## Folder structure

You can have as many subfolders as you want in the assets folder, each folder on the tree will be added as tags automatically to the final file. In the following folder structure `noiseperlin.jpg` image will have `tags=[noise, perlin]`:

```
- noise
  - perlin
      noiseperlin.jpg  
```

### Licenses

Inside each assets folder (image/sound/model) you could include a root level `license.txt` that will apply by default to any asset that doesn't contains a specific license. You can override the license for one folder and its subfolders just by including a `license.txt` file.
If you want to specify a license for just one file while leaving the default license for the rest of them, just include a `filename.txt` to the same folder of the original file.

For example:

```
license.txt            [LicenseA]
- particles             * LicenseA applied
- noise
  license.txt          [LicenseB]
  - perlin              * LicenseB applied
      noiseperlin.txt  [Specific file license]
      noiseperlin.jpg   * noiseperlin.txt license
      perlin0.jpg       * LicenseB applied
      perlin1.jpg       * LicenseB applied
```

## JSON Structure

The generated JSON files for each assets are stored on the `build` folder. They share the same structure:
- `licenseId`: Index of the license used for this asset
- `id`: Valid HTML ID for the asset
- `path`: Relative path to the file
- `tags`: Array with tags for this asset

Example of JSON file for images:

```json
{
  "licenses": [
    "MIT Three.js project\n"
  ],
  "images": [
    {
      "licenseId": 0,
      "id": "brick_bump",
      "path": "images/bricks/brick_bump.jpg",
      "tags": [ "bricks" ]
    }
  ]
}
```

## How to build

To build the output JSON files for each asset type you should execute the following command:

```bash
npm run build
```

## How to use it

You can fetch the assets JSON using the following url:

https://rawgit.com/aframevr/sample-assets/master/dist/images.json
