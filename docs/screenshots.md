# Screenshots & Visual Documentation

This directory contains screenshots and visual documentation for the CSV → Dashboard Generator application.

## Screenshot Guidelines

### Required Screenshots

#### 1. Main Dashboard (`dashboard.png`)
- **Purpose**: Show the main application interface with sample data loaded
- **Content**: Full dashboard view with charts, statistics, and data preview
- **Resolution**: 1920x1080 (recommended)
- **Format**: PNG with transparent background if possible

#### 2. Upload Interface (`upload.png`)
- **Purpose**: Demonstrate the drag-and-drop upload functionality
- **Content**: Upload area with drag-and-drop zone and file selection
- **Resolution**: 1200x800 (recommended)
- **Format**: PNG

#### 3. Settings Panel (`settings.png`)
- **Purpose**: Show configuration options and privacy controls
- **Content**: Settings panel with sliders, toggles, and theme options
- **Resolution**: 1000x800 (recommended)
- **Format**: PNG

#### 4. Mobile View (`mobile.png`)
- **Purpose**: Demonstrate responsive design on mobile devices
- **Content**: Dashboard view on mobile/tablet screen
- **Resolution**: 375x667 (iPhone SE) or 414x896 (iPhone 11)
- **Format**: PNG

#### 5. Dark Theme (`dark-theme.png`)
- **Purpose**: Show dark mode interface
- **Content**: Dashboard in dark theme
- **Resolution**: 1920x1080 (recommended)
- **Format**: PNG

### How to Capture Screenshots

#### Browser Developer Tools
1. Open the application in Chrome/Edge/Firefox
2. Press `F12` to open Developer Tools
3. Go to the desired page/section
4. Press `Ctrl+Shift+P` (Cmd+Shift+P on Mac) to open command palette
5. Type "screenshot" and select:
   - "Capture full size screenshot" for full page
   - "Capture node screenshot" for specific elements
   - "Capture area screenshot" for selected regions

#### Browser Extensions
- **Lightshot**: Simple screenshot tool with annotation
- **Awesome Screenshot**: Advanced screenshot and annotation
- **Fireshot**: Full page screenshots with editing

#### Operating System Tools
- **Windows**: Snip & Sketch (Win+Shift+S)
- **macOS**: Cmd+Shift+4 for area, Cmd+Shift+5 for advanced capture
- **Linux**: Flameshot, Shutter, or built-in screenshot tools

### Screenshot Best Practices

#### Technical
- **High Resolution**: At least 1920x1080 for desktop screenshots
- **Consistent Browser**: Use the same browser for all screenshots
- **Clean State**: Ensure no browser UI elements are visible
- **Consistent Data**: Use the same sample data across screenshots
- **Optimized Size**: Compress images without quality loss

#### Visual
- **Consistent Theme**: Use light theme for main screenshots, show dark theme separately
- **Sample Data**: Use realistic but anonymized data
- **Clear Focus**: Ensure the main content is clearly visible
- **Professional Look**: Clean interface without distractions
- **Branding**: Include application logo/title where appropriate

### File Naming Convention

```
screenshot-[feature]-[theme]-[device].[extension]
```

Examples:
- `dashboard-light-desktop.png`
- `upload-dark-mobile.png`
- `settings-light-tablet.png`
- `charts-comparison-desktop.png`

### Image Optimization

#### Tools
- **TinyPNG**: Lossless compression for PNG files
- **JPEGmini**: JPEG optimization
- **ImageOptim**: Mac optimization tool
- **Squoosh**: Web-based image optimization

#### Settings
- **PNG**: Lossless compression, best for screenshots with text
- **JPEG**: 80-90% quality for photos/charts
- **WebP**: Modern format with better compression (if supported)

### Accessibility Considerations

- **Alt Text**: Provide descriptive alt text for all screenshots
- **Color Contrast**: Ensure screenshots are visible in both light and dark contexts
- **Text Size**: Ensure UI text is readable in screenshots
- **Focus Indicators**: Show keyboard focus states where relevant

## Demo Video (Optional)

For a more comprehensive demonstration, consider creating a short video:

### Video Content
1. **Introduction** (10s): App overview and key features
2. **Upload Demo** (20s): File upload and parsing process
3. **Data Exploration** (30s): Statistics, charts, and interactions
4. **Customization** (20s): Settings, themes, and configuration
5. **Export Features** (10s): Data and chart export capabilities

### Video Specifications
- **Duration**: 1-2 minutes
- **Resolution**: 1920x1080 (Full HD)
- **Format**: MP4 with H.264 codec
- **Frame Rate**: 30 FPS
- **Audio**: Optional narration or background music

### Video Tools
- **OBS Studio**: Free screen recording software
- **Camtasia**: Professional screen recording
- **Loom**: Web-based screen recording
- **Built-in Tools**: Windows Game Bar, macOS QuickTime

## Documentation Integration

### README.md Integration
```markdown
## Screenshots

### Main Dashboard
![Main Dashboard](docs/dashboard.png)
*Interactive dashboard with charts and statistics*

### Upload Interface
![Upload Interface](docs/upload.png)
*Drag-and-drop CSV upload functionality*

### Settings Panel
![Settings Panel](docs/settings.png)
*Configuration options and privacy controls*
```

### GitHub Integration
- Add screenshots to repository for automatic display in README
- Use GitHub's image optimization for faster loading
- Consider creating a `screenshots` branch for larger files

## Maintenance

### Update Schedule
- **Major Releases**: Update all screenshots
- **UI Changes**: Update affected screenshots
- **New Features**: Add screenshots for new functionality
- **Quarterly**: Review and refresh existing screenshots

### Version Control
- Store screenshots in `docs/` directory
- Use descriptive commit messages for screenshot updates
- Consider using Git LFS for large video files

## Tools & Resources

### Design Tools
- **Figma**: Create mockups and prototypes
- **Adobe XD**: Design and prototyping
- **Sketch**: Mac-based design tool

### Image Editing
- **GIMP**: Free image editor
- **Photoshop**: Professional image editing
- **Pixelmator**: Mac image editor

### Color & Contrast
- **WebAIM Contrast Checker**: Verify color contrast
- **Stark**: Accessibility testing for design
- **Color Contrast Analyzer**: Browser extension

This documentation ensures consistent, professional visual presentation of the CSV → Dashboard Generator application across all platforms and use cases.