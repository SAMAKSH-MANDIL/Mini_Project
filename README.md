
# AttendanceHelper – Smart Attendance Tracker


  <h3>Track and predict your attendance percentage with ease</h3>
  <p>A comprehensive web application for students to calculate attendance, plan holidays, and achieve target percentages</p>


---

## 🌟 Features

### 📊 Attendance Calculator
- Calculate your current attendance percentage instantly
- Track total classes conducted vs. classes attended
- Visual representation of your attendance status
- Color-coded indicators:
  - 🟢 Green: ≥ 75%
  - 🟡 Yellow: 65–75%
  - 🔴 Red: < 65%

### 📅 Holiday Planner
- Predict how taking holidays affects your attendance
- Day-by-day breakdown of attendance decline
- Interactive charts showing:
  - Attendance trend over holiday days
  - Distribution of attended vs. missed classes
- Detailed table with percentage decrements per day

### 🎯 Target Achievement
- Set custom attendance percentage goals
- Calculate classes needed to reach your target
- See how many classes you can safely skip if above target
- Visual progress tracking with:
  - Bar charts showing projected percentages
  - Progress indicators
  - Personalized recommendations

### ⚙️ Settings & Data Management
- Set and save custom target percentages
- View comprehensive attendance statistics
- Reset all data when needed (with confirmation)
- Data persists using browser localStorage

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd AttendanceHelper
```
2.Install dependencies:
```bash
npm install
```
3.Start the development server:
```bash
npm run dev
```
4.Open your browser and navigate to:
```bash
http://localhost:8080
```
## 🛠️ Tech Stack

- **Framework:** React 18 with TypeScript  
- **Build Tool:** Vite  
- **Routing:** React Router DOM v6  
- **UI Components:**
  - Radix UI (Accessible component primitives)
  - shadcn/ui (Customizable UI components)
- **Charts:** Recharts  
- **Styling:** Tailwind CSS  
- **State Management:** React Hooks  
- **Data Persistence:** localStorage  
- **Icons:** Lucide React  
- **Notifications:** Sonner (toast notifications)
  
## 📁 Project Structure
```bash
src/
├── components/
│ ├── ui/ # Reusable UI components
│ ├── Navigation.tsx # Main navigation
│ └── NavLink.tsx # Custom NavLink wrapper
├── hooks/
│ ├── useAttendance.ts # Attendance calculation logic
│ ├── use-toast.ts # Toast notifications
│ └── use-mobile.tsx # Mobile detection
├── pages/
│ ├── Home.tsx
│ ├── HolidayPlanner.tsx
│ ├── TargetAchievement.tsx
│ ├── Settings.tsx
│ └── NotFound.tsx
├── lib/
│ └── utils.ts
├── App.tsx
├── main.tsx
└── index.css
```
## 🎨 Design System

- HSL-based color palette
- Light & Dark mode support
- Gradient-based UI accents
- Soft and medium shadows
- Inter font family
- Consistent border radius (1rem)

---

## 📱 Responsive Design

- Fully responsive for mobile, tablet, and desktop
- Mobile-friendly navigation
- Touch-optimized controls
- Adaptive charts and tables

---

## 🔒 Data Privacy

- All data is stored locally in the browser
- No external servers or databases
- Data persists across sessions
- Can be cleared anytime from Settings

---

## 🧮 Calculation Logic
### Attendance Percentage
```bash
(Current Classes Attended / Total Classes) × 100
```
### Holiday Impact
```bash
New Total = Current Total + (Classes per Day × Days)
New % = (Classes Attended / New Total) × 100
Decrement = Previous % - New %
```
### Target Achievement
#### If Above Target
```bash
Calculate maximum classes that can be skipped
while maintaining percentage ≥ target
```
#### If Below Target
```bash
Calculate minimum consecutive classes needed
to reach target percentage
```

---

## 📦 Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run build:dev  # Build for development
npm run preview    # Preview production build
npm run lint       # Lint the code
```
## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## 📄 License

This project is open source and available under the **MIT License**.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome.  
Feel free to open an issue or submit a pull request.

---

## 👨‍💻 Developer

Built with ❤️ for students who want to manage their attendance smartly.
