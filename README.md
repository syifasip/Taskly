<h1 align="center">Taskly</h1>

# Platform Overview

Taskly merupakan aplikasi manajemen tugas berbasis workspace yang dirancang untuk membantu individu maupun tim dalam mengatur pekerjaan sehari-hari secara terstruktur dan kolaboratif. Aplikasi ini dibangun menggunakan PostgreSQL sebagai basis data utama dengan implementasi fitur CRUD untuk task dan role, sistem autentikasi menggunakan JSON Web Token (JWT), serta Role-Based Access Control (RBAC) untuk mengatur hak akses pengguna secara detail pada setiap workspace.

Platform ini memungkinkan pengguna untuk membuat dan mengelola beberapa workspace secara terpisah, di mana setiap workspace memiliki URL unik sehingga tim yang berbeda dapat bekerja secara independen dalam satu platform yang sama. Sistem perizinan yang fleksibel memungkinkan pengelolaan hak akses secara granular, mulai dari izin membuat task, menghapus role, hingga mengelola anggota tim.

Sebagai database pendukung, Redis digunakan untuk meningkatkan performa aplikasi melalui caching sesi JWT sehingga proses autentikasi tidak terus-menerus membebani query pada PostgreSQL. Selain itu, Redis juga dimanfaatkan untuk sistem pengingat deadline otomatis menggunakan mekanisme Time-To-Live (TTL), yang memungkinkan pengguna menerima pengingat ketika tenggat waktu tugas semakin dekat.

Taskly juga menyediakan kalender terintegrasi yang secara otomatis menampilkan seluruh deadline tugas sehingga pengguna dapat memantau aktivitas, jadwal kerja, dan tugas yang akan datang dengan lebih mudah tanpa memerlukan konfigurasi tambahan.

---

## Tech Stack

![PostgreSQL](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![NPM](https://img.shields.io/badge/NPM-%23000000.svg?style=for-the-badge&logo=npm&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

> Fitur realtime menggunakan Pub/Sub Redis (bukan Socket.io). Database PostgreSQL di-host menggunakan Neon.

---

## Diagram

UML

ERD

Flowchart

---

## Database Architecture

| Database | Fungsi |
|---|---|
| PostgreSQL (Neon) | Penyimpanan utama: user, workspace, task, role, permission |
| Redis | Cache sesi JWT + TTL pengingat deadline otomatis + Pub/Sub realtime |

---

## Features

### Autentikasi
- Register dan login dengan autentikasi berbasis JWT
- Sesi di-cache via Redis agar validasi tidak membebani query ke database utama

### Workspace
- Buat workspace personal (private) atau tim (public)
- Setiap workspace memiliki URL unik dan beroperasi secara terisolasi
- Invite anggota tim ke workspace

### My Task
- Tambah, edit, dan hapus task dengan nama, deskripsi, tanggal, dan waktu deadline
- Pinned task ditampilkan di section terpisah bergaya post-it
- Task dikelompokkan otomatis berdasarkan waktu:
  - Pinned Tasks
  - Today's Tasks
  - This Week's Tasks
  - This Month's Tasks
  - This Year's Tasks
  - Future Tasks

### Calendar
- Tampilan kalender bulanan yang menampilkan task berdasarkan `tasks.due_date`
- Terhubung langsung ke task workspace tanpa konfigurasi tambahan

### Stats
- Rekap status task secara visual:
  - Persentase task yang sudah diselesaikan
  - Jumlah total task
  - Breakdown status: belum dikerjakan / sudah selesai / terlambat

### Notifikasi
- Pengingat otomatis berbasis TTL Redis saat deadline mendekat (H-3, H-1, H-0)
- Notifikasi saat task dikerjakan oleh anggota lain di workspace yang sama
- Notifikasi saat ada pesan baru di Discuss, disertai info asal workspace

### Discuss *(Team workspace only)*
- Fitur chat realtime antar anggota dalam satu workspace menggunakan Pub/Sub Redis
- Tidak tersedia pada workspace personal

### Roles & Permissions *(Team workspace only)*
- Buat dan kelola role kustom per workspace
- Permission dikonfigurasi per role, dan role ditetapkan per anggota

**Kategori Task:**

| Permission | Deskripsi |
|---|---|
| `add_task` | Menambahkan task baru |
| `update_task` | Mengubah task yang ada |
| `delete_task` | Menghapus task |

**Kategori Roles:**

| Permission | Deskripsi |
|---|---|
| `create_role` | Membuat role baru |
| `delete_role` | Menghapus role |
| `manage_team_roles` | Mengatur role anggota tim |

---

## Application Flow

```
Register / Login
      |
      v
Dashboard (kosong — belum ada workspace)
      |
      v
Buat Workspace (Private / Team)
      |
      |-- Private --> My Task, Calendar, Stats
      |
      +-- Team -----> My Task, Calendar, Stats, Discuss, Roles
```

### Persistent Layout

Seluruh halaman setelah login memiliki dua elemen yang selalu tampil:

**Topbar**
- Avatar profil (ujung kiri) — popup: Logout / Change Account
- Ikon notifikasi — popup berisi notifikasi deadline (H-3, H-1, H-0), aktivitas task oleh anggota lain, dan pesan baru dari Discuss beserta asal workspace

**Sidebar**
- Tombol New Workspace — arahkan ke form pembuatan workspace (private / team)
- Daftar workspace yang dimiliki untuk berpindah antar workspace
- Menu navigasi halaman: My Task, Calendar, Stats
- Khusus team workspace: Discuss, Roles

---

## Installation Guide

Clone this repository

```bash
git clone https://github.com/syifasip/Taskly.git
```

### Frontend

- Ensure you're on the right folder

  ```
  cd frontend
  ```

- Run npm install to install all dependencies

  ```bash
  npm install
  ```

- To run the frontend

  ```bash
  npm run dev
  ```

### Backend

- Ensure you're on the right folder

  ```
  cd backend
  ```

- Run npm install to install all dependencies

  ```bash
  npm install
  ```

- Create an `.env` file in your project root folder and add your variables

- Insert database variables

  ```env
  DATABASE_URL=postgresql://user:password@neon.tech/taskly
  REDIS_URL=redis://localhost:6379
  JWT_SECRET=your_jwt_secret
  PORT=5000
  ```

- To run the backend server

  ```bash
  node server.js
  ```

---

## Group Members

| Nama | NPM |
|---|---|
| Vanesa Kayla Zahra | 2306161901 |
| Soraya Azzizah Pahlevi | 2406487001 |
| Syifa Aulia Azhim | 2406413445 |
| Putu Arkana Satriakusuma | 2406486983 |
