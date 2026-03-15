# Bike Extensions Registry

This repository hosts the extension registry for [Bike](https://www.hogbaysoftware.com/bike/). Bike uses `extensions.json` to discover, install, and update extensions from Settings > Extensions > Browse.

## For Extension Users

Extensions are installed automatically from within Bike. Open Settings > Extensions, switch to the Browse tab, and click Install.

## For Extension Authors

To list your extension in the registry, add an entry to `extensions.json` and open a pull request.

### Entry format

```json
{
  "id": "my-extension",
  "version": "1.0.0",
  "download_url": "https://github.com/you/bike-my-extension/releases/download/v1.0.0/my-extension.bkext.zip",
  "min_api_version": "0.6.0",
  "description": "Short description of what the extension does",
  "author": "Your Name",
  "url": "https://github.com/you/bike-my-extension"
}
```

### Fields

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Yes | Must match the `.bkext` folder name (e.g. `my-extension` for `my-extension.bkext`) |
| `version` | Yes | Semver version of the latest release |
| `download_url` | Yes | URL to a `.bkext.zip` file (typically a GitHub Release asset) |
| `min_api_version` | No | Minimum Bike API version required (e.g. `"0.6.0"`) |
| `description` | No | Short description shown in the Browse tab |
| `author` | No | Author name |
| `url` | No | Project homepage or repository URL |

### ZIP structure

The ZIP must contain a single `.bkext` folder with a `manifest.json` at its root:

```
my-extension.bkext.zip
  └── my-extension.bkext/
      ├── manifest.json
      ├── app/
      │   └── main.js
      └── style/
          └── main.js
```

### Publishing a new version

The [Bike Extension Kit](https://github.com/jessegrosjean/bike-extension-kit) provides commands that automate the release and submission process:

```sh
npx bike-ext build
npx bike-ext package
npx bike-ext release my-extension   # creates a GitHub Release with the .bkext.zip
npx bike-ext submit my-extension    # forks this repo and opens a PR automatically
```

If you prefer to submit manually:

1. Build and package your extension (see the [Sharing Extensions](https://github.com/jessegrosjean/bike-extension-kit#sharing-extensions) guide)
2. Create a GitHub Release on your repo and attach the `.bkext.zip`
3. Update your entry in `extensions.json` with the new `version` and `download_url`
4. Open a pull request

## Related

- [Bike Extension Kit](https://github.com/jessegrosjean/bike-extension-kit) — tools and templates for building Bike extensions
- [Bike Guide: Using Extensions](https://bikeguide.hogbaysoftware.com/bike-2-preview/using-bike/using-extensions)
