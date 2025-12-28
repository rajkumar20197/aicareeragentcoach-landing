# 🎨 AI Career Agent Coach - Brand Assets

Complete branding package for your "AI Career Agent Coach" platform.

---

## 🎯 Logo Versions

### 1. **Horizontal Logo** (Primary)
**File:** `logo-horizontal.png`  
**Usage:** Website header, email signatures, presentations  
**Size:** Scalable, recommended: 200-400px width  
**Background:** Dark or transparent

### 2. **Square Icon** (App Icon)
**File:** `logo-icon-square.png`  
**Usage:** Social media profiles, app stores, square placements  
**Size:** 512x512px (scales down well)  
**Background:** Dark

### 3. **Wordmark** (Text Only)
**File:** `logo-wordmark.png`  
**Usage:** When you need just text without icon  
**Size:** Flexible width  
**Background:** Transparent

### 4. **Favicon** (Browser Tab)
**File:** `favicon.png`  
**Usage:** Browser tab icon, bookmarks  
**Size:** 32x32px optimized  
**Background:** Dark

---

## 🎨 Brand Colors

### Primary Palette

| Color | Hex Code | RGB | Usage |
|-------|----------|-----|-------|
| **Electric Cyan** | `#00d9ff` | `rgb(0, 217, 255)` | Primary accent, CTAs, highlights |
| **Vibrant Purple** | `#8b5cf6` | `rgb(139, 92, 246)` | Secondary accent, gradients |
| **Deep Charcoal** | `#0a0a0f` | `rgb(10, 10, 15)` | Background |
| **Dark Lighter** | `#1a1a2e` | `rgb(26, 26, 46)` | Cards, elevated surfaces |
| **Off White** | `#e5e5e5` | `rgb(229, 229, 229)` | Primary text |

### Gradient

**Main Gradient:** 
```css
background: linear-gradient(135deg, #00d9ff 0%, #8b5cf6 100%);
```

**Mesh Gradient (Background):**
```css
background: linear-gradient(135deg, #0a0a0f 0%, #1a1a3e 50%, #2d1b69 100%);
```

---

## ✍️ Typography

### Font Families

**Primary Font:** Inter
```css
font-family: 'Inter', sans-serif;
```
- Headings: 700-800 weight
- Body: 400 weight
- UI Elements: 600 weight

**Monospace Font:** JetBrains Mono
```css
font-family: 'JetBrains Mono', monospace;
```
- Code snippets
- Countdown timer numbers
- Status indicators

---

## 📐 Logo Usage Guidelines

### ✅ **DO:**
- Use on dark backgrounds (primary use case)
- Maintain aspect ratio when scaling
- Keep clear space around logo (minimum 20px)
- Use PNG format for web
- Ensure good contrast with background

### ❌ **DON'T:**
- Distort or stretch the logo
- Change the colors
- Add drop shadows or effects
- Place on busy backgrounds
- Use on light backgrounds without adjusting

---

## 📦 File Structure

Place logo files in your project:

```
coming-soon/public/images/
├── logo-horizontal.png      (Primary logo)
├── logo-icon-square.png     (App icon)
├── logo-wordmark.png        (Text only)
└── favicon.png              (Browser icon)
```

---

## 🌐 Web Implementation

### In HTML:
```html
<!-- Favicon -->
<link rel="icon" type="image/png" href="/images/favicon.png" />

<!-- Logo in header -->
<img src="/images/logo-horizontal.png" alt="AI Career Agent Coach" />
```

### In React:
```tsx
<img 
  src="/images/logo-horizontal.png" 
  alt="AI Career Agent Coach"
  className="h-12 md:h-16"
/>
```

---

## 📱 Social Media Specs

| Platform | Size | Logo Version |
|----------|------|--------------|
| **Facebook** | 180x180 | Square Icon |
| **Twitter** | 400x400 | Square Icon |
| **LinkedIn** | 300x300 | Square Icon |
| **Instagram** | 300x300 | Square Icon |
| **YouTube** | 800x800 | Square Icon |
| **Website Favicon** | 32x32 | Favicon |

---

## 🎯 Brand Personality

### Core Values:
- **Futuristic** - Cutting-edge AI technology
- **Professional** - Serious career advancement
- **Empowering** - Gives users an edge
- **Smart** - Intelligent automation
- **Ambitious** - For high achievers

### Tone of Voice:
- Confident but not arrogant
- Technical but accessible
- Aspirational but realistic
- Bold but professional

### Taglines:
- "Stop Applying. Start Conquering."
- "Your Personal AI Career Architect"
- "The Future of Career Advancement"

---

## 🎨 Design System Elements

### Glassmorphism Effect
```css
.glassmorphism {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}
```

### Glow Effect
```css
.glow-text {
  text-shadow: 0 0 20px rgba(0, 217, 255, 0.5);
}
```

### Button Style
```css
.primary-button {
  background: linear-gradient(135deg, #00d9ff 0%, #8b5cf6 100%);
  border-radius: 12px;
  padding: 16px 32px;
  font-weight: 600;
  box-shadow: 0 0 20px rgba(0, 217, 255, 0.3);
}
```

---

## 📄 Brand Assets Checklist

- [x] Horizontal logo created
- [x] Square icon created
- [x] Wordmark created
- [x] Favicon created
- [x] Color palette defined
- [x] Typography specified
- [x] Usage guidelines documented
- [x] Implemented in coming-soon page

---

## 🎉 Your Brand Identity

**AI Career Agent Coach** has a complete, professional brand identity that:
- ✅ Is memorable and distinctive
- ✅ Conveys futuristic AI technology
- ✅ Appeals to ambitious professionals
- ✅ Works across all platforms
- ✅ Scales from favicon to billboard

**Consistency is key!** Use these assets everywhere to build brand recognition.

---

**Last Updated:** December 27, 2024  
**Created by:** Antigravity AI
