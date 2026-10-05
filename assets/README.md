# 메인 비주얼 제작 기록

## 현재: Windows 패널

- 첫 화면은 index.html의 네 패널과 styles.css의 3D 변형·그라데이션으로 구성합니다.
- app.js에서 포인터 기울기, 스크롤 분리와 회전을 제어합니다.
- 외부 이미지 요청 없이 반응형으로 표시합니다. 기존 PNG를 편집한 이미지가 아닙니다.
- Windows를 표현한 스타일화된 연구용 비주얼이며 Microsoft와의 제휴를 의미하지 않습니다.

## 이전 비주얼 — 원본 보관

- 파일: [research-knot.png](research-knot.png)
- 이전 용도: TRACE 첫 화면의 금속 질감 입체 오브젝트
- 생성 방식: 내장 `image_gen` 도구 (CLI/API 우회 없음)
- 이미지: 1254 × 1254 PNG, 원본 그대로 사용
- 현재 화면이나 새 빌드에서는 사용하지 않습니다. 되돌릴 수 있도록 원본 PNG를 보관하며 변경하지 않았습니다.
- 제작 방향: 탐구와 연결을 표현하는 추상적인 매듭. 참고 사이트의 로고나 이미지는 입력하거나 복제하지 않았습니다.

## 최종 프롬프트

```text
Use case: stylized-concept. Asset type: original hero artwork for a premium independent security research portfolio website. Create one extraordinary sculptural polished chrome object: two thick interlocking rounded triangular Mobius loops, like a continuous impossible knot, a metaphor for tracing complex systems. This is abstract sculpture, NOT a logo, NOT a shield, NOT a padlock. Highly polished silver titanium with fine brushed details and crisp specular reflections, cool electric blue reflected highlights concentrated along the inner curves, mostly silver and black. Scene: pure near-black studio backdrop (#080a0e), absolutely empty with no floor, no stars, no particles, no text or icons. Composition: square, floating object centered, entire sculpture visible occupying 75 percent of the frame with comfortable empty margins, dramatic three-quarter view. Style: exceptionally photorealistic luxury industrial product render, sculptural, rich deep blacks, clean highlights, not illustration or cartoon. Strong white strip softbox from upper left, soft electric blue rim light from lower right. Avoid visual clutter, other props, glowing neon tube appearance, labels, letters, words, watermarks. Produce just the artwork, no website UI.
```
