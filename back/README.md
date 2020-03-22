# 설정
## DB 연결정보 지정
`ormconfig.json`을 작성합니다.
```json
{
  "type": "mysql",
  "host": "localhost",
  "port": 3306,
  "username": "test",
  "password": "test",
  "database": "test",
  "entities": ["src/models/*.ts"],
  "migrations": ["migration/*.ts"],
  "cli": {
    "migrationsDir": "migration"
  }
}
```
# 개발
## 마이그레이션
### 생성
```bash
npm run typeorm migration:generate -- -n (마이그레이션 이름)
```
마이그레이션 이름은 PascalCase로 작성합니다. (ex. CreateUser, AlterPayment)

### 실행