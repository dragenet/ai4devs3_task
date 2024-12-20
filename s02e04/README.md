# s02e04

## Setup

```bash
bun install
```

To run:

```bash
bun run src/app.ts
```

## Task

Zdobyliśmy dostęp do danych z fabryki, którą nam wskazałeś. Są to raporty dzienne kilku działających tam oddziałów. Część z nich to zwykłe raporty techniczne, a część to raporty związane z bezpieczeństwem. Pozyskane dane są w różnych formatach i nie wszystkie zawierają użyteczne dane. Wydobądź dla nas proszę tylko notatki zawierające informacje o schwytanych ludziach lub o śladach ich obecności oraz o naprawionych usterkach hardwarowych (pomiń te związane z softem oraz pomiń katalog z faktami). Raport wyślij do zadania “kategorie” w formie jak poniżej. Pliki powinny być posortowane alfabetycznie.

Oto dane źródłowe: https://centrala.ag3nts.org/dane/pliki_z_fabryki.zip [local](./resources)

{
"people": ["plik1.txt", "plik2.mp3", "plikN.png"],
"hardware": ["plik4.txt", "plik5.png", "plik6.mp3"],
}

Co trzeba zrobić w zadaniu?

1. Pobierasz i rozpakowujesz plik ZIP podany w zadaniu

2. W środku archiwum znajdują się pliki TXT, PNG oraz MP3

3. Odczytujesz zawartość wskazanych plików (z pominięciem folderu z faktami) za pomocą odpowiednich modeli i umiejętności modelu

4. Przy użyciu odpowiedniego prompta podejmujesz decyzję, czy w danym pliku znajduje się informacja o ludziach lub maszynach.

5. Istnieje szansa, że znaleziona informacja nie dotyczy ani ludzi, ani maszyn! Wtedy po prostu ją pomijasz.

6. Posegregowane dane raportujesz w postaci listy nazw plików (format JSON jak w treści zadania) do centrali.

7. Jeśli dane są przygotowane poprawnie, zdobywasz flagę.
