# Tier List Generator

A modern, feature-rich tier list generator built with React and TypeScript. Create, customize, and share tier lists with ease.

## Features

### Core Features
- 🎨 Create and customize tiers with custom colors and labels
- 📝 Add text items and images to your tier list
- 🔄 Drag and drop items between tiers
- 🌓 Dark mode support
- 📸 Export tier list as PNG image

### Tier Management
- ➕ Add new tiers with randomly generated colors
- 🎨 Change tier colors with color picker
- ✏️ Edit tier labels
- 🗑️ Remove tiers (items return to pool)

### Item Management
- 📝 Add text items
- 🖼️ Add image items
- ✏️ Edit item text
- 🔄 Convert text items to images
- 🗑️ Delete items
- 🔄 Smooth drag and drop between tiers

### User Experience
- 🎯 Visual feedback during drag and drop
- 🌓 System-aware dark mode
- 📱 Responsive design
- 💨 Smooth animations
- 🎨 Clean and modern UI

## Tech Stack

### Core
- ⚛️ React 18
- 📘 TypeScript
- ⚡ Vite

### State Management
- 🐻 Zustand - Lightweight state management

### Drag and Drop
- 🎯 @dnd-kit/core - Modern drag and drop
- 🔄 @dnd-kit/sortable - Sortable functionality
- 🛠️ @dnd-kit/modifiers - DnD modifiers
- 🔧 @dnd-kit/utilities - DnD utilities

### Styling
- 🎨 Tailwind CSS - Utility-first CSS
- 🌓 Dark mode support

### Icons & UI
- 🎨 Lucide React - Beautiful icons
- 📸 html-to-image - PNG export functionality

### Development
- 🔍 ESLint - Code linting
- 📦 npm - Package management

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Usage

1. Add items to the pool using the "Add Text" or "Add Image" buttons
2. Drag items from the pool to your desired tier
3. Customize tiers by:
   - Clicking the tier label to edit
   - Clicking the tier color to change it
4. Export your tier list using the "Export as PNG" button

## License

MIT