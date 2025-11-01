# Fix Lỗi Collation trong SQL Scripts

## Vấn đề:

Khi chạy SQL scripts, bạn có thể gặp lỗi:
```
SQL Error (1267): Illegal mix of collations (utf8mb4_0900_ai_ci,IMPLICIT) and (utf8mb4_general_ci,IMPLICIT) for operation '='
```

## Nguyên nhân:

Database của bạn có các column với collation khác nhau:
- Một số column dùng `utf8mb4_0900_ai_ci`
- Một số column dùng `utf8mb4_general_ci`

Khi so sánh các string từ các collation khác nhau, MySQL sẽ báo lỗi.

## Giải pháp:

Đã fix tất cả các scripts bằng cách sử dụng `BINARY` comparison:

### Trước (sẽ lỗi):
```sql
WHERE username = 'doctor1'
```

### Sau (đã fix):
```sql
WHERE BINARY username = BINARY 'doctor1'
```

## Scripts đã được fix:

✅ `database/create_doctor.sql`
✅ `database/create_doctor_complete.sql`
✅ `database/create_multiple_doctors.sql`

## Các cách khác để fix collation:

### Cách 1: Sử dụng BINARY (Đã áp dụng)
```sql
WHERE BINARY username = BINARY 'doctor1'
```

### Cách 2: Sử dụng COLLATE
```sql
WHERE username COLLATE utf8mb4_0900_ai_ci = 'doctor1' COLLATE utf8mb4_0900_ai_ci
```

### Cách 3: Thay đổi collation của column (Permanent fix)
```sql
ALTER TABLE users MODIFY username VARCHAR(50) COLLATE utf8mb4_0900_ai_ci;
```

## Nếu vẫn gặp lỗi:

1. Kiểm tra collation của các column:
```sql
SHOW FULL COLUMNS FROM users LIKE 'username';
```

2. Sử dụng BINARY trong tất cả các so sánh string trong script của bạn

3. Hoặc thống nhất collation cho toàn bộ database:
```sql
ALTER DATABASE your_database_name CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
```

## Lưu ý:

- `BINARY` comparison sẽ làm cho so sánh case-sensitive (phân biệt hoa thường)
- Điều này thường OK vì username nên là case-sensitive

