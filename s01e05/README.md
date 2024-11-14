# s01e05

## Setup

### App

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run src/app.ts
```

### Promptfoo

Install:

```bash
npm install -g promptfoo
```

Set API keys:

```bash
export OPENAI_API_KEY=<your-openai-api-key>
```

Evaluate:

```bash
promptfoo eval
```

View results:

```bash
promptfoo view
```

## Task description

Musisz przygotować system do cenzury danych agentów. Pobierz dane z pliku:

https://centrala.ag3nts.org/data/KLUCZ/cenzura.txt
[example](./resources/cenzura.txt)

a następnie ocenzuruj imię i nazwisko, wiek, miasto i ulicę z numerem domu tak, aby zastąpić je słowem CENZURA. Odpowiedź wyślij do:

https://centrala.ag3nts.org/report

w formacie, który znasz już z poligonu. Jeśli potrzebujesz pomocy, zbadaj nagłówki HTTP wysyłane razem z plikiem TXT. Uwaga! Dane w pliku TXT zmieniają się co 60 sekund i mogą być różne dla każdego z agentów w tej samej chwili. Nazwa zadania w API to “CENZURA”.

Co trzeba zrobić w zadaniu?

1. Przed wykonaniem zadania, każdorazowo pobierz plik cenzura.txt (zmienia się co 60 sekund)
2. Plik zawiera dane osobowe
3. Zamień wszelkie wrażliwe dane (imię + nazwisko, nazwę ulicy + numer, miasto, wiek osoby) na słowo CENZURA.
4. Zadbaj o każdą kropkę, przecinek, spację itp. Nie wolno Ci przeredagowywać tekstu
5. Jeśli to możliwe, użyj do wykonania zadania modelu lokalnego. Początkowo spróbuj z llama w rozmiarze 7B. Później możesz zejść np. do Gemma:2B. Modele te możesz uruchomić na własnym komputerze z użyciem aplikacji ollama.
6. Zadanie możesz wykonać na modelu chmurowym (np. dowolnym od OpenAI) jeśli nie uda Ci się uruchomić ollamy lub jeśli napisanie poprawnego prompta sprawi Ci trudność, a podpowiedzi z komentarzy pod lekcją nie naprowadzą Cię na rozwiązanie.
