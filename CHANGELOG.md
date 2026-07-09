# Changelog

## v1.3.0 - Stable integrated release
- v1.2.0 다국어 기능과 v1.2.1 모바일 자동 스크롤 수정 통합
- 한국어 / 루마니아어 / 영어 지원 유지
- 고급형 자동 CAGR/배당률 적용 유지
- 개인 투자 계획처럼 보이는 기본값 제거 유지
- Cloudflare Pages 배포용 기준 릴리스로 정리
- README 및 버전 표기 정리


## v1.2.1 - Mobile scroll UX fix
- Fixed mobile UX issue where realtime recalculation automatically scrolled to the result section whenever inputs changed.
- Beginner mode now scrolls to results only when the user explicitly presses the calculate button.


## v1.2.0

- 한국어 / 루마니아어 / 영어 3개 언어 지원 추가
- `public/locales/ko.json`, `ro.json`, `en.json` 추가
- `public/js/i18n.js` 추가
- 브라우저 언어 자동 감지
- 우측 하단 언어 선택기 추가
- 선택 언어 localStorage 저장
- 랜딩/초보자/고급형 주요 UI 문구 번역

## v1.1.0

- 고급형 CAGR/배당률 사용자 입력 제거
- 자산 데이터 기반 자동 지표 적용
- 자산 정보 버튼 추가
