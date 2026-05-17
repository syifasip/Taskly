<h1 align="center">Taskly </h1>

<p align="center">
Workspace-Based Task Management System
</p>

---

# Platform Overview

Taskly merupakan aplikasi manajemen tugas berbasis workspace yang dirancang untuk membantu individu maupun tim dalam mengatur pekerjaan sehari-hari secara terstruktur dan kolaboratif. Aplikasi ini dibangun menggunakan PostgreSQL sebagai basis data utama dengan implementasi fitur CRUD untuk task dan role, sistem autentikasi menggunakan JSON Web Token (JWT), serta Role-Based Access Control (RBAC) untuk mengatur hak akses pengguna secara detail pada setiap workspace.

Platform ini memungkinkan pengguna untuk membuat dan mengelola beberapa workspace secara terpisah, di mana setiap workspace memiliki URL unik sehingga tim yang berbeda dapat bekerja secara independen dalam satu platform yang sama. Sistem perizinan yang fleksibel memungkinkan pengelolaan hak akses secara granular, mulai dari izin membuat task, menghapus role, hingga mengelola anggota tim.

Sebagai database pendukung, Redis digunakan untuk meningkatkan performa aplikasi melalui caching sesi JWT sehingga proses autentikasi tidak terus-menerus membebani query pada PostgreSQL. Selain itu, Redis juga dimanfaatkan untuk sistem pengingat deadline otomatis menggunakan mekanisme Time-To-Live (TTL), yang memungkinkan pengguna menerima pengingat ketika tenggat waktu tugas semakin dekat.

Taskly juga menyediakan kalender terintegrasi yang secara otomatis menampilkan seluruh deadline tugas sehingga pengguna dapat memantau aktivitas, jadwal kerja, dan tugas yang akan datang dengan lebih mudah tanpa memerlukan konfigurasi tambahan.

---

# Group Members

| Nama | NPM |
|--------|--------|
| Vanesa Kayla Zahra | 2306161901 |
| Soraya Azzizah Pahlevi | 2406487001 |
| Syifa Aulia Azhim | 2406413445 |
| Putu Arkana Satriakusuma | 2406486983 |

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
