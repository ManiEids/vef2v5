# Vefforritun 2 - Verkefni 5

## Um verkefnið
Next.js spurningaforrit með DatoCMS sem headless CMS kerfi.

## Uppsetning
```bash
npm install
```

## Keyra
```bash
npm run dev
```

## Stillingar
Útbúðu `.env.local` skrá með viðeigandi breytum.

## CMS uppsetning
Verkefnið notar DatoCMS með eftirfarandi líkön:
- HomePage (single instance): title, subtitle, description, headerImage
- Category (collection): title, slug, description
- Question (collection): text, category, answers
- Answer (collection): text, correct

## Virkni
Notandi getur skoðað forsíðu, valið flokk, og svarað spurningum með strax niðurstöðum.

## Tæknilegar upplýsingar
- Next.js með TypeScript og App Router
- SASS fyrir stílsetningu
- DatoCMS sem headless CMS
- Vercel fyrir hýsingu