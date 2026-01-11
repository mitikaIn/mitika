# Mitika 📚

<div align="center">

![Mitika Logo](public/favicon.ico)

**A Modern, Private-by-Default E-Book & Audiobook Reader for the Web**

[![Nuxt 4](https://img.shields.io/badge/Nuxt-4.1.3-00DC82?logo=nuxt.js)](https://nuxt.com/)
[![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4.1-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

</div>

---

## 📖 Overview

**Mitika** is a next-generation web-based reader designed for seamless consumption of EPUBs, PDFs, and Audiobooks. Built with a focus on privacy, performance, and offline capability, Mitika leverages modern web technologies (file system access, local databases) to give you a native-app experience directly in your browser.

> **Note:** Mitika functions entirely offline. Your books are stored locally on your device and never uploaded to any server.

## ✨ Features

- **📂 Format Support**: Read **EPUB** and **PDF** files, and listen to **Audiobooks** (MP3, M4A/MP4).
- **🔒 Privacy First**: Zero data collection. All files and metadata remain on your device using IndexedDB and OPFS.
- **⚡ Performance**: Powered by **MuPDF** via WebAssembly for blazing fast rendering and text extraction.
- **🎨 Modern UI**: Beautiful, responsive interface built with **Tailwind CSS v4** and **DaisyUI**.
- **🎧 Audio Player**: variable playback speed, volume control, and progress tracking.
- **📝 Annotations**: Create notes, bookmarks, and highlights (coming soon).
- **👁️ Focus Mode**: Distraction-free reading experience.
- **📱 Responsive**: Optimized for desktop, tablet, and mobile usage.

## 🛠️ Technology Stack

- **Framework**: [Nuxt 4](https://nuxt.com/) & [Vue 3](https://vuejs.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [DaisyUI](https://daisyui.com/)
- **Core Engine**: [MuPDF](https://mupdf.com/) (WASM) for document rendering
- **Storage**: IndexedDB & Origin Private File System (OPFS)
- **State**: Reactive Composition API

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or pnpm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/mitika-in/mitika.git
    cd mitika
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Prepare the environment:**
    ```bash
    npm run postinstall
    ```

4.  **Start the development server:**
    ```bash
    npm run dev
    ```
    Visit `http://localhost:3000` in your browser.

### Building for Production

To create a production-ready build:

```bash
npm run build
```

The output will be in the `.output` directory.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'Add some amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Built with ❤️ by Arun Mani J, Priyank, Suyash Singh Varma and contributors.</sub>
</div>
