<h1 align="center">Taskly - Workspace-Based Task Management System</h1>

<p align="center">
Revolutionizing Team Collaboration Through Smart Task Organization
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
