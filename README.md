# 📬 Mystery Message — Anonymous Messaging Platform

[![Live Demo](https://img.shields.io/badge/Live_Demo-vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://next-freelance-website.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb)](https://www.mongodb.com/)

A full-stack, modern anonymous social messaging web application built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **MongoDB**, **NextAuth.js**, **Resend Email API**, and **Vercel AI SDK (Groq Llama 3.1)**.

🌐 **Live Application Link**: [https://next-freelance-website.vercel.app](https://next-freelance-website.vercel.app/)

---

## ✨ Features

- 👤 **Unique Public Profile Links**: Every user gets a personalized public URL (`/u/[username]`) to receive anonymous messages.
- 🤖 **AI Question Suggestions**: Stream interactive, engaging questions using Groq AI (`llama-3.1-8b-instant`) via Vercel AI SDK.
- 🎯 **One-Click Question Selection**: Click on any suggested question card to automatically populate the message text box.
- 🎛️ **Accept Messages Toggle**: Turn message acceptance **ON** or **OFF** instantly from your dashboard.
- 🔐 **Secure Authentication**: Credentials authentication managed by NextAuth.js with encrypted passwords (`bcryptjs`).
- ✉️ **OTP Email Verification**: 6-digit verification code sent via Resend API and HTML templates using React Email.
- 🗑️ **Message Management**: Read and delete received messages securely using MongoDB `$pull` operations.
- 🎨 **Responsive Premium UI**: Sleek, modern UI with dark/light theme support, Lucide icons, and Tailwind CSS.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router) & [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: [NextAuth.js v4](https://next-auth.js.org/)
- **Email Service**: [Resend](https://resend.com/) & [React Email](https://react.email/)
- **AI Integration**: [Vercel AI SDK](https://sdk.vercel.ai/) & [@ai-sdk/groq](https://groq.com/)
- **Form & Validation**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [Lucide Icons](https://lucide.dev/)

---

## 📁 Repository Structure

```text
NextFreelanceWebsite/
├── app/
│   ├── (app)/
│   │   ├── dashboard/page.tsx      # User Dashboard (Inbox, Toggle & Unique Link)
│   │   ├── layout.tsx              # App Navigation Layout
│   │   └── page.tsx                # Hero Home Page & Feature Carousel
│   ├── (auth)/
│   │   ├── sign-in/page.tsx        # Sign In Page
│   │   ├── sign-up/page.tsx        # Sign Up Page
│   │   └── verfiy/[username]/      # OTP Email Verification Page
│   ├── api/
│   │   ├── accept-message/         # GET/POST Message Acceptance Toggle
│   │   ├── auth/[...nextauth]/     # NextAuth Options & Route Handlers
│   │   ├── check-username-unique/  # Debounced Username Availability API
│   │   ├── delete-message/         # Delete Message API Route ($pull)
│   │   ├── get-message/            # Fetch Received User Messages
│   │   ├── send-message/           # Send Anonymous Message API Route
│   │   ├── sign-up/                # User Registration & OTP Email Dispatch
│   │   ├── suggest-message/        # AI Suggested Questions API (Groq)
│   │   └── verify-user/            # Verify Code API Route
│   ├── layout.tsx                  # Root Layout with AuthProvider & Toaster
│   └── globals.css                 # Global Tailwind CSS Styles
├── components/
│   ├── ui/                         # Reusable UI Components (Button, Card, Switch, etc.)
│   ├── MessageCard.tsx             # Interactive Inbox Message Card with Delete Modal
│   └── Navbar.tsx                  # Top Sticky Navigation Bar
├── emails/
│   └── VerificationEmail.tsx       # React Email Verification Template
├── helpers/
│   └── sendVerificationEmail.ts    # Resend API Helper Function
├── lib/
│   ├── dbConnect.ts                # MongoDB Connection Singleton
│   └── resend.ts                   # Resend API Client Instance
├── model/
│   └── User.ts                     # Mongoose User & Message Schema
└── schemas/                        # Zod Validation Schemas
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** or **yarn** or **pnpm**
- **MongoDB Database** (MongoDB Atlas or Local Instance)
- **Resend API Key** ([https://resend.com](https://resend.com))
- **Groq API Key** ([https://groq.com](https://groq.com)) *(Optional for AI suggestions)*

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/jsr-warrior-21/NextFreelanceWebsite.git
   cd NextFreelanceWebsite
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   # Database Connection
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/nextfreelance

   # NextAuth Secret
   NEXTAUTH_SECRET=your_super_secret_key_here

   # Resend Email API Key
   RESEND_EMAIL_API=re_your_resend_api_key_here

   # Groq AI API Key (Optional)
   GROQ_API_KEY=gsk_your_groq_api_key_here
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. Open **[http://localhost:3000](http://localhost:3000)** in your browser!

---

## 🌐 Deployment

The live app is deployed on **Vercel** at:
👉 **[https://next-freelance-website.vercel.app](https://next-freelance-website.vercel.app/)**

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
