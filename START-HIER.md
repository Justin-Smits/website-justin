# Smits Digital — blog, beheer en AI-diensten

Deze zip bevat je volledige vernieuwde website, gebaseerd op de openbare repository `Justin-Smits/website-justin` (broncommit `e8fb54f5db74d2f4a75cf2559b5ae4817f874418`). De bestanden zijn klaar voor statische hosting. Je hoeft geen database, PHP-server of betaald CMS in te richten. De website is vanuit deze opdracht niet naar je repository gepusht of live gepubliceerd.

## 1. De vernieuwde website plaatsen

1. Pak `Smits-Digital-Blog-AI.zip` uit.
2. Maak eerst een back-up van je huidige repository. Als je sinds deze versie zelf wijzigingen hebt gedaan, vergelijk die voordat je bestanden vervangt.
3. Open `Justin-Smits/website-justin` in GitHub Desktop of op GitHub.
4. Kopieer **de inhoud** van de map `website-justin` naar de hoofdmap van je bestaande repository. `index.html`, `assets`, `admin`, `blog` en `data` moeten direct in de hoofdmap staan, niet in een extra submap. Neem de nieuwe bestanden mee en vervang de bestaande bestanden uit de zip.
5. Neem ook `.nojekyll` mee. Op de Mac toon je verborgen bestanden met `Cmd + Shift + .`. Gebruik je GitHub Desktop, dan zie je het bestand bij de wijzigingen.
6. Commit en push naar `main`. Op GitHub in de browser gebruik je **Add file → Upload files**, sleep je bestanden en mappen naar het venster en kies je **Commit changes**. Geen token in een bestand plakken.
7. Wacht tot je bestaande websitehost de wijziging heeft verwerkt.

### Gebruik je GitHub Pages?

Open **Settings → Pages**. Bij **Build and deployment** kies je **Deploy from a branch**, branch **main**, map **/(root)**. Bewaar je bestaande domein `smitsdigital.com` en controleer dat HTTPS aanstaat. Als jouw hosting al goed werkt, laat je de domein- en DNS-instellingen staan.

De zip bevat de gebouwde HTML; een build workflow is niet nodig. De blogstudio publiceert normale commits met jouw persoonlijke toegangstoken. Die commits kunnen de ingestelde Pages-publicatie starten.

### Gebruik je een andere host?

De website werkt ook op een andere statische host die deze repository automatisch publiceert vanaf `main`. Zorg dat de hoofdmap als website wordt gepubliceerd, dat `.mjs` als JavaScript wordt geserveerd en dat `/blog/` en `/admin/` hun `index.html` openen. Handmatig uploaden kan, maar bij iedere nieuwe blog moet je dan de bijgewerkte GitHub-bestanden opnieuw naar je host zetten. De blogstudio kan uitsluitend in GitHub opslaan, niet rechtstreeks via FTP.

Alle openbare links zijn voorbereid voor `https://smitsdigital.com` op de hoofdmap van het domein. Een GitHub-projectadres met `/website-justin/` is geen vervanging voor dit domein. Houd het bestaande domein aan. Gebruik een redirect van `www.smitsdigital.com` naar `smitsdigital.com` als die nog niet door je host wordt geregeld.

## 2. Eenmalig je blogbeheer verbinden

Open na de publicatie **https://smitsdigital.com/admin/**.

De beheerpagina gebruikt een GitHub-toegangstoken als aanmelding. Er is geen los gebruikersaccount of gedeeld standaardwachtwoord.

1. Ga naar https://github.com/settings/personal-access-tokens/new.
2. Geef het token een herkenbare naam, bijvoorbeeld `Smits Digital blogstudio`.
3. Kies **Justin-Smits** als Resource owner.
4. Stel een vervaldatum in, bijvoorbeeld 90 dagen.
5. Kies bij **Repository access → Only select repositories** alleen **website-justin**.
6. Kies bij **Repository permissions → Contents → Read and write**. Metadata wordt automatisch toegevoegd. Andere rechten zijn niet nodig voor deze blogstudio.
7. Genereer het token. Bewaar het in je wachtwoordmanager en plak het op `/admin/`.
8. Klik op **Verbind met GitHub**.

Het token blijft alleen in het geheugen van het geopende tabblad. Het wordt niet in cookies, localStorage, IndexedDB, de zip of GitHub-bestanden opgeslagen. Na verversen log je opnieuw in. Na 30 minuten zonder interactie logt de studio automatisch uit. Deel het token niet en zet het nooit in je openbare repository.

