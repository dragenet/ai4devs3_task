# s03e02

## Setup

To install dependencies:

```bash
bun install
```

To fill database with documents from resources:

```bash
bun run src/collect.ts
```

To run

```bash
bun run src/app.ts
```

## Task

Centrala złamała hasło do pliku ZIP, który wysłaliśmy wczoraj.

Brzmi ono:

1670

> Rozpakowana zawartość archiwum weapons_tests.zip znajduje się w folderze [resources](./resources)

W archiwum weapons_tests.zip znajdziesz raporty z testów nowoczesnej broni. Zaindeksuj je z użyciem embeddingów w swojej bazie wektorowej, a następnie odpowiedz na pytanie:

Edit 2024-11-19 10:54 CET: Którego dnia skradziono prototyp broni?
W raporcie, z którego dnia znajduje się wzmianka o kradzieży prototypu broni?

Oczekiwana jest odpowiedź w formacie YYYY-MM-DD

Nazwa zadania w centrali to wektory.

Co należy zrobić w zadaniu?

Pobierz archiwum z poprzedniej lekcji https://centrala.ag3nts.org/dane/pliki_z_fabryki.zip

Rozpakuj znajdujące się w nim zaszyfrowane archiwum weapons_tests.zip za pomocą hasła: 1670

Zaindeksuj z użyciem dowolnego modelu do embeddingów (OpenAI ma ich aż trzy) raporty w swojej bazie danych

Zadbaj, aby metadane trzymane wraz z wektorami zawierały datę raportu (mogą zawierać więcej szczegółów, ale to Twoja decyzja)

Utwórz embedding z pytania “W raporcie, z którego dnia znajduje się wzmianka o kradzieży prototypu broni?” i odpytaj nim swoją bazę danych, ustawiając limit zwracanych rekordów na 1. Jeśli baza nie będzie zwracać odpowiednich rezultatów, wzbogać raporty o odpowiednie metadane w sposób, w jaki robiliśmy to wczoraj.

Sprawdź jaką datę zwróciła baza do powyższego zapytania i wyślij ją w polu “answer” do centrali (/report) w formacie YYYY-MM-DD do zadania wektory.

Jeśli data jest poprawna, otrzymasz w odpowiedzi flagę do zadania

> **Wyjaśnienie:** To zadanie ze względu na miniaturowy rozmiar zestawu danych można
> oczywiście wykonać za pomocą jednego prompta i nie potrzebujesz do niego bazy
> wektorowej. Celem ćwiczenia jest jednak zaznajomienie się z działaniem tego typu
> baz i zachęcenie Cię do przynajmniej jednokrotnego wykorzystania takiej bazy w
> praktyce. Spróbuj więc wykonać ćwiczenie zgodnie z jego założeniami.
