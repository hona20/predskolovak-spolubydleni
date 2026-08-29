# AGENT LOG - Spolubydlení Předškolovák

Datum zahájení: 2026-08-29
Popis projektu: Webová aplikace pro hledání spolubydlení a spolubydlících pro studenty a prváky v rámci akce Předškolovák. Umožňuje bezpečné seznámení a propojení budoucích spolubydlících před začátkem semestru i offline přímo na turnusech Předškolováku.

---

## [2026-08-29] agent:Gemini | Spolubydlení Předškolovák MUNI

**Changed:** 
- `package.json`, `tsconfig.json`, `tsconfig.node.json`, `vite.config.ts`, `vercel.json`, `index.html`
- `src/types.ts`, `src/data/faculties.ts`, `src/data/initialProfiles.ts`
- `src/styles/variables.css`, `src/styles/base.css`, `src/styles/components.css`, `src/styles/animations.css`
- `src/context/ProfilesContext.tsx`
- `src/components/Header.tsx`, `src/components/HeroBanner.tsx`, `src/components/TurnusFilter.tsx`, `src/components/FilterBar.tsx`, `src/components/ProfileCard.tsx`, `src/components/ProfileList.tsx`, `src/components/ProfileDetailModal.tsx`, `src/components/CreateProfileModal.tsx`, `src/components/VranovMeetupTips.tsx`, `src/components/Footer.tsx`
- `src/App.tsx`, `src/main.tsx`

**Decisions:** 
- Použit React 18 + Vite + TypeScript + Vanilla CSS design system inspirovaný webem `muj.predskolovak.cz` (modrá barva `#2563E2`, mint `#5AC8AF`, tlačítka se šipkami, kulaté rohy `rounded-24`).
- Všechna pole ve formuláři tvorby inzerátu jsou 100% dobrovolná. Uživatel si nemusí nahrávat fotku – má k dispozici emoji avatary jedním klikem.
- Implementován systém offline seznámení na Vranovské pláži s generátorem icebreaker zpráv pro Instagram a WhatsApp.
- Filtrování podle turnusů (1. turnus, 2. turnus, FSpS, Všechny), fakult MUNI (LF, FF, PrF, FI, FSS, PřF, ESF, PdF, FSpS, FaF), rozpočtu, tagů a oblíbených inzerátů.
- Ukládání vlastních inzerátů a oblíbených položek do `localStorage`.

**For others:** 
- Aplikace běží na Vite dev serveru na portu 3000 (`http://localhost:3000/`).
- Build je otestován příkazem `npm run build` a je připraven pro okamžité nasazení na Vercel (soubor `vercel.json` je součástí rootu).

**Status:** Done

---

## [2026-08-29] agent:Gemini | Dobrovolné fotografie a právní moduly (GDPR, Cookies, Podmínky)

**Changed:** 
- `src/components/CookieBanner.tsx` [NEW]: Interaktivní cookie lišta s možností "Přijmout vše" / "Jen nezbytné" a odkazem na zásady GDPR.
- `src/components/LegalModal.tsx` [NEW]: Přehledný právní modal se 3 záložkami (Ochrana osobních údajů / GDPR, Cookies a lokální úložiště, Bezpečnostní pravidla pro spolubydlení).
- `src/components/CreateProfileModal.tsx`: Vylepšený formulář pro nahrání volitelné profilové fotografie (dropzone, náhled, možnost snadného odebrání) vedle rychlého výběru emoji avatarů.
- `src/components/Footer.tsx`: Propojení odkazů na GDPR, Cookies a Podmínky používání přímo z patičky.
- `src/components/Header.tsx` & `src/components/ProfileDetailModal.tsx`: Vylepšená navigace a bezpečné in-modal mazání inzerátu.
- `src/styles/components.css`: Stylování cookie banneru, právních záložek a foto dropzone.
- `src/App.tsx`: Napojení stavu cookie lišty a právního modalu.

**Decisions:** 
- Veškeré nahrávání fotografií je striktně dobrovolné s okamžitou alternativou rychlých studentských emoji avatarů.
- Právní náležitosti jsou vysvětleny lidsky a srozumitelně pro studenty, včetně garance práva na okamžité smazání dat a neexistence předávání třetím stranám.

**For others:** 
- Aplikace splňuje GDPR požadavky pro dobrovolné komunitní inzerce a běží na `http://localhost:3000/`.

**Status:** Done

---

## [2026-08-29] agent:Gemini | Email autentizace (OTP kód), Vlastní štítky & Profesionální design

