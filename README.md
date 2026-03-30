# All-in-One File Compressor

A browser-based compressor for images, PDFs, and Office files with batch queueing, presets, and ZIP download.

## Features

- Drag-and-drop or browse upload
- File type support: `JPG/JPEG`, `PNG`, `WebP`, `PDF`, `DOCX`, `PPTX`, `XLSX`
- Compression presets: `Smallest`, `Balanced`, `Best`
- Global quality and image output format controls
- Queue system with per-file states: `queued`, `compressing`, `done`, `error`, `canceled`
- Cancel/retry/recompress controls per file
- Batch compress and batch ZIP download
- Toast notifications for actions and errors
- LocalStorage persistence for tab and compression preferences
- Privacy-first: processing runs in the browser

## Tech Stack

- React + Vite
- `pdf-lib` (lazy loaded for PDF compression)
- `jszip` (lazy loaded for ZIP export)

## Getting Started

### 1. Install

```bash
npm install
```

### 2. Run locally

```bash
npm run dev
```

### 3. Production build

```bash
npm run build
npm run preview
```

### 4. Lint

```bash
npm run lint
```

## Project Structure

```text
src/
  components/
    DropZone.jsx
    FileCard.jsx
    SettingsPanel.jsx
    StatsBar.jsx
    TabBar.jsx
    ToastStack.jsx
  hooks/
    useCompressionQueue.js
    useCompressorSettings.js
    useToasts.js
  utils/
    compression.js
    file.js
    format.js
  constants.js
  App.jsx
```

## Notes

- Office files (`DOCX`, `PPTX`, `XLSX`) are preserved in browser-safe mode.
- PDF compression is handled with `pdf-lib` and may vary by document structure.
- Large bundles are split via lazy-loading so initial load stays faster.

## License

Private project.