De openbare beheerpagina bekijken geeft niemand schrijfrechten. GitHub controleert de rechten op iedere wijziging. `noindex` is alleen bedoeld om de beheerpagina uit zoekresultaten te houden; de beveiliging zit in de GitHub-autorisatie.

De configuratie staat al goed in `admin/config.json`:

- Account: `Justin-Smits`
- Repository: `website-justin`
- Branch: `main`

Alleen aanpassen als je account, repository of publicatiebranch verandert. Dit bestand bevat geen geheimen.

## 3. Je eerste eigen blog publiceren

1. Klik op **Nieuw artikel**.
2. Vul de titel in. De artikel-URL wordt automatisch voorgesteld; je kunt die vóór de eerste publicatie aanpassen.
3. Kies een categorie en schrijf een samenvatting van 30 tot 200 tekens.
4. Voeg een omslagfoto toe en beschrijf wat erop te zien is.
5. Schrijf je artikel. De knoppen voegen kopjes, vetgedrukte tekst, lijsten, citaten en links toe.
6. Gebruik **Foto +** voor afbeeldingen tussen de tekst. De tekst tussen de vierkante haken is de beschrijving van die foto.
7. Klik op **Voorbeeld** en controleer je tekst en foto's.
8. Klik op **Publiceren** en bevestig dat de inhoud openbaar mag worden.

Na het opslaan in GitHub moet je host nog publiceren. De studio meldt daarom dat het artikel is opgeslagen, niet dat een externe uitrol al klaar is. Controleer daarna de artikelpagina op je eigen domein.

Publiceren werkt automatisch deze onderdelen bij:

- de eigen artikelpagina, zoals `/blog/jouw-artikel/`;
- het blogoverzicht, inclusief zoeken en categoriefilters;
- de blogverwijzing op de Nederlandse homepage;
- de sitemap voor zoekmachines;
- de RSS-feed;
- de metadata en gestructureerde artikelgegevens.

De tekst en foto’s worden samen in één GitHub-commit opgeslagen. Als iemand tussendoor de repository wijzigt, stopt de studio om overschrijven te voorkomen. Klik dan op **Vernieuwen**. Is hetzelfde artikel inhoudelijk gewijzigd, exporteer je concept en neem je wijzigingen over in de actuele publicatie.

### Concepten, wijzigen en verwijderen

- Tekst en geüploade foto’s worden automatisch als concept in deze browser opgeslagen. Die concepten komen niet in de openbare repository.
- Gebruik **Concept exporteren** voor een lokale back-up met de foto's. Via **Concept importeren** werk je op een ander apparaat verder.
- Browsergegevens wissen verwijdert ook lokale concepten. Bewaar daarom een export van belangrijke ongepubliceerde stukken.
- Kies een gepubliceerd artikel om het te bewerken. De artikel-URL blijft vast, zodat bestaande links blijven werken.
- **Publicatie verwijderen** verwijdert de artikelpagina en de verwijzingen in overzicht, sitemap en homepage. Oude foto’s worden niet automatisch verwijderd, zodat gedeelde afbeeldingen intact blijven.
- De GitHub-geschiedenis behoudt eerder gepubliceerde tekst en afbeeldingen. Publiceer dus geen vertrouwelijke informatie. **Concept wissen** verwijdert alleen het lokale concept en laat een eventuele publicatie staan.

### Foto’s en tekstopmaak

JPG, PNG en WebP worden ondersteund. Elke foto mag maximaal 15 MB zijn en maximaal 40 megapixel bevatten. De studio verkleint foto's tot maximaal 1600 pixels aan de langste zijde en zet ze om naar WebP. Dat verkleint de download en verwijdert de gebruikelijke fotometadata. Maximaal 20 nieuwe foto’s per concept.

Ondersteunde opmaak:

```text
## Tussenkop
### Subkop

Een gewone alinea met **vetgedrukte tekst**.

- Een eerste punt
- Een tweede punt

> Een uitgelicht citaat

[Lees meer](/ai-agents.html)
![Beschrijving van de foto](/assets/blog/bestandsnaam.webp)
```

Gebruik een lege regel tussen alinea’s. De artikelnaam is al de hoofdkop; gebruik in de tekst `##` of `###`. HTML, scripts en iframes worden niet uitgevoerd. De editor is een eenvoudige teksteditor met opmaakknoppen en een live opvraagbaar voorbeeld, geen Word-editor.

## 4. Wat is toegevoegd en verbeterd?

