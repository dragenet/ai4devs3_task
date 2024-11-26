# s03e01

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

Zadanie: Twoim zadaniem jest przygotowanie metadanych do 10 raportów dostarczonych w formacie TXT. Dotyczą one wydarzeń związanych z bezpieczeństwem, które zdarzyły się w różnych sektorach wokół fabryki. Metadane powinny ułatwić centrali wyszukiwanie tych raportów za pomocą własnych technologii. Sugerujemy, aby metadane zawierały słowa kluczowe w języku polskim, opisujące dany raport. Bardzo ważne jest przy generowaniu słów kluczowych uwzględnienie całej posiadanej przez nas wiedzy (np. folder z faktami, czy odwołania w innych raportach). Nazwa zadania to dokumenty.

Dane pozyskane w poprzednich lekcjach:

https://centrala.ag3nts.org/dane/pliki_z_fabryki.zip [local](./resources)

Oczekiwany format odpowiedzi w polu ‘answer’:

{
"nazwa-pliku-01.txt":"lista, słów, kluczowych 1",
"nazwa-pliku-02.txt":"lista, słów, kluczowych 2",
"nazwa-pliku-03.txt":"lista, słów, kluczowych 3",
"nazwa-pliku-NN.txt":"lista, słów, kluczowych N"
}

Co należy zrobić w zadaniu?

1. Pobierz plik ZIP i rozpakuj go

2. zapoznaj się z 10-cioma plikami TXT z raportami. Na nich się skupimy

3. Do każdego pliku wygeneruj słowa kluczowe w formie mianownika (czyli np. “sportowiec”, a nie “sportowcem”, “sportowców” itp.), które pomogą ludziom z centrali wyszukać odpowiedni dokument

4. Przy generowaniu metadanych posiłkuj się całą posiadaną wiedzą (czyli także folderem z faktami)

5. Przygotowane dane wyślij do centrali (/report) w formacie podanym w treści zadania

6. Jeśli pracownicy centrali potwierdzą, że ich pytania testowe zwróciły odpowiednie odpowiedzi, to otrzymasz flagę.
