# FutureWealth FOMO & RETIRE v1.2.0

서비스용 다국어 MVP 패키지입니다.

## 주요 기능

- 초보자용 FOMO: 과거 특정 시점에 투자했다면 현재 얼마인지 계산
- 고급형 RETIRE: 앞으로 투자하면 은퇴 후 자산과 현금흐름이 어떻게 변하는지 계산
- 한국어 / 루마니아어 / 영어 지원
- 브라우저 언어 자동 감지
- 우측 하단 언어 선택기
- 선택 언어 localStorage 저장
- 자산 데이터와 가격 데이터 JSON 분리 구조 유지

## 배포

Cloudflare Pages 설정:

- Framework preset: None
- Build command: 비움
- Build output directory: public

## 파일 구조

```
public/
  index.html
  beginner.html
  advanced.html
  js/i18n.js
  locales/ko.json
  locales/ro.json
  locales/en.json
  data/assets.json
  data/prices.json
```

## 주의

현재 번역은 정적 UI 중심입니다. 일부 계산 결과 문구와 동적 알림은 다음 버전에서 더 세밀하게 분리할 수 있습니다.


## v1.2.1
- 모바일에서 입력값 변경 시 결과 영역으로 자동 스크롤되는 문제를 수정했습니다.
- 결과 영역 이동은 초보자 모드에서 계산 버튼을 직접 눌렀을 때만 발생합니다.
