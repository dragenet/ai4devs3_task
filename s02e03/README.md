# s02e03

## Setup

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run src/app.ts
```

This project was created using `bun init` in bun v1.1.34. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Task

Zebraliśmy zeznania od naszych wysłanników, którzy obserwowali fabrykę. Opisali oni, jak wyglądały roboty, które się tam kręciły. Na podstawie ich opisów przygotuj proszę grafikę, która będzie pewnego rodzaju wizualizacją potencjalnego wyglądu tych robotów, a następnie prześlij nam linka do tej grafiki. Użyj w tym celu modelu Dall-E w wersji 3. Grafika, której oczekujemy powinna być w formacie PNG o wymiarach 1024x1024px. Zadanie w raportach nazywa się ’robotid’.

Opis robota (zmienia się co 10 minut):

https://centrala.ag3nts.org/data/KLUCZ-API/robotid.json
[example1](./resources/example1.json)
[example2](./resources/example2.json)

Co należy zrobić w zadaniu?

1. Pobierz jedno z zeznań wysłanników

2. Stwórz obraz na podstawie opisu (wykorzystaj sugerowany model DALL-E lub dowolny inny, który będzie dla Ciebie dogodny)

3. Odeślij URL wygenerowanej grafiki do centrali

4. Grafika musi być w formacie PNG i mieć wymiary 1024×1024 px

5. Jeśli obraz zostanie zaakceptowany, otrzymasz flagę

UWAGA: nie musisz samodzielnie hostować pliku PNG. Możesz podać adres URL otrzymany od generatora.
