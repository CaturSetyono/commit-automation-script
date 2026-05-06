# Git Commit Automation Script

Dua script bash untuk otomatisasi commit dan push Git — setiap file dicommit secara terpisah dengan pesan commit bergaya [Conventional Commits](https://www.conventionalcommits.org/).

---

## Instalasi via NPM

Sekarang script ini bisa diinstal melalui NPM! Secara otomatis script `push.sh` dan `amend.sh` akan disalin (di-copy) ke root direktori project kamu. Dengan begitu, kamu bisa memilih mau menggunakan fitur auto commit standar (`push.sh`) atau fitur amend tanggal (`amend.sh`).

```bash
npm install commit-automation-script
```

---

## Script yang Tersedia

| Script     | Fungsi                                                                         |
| ---------- | ------------------------------------------------------------------------------ |
| `push.sh`  | Commit + push tiap file dengan timestamp asli                                  |
| `amend.sh` | Commit + push tiap file, lalu **amend tanggal commit** ke rentang Januari 2025 |

---

## `push.sh` — Auto Commit & Push

### Cara Kerja

1. Membaca semua file yang berubah via `git status --short`
2. Tiap file di-stage dan di-commit satu per satu
3. Pesan commit dibentuk otomatis berdasarkan nama/ekstensi file (format Conventional Commits)
4. Semua commit di-push ke remote branch saat ini

### Cara Penggunaan

```bash
./push.sh "pesan commit"
```

Jika tidak ada argumen, pesan default yang dipakai adalah `auto update`.

```bash
# Contoh
./push.sh "tambah fitur login"
./push.sh                        # pakai pesan default "auto update"
```

### Contoh Output

```
🚀 Auto Git Push
==========================================
 Branch  : main
 Message : tambah fitur login
==========================================
🔍 Repository status:
 M src/auth.js
?? src/utils.js

 modify  → src/auth.js
 add     → src/utils.js
📤 Pushing to origin/main...
==========================================
✅ Done! 2 commit(s) pushed.
==========================================
```

---

## `amend.sh` — Auto Commit & Push dengan Amend Tanggal

### Cara Kerja

Sama seperti `push.sh`, tapi setelah tiap commit dibuat, tanggal commit di-**amend** secara berurutan mulai dari `2025-01-01` hingga `2025-01-13`, lalu berulang kembali dari 01.

```
File ke-1  → commit tanggal 2025-01-01
File ke-2  → commit tanggal 2025-01-02
...
File ke-13 → commit tanggal 2025-01-13
File ke-14 → commit tanggal 2025-01-01  ← reset
```

### Cara Penggunaan

```bash
./amend.sh "pesan commit"
```

```bash
# Contoh
./amend.sh "initial project setup"
./amend.sh                           # pakai pesan default "auto update"
```

### Contoh Output

```
🚀 Auto Git Push with Loop Date
==========================================
 Branch  : main
 Message : initial project setup
==========================================
🔍 Repository status:
 M contracts/Token.sol
?? README.md

 modify  → contracts/Token.sol
 amending date → 2025-01-01 10:00:00
 add     → README.md
 amending date → 2025-01-02 10:00:00
📤 Pushing to origin/main...
==========================================
✅ Done! 2 commit(s) pushed.
==========================================
```

---

## Deteksi Tipe Commit Otomatis

Kedua script mendeteksi tipe commit berdasarkan nama file dan status perubahan:

| Kondisi                                        | Tipe Commit |
| ---------------------------------------------- | ----------- |
| File dihapus                                   | `delete`    |
| File `.sol` (Solidity)                         | `feat`      |
| File mengandung `test` atau `spec`             | `test`      |
| File `.md`                                     | `docs`      |
| File `.env`, `.toml`, `.json`, `.yaml`, `.yml` | `chore`     |
| File mengandung `style` atau `.css`            | `style`     |
| File mengandung `config`                       | `chore`     |
| File mengandung `refactor`                     | `refactor`  |
| File baru ditambahkan (`A` / `??`)             | `feat`      |
| File dimodifikasi (`M`)                        | `refactor`  |
| File di-rename (`R`)                           | `refactor`  |
| Lainnya                                        | `chore`     |

Format pesan commit yang dihasilkan:

```
feat(src/Token.sol): tambah fitur staking
docs(README.md): update dokumentasi
chore(package.json): update dependencies
```

---

## Persiapan

Pastikan script punya izin eksekusi sebelum dijalankan:

```bash
chmod +x push.sh amend.sh
```

Script harus dijalankan dari dalam direktori Git repository yang valid.

---

## Kapan Pakai yang Mana?

- **`push.sh`** — untuk commit dan push biasa dengan timestamp waktu sekarang
- **`amend.sh`** — jika ingin commit-commit terlihat tersebar di rentang tanggal Januari 2025 (misalnya untuk keperluan tampilan contribution graph)

---

## Peringatan: Risiko Penggunaan `amend.sh`

> **PERHATIAN:** Manipulasi tanggal commit menggunakan `amend.sh` membawa sejumlah risiko yang perlu dipahami sebelum digunakan.

### Risiko dari GitHub

- **Penghapusan kontribusi dari grafik** — GitHub dapat mendeteksi pola commit yang tidak wajar dan menghapusnya dari contribution graph tanpa pemberitahuan.
- **Pembatasan atau penangguhan akun** — Penggunaan yang dianggap sebagai manipulasi aktivitas atau penyesatan (misleading behavior) dapat melanggar [GitHub Terms of Service](https://docs.github.com/en/site-policy/acceptable-use-policies/github-acceptable-use-policies), yang berpotensi berujung pada pembatasan akun.
- **Reputasi yang rusak** — Jika diketahui oleh recruiter, kolaborator, atau komunitas open source, riwayat commit yang dimanipulasi dapat merusak kredibilitas dan kepercayaan.

### Risiko Teknis

- **Kerusakan history kolaborasi** — `--force push` yang dilakukan setelah amend akan menimpa riwayat di remote. Pada repo yang digunakan bersama, ini dapat menyebabkan konflik serius bagi kontributor lain.
- **Kehilangan data** — Force push yang tidak hati-hati dapat menghapus commit orang lain yang belum di-merge.

### Penggunaan yang Aman vs Berisiko

| Penggunaan                                                     | Status   |
| -------------------------------------------------------------- | -------- |
| Merapikan commit lokal sebelum push pertama                    | Aman     |
| Memperbaiki pesan commit yang typo                             | Aman     |
| Menyesuaikan history di repo pribadi yang belum dipublikasikan | Aman     |
| Memalsukan tanggal untuk menipu grafik kontribusi              | Berisiko |
| Force push ke repo publik / yang sudah dikerjakan bersama      | Berisiko |
| Manipulasi history untuk portofolio atau rekrutmen             | Berisiko |

### Rekomendasi

Gunakan `amend.sh` hanya pada **repo pribadi yang tidak digunakan untuk kolaborasi** dan **bukan untuk tujuan menipu** pihak lain. Jika tujuan utamamu adalah membangun portofolio yang kuat, cara terbaik tetaplah berkontribusi secara konsisten dan jujur.
