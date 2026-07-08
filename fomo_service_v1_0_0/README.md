# FutureWealth FOMO & RETIRE v1.0.0

초보자용 **FOMO** 계산기와 고급형 **RETIRE** 은퇴 현금흐름 시뮬레이터를 하나로 묶은 1차 서비스 버전입니다.

## 서비스 컨셉

- **FOMO / 초보용**: “그때 투자했다면 지금 얼마였을까?”
- **RETIRE / 고급형**: “앞으로 투자하면 은퇴 후 어떤 미래가 펼쳐질까?”

## GitHub에 올릴 때

이 폴더 안의 파일과 폴더를 GitHub 저장소 최상단에 그대로 업로드하세요.

```text
.github/
docs/
public/
scripts/
package.json
README.md
```

## Cloudflare Pages 배포 설정

- Framework preset: **None**
- Build command: 비워두기
- Output directory: **public**
- Root directory: 비워두기

배포 후 기본 주소는 보통 아래처럼 생성됩니다.

```text
https://프로젝트명.pages.dev
```

## 로컬 실행

브라우저에서 HTML을 직접 열면 JSON 로딩이 막힐 수 있으므로 간단 서버로 실행하세요.

```bash
npm run serve
```

그 다음 브라우저에서 아래 주소 접속:

```text
http://localhost:8000
```

## 가격 데이터 구조

가격과 자산 정보는 앱과 분리되어 있습니다.

```text
public/data/assets.json
public/data/prices.json
public/data/update-log.json
```

나중에 가격 API를 연결하면 `public/data/prices.json`만 매일 갱신하면 됩니다.

## 자동 가격 업데이트

```bash
npm run update:prices
```

테스트만 하고 파일을 바꾸지 않으려면:

```bash
npm run update:prices:dry
```

GitHub Actions는 `.github/workflows/update-prices.yml`에 포함되어 있습니다.

## 주의사항

- 현재 가격 데이터는 무료 데이터 제공자 연결을 위한 서비스 준비 구조입니다.
- 실제 공개 운영 시 데이터 제공자의 이용약관과 상업적 사용 가능 여부를 확인해야 합니다.
- 본 서비스는 투자 참고용 시뮬레이터이며 투자 수익을 보장하지 않습니다.
