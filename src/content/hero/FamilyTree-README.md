# Interactive Family Tree Component

A modern, interactive family health visualization component built with React, TypeScript, and Framer Motion.

## Features

### 🎨 Modern Design
- **Glassmorphism UI**: Beautiful frosted glass effects with backdrop blur
- **Gradient Backgrounds**: Dynamic color schemes for different family member types
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **Responsive Layout**: Adapts to different screen sizes

### 👥 Interactive Family Members
- **Drag & Drop**: Move family members around the canvas
- **Hover Effects**: Rich tooltips with health insights
- **Click Interactions**: Expand detailed health information
- **Add Members**: Dynamic member addition with relationship selection

### 🏥 Health Insights
- **AI-Powered Analysis**: Intelligent health pattern recognition
- **Risk Assessment**: Color-coded health risk indicators
- **Timeline View**: Historical health data visualization
- **Collaborative Notes**: Shared health observations

### 🔗 Relationship Mapping
- **Visual Connections**: Animated relationship lines between family members
- **Relationship Types**: Parent-child, sibling, spouse connections
- **Dynamic Updates**: Real-time relationship adjustments

## Usage

```tsx
import InteractiveFamilyTree from './FamilyTree';

function App() {
  return (
    <div className="min-h-screen bg-black">
      <InteractiveFamilyTree />
    </div>
  );
}
```

## Component Structure

```
InteractiveFamilyTree/
├── FamilyTreeCanvas - Main SVG canvas container
├── FamilyMemberCard - Individual member visualization
├── RelationshipLines - Animated connection lines
├── HealthInsightsPanel - Detailed health information
├── AddMemberModal - Member addition interface
├── TimelineView - Historical health timeline
└── AIInsights - Intelligent health analysis
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialData` | `FamilyMember[]` | `mockFamilyData` | Initial family member data |
| `onMemberUpdate` | `(member: FamilyMember) => void` | - | Callback when member data changes |
| `theme` | `'dark' \| 'light'` | `'dark'` | Color theme |

## Family Member Data Structure

```typescript
interface FamilyMember {
  id: string;
  name: string;
  age: number;
  relationship: string;
  healthStatus: 'excellent' | 'good' | 'fair' | 'poor';
  conditions: string[];
  medications: string[];
  position: { x: number; y: number };
  avatar?: string;
  notes: string[];
}
```

## Health Risk Colors

- 🟢 **Green**: Excellent health
- 🟡 **Yellow**: Good health with minor concerns
- 🟠 **Orange**: Fair health requiring attention
- 🔴 **Red**: Poor health needing immediate care

## Animations

- **Entrance**: Staggered fade-in for family members
- **Hover**: Scale and glow effects
- **Drag**: Smooth position updates with physics
- **Connection**: Animated relationship line drawing
- **Modal**: Slide-in transitions for details

## Accessibility

- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: ARIA labels and descriptions
- **Focus Management**: Proper focus indicators
- **Color Contrast**: WCAG compliant color schemes

## Performance

- **Virtualization**: Efficient rendering for large family trees
- **Lazy Loading**: On-demand health data loading
- **Memoization**: Optimized re-renders
- **Web Workers**: Background health analysis

## Dependencies

- `react`: ^18.0.0
- `framer-motion`: ^10.0.0
- `react-draggable`: ^4.4.5
- `@heroicons/react`: ^2.0.0
- `tailwindcss`: ^3.0.0

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details.