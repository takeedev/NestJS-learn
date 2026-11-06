# NestJS Learn

โปรเจกต์ฝึกเขียน Backend API ด้วย NestJS มีตัวอย่าง Todo CRUD ที่เก็บข้อมูลใน PostgreSQL โดยรันฐานข้อมูลใน Docker และรัน NestJS บนเครื่อง

## เวอร์ชันและเครื่องมือ

| เครื่องมือหรือไลบรารี       | เวอร์ชัน              | ใช้ทำอะไร                                                           |
| --------------------------- | --------------------- | ------------------------------------------------------------------- |
| Node.js / mise              | Node.js `26.13.0`     | รันแอปและกำหนดเวอร์ชัน Node ใน `mise.toml`                          |
| NestJS / Express            | NestJS `12.3.3`       | จัดโครงสร้าง Module, Controller และ Service โดยใช้ Express รับ HTTP |
| TypeScript                  | `6.0.3`               | เขียนโค้ดแบบมีชนิดข้อมูล                                            |
| PostgreSQL / Docker Compose | อิมเมจ `postgres:17`  | รันฐานข้อมูลใน container และเก็บข้อมูลใน volume                     |
| `pg` / `@types/pg`          | `8.23.1`              | เชื่อม PostgreSQL ผ่าน connection pool และเขียน SQL โดยตรง          |
| Nest CLI / Schematics       | สาย `12.x`            | รันแอป, build และสร้างโครงไฟล์ด้วย `nest generate`                  |
| Vitest / Supertest          | `4.1.12` / `7.3.1`    | รัน unit test และทดสอบ HTTP แบบ E2E                                 |
| Oxlint / `oxlint-tsgolint`  | `1.91.0` / `7.0.2006` | ตรวจโค้ดและกฎที่ใช้ข้อมูลชนิดของ TypeScript                         |
| Prettier                    | `3.9.10`              | จัดรูปแบบโค้ด                                                       |

เวอร์ชันไลบรารีอ้างอิงจาก `package-lock.json` ใช้ `npm ci` เพื่อติดตั้งตาม lockfile ตัวโปรเจกต์มี `@nestjs/mau` สำหรับคำสั่ง deploy และใช้ `@vitest/coverage-v8` เมื่อรัน coverage

## เริ่มรันในเครื่อง

ต้องมี mise และ Docker พร้อมคำสั่ง `docker compose`

```bash
mise install
mise exec -- npm ci
docker compose up -d --wait postgres
mise exec -- npm run start:dev
```

API เปิดที่ `http://localhost:3000` โดยเปลี่ยนพอร์ตได้ผ่านตัวแปร `PORT` ส่วน PostgreSQL รับการเชื่อมต่อที่ `127.0.0.1:5432`

## ตั้งค่าฐานข้อมูล

`src/config/database.config.ts` อ่าน environment variables แล้วส่งค่าให้ `Pool` ใน `TodosService` ค่าเริ่มต้นด้านล่างตรงกับ PostgreSQL ใน Compose สำหรับใช้ในเครื่อง

| ตัวแปร       | ค่าเริ่มต้น  |
| ------------ | ------------ |
| `PGHOST`     | `127.0.0.1`  |
| `PGPORT`     | `5432`       |
| `PGUSER`     | `todo`       |
| `PGPASSWORD` | `todo_local` |
| `PGDATABASE` | `todos`      |

`postgres/init.sql` สร้างตาราง `todos` ครั้งแรกที่ PostgreSQL เตรียม volume ใหม่ ข้อมูลอยู่ใน volume `postgres-data` จึงอยู่ต่อหลังรีสตาร์ตแอปหรือ container หยุดฐานข้อมูลโดยเก็บข้อมูลไว้ได้ด้วย `docker compose stop postgres`

## ลองใช้ Todo API

```bash
curl http://localhost:3000/todos \
  -H 'Content-Type: application/json' \
  -d '{"title":"ฝึก NestJS"}'

curl http://localhost:3000/todos
```

| Method   | Path         | การทำงาน                                              |
| -------- | ------------ | ----------------------------------------------------- |
| `GET`    | `/`          | ตอบ `Hello World!`                                    |
| `GET`    | `/test`      | ตอบ `test`                                            |
| `POST`   | `/todos`     | สร้างรายการจาก `title` โดยเริ่มที่ `completed: false` |
| `GET`    | `/todos`     | ดูรายการทั้งหมด                                       |
| `GET`    | `/todos/:id` | ดูรายการตาม ID                                        |
| `PUT`    | `/todos/:id` | แก้รายการ โดยส่งทั้ง `title` และ `completed`          |
| `DELETE` | `/todos/:id` | ลบรายการและตอบ `204 No Content`                       |

## อ่านโค้ดจากตรงไหน

- `src/main.ts` สตาร์ต NestJS ส่วน `src/app.module.ts` ลงทะเบียน `TodosModule`
- `src/todos/todos.controller.ts` รับ HTTP request และตรวจข้อมูลก่อนส่งให้ Service
- `src/todos/todos.service.ts` ใช้ SQL แบบมีพารามิเตอร์เพื่ออ่านและเขียน PostgreSQL
- `src/config/database.config.ts` รวมค่าเชื่อมต่อฐานข้อมูล
- `compose.yaml` กำหนด PostgreSQL container, พอร์ต และ volume
- `postgres/init.sql` กำหนดโครงสร้างตาราง

## คำสั่งพัฒนา

```bash
mise exec -- npm run build
mise exec -- npm run lint
mise exec -- npm test
mise exec -- npm run test:e2e
mise exec -- npm run test:cov
```

Unit test และ E2E test ที่อยู่ใน repo ทดสอบ endpoint หลัก `GET /` ส่วนการลอง Todo API ผ่าน HTTP ต้องเปิด PostgreSQL ก่อน รายละเอียดการตั้ง NestJS Observe สำหรับ telemetry อยู่ใน `AGENTS.md`
