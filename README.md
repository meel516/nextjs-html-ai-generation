nextjs-html-ai-generation
# 🚀 HTML & CSS Chatbot Generator

An AI-powered chatbot that generates responsive, production-ready HTML and CSS code from user prompts — complete with live preview and authentication. Built for rapid MVP creation of landing pages.

![Preview Screenshot](https://nextjs-html-ai-generation.vercel.app/) <!-- Optional: Add demo image -->

---

## 📌 Objective

Build a developer tool that enables users to:

- Generate full HTML/CSS landing pages using GenAI.
- Preview and copy or download the result.
- Easily create and manage sessions with authentication.

---

## 🧰 Tech Stack

| Layer            | Technology                          |
|------------------|--------------------------------------|
| Framework        | [Next.js](https://nextjs.org)        |
| Language         | TypeScript                          |
| Styling          | Tailwind CSS + RadixUI             |
| Authentication   | NextAuth.js                         |
| Database         | PostgreSQL ( NeonDB) |
| ORM              | Prisma                |
| GenAI API        | Any (Groq) via Vercel AI SDK |
| Hosting          | Vercel                              |

---

## 🔐 Authentication

- Login & Signup using **NextAuth.js**.
- Supports email/password auth.
- All routes are protected unless authenticated.

---

## 💬 Chat Interface

- Interactive chat with an AI HTML generator.
- Choose between:
  - Tailwind CSS
  - Inline styles
  - `<style>` tag usage
- Messages persist in database using sessions.

---

## ✨ Features

- ✅ Generate full HTML pages
- ✅ Live code preview panel
- ✅ Persistent chat history (via PostgreSQL)
- ✅ Sidebar for switching chat sessions
- ✅ Beautiful UI built with Tailwind + ShadcnUI
- ✅ Auth-protected access
- ⚡ Optimized for landing page generation

---

## 🧠 System Prompt

The model is optimized to:

- Follow clean HTML semantics
- Use modern responsive techniques
- Support Tailwind, Inline, or `<style>` styling
- Always return full HTML (`<!DOCTYPE html>` …)

---

