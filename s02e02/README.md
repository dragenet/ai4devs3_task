# s02e02

## Setup

To install dependencies:

```bash
bun install
```

Segmentate maps into fragments:

```bash
bun run src/segmentation.ts
```

Run the app:

```bash
bun run src/app.ts
```

## Task

Na podstawie dostarczonych w teczce fragmentów mapy, korzystając także z podpowiedzi z treści filmu powyżej, określ, z jakiego miasta one pochodzą. Pamiętaj, że jeden z fragmentów mapy może być błędny i może pochodzić z innego miasta. Użyj do tego celu modelu zdolnego do rozpoznawania obrazu. Wyślij nam do centrali nazwę tej miejscowości jako flagę.

Co należy zrobić w zadaniu?

1. Na podstawie mapy z teczki (papierowej lub [elektronicznej](./resources/)) przygotuj cztery grafiki z czterema elementami mapy. Wykonanie fotek a pomocą smartfona pozwoli Ci zrozumieć, jak dokładny bywa model przy pracy z tego rodzaju skanami dokumentów przy różnych warunkach oświetlenia.

2. Użyj dowolnego modułu typu Vision, do rozpoznania co jest na obrazach (możesz użyć GPT-4o, który potrafi świetnie poradzić sobie z inputem graficznym)

3. W ramach dodatkowego prompta określ, co jest zadaniem, jakie informacje posiadasz i czego oczekujesz od modelu.

4. Otrzymaną nazwę miasta zgłoś do centrali jako flagę (przez UI. W tym zadaniu nie używamy API)

UWAGA: wielu agentów rozpoznało jakie to miasto za pomocą technik OSINT-owych. To świetne podejście, ale nie na szkoleniu z LLM. Zachęcamy do zapoznania się z tym, jak wygląda praca z modelami do rozpoznawania obrazów.
