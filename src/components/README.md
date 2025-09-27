# DomainFi Components

This directory contains all the modular components for the DomainFi dashboard.

## Structure

```
src/components/
├── Layout/
│   ├── Header.tsx          # Navigation header
│   ├── Hero.tsx            # Hero section with main heading
│   ├── SearchSection.tsx   # Domain search functionality
│   ├── DomainResults.tsx   # Domain analysis results
│   ├── Features.tsx        # Feature cards section
│   └── MainLayout.tsx      # Main layout wrapper
├── index.ts                # Component exports
└── README.md              # This file
```

## Layout System

All components follow a consistent layout system:

- **Container**: `max-w-7xl mx-auto px-6 lg:px-8`
- **Sections**: `py-24` for main sections, `py-16` for smaller sections
- **Grid**: Responsive grid system with proper gaps
- **Alignment**: Consistent spacing and alignment throughout

## Usage

```tsx
import { MainLayout } from '@/components';

export default function Home() {
  return <MainLayout />;
}
```

## Component Props

### SearchSection
- `onDomainData: (data: any) => void` - Callback for domain data

### DomainResults
- `domainData: any` - Domain analysis data

## CSS Classes

The layout system uses these CSS classes:
- `.container` - Main container with max-width and padding
- `.section` - Standard section spacing (py-24)
- `.section-sm` - Smaller section spacing (py-16)
- `.grid-auto-fit` - Auto-fit grid for responsive layouts
- `.flex-center` - Centered flex layout
- `.flex-between` - Space-between flex layout
