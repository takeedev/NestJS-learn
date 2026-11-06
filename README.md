# NestJS Learn

โปรเจกต์ฝึกเขียน Backend API ด้วย NestJS มีตัวอย่าง Todo CRUD และ Notes API ที่เก็บข้อมูลใน PostgreSQL โดยรันฐานข้อมูลใน Docker และรัน NestJS บนเครื่อง

## เวอร์ชันและเครื่องมือ

| เครื่องมือหรือไลบรารี       | เวอร์ชัน              | ใช้ทำอะไร                                                           |
| --------------------------- | --------------------- | ------------------------------------------------------------------- |
| Node.js / mise              | Node.js `26.13.0`     | รันแอปและกำหนดเวอร์ชัน Node ใน `mise.toml`                          |
| NestJS / Express            | NestJS `12.3.3`       | จัดโครงสร้าง Module, Controller และ Service โดยใช้ Express รับ HTTP |
| TypeScript                  | `6.0.3`               | เขียนโค้ดแบบมีชนิดข้อมูล                                            |
| PostgreSQL / Docker Compose | อิมเมจ `postgres:17`  | รันฐานข้อมูลใน container และเก็บข้อมูลใน volume                     |
| `@nestjs/config`            | `12.1.0`              | โหลด `.env` และจัดกลุ่ม config สำหรับ NestJS                        |
| `@nestjs/swagger`           | `12.1.0`              | สร้าง OpenAPI และเปิด Swagger UI ให้ลองเรียก API                    |
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

## เลือก environment และตั้งค่าฐานข้อมูล

ตั้ง `APP_ENV` ใน shell ก่อนรันแอป แล้ว `ConfigModule` จะเลือกไฟล์จาก root ของโปรเจกต์ตามตารางนี้

| `APP_ENV`             | ไฟล์ที่อ่าน                              |
| --------------------- | ---------------------------------------- |
| `local` (ค่าเริ่มต้น) | `.env.local` แล้วเติมค่าที่ขาดจาก `.env` |
| `sit`                 | `.env.sit`                               |
| `uat`                 | `.env.uat`                               |
| `prod`                | `.env.prod`                              |

ค่าที่ตั้งไว้ใน shell หรือส่งเข้ามาจากระบบ deploy มีลำดับสูงกว่าไฟล์ env Git ignore ไฟล์ env ยกเว้น `.env.sit` และ `.env.uat` ซึ่งเก็บค่าจำลองไว้สำหรับเรียน

ไฟล์ `.env.sit` ในโปรเจกต์ใช้ค่าจำลอง ตัวอย่างค่าที่ใช้ตั้งค่า SIT มีดังนี้

```dotenv
PORT=3001
PGHOST=your-sit-db-host
PGPORT=5432
PGUSER=your-sit-db-user
PGPASSWORD=your-sit-db-password
PGDATABASE=todos
SWAGGER_ENABLED=false
```

```bash
APP_ENV=sit mise exec -- npm run start:dev
APP_ENV=uat mise exec -- npm run start:dev
APP_ENV=prod mise exec -- npm run start:prod # รัน build ก่อน
```

ไฟล์ตัวอย่างกำหนดพอร์ต HTTP ของ SIT เป็น `3001` และ UAT เป็น `3002` ผ่าน `PORT` ส่วน `PGPORT` เป็นพอร์ตของ PostgreSQL

สำหรับ `sit`, `uat` และ `prod` แอปต้องได้รับ `PGHOST`, `PGUSER`, `PGPASSWORD` และ `PGDATABASE` ผ่านไฟล์ของสภาพแวดล้อมนั้นหรือ environment variables หากไม่ตั้ง `PGPORT` จะใช้ `5432` และถ้าตั้งผิดแอปจะแจ้งตอนเริ่มรัน

สำหรับ `local` ค่าเริ่มต้นตรงกับ PostgreSQL ใน Compose จึงรันได้ทันทีโดยไม่ต้องสร้างไฟล์ env

| ตัวแปร       | ค่าเริ่มต้นสำหรับ local |
| ------------ | ----------------------- |
| `PGHOST`     | `127.0.0.1`             |
| `PGPORT`     | `5432`                  |
| `PGUSER`     | `todo`                  |
| `PGPASSWORD` | `todo_local`            |
| `PGDATABASE` | `todos`                 |

