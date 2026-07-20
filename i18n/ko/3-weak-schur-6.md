# 1 — 약한 Schur 수 WS(6): 하한 갱신하기

## 문제

정수 집합이 *서로 다른* 세 원소 x, y, z로서 x + y = z를 만족하는 것을 하나도 포함하지 않을 때, 그 집합을 **weakly sum-free**(약하게 합이 없는 집합)라고 합니다. 약한 Schur 수(weak Schur number) WS(k)는 {1, 2, …, n}을 weakly sum-free인 k개의 부분으로 분할할 수 있는 가장 큰 n으로 정의됩니다.

정확한 값이 알려진 것은 WS(1)=2, WS(2)=8, WS(3)=23, WS(4)=66까지입니다. WS(5)부터 이미 미해결이며(현재 최선의 하한은 196으로, 1952년부터 이것이 정확한 값이라고 추측되어 왔지만 증명은 없습니다), **WS(6)은 완전히 열려 있는 문제입니다.**

더 큰 n에 대해 유효한 분할을 하나 찾을 때마다, 그것이 곧 WS(6)의 새로운 하한이 됩니다. 인용 가능한, 진짜 수학적 사실입니다.

## 점수

`score = n`, 즉 분할이 커버하는 가장 큰 정수입니다. n이 클수록 하한 WS(6) ≥ n도 그만큼 강해집니다.

## Witness 형식

```json
{
  "mission": "1-weak-schur-6",
  "author": "your-handle",
  "date": "YYYY-MM-DD",
  "score": 160,
  "witness": {
    "parts": [[1, 2, 4, ...], [3, 5, ...], ...]
  }
}
```

- `parts`는 정수 리스트 **정확히 6개**로 이루어진 리스트입니다.
- 전체적으로 1..n의 각 정수를 정확히 한 번씩 포함해야 합니다(n = score).
- 어느 부분에도 서로 다른 x, y, z가 x + y = z를 만족하는 경우가 있어서는 안 됩니다.

검증 방법: `python3 verify.py <witness.json>`

## 문헌상 기록

WS(6) ≥ 646 — Ageron 외, *New lower bounds for Schur and weak Schur numbers*([arXiv:2112.03175](https://arxiv.org/abs/2112.03175)). 그 이전 기록은 ≥ 582(Eliahou 외, 2013), ≥ 572(2012)입니다. 646의 witness는 아직 `records/`에 수록되어 있지 않으므로, 여기서 검증 가능한 형태로 재현하면 그 자체가 기록으로 인정됩니다.

## 알려진 접근법

- 탐욕(greedy)/first-fit에 무작위 재시작을 결합하면 150은 금방 넘길 수 있습니다.
- 500을 넘는 기록들은 타부 탐색(tabu search)과 몬테카를로 트리 탐색으로 얻어졌습니다(Bouzy, *Investigating Monte-Carlo Methods on the Weak Schur Problem* 참고).
- 현재 최고 하한을 뒷받침하는 것은 템플릿/주기적 구성("symmetric sum-free partitions")입니다. 구성 방식은 위 arXiv 논문을 참고하십시오.
- SAT 인코딩은 작은 n에서의 검증형 탐색에는 유효하지만 확장성이 떨어집니다. 템플릿 + SAT 하이브리드는 아직 아무도 시도하지 않은 영역입니다.
