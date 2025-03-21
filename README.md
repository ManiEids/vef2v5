# verkefni 4 - vefforritun 2 - mani - quiz

React framendi fyrir spurningakerfi.

## Um verkefnið

Þetta verkefni er React framendi fyrir vefþjónustu sem var gerð í verkefni 3. Verkefnið notar Next.js og Tailwind CSS fyrir útlit.

## Backend Val

Upphaflega var planað að nota kennara-gefna sýnilausn frá verkefni 3 sem backend, en eftir íhugun ákvað ég að nota mína eigin útfærslu af verkefni 3 sem er þegar hýst á Render. Þetta sparaði tíma og aukavinnu við að setja upp auka þjónustu og gagnagrunna.

### Aðlögun að backend

Verkefnið krafðist nokkurra aðlagana til að tengja framendann við minn eigin bakenda:

1. Breyta þurfti endapunktum í samræmi við API skilgreiningu mína (`/question` í stað `/questions` fyrir POST aðgerðir, o.s.frv.)
2. Aðlaga gagnalíkön til að passa við bakenda (t.d. `name` fyrir flokka í stað `title`)
3. Breyta þurfti hvernig spurningar eru sóttar eftir flokki

## API Endapunktar

Framendinn tengist við eftirfarandi endapunkta:

- **Flokkar**: `/categories`, `/category/:slug`
- **Spurningar**: `/questions`, `/questions/category/:slug`, `/question/:id`

## Keyrsla

```bash
# Setja upp dependencies
npm install

# Keyra í development
npm run dev

# Byggja fyrir production
npm run build

# Keyra í production
npm start
```

## Vefþjónusta

Verkefnið tengist við vefþjónustu sem er hýst á https://vef2v3.onrender.com. Slóðin er skilgreind í `.env.local` skrá með `NEXT_PUBLIC_API_BASE_URL` breytu.

Athugið að fyrsta beiðni til vefþjónustu getur tekið nokkrar sekúndur þar sem óvirk þjónusta á ókeypis áskrift hjá Render.com fer í hvíld.

## Áskoranir

Helstu áskoranir verkefnisins voru:

1. Aðlaga framenda að bakenda með öðruvísi API uppbyggingu en fyrst var gert ráð fyrir
2. Vinna með mismunandi endapunkta fyrir svipaðar aðgerðir (t.d. `/questions` vs `/question`)
3. Gæta þess að senda rétt gögn í réttum formum til bakenda

## Uppsetning á eigin vefþjónustu

Ef þú vilt keyra þína eigin vefþjónustu locally, stilltu þá `.env.local` skrána á:

```
NEXT_PUBLIC_API_BASE_URL="http://localhost:5000"
```