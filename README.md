<!-- styled:v2 -->
<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:1d1726,50:167dfe,100:9533fa&height=180&section=header&text=Life%20Care%20%E2%80%93%20Self%20Health%20Care%20Monitoring%20System%20(SHCMS)&fontSize=25&fontColor=ffffff&fontAlignY=36&desc=Open-source%20project&descAlignY=58&descSize=16&animation=fadeIn" width="100%" alt="Life Care – Self Health Care Monitoring System (SHCMS)" />

**A **production-ready** full-stack web application that unifies **diet planning**, **exercise**, **health recipes**, **doctor consultation**, and **appointment booking** in one platform. Built with React, Firebase, and TailwindCSS.**


<p>
  <a href="#features">Features</a> ·
  <a href="#project-structure">Project structure</a> ·
  <a href="#setup">Setup</a>
</p>

</div>

---

## Features

- **Multi-role access:** User (Patient), Doctor, and Admin dashboards with role-based routing and permissions  
- **Authentication:** Email/password sign up, sign in, password reset (Firebase Auth)  
- **Health profiles:** Users maintain profile and health data; doctors maintain professional profile and availability  
- **Appointments:** Book with doctors, view status; doctors accept/reject requests  
- **Content:** Diet plans, exercise plans, health recipes (video/content), health tips  
- **Admin panel:** Manage users, doctors, appointments; approve doctors; add recipes, diet plans, exercises; view statistics  
- **Storage:** Profile photo uploads (Firebase Storage)  
- **Responsive UI:** TailwindCSS, dashboard layout with sidebar, modals, and forms matching the design system  

---

## Tech Stack

| Layer        | Technology                          |
| ------------ | ----------------------------------- |
| **Frontend** | React 19, Vite, React Router v6     |
| **Styling**  | TailwindCSS                         |
| **Backend**  | Firebase (Auth, Firestore, Storage)  |
| **State**    | React Context API                   |

---

## Prerequisites

- **Node.js** 20.19+ or 22.12+ (recommended for Vite 7)  
- **npm** (or yarn/pnpm)  
- **Firebase** project with Auth, Firestore, and Storage enabled  

---

## Setup

### 1. Clone and install

```bash
cd shcms
npm install
```

### 2. Firebase configuration

- The app is preconfigured for Firebase project **shcp-88165**.  
- In [Firebase Console](https://console.firebase.google.com):
  - Enable **Authentication** → **Email/Password** sign-in.
  - Create a **Firestore** database (start in test mode if needed, then switch to rules below).
  - Enable **Storage**.

To use a **different project**, copy `.env.example` to `.env` and set:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...   # optional, for Analytics
```

### 3. Firestore rules (required for sign-up to work)

If you see **"Missing or insufficient permissions"** when signing up, Firestore is blocking the write. You must deploy the rules:

1. Open [Firebase Console](https://console.firebase.google.com) → your project (**SHCP**).
2. Go to **Firestore Database** → **Rules**.
3. Replace everything in the editor with the full contents of **`firestore.rules`** from this repo (copy the entire file).
4. Click **Publish**.

After publishing, try signing up again. The app creates a user in **Authentication** first, then writes the profile to **Firestore**; the rules allow that write only when the document ID matches the signed-in user’s UID.

### 4. Storage rules

In Firebase Console → **Storage** → **Rules**, paste the contents of **`storage.rules`** from this repo.

### 5. Create the first admin

**Option A – Admin auth page (recommended)**  
1. On the **Home** page, click the **Admin** icon (bottom-left).  
2. You are taken to the **Admin** login/signup page (no User/Doctor options).  
3. Open the **Sign up** tab, enter name, email, password, and **Admin invite code**: `SHCMS_ADMIN_2026` (or set `VITE_ADMIN_INVITE_CODE` in `.env` to your own secret).  
4. Click **Create admin account**. You will be signed in and redirected to the Admin dashboard.

**Option B – Manual role in Firestore**  
1. Register as a normal **User** from the main Register page.  
2. In Firebase Console → **Firestore** → **users** → open the document for that user’s UID.  
3. Change the **`role`** field from `user` to **`admin`** and save.  
4. Click the **Admin** icon on the home page and log in with that email/password.

### 6. Run the app

```bash
npm run dev
```

Open the URL shown in the terminal (e.g. `http://localhost:5173`).

### 7. Load sample content (optional)

As an **admin**, go to **Admin** → **Content** and click **Load sample data**. This adds sample exercises, diet plans, recipes (halal/healthy), and health tips so the app has content for users and doctors.

---

## Roles and capabilities

| Role    | Capabilities |
| ------- | ----------------------------------------------------------------------------------- |
| **User** | Health profile, view diet/exercise plans and recipes, book appointments, view doctors and health tips, track appointment status. |
| **Doctor** | Professional profile, set availability, view/accept/reject appointments, add health tips, view diet recommendations. |
| **Admin** | Manage users and doctors, verify/approve doctors, manage appointments, add recipes/diet plans/exercises/health tips (Content), load sample data, view statistics and reports. Admin login is separate (Admin icon → admin-only login/signup). |

---

## Project structure

```
shcms/
├── public/
├── src/
│   ├── components/     # Navbar, Sidebar, Cards, Forms, Modals, Logo, Icons
│   ├── contexts/       # AuthContext, UserContext
│   ├── hooks/          # useAuth, useFirestore
│   ├── pages/          # Home, Login, Register, User/Doctor/Admin dashboards & subpages
│   ├── services/       # firebase, authService, appointmentService, storageService
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── firestore.rules     # Firestore security rules
├── storage.rules       # Firebase Storage security rules
├── .env.example
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## Build and deploy

```bash
# Production build
npm run build

# Preview production build locally
npm run preview
```

Deploy the **`dist/`** folder to any static host (Vercel, Netlify, Firebase Hosting, etc.). Ensure environment variables are set in the host if you use a different Firebase project.

---

## License

This project is for educational and portfolio use.  
For production use, ensure compliance with health-data regulations (e.g. HIPAA, GDPR) as applicable.

---

## Developer

**Syed Muhammad Hussnain Bukhari**

Full-stack developer behind the Self Health Care Monitoring System (SHCMS).  
If you use or extend this project, a credit or link back is appreciated.

---

<div align="center">

**Built by [Ch Muhammad Samiullah](https://github.com/samiullah156-creator)** · AI Automation Engineer and Full-Stack Developer at [Lexvaxa](https://lexvaxa.com)

<a href="https://github.com/samiullah156-creator"><img src="https://img.shields.io/badge/More%20projects-181717?style=for-the-badge&logo=github&logoColor=white" alt="More projects" /></a>
<a href="https://lexvaxa.com/contact"><img src="https://img.shields.io/badge/Work%20with%20me-167dfe?style=for-the-badge&logo=googlecalendar&logoColor=white" alt="Work with me" /></a>
<a href="https://www.linkedin.com/in/sami-lexvaxa/"><img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>

<sub>⭐ Star this repo if you found it useful</sub>

</div>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:9533fa,50:167dfe,100:1d1726&height=110&section=footer" width="100%" alt="" />