`postgres/init.sql` สร้างตาราง `todos` และ `notes` ครั้งแรกที่ PostgreSQL เตรียม volume ใหม่ ข้อมูลอยู่ใน volume `postgres-data` จึงอยู่ต่อหลังรีสตาร์ตแอปหรือ container หยุดฐานข้อมูลโดยเก็บข้อมูลไว้ได้ด้วย `docker compose stop postgres`

## ลองใช้ Todo API

ตั้ง `SWAGGER_ENABLED=true` ในไฟล์ env ของ environment ที่ใช้หรือใน shell เพื่อเปิด Swagger และใช้ `false` เพื่อปิด ถ้าไม่ได้ตั้งค่า แอปจะเปิด Swagger เฉพาะ `local` ตัวอย่าง `.env.sit` และ `.env.uat` ตั้งไว้เป็น `false`

```bash
APP_ENV=sit SWAGGER_ENABLED=true mise exec -- npm run start:dev
```

เมื่อเปิดแล้ว เข้า Swagger UI ที่ [localhost:3001/docs](http://localhost:3001/docs) สำหรับ SIT หรือ [localhost:3000/docs](http://localhost:3000/docs) สำหรับ local แล้วเลือก **Todos** → **Try it out** → **Execute** เพื่อส่ง request จริง ดู OpenAPI JSON ได้ที่ `/docs-json` การลองคำสั่ง Todo ต้องใช้ PostgreSQL ที่แอปเข้าถึงได้

```bash
curl http://localhost:3000/todos \
  -H 'Content-Type: application/json' \
  -d '{"title":"ฝึก NestJS"}'

curl http://localhost:3000/todos
```

| Method   | Path                   | การทำงาน                                                           |
| -------- | ---------------------- | ------------------------------------------------------------------ |
| `GET`    | `/`                    | ตอบ `Hello World!`                                                 |
| `GET`    | `/test`                | ตอบ `test`                                                         |
| `POST`   | `/todos`               | สร้างรายการจาก `title` โดยเริ่มที่ `completed: false`              |
| `GET`    | `/todos`               | ดูรายการทั้งหมด                                                    |
| `GET`    | `/todos/:id`           | ดูรายการตาม ID                                                     |
| `PUT`    | `/todos/:id`           | แก้รายการ โดยส่งทั้ง `title` และ `completed`                       |
| `PATCH`  | `/todos/:id/completed` | เปลี่ยนสถานะโดยส่ง `{"completed":true}` หรือ `{"completed":false}` |
| `DELETE` | `/todos/:id`           | ลบรายการและตอบ `204 No Content`                                    |

## ลองใช้ Notes API

เปิด Swagger UI แล้วเลือกกลุ่ม **Notes** ใช้ `POST /notes` พร้อม body
`{"content":"ฝึกทำ API ด้วย NestJS"}` เพื่อสร้างโน้ต แล้วใช้ `GET /notes` เพื่อดูรายการ

ถ้ามี Docker volume จากก่อนเพิ่ม Notes ให้รันคำสั่งนี้เพื่อสร้างตารางเพิ่มในฐานข้อมูลเดิม

```bash
docker compose exec -T postgres psql -v ON_ERROR_STOP=1 -U todo -d todos < postgres/init.sql
```

## อ่านโค้ดจากตรงไหน

- `src/main.ts` สตาร์ต NestJS ส่วน `src/app.module.ts` ลงทะเบียน `TodosModule` และ `NotesModule`
- `src/todos/todos.controller.ts` รับ HTTP request และตรวจข้อมูลก่อนส่งให้ Service
- `src/todos/todos.service.ts` ใช้ SQL แบบมีพารามิเตอร์เพื่ออ่านและเขียน PostgreSQL
- `src/config/app-environment.ts` เลือกไฟล์ตาม `APP_ENV`
- `src/config/database.config.ts` จัดกลุ่มค่าเชื่อมต่อฐานข้อมูลและส่งให้ `DatabaseService` ผ่าน dependency injection
- `src/database/database.module.ts` ใช้ `@Global()` และ import ใน `AppModule` ครั้งเดียว เพื่อให้ Todo และ Notes inject `DatabaseService` และใช้ PostgreSQL Pool ร่วมกัน
- `src/notes/` แยก Controller และ Service สำหรับสร้างและอ่านโน้ต
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
