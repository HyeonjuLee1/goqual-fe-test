# 고퀄 과제

CoreUI Free React Admin Template을 기반으로 만든 간단한 IoT 대시보드 애플리케이션 실습 과제입니다.

## 📌 Project Setup

```sh
npm install
```

<br />

개발 서버 실행

```sh
npm run start
```

## 🛠️ 기술 스택

- React 18
- CoreUI React Admin Template
- React Router (HashRouter)
- Axios
- Font Awesome

## 🔐 주요 기능

### 1. 사용자 로그인 (Login.js)

- `/login` 경로에서 아이디/비밀번호 입력으로 로그인
- 로그인 성공 시 `token`이 localStorage에 저장되며 대시보드로 리디렉션
- 잘못된 정보 입력 시 에러 메시지 출력

### 2. 인증 기반 라우팅

- 로그인 여부(`token`)에 따라 라우팅 분기
- 로그인 O: `DefaultLayout` 진입 (Dashboard 진입)
- 로그인 X: `/login` 페이지로 리디렉션

### 3. 기기 상태 조회 대시보드 (DeviceDashboard.js)

- 로그인 시 기본 경로(`/`)로 이동하면 대시보드 출력
- 로그인 세션 만료시 로그인페이지로 이동
- deviceId 값을 React Context로 전역 관리
- 상태 변화가 복잡하지 않아서 Context만으로도 충분하다고 판단하여 React Context사용

#### 3-1. 기기 상태 차트 (MainChart.js)

- 기기 상태 확인 차트 출력
- wh40batt, baromrelin, soilad1, rainratein 최근 10분간 데이터를 조회
- X축 시간 라벨(HH:mm) / Y축 자동 스케일링
- 로딩 중 스피너(CSpinner) 출력
- 실시간 반영: 평균 interval 값을 계산하여 해당 간격으로 10분 간의 데이터 주기적 갱신
- 평균 변경 간격(Interval) 값을 계산하여 화면에 출력

#### 3-2. 전구 제어 대시보드 (BrightnessControl.js)

- 슬라이더를 통해 밝기(0~100%) 값 조절, 현재 밝기 % 실시간 출력
- `FontAwesome` 전구 아이콘의 색상(투명도)을 통해 현재 밝기 시각화
- 슬라이더와 아이콘 스타일 커스터마이징 적용
- 슬라이더를 통해 밝기 변경 시 디바이스 제어 API 호출
- 밝기 값에 따라 전구 아이콘에 빛나는 효과(glow) 적용
- 슬라이더 좌우에 밝고 어두운 전구 아이콘 배치 → 밝기 방향 직관적으로 표현
- 슬라이더 아래 도움말 텍스트 추가 → "슬라이더를 움직여 밝기를 조절해주세요."

### 4. 오류 페이지

- `/404`, `/500` 경로 대응
