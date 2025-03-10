# 🌍 RecycleHub

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?style=for-the-badge)
![Angular](https://img.shields.io/badge/Angular-17.3.0-red.svg?style=for-the-badge&logo=angular)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.17-38B2AC.svg?style=for-the-badge&logo=tailwind-css)
![NgRx](https://img.shields.io/badge/NgRx-17.2.0-BA2BD2.svg?style=for-the-badge&logo=redux)
![License](https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge)

</div>

<p align="center">
  <strong>🌱 Connecting communities for a sustainable future through smart recycling</strong>
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technical Stack](#-technical-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Development](#-development)
- [State Management](#-state-management)
- [Contributing](#-contributing)

## 🌟 Overview

RecycleHub revolutionizes the recycling experience by creating a digital bridge between individuals and certified waste collectors. Our platform promotes sustainable practices while rewarding environmental consciousness through an innovative points system.

## ✨ Features

### 👤 For Users

- 🔐 Secure user authentication and profile management
- 📅 Intuitive collection scheduling system
- 📊 Real-time collection tracking
- 💰 Points earning and redemption system
- 📈 Detailed recycling analytics

### 🚛 For Collectors

- 📱 Streamlined collector dashboard
- 🎯 Smart request matching system
- ✅ Collection validation tools
- 📊 Performance metrics and analytics

## 🛠 Technical Stack

- **🅰️ Frontend**: Angular 17.3.0
- **🔄 State Management**: NgRx (Store, Effects, Entity)
- **🎨 Styling**: TailwindCSS
- **📐 Architecture**: Feature-based modular design

## 📂 Project Structure

```bash
src/
├── 📁 app/
│   ├── 📁 core/
│   │   ├── 🛡️ guards/
│   │   └── ⚙️ services/
│   ├── 📁 features/
│   │   ├── 🔐 auth/
│   │   ├── 📊 dashboard/
│   │   ├── 🏠 home/
│   │   ├── 💰 points/
│   │   └── 👤 profile/
│   ├── 📁 shared/
│   │   ├── 🧩 components/
│   │   ├── 📝 constants/
│   │   └── 📋 models/
│   └── 📁 store/
│       ├── ⚡ actions/
│       ├── 🔄 effects/
│       ├── 📦 reducers/
│       └── 🎯 selectors/
```

## 🚀 Getting Started

### Prerequisites

- 📦 Node.js (v18+)
- 🅰️ Angular CLI (v17.3.0)
- 📦 npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone [repository-url]
cd recyclehub-web-angular
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm start
```

Visit `http://localhost:4200` in your browser! 🎉

## 💻 Development

### 🔨 Build Commands

```bash
# 🔧 Development build
npm run build

# 🏭 Production build
npm run build -- --configuration production
```

### 🧪 Testing

```bash
# 🔍 Run unit tests
npm run test

# 👀 Watch mode
npm run test -- --watch
```

## 🔄 State Management

Our NgRx store is organized into three main modules:

- 🔐 **Auth Store**: User authentication & profile management
- 📦 **Collection Store**: Request lifecycle management
- 💰 **Points Store**: Transaction & rewards tracking

## 🎨 Styling

Utilizing TailwindCSS with:

- 🎯 Custom brand color palette
- 📱 Responsive design system
- 🧩 Reusable component classes

## 🔒 Security Features

- 🛡️ Protected route guards
- 🔑 JWT authentication
- 👤 Secure profile management
- 🔐 Role-based access control

## 🤝 Contributing

1. 🍴 Fork the repository
2. 🌿 Create your feature branch
3. 💾 Commit your changes
4. 🚀 Push to the branch
5. 📬 Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<div align="center">

**🌱 Join us in making recycling smarter and more rewarding! 🌱**

[Report Bug](https://github.com/username/recyclehub/issues) · [Request Feature](https://github.com/username/recyclehub/issues)

</div>
