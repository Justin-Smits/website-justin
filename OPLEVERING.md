# Oplevering — 7 oktober 2026

## Inhoud

Volledige website met Nederlandse blog, browserbeheer via GitHub, een nieuw AI-dienstenoverzicht, uitgebreide Copilot Studio-uitleg en de eerste blog. De bestaande NL/EN/ES-website en media zijn meegenomen. Installatie en gebruik staan in `START-HIER.md`; vervolgideeën staan in `SEO-EN-CONTENTPLAN.md`.

## Uitgevoerde controles

**15 geautomatiseerde tests geslaagd** met Node.js:

- veilige Markdown en URL-verwerking;
- schone artikel-URLs en validatie;
- bescherming tegen ingevoegde scripts en attribuutinjectie;
- unieke inhoudsopgave-ankers;
- artikelmetadata, canonieke URL en BlogPosting;
- generatie van artikel, overzicht, homepage, sitemap en RSS;
- leeg blog na verwijderen van het laatste artikel;
- één samenhangende GitHub-commit per publicatie;
- geen overschrijven bij een gewijzigde branch;
- geen publicatie na een mislukte bestandsoverdracht;
- bescherming tegen een gelijktijdige commit;
- herkennen van een geslaagde wijziging na een verloren netwerkantwoord;
- verwijderen van de bijbehorende artikelpagina;
- weigeren van afbeeldingspaden buiten de blogmap.

**9 browserscenario’s geslaagd** in Chromium, met een nagebootste GitHub API:

1. Ongeldige aanmeldgegevens geven een foutmelding.
2. Nieuw artikel, twee foto's optimaliseren, voorbeeld tonen en concept bewaren.
3. Concept en foto's herstellen na verversen; token blijft niet bewaard; export bevat foto's.
4. Publiceren van tekst, foto's, artikelpagina, overzicht, metadata, feed, sitemap en homepage.
5. Gepubliceerd artikel bewerken met behoud van de URL.
6. Publicatie verwijderen, inclusief artikelpagina en sitemapverwijzing.
7. Zoeken en categoriefilters op het blogoverzicht.
8. Mobiele navigatie en sluiten met Escape.
9. Artikel blijft volledig leesbaar als JavaScript uitstaat.

Geen JavaScript-paginafouten in deze scenario’s. De verwachte HTTP 401 bij de test met een ongeldig token is geen productfout.

**Bestanden en vormgeving:**

- 30 HTML-pagina’s gecontroleerd: geen ontbrekende lokale linkbestanden, ontbrekende interne ankers of dubbele element-ID’s.
- Alle JSON-LD-gegevens, sitemap-XML en RSS-XML zijn parsebaar.
- Layout gecontroleerd op 390, 1024 en 1440 pixels voor de drie homepages, Copilot Studio, blog en AI-diensten: geen horizontale overflow.
- Blog, AI-pagina, artikel en beheer visueel gecontroleerd op desktop en mobiel; fotocropping in de blogkaart verbeterd.
- Het archief bevat één daadwerkelijk uitgewerkte publicatie; er zijn geen testartikelen in de openbare blogdata opgenomen.

## Wat nog afhangt van jouw publicatie

De zip is niet naar GitHub gepusht en er is geen live deployment uitgevoerd. De echte GitHub-schrijfautorisatie, eventuele branchregels, de uitrol van je host, DNS en uiteindelijke Google-indexering zijn daardoor niet live gevalideerd. De beheerflow is getest met dezelfde API-routes en gegevensvormen via een lokale simulatie; jouw toegangstoken en hostingverbinding moeten nog worden ingesteld.

Het bestaande contactformulier via FormSubmit is behouden. De ontvangst van echte e-mails is niet getest. Bestaande externe video's en bestaande analytics-instellingen zijn behouden; er is geen nieuwe tracking toegevoegd aan blog of beheer.

De blogstudio is bedoeld voor één eigenaar die rechtstreeks naar de publicatiebranch mag schrijven. Er is geen serverlogin, samenwerking met rollen, planning voor latere publicatie of pull-request-reviewworkflow toegevoegd. Concepten staan lokaal in je browser en kunnen worden geëxporteerd. Gepubliceerde inhoud staat in je openbare GitHub-repository en blijft terug te vinden in de Git-geschiedenis.
