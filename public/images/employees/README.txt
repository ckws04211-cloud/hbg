사원증 이미지 배치 폴더
=====================

- 권장 비율: 1536 x 1024 (3:2)
- 지원 형식: PNG (JPG, WebP도 가능)
- 파일명 규칙: {name}.png (employees.json의 name과 동일)

예시:
  김민수.png  →  "name": "김민수", "image": "/images/employees/김민수.png"

데이터 필드:
  name           이름 (유니크, URL 식별자)
  employeeNumber 사원번호
  rank           직급
  arcana         아르카나 (마비노기 직업)
  quote          대사
  color          메인 색상 (HEX, 예: #FF6B35)
  image          이미지 경로
