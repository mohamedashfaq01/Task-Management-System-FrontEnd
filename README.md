# Task Tracker PWA

A Progressive Web Application (PWA) for tracking and managing tasks for family members. This application allows you to create tasks under specific categories and track progress with SMS notifications.

## Features

### Core Functionality
- **Task Creation**: Create tasks with title, description, category, priority, assigned person, and due date
- **Task Categories**: 
  - Islamic Learning (e.g., memorize surahs, read hadith)
  - Academic Improvement (e.g., complete a chapter of a subject)
  - Technical Skills (e.g., learn a programming concept)
  - Life Skills (e.g., help in household work, public speaking practice)
- **Task Management**: View, filter, and update task status
- **Progress Tracking**: Monitor individual and overall progress with detailed reports
- **SMS Notifications**: Simulated SMS notifications for task creation and completion

### PWA Features
- **Offline Support**: Works offline with service worker
- **Installable**: Can be installed as a native app on mobile devices
- **Responsive Design**: Optimized for mobile and desktop
- **Fast Loading**: Optimized performance with Angular

## Technology Stack

- **Frontend**: Angular 20 with standalone components
- **UI Framework**: Angular Material Design
- **PWA**: Angular PWA package with service worker
- **Styling**: SCSS with Material Design theming
- **Data**: Mock data service (ready for backend integration)

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd task-tracker-pwa
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
ng serve
```

4. Open your browser and navigate to `http://localhost:4200`

### Building for Production

1. Build the application:
```bash
ng build
```

2. For PWA deployment:
```bash
ng build --configuration production
```

## Application Structure

```
src/
├── app/
│   ├── components/
│   │   ├── dashboard/           # Main dashboard component
│   │   ├── create-task/         # Task creation form
│   │   ├── task-list/           # Task listing and management
│   │   └── progress-reports/    # Progress tracking and reports
│   ├── models/
│   │   └── task.model.ts        # Data models and interfaces
│   ├── services/
│   │   └── mock-data.service.ts # Mock data service
│   ├── app.routes.ts            # Application routing
│   ├── app.config.ts            # App configuration
│   └── app.html                 # Main app template
├── styles.scss                  # Global styles and Material theme
└── index.html                   # Main HTML file
```

## Features in Detail

### Dashboard
- Overview of all tasks with statistics
- Quick actions to create tasks and view reports
- Recent tasks display
- Progress overview for each person

### Task Creation
- Comprehensive form with validation
- Real-time task preview
- Category and priority selection
- Person assignment
- Due date picker

### Task Management
- Filter tasks by status, category, and person
- Search functionality
- Status updates (Pending, In Progress, Completed)
- Visual indicators for overdue tasks

### Progress Reports
- Individual progress tracking
- Overall statistics
- Monthly breakdown
- Performance comparison table
- Visual progress indicators

### SMS Notifications (Simulated)
- Task creation notifications
- Task completion notifications
- Console logs for demonstration

## Mock Data

The application includes sample data for testing:
- 3 family members (Ahmed Khan, Fatima Ali, Omar Hassan)
- 5 sample tasks across different categories
- Various task statuses and priorities

## PWA Features

### Installation
- Users can install the app on their mobile devices
- App icon and splash screen
- Native app-like experience

### Offline Support
- Service worker caches resources
- Works without internet connection
- Automatic updates when online

### Performance
- Optimized bundle size
- Lazy loading of components
- Efficient caching strategies

## Future Enhancements

### Backend Integration
- Spring Boot REST API
- Real SMS notifications
- User authentication
- Database persistence

### Additional Features
- Task templates
- Recurring tasks
- File attachments
- Comments and discussions
- Email notifications
- Push notifications

## Development

### Code Style
- Angular style guide compliance
- TypeScript strict mode
- ESLint configuration
- Prettier formatting

### Testing
- Unit tests for components
- Service testing
- E2E testing with Playwright

### Deployment
- Docker containerization
- CI/CD pipeline
- Environment configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.

---

**Note**: This is an MVP (Minimum Viable Product) with mock data. The backend integration and real SMS notifications will be implemented in future versions.