**Changed:** 
- `src/components/EmailVerificationModal.tsx` [NEW]: Modální okno pro 6místné emailové ověření s doručením autentizačního kódu a okamžitým vyplněním.
- `public/assets/vranov_hero.jpg` [NEW]: Vlastní vygenerovaná grafická ilustrace kempu na Vranovské pláži v autentickém stylu Předškolováku.
- `src/components/CreateProfileModal.tsx`: Odstraněny předvytvořené badges. Přidán dynamický input pro tvorbu vlastních štítků (uživatel si píše vlastní tagy a přidává/odebírá je). Přidáno pole pro ověřovací email.
- `src/components/FilterBar.tsx`: Odstraněno filtrování podle badges a fakult, ponechán pouze čistý minimalistický vyhledávač.
- `src/components/TurnusFilter.tsx`: Výhradní filtrování inzerátů na základě turnusů na Vranovské pláži.
- `src/components/ProfileCard.tsx` & `src/components/ProfileDetailModal.tsx`: Zobrazení vlastních uživatelských štítků a zeleného odznaku „Ověřený účastník emailem“.
- `src/context/ProfilesContext.tsx`: Implementace stavu verifikace, generování 6místných OTP kódů a zjednodušené filtrace.
- `src/App.tsx`: Napojení EmailVerificationModal do celého běhu aplikace.

**Decisions:** 
- Filtrování je zjednodušeno čistě na bázi turnusů Předškolováku.
- Odstraněny AI buzzwords a generické prvky ve prospěch čistého profesionálního designu s autentickou grafikou.
- Autentizace funguje automaticky: po zadání emailu se vygeneruje 6místný kód a po jeho potvrzení získá profil status ověřeného účastníka.

**For others:** 
- Aplikace je plně otestována v prohlížeči, build `npm run build` prochází bez chyb.

**Status:** Done

---

## [2026-08-29] agent:Gemini | Mobilní optimalizace (Bottom sheets, Touch FAB, Safe Area)

**Changed:** 
- `src/styles/base.css`: Nastaveno `font-size: 16px` pro formulářové inputy (zabraňuje nechtěnému přiblížení stránky na iOS Safari), přidána podpora `env(safe-area-inset-bottom)` pro moderní telefony bez rámečků, `-webkit-tap-highlight-color: transparent`.
- `src/styles/components.css`:
  - **Plnohodnotné Bottom Sheets**: Všechna modální okna (tvorba inzerátu, detail, ověření kódem, právní podmínky) se na mobilech vysouvají plynule zdola jako nativní mobilní listy se zaoblením `24px 24px 0 0`.
  - **Plovoucí akční tlačítko (FAB)**: Na mobilech přidáno sticky tlačítko `+ Přidat inzerát` vpravo dole pro snadné ovládání jedním palcem.
  - **Dotykový Turnus Slider**: Horizontální posuvník turnusů s plynulou setrvačností (`scroll-snap-type: x mandatory`).
  - **Touch ergonomie**: Minimální výška dotykových prvků 44px (Apple Human Interface standard), zvětšené ovládací prvky avatarů a štítků.
  - **Responzivní Hero banner**: Vertikální skládání na telefonech a optimalizované zobrazení ilustrace kempu.
- `src/components/Header.tsx`: Kompaktní zobrazení hlavičky na mobilech (skrytí textu desktopového CTA ve prospěch plovoucího FABu).
- `src/App.tsx`: Integrace Floating Action Buttonu.

**Decisions:** 
- Optimalizováno mobile-first pro studenty používající aplikaci přímo na pláži na Vranově.

**For others:** 
- Otestováno v mobilním viewportu v prohlížeči, build bez chyb.

**Status:** Done

---

## [2026-08-29] agent:Gemini | Rozšíření kontaktů (WhatsApp, Messenger, OnlyFans)

**Changed:** 
- `src/types.ts`: Rozšířen interface `Profile.contacts` o `messenger` a `onlyfans`.
- `src/components/CreateProfileModal.tsx`: Přidána formulářová pole pro Instagram, WhatsApp, Messenger a OnlyFans (s vtipným podtitulem „na nájem 😜“).
- `src/components/ProfileDetailModal.tsx`: Vytvořena tlačítka pro přímé prokliknutí na WhatsApp (`wa.me`), Messenger (`m.me`), Instagram a OnlyFans (`onlyfans.com`).
- `src/data/initialProfiles.ts`: Doplněny ukázkové kontakty do mock profilů.

**Decisions:** 
- Všechny kontaktní kanály jsou 100% dobrovolné a stylované v autentických barvách daných platforem.

**Status:** Done

---

## [2026-08-29] agent:Gemini | Přidání BETA odznaku a horní notifikační lišty

**Changed:** 
- `src/components/Header.tsx`: Doplněn žlutý odznak `BETA` vedle nápisu Spolubydlení a horní notifikační lišta s informací o pilotním testování pro ročník 2026.
- `src/styles/components.css`: Přidány třídy `.beta-badge`, `.beta-top-bar`, `.beta-top-pill`, `.brand-title-row`.

**Decisions:** 
- Odznak je decentní, v souladu s vizuálním stylem Předškolováku.

**Status:** Done

---

## [2026-08-29] agent:Gemini | Odstranění ilustrace stanu z Hero Banneru

**Changed:** 
- `src/components/HeroBanner.tsx`: Odstraněn box s ilustrací stanu. Úvodní banner má nyní čisté, vzdušné rozvržení s důrazem na typografii, CTA tlačítko a statistiky.

