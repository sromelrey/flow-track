# FocusFlow - Productivity Dashboard

A modern productivity dashboard built with Next.js 16, React 19, and Tailwind CSS. Track your daily progress, manage tasks, and visualize your activity patterns.

## Features

- **Activity Heatmap**: Visual representation of your daily activity over the past 30 days
- **Task Management**: Create, complete, and track tasks with categories (Dev, Family, Health, Personal)
- **Progress Tracking**: Monitor daily, weekly, and monthly progress with circular progress indicators
- **Streak Counter**: Keep track of consecutive days with activity
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, minimalist interface with smooth animations

## Tech Stack

- **Framework**: Next.js 16
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Components**: shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React
- **State Management**: Zustand
- **TypeScript**: Full type safety

## Getting Started

First, run the development server:

```bash
pnpm dev
# or
npm run dev
# or
yarn dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
├── app/
│   ├── dashboard/          # Main dashboard page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page (redirects to dashboard)
├── components/
│   ├── dashboard/         # Dashboard-specific components
│   │   ├── Header.tsx
│   │   ├── DashboardHeader.tsx
│   │   ├── ActivityHeatmap.tsx
│   │   ├── DailySummaryCard.tsx
│   │   ├── TaskList.tsx
│   │   └── ProgressRing.tsx
│   └── ui/               # shadcn/ui components
├── store/
│   └── dashboardStore.ts  # Zustand state management
├── types/
│   └── index.ts          # TypeScript type definitions
└── lib/
    └── dateUtils.ts      # Date utility functions
```

## Components

### Header
- Navigation menu with Dashboard, Tasks, Plans, and Settings
- Mobile-responsive with hamburger menu
- FocusFlow branding

### Dashboard Header
- Displays current date and streak counter
- "Small wins daily" motivational message

### Activity Heatmap
- 30-day activity visualization
- Color-coded intensity levels
- Tooltip on hover showing date and activity count

### Daily Summary Card
- Task completion progress
- Motivational messages based on progress
- Visual progress bar

### Task List
- Interactive task checkboxes
- Category badges with color coding
- Strike-through effect for completed tasks

### Progress Ring
- Circular progress indicator
- Toggle between Daily, Weekly, and Monthly views
- Smooth animations

## State Management

The application uses Zustand for state management with the following store:

- **Tasks**: Array of task objects with completion status
- **Activity Data**: 30-day activity history for the heatmap
- **Progress Data**: Daily, weekly, and monthly progress percentages
- **Streak Counter**: Consecutive days with activity

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).
