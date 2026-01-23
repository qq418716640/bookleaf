# Eternal Moments - Wedding Theme Design Guide

## 🎨 Color Palette

### Primary Colors (Soft Pink)
```
primary-50:  #fdf2f8  (Lightest - backgrounds)
primary-100: #fce7f3
primary-200: #fbcfe8
primary-300: #f9a8d4
primary-400: #f472b6  (Main interactive elements)
primary-500: #ec4899  (Primary brand color)
primary-600: #db2777  (Hover states)
primary-700: #be185d
```

### Accent Colors (Gold)
```
gold-50:  #fffbeb  (Lightest - backgrounds)
gold-100: #fef3c7
gold-200: #fde68a
gold-300: #fcd34d
gold-400: #fbbf24  (Main accent elements)
gold-500: #f59e0b  (Secondary brand color)
gold-600: #d97706  (Hover states)
```

### Warm Neutrals
```
neutral-50:  #fdfcfb  (Lightest backgrounds)
neutral-100: #faf8f6
neutral-200: #f5f1ed  (Borders, dividers)
neutral-600: #8b7d6b  (Body text)
neutral-800: #4a3f33  (Headings)
```

## 🎯 Design Principles

### 1. Soft UI Aesthetic
- **Glassmorphism**: Semi-transparent backgrounds with backdrop blur
- **Soft Shadows**: Pink-tinted shadows for depth
- **Rounded Corners**: Generous border radius (24px+)
- **Gentle Gradients**: Smooth color transitions

### 2. Romantic Elements
- **Heart Icons**: Used for love/selection indicators
- **Flowing Shapes**: Circular decorative elements
- **Warm Tones**: Pink and gold create warmth
- **Elegant Typography**: Serif fonts for sophistication

### 3. Wedding Focus
- **Invitation-Centric**: Language focuses on wedding invitations
- **Save-the-Date**: Default text reflects wedding use case
- **Elegant Naming**: "Eternal Moments" conveys romance

## 🧩 Component Styles

### Buttons
```css
/* Primary Button (Pink) */
.btn-primary {
  background: linear-gradient(to right, #f472b6, #ec4899);
  border-radius: 9999px; /* Fully rounded */
  padding: 0.75rem 1.5rem;
  box-shadow: 0 8px 30px rgba(236, 72, 153, 0.12);
}

/* Secondary Button (Gold) */
.btn-secondary {
  background: linear-gradient(to right, #fbbf24, #f59e0b);
  border-radius: 9999px;
  padding: 0.75rem 1.5rem;
  box-shadow: 0 8px 30px rgba(245, 158, 11, 0.15);
}
```

### Cards
```css
/* Glass Card */
.card-glass {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(12px);
  border-radius: 1.5rem; /* 24px */
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 8px 30px rgba(236, 72, 153, 0.12);
}

/* Base Card */
.card-base {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  border-radius: 1.5rem;
  border: 1px solid #faf8f6;
  box-shadow: 0 8px 30px rgba(236, 72, 153, 0.12);
}
```

### Icons
```css
/* Icon Badge */
.icon-badge {
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(to bottom right, #f472b6, #ec4899);
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 30px rgba(236, 72, 153, 0.12);
}
```

## 📐 Layout Structure

### Page Background
```
Gradient: from-primary-50 via-white to-gold-50
Decorative blurs: Pink (top-right) and Gold (bottom-left)
```

### Header
```
- Glassmorphism background
- Heart logo with gradient
- Navigation menu (desktop)
- Sticky positioning
```

### Hero Section
```
- Large gradient title
- Descriptive subtitle
- Feature badges
- Call-to-action focus
```

### Content Grid
```
Desktop: 400px sidebar + flexible main area
Mobile: Single column stack
Gap: 2rem (32px)
```

## 🎭 Preset Themes

### Romantic Elegance (Editorial)
- **Description**: Timeless & Elegant
- **Font**: Crimson Text (serif)
- **Style**: Classic, sophisticated
- **Use Case**: Traditional weddings

### Timeless Love (Classic)
- **Description**: Traditional Romance
- **Font**: Averia Serif Libre
- **Style**: Warm, inviting
- **Use Case**: Rustic/vintage weddings

### Contemporary Bliss (Modern)
- **Description**: Contemporary Chic
- **Font**: New Athena Unicode
- **Style**: Clean, modern
- **Use Case**: Modern/minimalist weddings

## ✨ Interactive States

### Hover Effects
```css
/* Card Hover */
transform: scale(1.02);
box-shadow: 0 10px 15px -3px rgba(236, 72, 153, 0.1);
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

/* Button Hover */
background: linear-gradient(to right, #ec4899, #db2777);
box-shadow: 0 20px 25px -5px rgba(236, 72, 153, 0.12);
```

### Focus States
```css
outline: none;
ring: 2px solid #f472b6;
ring-offset: 2px;
```

### Selected State
```css
border: 2px solid #f472b6;
ring: 2px solid #f472b6;
transform: scale(1.05);
```

## 🎬 Animations

### Scale In (Selection)
```css
@keyframes scale-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
```

### Fade Slide (Messages)
```css
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
```

## 📱 Responsive Breakpoints

```
xs: 320px  (Mobile portrait)
sm: 640px  (Mobile landscape)
md: 768px  (Tablet)
lg: 1024px (Desktop)
xl: 1280px (Large desktop)
```

## 🎨 Usage Examples

### Creating a New Card
```vue
<div class="card-glass">
  <div class="flex items-center gap-3 mb-6">
    <div class="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-500 rounded-full flex-center shadow-soft">
      <!-- Icon here -->
    </div>
    <h3 class="text-xl font-bold text-neutral-800">Title</h3>
  </div>
  <!-- Content -->
</div>
```

### Creating a Gradient Button
```vue
<button class="btn-primary">
  <svg class="w-5 h-5"><!-- Icon --></svg>
  <span>Button Text</span>
</button>
```

### Adding Decorative Blur
```vue
<div class="fixed inset-0 overflow-hidden pointer-events-none">
  <div class="absolute top-0 right-0 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl" />
</div>
```

## 🔧 Customization

### Adjusting Pink Intensity
Change primary color values in `uno.config.ts`:
```typescript
primary: {
  400: '#f472b6', // Lighter = softer
  500: '#ec4899', // Main brand color
  600: '#db2777', // Darker = more vibrant
}
```

### Adjusting Gold Accent
```typescript
gold: {
  400: '#fbbf24', // Lighter = softer
  500: '#f59e0b', // Main accent
  600: '#d97706', // Darker = richer
}
```

### Adjusting Blur Strength
```css
backdrop-blur-sm  /* 4px - subtle */
backdrop-blur-md  /* 12px - medium */
backdrop-blur-lg  /* 16px - strong */
```

## 📚 Resources

- **UnoCSS Documentation**: https://unocss.dev/
- **Nuxt 3 Documentation**: https://nuxt.com/
- **Color Palette Tool**: https://uicolors.app/
- **Glassmorphism Generator**: https://hype4.academy/tools/glassmorphism-generator

## 🎯 Best Practices

1. **Consistency**: Use defined color variables, not hardcoded values
2. **Accessibility**: Maintain WCAG AA contrast ratios
3. **Performance**: Use backdrop-filter sparingly
4. **Mobile First**: Design for mobile, enhance for desktop
5. **Semantic HTML**: Use proper heading hierarchy
6. **Loading States**: Always provide feedback for async actions

---

**Created for**: Eternal Moments Wedding Planning Platform
**Theme**: Romantic Soft UI with Pink & Gold Accents
**Version**: 1.0.0
**Last Updated**: January 2026
