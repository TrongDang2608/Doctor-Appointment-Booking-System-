# Environment Variables Setup

## Database Configuration

Tạo file `.env` trong thư mục `backend/` với nội dung sau:

```env
# Database Configuration
DB_URL=jdbc:mysql://your-database-host:port/database_name?ssl-mode=REQUIRED
DB_USERNAME=your_username
DB_PASSWORD=your_aiven_password_here

# JWT Configuration
JWT_SECRET=defaultSecretKeyForDevelopmentOnlyChangeThisInProduction123456789012345678901234567890
JWT_EXPIRATION=86400000
JWT_REFRESH_EXPIRATION=604800000
```

## Hoặc set Environment Variables

### Windows (PowerShell)
```powershell
$env:DB_URL="jdbc:mysql://doctorbooking-huynhphongdat2005-ea0d.h.aivencloud.com:13499/defaultdb?ssl-mode=REQUIRED"
$env:DB_USERNAME="avnadmin"
$env:DB_PASSWORD="AVNS_XGrOoEvia23LMg2jPX3"
$env:JWT_SECRET="defaultSecretKeyForDevelopmentOnlyChangeThisInProduction123456789012345678901234567890"
$env:JWT_EXPIRATION="86400000"
$env:JWT_REFRESH_EXPIRATION="604800000"
```

### Windows (CMD)
```cmd
set DB_URL=jdbc:mysql://your-database-host:port/database_name?ssl-mode=REQUIRED
set DB_USERNAME=your_username
set DB_PASSWORD=your_aiven_password_here
set JWT_SECRET=defaultSecretKeyForDevelopmentOnlyChangeThisInProduction123456789012345678901234567890
set JWT_EXPIRATION=86400000
set JWT_REFRESH_EXPIRATION=604800000
```

### Linux/Mac
```bash
export DB_URL="jdbc:mysql://doctorbooking-huynhphongdat2005-ea0d.h.aivencloud.com:13499/defaultdb?ssl-mode=REQUIRED"
export DB_USERNAME="avnadmin"
export DB_PASSWORD="AVNS_XGrOoEvia23LMg2jPX3"
export JWT_SECRET="defaultSecretKeyForDevelopmentOnlyChangeThisInProduction123456789012345678901234567890"
export JWT_EXPIRATION="86400000"
export JWT_REFRESH_EXPIRATION="604800000"
```

## Lưu ý

- **QUAN TRỌNG**: `DB_URL` phải bắt đầu với `jdbc:mysql://` không phải `mysql://`
- File `.env` sẽ tự động được load bởi `spring-dotenv` dependency
- Không commit file `.env` vào Git (đã có trong .gitignore)

