# 🕒 Yet Another Attendance System (YAAS)

Welcome to **Yet Another Attendance System**, a Next.js project designed to showcase a modern, well-structured, and type-safe web application. This project demonstrates a comprehensive solution for managing employee clock-ins and clock-outs while offering a sleek, user-friendly interface for both employees and administrators.

⚠️ Note: This project was built primarily as a coding exercise. While it's fully functional, it's not intended for production use.

## 🚀 Features

### 🔐 **Admin Panel**
- **User Management:** Create, update, and delete users with ease.
- **Schedule Creation:** Define work schedules and assign them to multiple users.
- **Attendance Tracking:** Easily view and manage clock-ins and clock-outs from employees.

### 👤 **User Dashboard**
- **Clock-in/Clock-out:** Employees can log their work hours directly from their dashboard.
- **Attendance History:** Employees can view a detailed list of their clock-ins and clock-outs to avoid confusion.

### 📦 **File Uploads with MinIO**
The project includes a feature for uploading user avatars using **MinIO**, implemented through a **presigned URL system**:
- **Secure Uploads:** Presigned URLs allow clients to upload files directly to MinIO without exposing sensitive credentials.

This demonstrates a way to use cloud storage systems and implement secure file upload workflows in a scalable manner.

## 🛠️ Tech Stack

- **[Next.js](https://nextjs.org/):** The React framework for production-grade applications.
- **[next-safe-actions](https://github.com/themarkiv/next-safe-actions):** Type-safe server actions for modern Next.js applications.
- **[Zod](https://zod.dev/):** Schema validation and type inference for reliable input handling.
- **[Drizzle ORM](https://orm.drizzle.team/):** Type-safe and lightweight ORM for database management.
- **SQLite:** A simple and powerful database for lightweight data storage.
- **[shadcn/ui](https://shadcn.dev/):** A component library to create modern and beautiful interfaces.
- - **[Zustand](https://github.com/pmndrs/zustand):** A small, fast, and scalable state management solution for React, used to manage global state across the app.
- **[MinIO](https://min.io/):** Object storage for securely managing file uploads.

## 📚 What This Project Demonstrates

- **Full-stack Development:** A comprehensive application covering both front-end and back-end functionality.
- **Type Safety:** Extensive use of TypeScript, `next-safe-actions`, and `Zod` to ensure reliability.
- **Modern UI/UX:** A sleek interface built with `shadcn/ui` for a professional look and feel.
- **Database Expertise:** Use of `Drizzle ORM` for type-safe database interactions.
- **Cloud Integration:** File uploads implemented securely via MinIO and presigned URLs.

## 🚀 Key Highlights

This project was built as a demostration to:

- Implement type-safe, scalable solutions using Server Actions and next-safe-actions.
- Create reliable and reusable validation layers with Zod.
- Manage complex relational data using Drizzle ORM with an SQLite backend.
- Build aesthetic and responsive user interfaces using ShadCN.
- Follow best practices for coding, architecture, and UI/UX design.


Feel free to explore the codebase and reach out with any questions or feedback!
