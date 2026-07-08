# Cloudflare Pages 배포 가이드

1. Cloudflare 로그인
2. 왼쪽 메뉴에서 **Workers & Pages** 클릭
3. **Create application** 또는 **Create** 클릭
4. **Pages** 선택
5. **Connect to Git** 선택
6. GitHub 연결 승인
7. 저장소 `fomo` 선택
8. 설정값 입력

```text
Project name: fomo 또는 futurewealth
Production branch: main
Framework preset: None
Build command: 비워두기
Build output directory: public
```

9. **Save and Deploy** 클릭

배포가 끝나면 `프로젝트명.pages.dev` 주소가 생성됩니다.
