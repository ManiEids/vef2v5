# Verkefni 4 - Vefforritun 2: React Framendi

## Um verkefnið
Þetta verkefni snýst um að setja upp React framenda fyrir vefþjónustu gerða í Verkefni 3. Það var upphaflega ætlað að nota sýnilausn kennarans, en vegna margvíslegra vandamála fannst best að fara til baka og nota eigin útgáfu af Verkefni 3 sem bakenda.

## Markmið
- Uppsetning og notkun á React með Next.js.
- Noktun á React components með props og state.
- Routing í React verkefnum.
- Vinnsla með vefþjónustu og gögn.

## Vandamál og lausnir
- **Bakendi**: Upphaflega var kennara-gefna sýnilausn notuð en því miður reyndust henni vandamál, svo var farið yfir í að nota eigin útgáfu af Verkefni 3 sem bakenda.
- **CORS villur**: Margvíslegir CORS error komu upp sem leiddi til þess að proxy lausn var búnar til til að forðast þessa villu.
- **Deploy breytingar**: Á meðan þróun voru notaðar nokkrar aðferðir og hýsingar: fyrst reynt að setja upp PostgreSQL í Neon, en þó endaði á því að nota Render aftur þar sem bakendinn var þegar hýstur.
- **GitHub Copilot**: Notaður sem hjálpartæki við að leysa ýmis tæknileg vandamál og til að hraða þróun.
- **Yfirlestur API**: Breytt var úr því að nota sýnilausn kennarans í að nota eigin útgáfu, sem hafði örlítið mismunandi endapunkta og gögn.

## Virkni
Verkefnið inniheldur:
- **Forsíðu**: Sýnir flokka með hlekkjum til flokkasíðu.
- **Flokkasíðu**: Sýnir spurningar í gefnum flokk. Ef flokkur er ekki til birtist 404 síða.
- **Spurningar með vinnslu**: Leyfir að búa til, breyta og eyða spurningum ásamt viðeigandi svörum.

## Uppsetning Next.js
Verkefnið nýtir annaðhvort `pages/` eða `app/` uppsetningu í Next.js. Það er líka sett upp eslint og önnur tæki til að tryggja góða kóðagæði.

## Hvernig á að keyra verkefnið

### Nauðsynleg forrit
- Node.js (16+)
- npm eða yarn

### Uppsetning
1. Klónaðu verkefnið:
   ```bash
   git clone https://github.com/notandinn/v4-vefforritun.git
   cd v4-vefforritun
   ```

2. Settu upp dependencies:
   ```bash
   npm install
   # eða
   yarn install
   ```

3. Stilltu umhverfisbreytur:
   Búðu til skrá sem heitir `.env.local` í rót verkefnisins og settu inn:
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
   ```
   (Eða ef bakendinn er hýstur á Render þá er slóðin rétt stillt þar.)

4. Keyrðu verkefnið:
   ```bash
   npm run dev
   # eða
   yarn dev
   ```

Þegar þú hefur keyrt verkefnið tekur það venjulega nokkrar sekúndur að starta og endanlega birtist forritið á [http://localhost:3000](http://localhost:3000).

## Önnur athugasemd
Gakktu úr skugga um að bakendinn sé að keyra og að viðeigandi umhverfisbreytur séu rétt stilltar. Ef bakendinn er í hvíld eða það koma CORS villur, athugaðu console logs til að staðfesta að proxy lausnin virki rétt.

---

Það er von í að þessi README hjálpi til við að skilja og keyra verkefnið. Góður kóði og gangi þér vel í þróun!