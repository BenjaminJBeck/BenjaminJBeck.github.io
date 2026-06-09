// forge.config.js
const path = require('path');

module.exports = {
  packagerConfig: {
    // App metadata
    name: 'OldlyNotebook',
    productName: 'Oldly Notebook',
    executableName: 'OldlyNotebook',
    // Icon for the built app (Windows/Linux) — can use .ico directly
    icon: path.resolve(__dirname, 'Book5Cropped'),
    // Important: exclude dev dependencies from the package
    ignore: [
      /^\/\.git/,
      /^\/node_modules\/.*\/test/,
      /^\/\.vscode/,
      /^\/src/
    ]
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        // App name and setup
        name: 'OldlyNotebook',
        setupExe: 'OldlyNotebook-Setup.exe',
        // Icon for the Windows installer — MUST be .ico
        setupIcon: path.resolve(__dirname, 'Book5Cropped.ico'),
        // Skip version info that might cause issues
        noMsi: true,
        // Add loading gif (optional)
        loadingGif: path.resolve(__dirname, 'Book5Cropped.ico'),
        // Desktop and Start Menu shortcuts - ADD THESE LINES
        createDesktopShortcut: true,
        createStartMenuShortcut: true,
        // Authors info (optional - can remove if causing issues)
        // authors: 'Benjamin Beck',
        // description: 'OldlyNotebook - A digital notebook application'
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin', 'linux']
    }
  ],
  plugins: []
};