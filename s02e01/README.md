# s02e01

## Setup

To install dependencies:

```bash
bun install
```

To perform transcription:

```bash
bun run src/transcribe.ts
```

To run app:

```bash
bun run src/app.ts
```

## Task

Zadanie: Pobierz nagrania z przesłuchań świadków oskarżonych o kontakty z profesorem Majem. Zeznania mogą się wzajemnie wykluczać lub uzupełniać. Materiału jest sporo, więc sugerujemy przetworzyć te dane w sposób automatyczny. Centrala warunkowo dopuściła do analizy nagranie Rafała, ponieważ jego stan od pewnego czasu jest bardzo niestabilny, ale to jedyna osoba, co do której jesteśmy pewni, że utrzymywała bliskie kontakty z profesorem. Podaj nam proszę nazwę ulicy, na której znajduje się uczelnia (konkretny instytut!), gdzie wykłada profesor. Wyślij odpowiedź w standardowym formacie (nazwa taska do: mp3) https://centrala.ag3nts.org/report

Nagrania z przesłuchań: https://centrala.ag3nts.org/dane/przesluchania.zip

Co należy zrobić w zadaniu?

1. Pobierz archiwum ZIP i rozpakuj je. W środku znajdziesz pliki audio z nagraniami kilku przesłuchań [pliki audio](./resources).

2. Za pomocą dowolnego modelu zamieniającego audio na tekst, wygeneruj transkrypcję każdego z nagrań.

3. Z otrzymanych transkryptów zbuduj wspólny kontekst dla swojego prompta

4. Znajdź odpowiedź na pytanie, na jakiej ulicy znajduje się uczelnia, na której wykłada Andrzej Maj

5. Pamiętaj, że zeznania świadków mogą być sprzeczne, niektórzy z nich mogą się mylić, a inni odpowiadać w dość dziwaczny sposób.

6. Nazwa ulicy nie pada w treści transkrypcji. Musisz użyć wiedzy wewnętrznej modelu, aby uzyskać odpowiedź.

7. Uzyskaną odpowiedź wyślij do centrali (/report) jako zadanie o nazwie ‘mp3’

8. Podpowiedź: zamiast prosić model o udzielenie natychmiastowej odpowiedzi, pozwól mu trochę pomyśleń na głos. Zwróć uwagę czy i jak poprawia to zdolności wnioskowania modelu.
