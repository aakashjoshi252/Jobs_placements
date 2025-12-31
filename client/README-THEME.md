# Job Placements Portal - Theme System Documentation

## Overview

This document describes the comprehensive theme system implemented for the Job Placements Portal. The theme uses a modern, professional color palette with full dark mode support.

## Color Palette

### Primary (Brand Blue)
- **Purpose**: Main brand color, primary actions, links
- **Shades**: 50-950 (from lightest to darkest)
- **Main**: `primary-600` (#2563eb)
- **Usage**: Buttons, links, highlights, active states

### Secondary (Success Green)
- **Purpose**: Success states, positive actions, completed items
- **Shades**: 50-950
- **Main**: `secondary-600` (#16a34a)
- **Usage**: Success messages, completed applications, positive indicators

### Accent (Vibrant Purple)
- **Purpose**: Special highlights, featured items, accents
- **Shades**: 50-950
- **Main**: `accent-600` (#9333ea)
- **Usage**: Featured jobs, premium badges, special callouts

### Status Colors
- **Warning**: `warning-600` (#d97706) - Pending actions, warnings
- **Danger**: `danger-600` (#dc2626) - Errors, rejected states, destructive actions
- **Info**: `primary-600` - Informational messages

### Neutral Grays
- **Purpose**: Backgrounds, text, borders
- **Shades**: 50-950
- **Usage**: Universal across all components

## File Structure

```
client/src/
├── index.css              # Main stylesheet with all components
├── styles/
│   ├── components.css     # Job portal specific components
│   ├── animations.css     # Advanced animations
│   ├── responsive.css     # Responsive utilities
│   └── theme.css          # Dark mode & theme configuration
└── tailwind.config.js     # Tailwind configuration
```

## Component Classes

### Buttons
```jsx
// Primary button
<button className="btn btn-primary">Apply Now</button>

// Secondary button
<button className="btn btn-secondary">Save</button>

// Outline button
<button className="btn btn-outline">Learn More</button>

// Ghost button
<button className="btn btn-ghost">Cancel</button>

// Danger button
<button className="btn btn-danger">Delete</button>

// Sizes
<button className="btn btn-sm">Small</button>
<button className="btn btn-lg">Large</button>
<button className="btn btn-icon">🔍</button>
```

### Cards
```jsx
// Basic card
<div className="card">
  <div className="p-6">
    Content here
  </div>
</div>

// Interactive card with hover effect
<div className="card card-hover card-interactive">
  Content here
</div>

// Glassmorphism card
<div className="card-glass">
  Content here
</div>

// Job listing card
<div className="job-card">
  Job details
</div>
```

### Form Controls
```jsx
// Input field
<input type="text" className="input" placeholder="Enter text" />

// With error state
<input type="text" className="input input-error" />

// Select dropdown
<select className="select">
  <option>Choose...</option>
</select>

// Textarea
<textarea className="textarea" />

// Checkbox
<input type="checkbox" className="checkbox" />

// Radio
<input type="radio" className="radio" />
```

### Badges & Tags
```jsx
// Status badges
<span className="badge badge-primary">Active</span>
<span className="badge badge-success">Completed</span>
<span className="badge badge-warning">Pending</span>
<span className="badge badge-danger">Rejected</span>

// Job tags
<span className="job-tag">Remote</span>
<span className="job-tag">Full-time</span>
```

### Alerts
```jsx
<div className="alert alert-info">
  <Icon /> Information message
</div>

<div className="alert alert-success">
  <Icon /> Success message
</div>

<div className="alert alert-warning">
  <Icon /> Warning message
</div>

<div className="alert alert-danger">
  <Icon /> Error message
</div>
```

### Job Portal Components
```jsx
// Job listing
<div className="job-listing">
  <div className="job-listing-header">
    <img src="logo.png" className="job-company-logo" />
    <h3 className="job-title">Senior Developer</h3>
    <p className="job-company">TechCorp Inc.</p>
    <div className="job-meta">
      <span className="job-meta-item">📍 Remote</span>
      <span className="job-meta-item">💰 $100k-$150k</span>
    </div>
  </div>
  <div className="job-actions">
    <button className="btn btn-primary">Apply</button>
  </div>
</div>

// Application status
<span className="application-status pending">Pending</span>
<span className="application-status reviewing">Under Review</span>
<span className="application-status accepted">Accepted</span>
<span className="application-status rejected">Rejected</span>

// Profile card
<div className="profile-card">
  <img src="avatar.jpg" className="profile-avatar" />
  <h3 className="profile-name">John Doe</h3>
  <p className="profile-role">Software Engineer</p>
  <div className="profile-stats">
    <div className="profile-stat">
      <div className="profile-stat-value">15</div>
      <div className="profile-stat-label">Applications</div>
    </div>
  </div>
</div>
```

## Animations

### Built-in Animations
```jsx
// Fade in
<div className="animate-fade-in">Content</div>

// Fade in up
<div className="animate-fade-in-up">Content</div>

// Slide in from right
<div className="animate-slide-in-right">Content</div>

// Scale in
<div className="animate-scale-in">Content</div>

// Staggered children
<div className="stagger-children">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

// Hover lift effect
<div className="hover-lift">Hover me</div>

// Floating animation
<div className="float-animation">Floating element</div>
```

## Dark Mode

### Implementation
Dark mode is implemented using Tailwind's `dark:` variant and CSS variables.

```jsx
// Toggle dark mode
function toggleDarkMode() {
  document.documentElement.classList.toggle('dark');
}

// Dark mode toggle button
<button className="theme-toggle" onClick={toggleDarkMode}>
  <span className="theme-toggle-slider" />
  <span className="theme-toggle-icon sun">☀️</span>
  <span className="theme-toggle-icon moon">🌙</span>
</button>
```

### Usage in Components
```jsx
// Background that adapts to theme
<div className="bg-white dark:bg-gray-900">
  Content
</div>

// Text that adapts to theme
<p className="text-gray-900 dark:text-gray-100">
  Adaptive text
</p>

// Using theme CSS variables
<div className="theme-bg theme-text-primary">
  Content
</div>
```

## Utility Classes

### Gradient Text
```jsx
<h1 className="gradient-text">Beautiful Gradient</h1>
<h2 className="gradient-text-animated">Animated Gradient</h2>
```

### Glassmorphism
```jsx
<div className="glass">Glass effect (light)</div>
<div className="glass-dark">Glass effect (dark)</div>
```

### Custom Container
```jsx
<div className="container-custom">
  Centered content with max-width
</div>
```

### Background Patterns
```jsx
<div className="grid-pattern">Grid background</div>
<div className="dot-pattern">Dot background</div>
```

### Line Clamping
```jsx
<p className="line-clamp-2">Long text truncated to 2 lines...</p>
<p className="line-clamp-3">Long text truncated to 3 lines...</p>
```

## Responsive Design

All components are mobile-first and responsive:

```jsx
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  Cards
</div>

// Responsive text
<h1 className="text-4xl md:text-5xl lg:text-6xl">
  Responsive Heading
</h1>

// Hide on mobile
<div className="hidden md:block">
  Desktop only
</div>

// Show on mobile only
<div className="md:hidden">
  Mobile only
</div>
```

## Best Practices

1. **Use Design Tokens**: Always use the predefined color classes instead of arbitrary values
   ```jsx
   // ✅ Good
   <div className="bg-primary-600" />
   
   // ❌ Bad
   <div className="bg-[#2563eb]" />
   ```

2. **Consistent Spacing**: Use the spacing scale
   ```jsx
   <div className="p-6 space-y-4">
     Content with consistent spacing
   </div>
   ```

3. **Accessibility**: Always include focus states
   ```jsx
   <button className="btn focus-visible:ring-2">
     Accessible Button
   </button>
   ```

4. **Dark Mode**: Always provide dark mode variants
   ```jsx
   <div className="bg-white dark:bg-gray-900
                   text-gray-900 dark:text-gray-100">
     Theme-aware content
   </div>
   ```

5. **Performance**: Use transitions wisely
   ```jsx
   // Only transition specific properties
   <div className="transition-colors duration-200">
     Optimized transitions
   </div>
   ```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Customization

To customize the theme, edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      }
    }
  }
}
```

## Performance Tips

1. Use PurgeCSS (built into Tailwind) to remove unused styles in production
2. Load fonts using `font-display: swap` for better performance
3. Use CSS containment for complex components
4. Minimize use of backdrop filters on mobile devices

## Support

For issues or questions about the theme system, please refer to the main project documentation or open an issue on GitHub.