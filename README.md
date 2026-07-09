# FutureWealth FOMO & RETIRE v1.3.0

서비스 배포용 통합 릴리스입니다.

## 포함 기능

- 초보용: “그때 투자했다면 지금 얼마?” 과거 투자 시뮬레이터
- 고급형: “앞으로 투자하면 은퇴 후 어떤 미래?” 은퇴/현금흐름 시뮬레이터
- 한국어 / 루마니아어 / 영어 다국어 지원
- 우측 하단 언어 선택기 및 브라우저 언어 자동 감지
- 모바일 입력 중 자동 스크롤 방지
- 고급형 CAGR/배당률 사용자 입력 제거
- 자산 데이터 기반 자동 CAGR/배당률 적용
- ETF/자산 정보 카드
- 생년월 기반 은퇴/연금 시작 시점 자동 계산
- 4% / 5% / 6% / 7% 인출률 버튼
- 은퇴 이후 월 현금흐름 그래프
- Cloudflare Pages 배포 구조
- 향후 가격 API 업데이트를 위한 scripts 구조

## 배포 방법

1. ZIP 압축 해제
2. 폴더 안의 내용 전체를 GitHub 저장소 루트에 업로드
3. Cloudflare Pages 설정
   - Framework preset: None
   - Build command: 비움
   - Build output directory: `public`
   - Root directory: 비움
4. 배포 완료 후 사이트 확인

## 폴더 구조

```text
public/
  index.html
  beginner.html
  advanced.html
  data/
    assets.json
    prices.json
  locales/
    ko.json
    ro.json
    en.json
  js/
    i18n.js
scripts/
  update_prices.js
  bootstrap_history.js
  market_data_lib.js
docs/
  CLOUDFLARE_PAGES_GUIDE.md
  GITHUB_UPLOAD_GUIDE.md
  ROADMAP.md
```

## 주의

현재 가격 데이터와 과거 가격 데이터는 MVP용 샘플/기준 데이터입니다. 실제 서비스 정확도를 높이려면 API 기반 가격 업데이트를 활성화해야 합니다.
