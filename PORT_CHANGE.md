# Port Change: Backend 8080 → 7070

## Đã cập nhật

### Backend
- ✅ `backend/src/main/resources/application.properties`
  - `server.port=7070`

### Frontend
- ✅ `frontend/src/config/api.js`
  - Default API URL: `http://localhost:7070/api`
- ✅ `frontend/src/utils/constants.js`
  - Default API URL: `http://localhost:7070/api`
- ✅ `frontend/vite.config.js`
  - Proxy target: `http://localhost:7070`

## CORS Configuration

CORS đã được cấu hình để cho phép tất cả localhost ports, nên không cần thay đổi:
```java
configuration.setAllowedOriginPatterns(List.of(
    "http://localhost:*",
    "http://127.0.0.1:*"
));
```

## Environment Variables (Optional)

Nếu bạn muốn override bằng environment variable:

**Frontend `.env`:**
```env
VITE_API_BASE_URL=http://localhost:7070/api
```

**Backend `.env`:**
```env
SERVER_PORT=7070
```

## Sau khi thay đổi

1. **Restart Backend**
   - Backend sẽ chạy tại: `http://localhost:7070`

2. **Restart Frontend** (nếu đang chạy)
   - Frontend sẽ gọi API đến: `http://localhost:7070/api`

3. **Test Connection**
   ```
   GET http://localhost:7070/api/test/db-check
   ```

## Lưu ý

- CORS đã được cấu hình để cho phép mọi localhost port, nên không cần thay đổi CORS config
- Nếu có hardcode URL nào trong code, cần update
- Browser cache có thể cần clear