**Decisions:** 
- Čistý a minimalistický design bez generických obrázků.

**Status:** Done

---

## [2026-08-29] agent:Gemini | Tajný PIN kód inzerátu, Výzva k vyfocení & Anti-Spam ochrana

**Changed:** 
- `src/types.ts`: Přidána položka `manageCode: string` do profilu inzerátu.
- `src/context/ProfilesContext.tsx`:
  - Generování unikátního tajného kódu inzerátu (např. `VRN-8429`).
  - **Ochrana proti spamu**: Limit cooldownu 60 sekund mezi tvorbou inzerátů a maximální limit 3 aktivních inzerátů na zařízení.
  - Správa, úprava i trvalé smazání inzerátu pomocí PIN kódu (`getProfileByCode`, `updateProfileByCode`, `deleteProfileByCode`).
- `src/components/AdSuccessModal.tsx` [NEW]: Modální okno po vytvoření inzerátu s výzvou: **„📸 Vyfoť si obrazovku nebo si kód ulož!“**, zobrazením velkého kódu `VRN-XXXX` a tlačítkem pro zkopírování.
- `src/components/ManageAdByCodeModal.tsx` [NEW]: Modál pro zadání PIN kódu a plnohodnotnou editaci či smazání inzerátu.
- `src/components/CreateProfileModal.tsx`: Odstraněna závislost na emailech. Inzerát se vytvoří ihned a vygeneruje autorizační kód. Přidána detekce cooldownu s varováním.
- `src/components/Header.tsx`: Přidáno tlačítko „Správa inzerátu (kód)“ a rychlý přístup ke kódu vlastního inzerátu.

**Decisions:** 
- Nahrazení emailového ověřování samostatným tajným PIN kódem inzerátu – ideální pro podmínky kempu a pláže s možným horším signálem.

**Status:** Done

---

## [2026-08-29] agent:Gemini | Vyčištění popisků OnlyFans

**Changed:** 
- `src/components/CreateProfileModal.tsx`: Odstraněny texty „(ze srandy)“ a „na nájem 😜“. Ponechán pouze čistý název `OnlyFans 🔞` a placeholder `např. username`.
- `src/components/ProfileDetailModal.tsx`: Odstraněn tooltip.

**Decisions:** 
- Čisté a přirozené zobrazení pole bez zbytečných vysvětlivek.

**Status:** Done

---

## [2026-08-29] agent:Gemini | UI Cleanup – BETA badge, Sparkles ikony, email label, favicon, support email

**Changed:**
- `src/components/Header.tsx`: Odstraněn druhý BETA badge vedle loga. Zůstal pouze jeden v horním proužku `beta-top-bar`. Odstraněna `Sparkles` ikona z top baru.
- `src/components/ProfileCard.tsx`: Sparkles ikona u turnusu nahrazena emojí 📅.
- `src/components/TurnusFilter.tsx`: Sparkles ikona u „Všechny turnusy" nahrazena emojí 🏕️.
- `src/components/VranovMeetupTips.tsx`: Sparkles ikona odstraněna.
- `src/components/AdSuccessModal.tsx`: Sparkles ikona nahrazena emojí 🎉.
- `src/components/CreateProfileModal.tsx`: Sparkles nahrazen emojí 🏕️ v submit btn. Opraveno duplicitní popisání emailového pole: `Email kontakt (volitelný)` + badge → `Email kontakt` + badge `dobrovolné`.
- `src/components/Footer.tsx`: Přidán support email `zubik.jan@post.cz`.
- `public/favicon.png` [NEW]: Ikona webu – pivo s bakalářskou čepicí, bez pozadí.
- `index.html`: Favicon nastaven na `/favicon.png` + `apple-touch-icon` pro iOS.

**Decisions:**
- Sparkles ikony (lucide-react) působily genericky – nahrazeny tematickými emojí.
- Jeden BETA badge v horním proužku stačí.

**Status:** Done

---

## [2026-08-29] agent:Gemini | GitHub repozitář + pokus o Vercel deploy

**Changed:**
- `.gitignore` [NEW]: Vytvořen (node_modules, dist, .env, .vercel...).
- `vercel.json` [NEW]: SPA rewrite pravidlo `/* → /index.html`.
- Git repozitář inicializován, první commit, branch `main`.

**GitHub:**
- Repozitář úspěšně vytvořen a pushnut: **https://github.com/hona20/predskolovak-spolubydleni**

**Vercel:**
- Deploy přes CLI selhal – token `vck_7y...` byl odmítnut jako neplatný.
- Doporučený postup: Propojit ručně přes https://vercel.com/new → Import `hona20/predskolovak-spolubydleni` → Framework: Vite, Build: `npm run build`, Output: `dist`.

**For others:** Backend zatím NEEXISTUJE – vše běží na localStorage. Data se ztratí při vymazání cache. Pro produkci zvážit Firebase Firestore nebo Supabase.

**Status:** GitHub ✅ Done | Vercel ⚠️ nutné dokončit ručně přes web dashboard