- Een blogoverzicht en volledig statische artikelpagina’s: alle inhoud staat direct in HTML, ook zonder JavaScript.
- Eerste artikel: **Wat zijn AI-agents en wat kunnen ze voor jouw bedrijf betekenen?**
- Een beheeromgeving met lokale concepten, upload, voorbeeld, SEO-voorbeeld, bewerken en verwijderen.
- Een aparte pagina **AI-agents laten bouwen & AI-advies** met concrete diensten, toepassingen, werkwijze en veelgestelde vragen.
- De Copilot Studio-pagina maakt duidelijk dat jij agents ontwerpt, bouwt en test en helpt met algemene AI-vragen.
- Duidelijke AI-verwijzingen op de homepage, in navigatie, in de over-Justin-tekst en in het contactformulier.
- Een eigen blogillustratie, leesduur, auteur, inhoudsopgave, deelknop, verwante diensten en RSS.
- Canonieke URLs op één domein, beschrijvingen, sociale deelmetadata, `BlogPosting` en breadcrumbs, automatische sitemap en 404-pagina.
- Een dubbel opgenomen stuk HTML in de Engelse homepage uit de bronrepo hersteld. De oude `index1.html` verwijst door naar de echte homepage.
- Je bestaande portretfoto en overige media zijn behouden. De portretfoto wordt via een lokaal pad geladen, zodat hij ook bij lokaal bekijken beschikbaar is.

De bestaande Nederlandse, Engelse en Spaanse pagina’s zijn behouden. Blog, blogbeheer en de nieuwe uitgebreide AI-dienstenpagina zijn in het Nederlands. EN/ES-links naar die nieuwe pagina’s zijn aangeduid met “NL”. De bestaande Copilot Studio-pagina’s zijn ook in het Engels en Spaans aangevuld.

## 5. Na het publiceren

1. Controleer homepage, `/ai-agents.html`, `/copilot-studio.html`, `/blog/` en het eerste artikel op desktop en mobiel.
2. Verbind de blogstudio en publiceer een eigen artikel wanneer je daaraan toe bent.
3. Controleer één keer of je bestaande FormSubmit-contactformulier e-mails bezorgt. Dit bestaande contactmechanisme is behouden; de e-mailverwerking is niet vanuit deze opdracht live getest.
4. Meld `https://smitsdigital.com/sitemap.xml` aan bij Google Search Console en controleer met URL-inspectie de nieuwe AI-pagina en het eerste artikel.
5. Gebruik het plan in `SEO-EN-CONTENTPLAN.md` voor de volgende artikelen.

## 6. Technisch onderhoud (optioneel)

Voor normaal publiceren gebruik je alleen de blogstudio. Er zijn geen npm-pakketten nodig voor de site of de build.

Met Node.js 20 of nieuwer:

```bash
npm test
npm run build
```

`npm run build` maakt de blogbestanden opnieuw vanuit `data/posts.json` en behoudt de overige sitemap-URLs. Bij handmatig verwijderen van een artikel uit de JSON moet je ook de betreffende map onder `blog/` verwijderen; via de studio gebeurt dit automatisch.

Voor lokaal bekijken met Python 3:

```bash
python3 -m http.server 8080
```

Open daarna `http://localhost:8080`. Dubbelklikken op HTML via `file://` ondersteunt de modules en rootpaden niet. Een lokale blogstudio met een echt token schrijft naar de geconfigureerde GitHub-repository: gebruik die knop alleen als je werkelijk wilt publiceren.

## 7. Veelvoorkomende meldingen

- **401:** token verlopen of ongeldig. Maak of plak een geldig token.
- **403:** controleer Contents → Read and write, de gekozen repository en eventuele GitHub API-limieten.
- **404 tijdens aanmelden:** controleer `admin/config.json` en of de complete zip is gecommit op de gekozen branch.
- **422 / branch gewijzigd:** vernieuw de lijst. Controleer of branchregels directe commits blokkeren. De studio respecteert die regels; bij verplichte pull requests is deze directe publicatieroute niet geschikt zonder een aanvullende reviewworkflow.
- **Opgeslagen, nog niet zichtbaar:** kijk bij de deployments van je host of GitHub Actions. Wacht tot de uitrol klaar is en herlaad daarna zonder cache.
- **Concept niet opgeslagen:** browseropslag kan geblokkeerd of vol zijn. Exporteer het concept voordat je het tabblad sluit.

Details van de uitgevoerde controles staan in `OPLEVERING.md`.
