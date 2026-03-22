# WEBSITE BRIEF — startup-premium-website-kit
# Popuni ovaj fajl za novi projekat, pa reci Claudeu:
# "new-website, brief je u /path/to/brief.md"
# Ostavi prazno ono što ne trebaš — Claude će preskočiti.
# ═══════════════════════════════════════════════════════════

# ── 01. PROJEKAT ────────────────────────────────────────────

naziv:          "Salon Bella"
domena:         "bella-linz.at"
repo-slug:      "salon-bella-website"        # GitHub repo naziv
jezik:          "de"                         # bs / hr / sr / de / en
tip:            "static"                     # static / nextjs
server-ip:      "157.180.67.68"              # default jebenko
server-path:    "/var/www/salon-bella/html"

# ── 02. BRAND ───────────────────────────────────────────────

brand:
  boja-primarna:    "#c9a96e"       # zlatna, ledena, zelena...
  boja-sekundarna:  "#1a1209"       # tamna pozadina
  boja-akcent:      "#ffffff"       # za kontrast
  boja-tekst:       "#f5f0e8"
  font-naslov:      "Playfair Display"   # Google Fonts naziv
  font-tijelo:      "DM Sans"
  stil:             "elegantno"     # elegantno / minimalistično / bold / dark / playful
  logo-fajl:        "images/logo.svg"        # putanja do logo fajla
  favicon-fajl:     "images/favicon.svg"
  og-slika:         "images/og-image.jpg"    # 1200×630px

# ── 03. SEO ─────────────────────────────────────────────────

seo:
  title:            "Salon Bella Linz — Friseur & Styling"    # max 60 znakova
  meta-description: "Ihr Premium-Friseur in Linz. Haarschnitt, Coloration & Styling. Jetzt Termin buchen: +43 732 123456"   # max 160 znakova
  kljucne-rijeci:   "Friseur Linz, Haarsalon Linz, Haarschnitt Linz"
  schema-tip:       "HairSalon"     # LocalBusiness / HairSalon / Restaurant / MedicalBusiness / LegalService / AutoRepair / itd.
  cijena-raspon:    "€€"            # € / €€ / €€€ / €€€€

# ── 04. HERO SEKCIJA ─────────────────────────────────────────

hero:
  naslov:       "Ihr Schönheitssalon\nin Linz"
  podnaslov:    "Wir verwöhnen Sie mit Leidenschaft und 20 Jahren Erfahrung."
  cta-tekst:    "Jetzt Termin buchen"
  cta-link:     "#kontakt"          # ili vanjski URL (Calendly, telefon...)
  cta2-tekst:   "Unsere Leistungen"  # drugi CTA (opciono)
  cta2-link:    "#usluge"
  hero-slika:   "images/hero.jpg"   # ili hero-video: "videos/hero.mp4"
  hero-video:   ""
  # Statistike ispod hero-a (opciono)
  stats:
    - broj: "20+"
      opis: "Jahre Erfahrung"
    - broj: "5.000+"
      opis: "Zufriedene Kunden"
    - broj: "4.9★"
      opis: "Google Bewertung"

# ── 05. O NAMA ───────────────────────────────────────────────

o-nama:
  naslov:   "Über uns"
  tekst:    |
    Seit 2004 sind wir Ihr vertrauensvoller Friseur in der Linzer Innenstadt.
    Unser erfahrenes Team aus 6 Stylisten steht für Qualität, Kreativität
    und persönliche Beratung — bei jedem Besuch.
  slika:    "images/about.jpg"
  cta:      "Unser Team kennenlernen"

# ── 06. USLUGE ───────────────────────────────────────────────

usluge:
  naslov:   "Leistungen"
  podnaslov: "Alles für Ihr perfektes Styling"
  stavke:
    - naziv:   "Haarschnitt Damen"
      opis:    "Waschen, Schneiden, Föhnen"
      cijena:  "ab €35"
      trajanje: "45 min"
      ikona:   "✂️"
    - naziv:   "Coloration"
      opis:    "Komplett-Coloration mit Pflegebehandlung"
      cijena:  "ab €65"
      trajanje: "90 min"
      ikona:   "🎨"
    - naziv:   "Balayage"
      opis:    "Natürlicher Farbverlauf, moderner Look"
      cijena:  "ab €95"
      trajanje: "120 min"
      ikona:   "🌟"
    - naziv:   "Hochzeitsstyling"
      opis:    "Probetermin + Tag der Hochzeit"
      cijena:  "auf Anfrage"
      trajanje: ""
      ikona:   "💍"

# ── 07. CIJENE TABELA (alternativa uslugama) ─────────────────
# Koristi ILI usluge ILI cijene-tabela, ne oba

cijene-tabela:
  aktivan: false
  naslov: "Preisliste"
  kolone: ["Leistung", "Dauer", "Preis"]
  redovi:
    - ["Herrenschnitt", "30 min", "€25"]
    - ["Damenschnitt", "45 min", "ab €35"]
    - ["Kinderschnitt (bis 12)", "20 min", "€18"]

# ── 08. TIM ──────────────────────────────────────────────────

tim:
  naslov:   "Unser Team"
  podnaslov: "Leidenschaftliche Stylisten mit Herz"
  clanovi:
    - ime:     "Isabella Kern"
      titula:  "Inhaberin & Senior Stylistin"
      opis:    "20 Jahre Erfahrung, spezialisiert auf Colorationen"
      foto:    "images/team/isabella.jpg"
      instagram: "isabella.bella"
    - ime:     "Markus Huber"
      titula:  "Herrenspezialist"
      opis:    "Experte für klassische und moderne Herrenschnitte"
      foto:    "images/team/markus.jpg"
      instagram: ""

# ── 09. GALERIJA / PORTFOLIO ──────────────────────────────────

galerija:
  naslov:   "Galerie"
  podnaslov: "Unsere Arbeiten"
  tip:      "grid"       # grid / masonry / slider / lightbox
  slike:
    - fajl:  "images/gallery/01.jpg"
      alt:   "Balayage — natürlicher Farbverlauf"
    - fajl:  "images/gallery/02.jpg"
      alt:   "Brautfrisur mit Blumenakzenten"
    - fajl:  "images/gallery/03.jpg"
      alt:   "Herrenschnitt — klassisch modern"
    # ... dodaj više

# ── 10. TESTIMONIJALI / RECENZIJE ────────────────────────────

testimonijali:
  naslov:   "Kundenstimmen"
  recenzije:
    - ime:     "Sarah M."
      tekst:   "Absolut begeistert! Isabella hat genau verstanden, was ich wollte. Beste Friseurin in Linz!"
      ocjena:  5
      izvor:   "Google"    # Google / Facebook / vlastito
    - ime:     "Thomas K."
      tekst:   "Super Atmosphäre, freundliches Team. Komme seit 5 Jahren hierher."
      ocjena:  5
      izvor:   "Google"

# ── 11. FAQ ──────────────────────────────────────────────────

faq:
  naslov:   "Häufige Fragen"
  pitanja:
    - pitanje: "Wie kann ich einen Termin buchen?"
      odgovor: "Sie können uns telefonisch, per WhatsApp oder über das Kontaktformular erreichen."
    - pitanje: "Sind Walk-Ins möglich?"
      odgovor: "Ja, nach Verfügbarkeit — wir empfehlen jedoch eine Voranmeldung."
    - pitanje: "Welche Zahlungsmittel akzeptieren Sie?"
      odgovor: "Bar, Karte (Visa, Mastercard) und Apple/Google Pay."

# ── 12. BLOG / NOVOSTI (opciono) ─────────────────────────────

blog:
  aktivan: false
  naslov:  "Aktuelles"
  # Blog postovi se dodaju naknadno

# ── 13. PARTNERI / KLIJENTI ──────────────────────────────────

partneri:
  aktivan: false
  naslov:  "Unsere Marken"
  logoi:
    - naziv: "Wella"
      logo:  "images/brands/wella.svg"
    - naziv: "Kerastase"
      logo:  "images/brands/kerastase.svg"

# ── 14. KONTAKT ──────────────────────────────────────────────

kontakt:
  naslov:       "Kontakt"
  podnaslov:    "Wir freuen uns auf Ihren Besuch"
  # Adresa
  adresa:       "Landstraße 15, 4020 Linz, Österreich"
  maps-url:     "https://maps.google.com/?q=Landstraße+15,+4020+Linz"
  maps-embed:   "https://www.google.com/maps/embed?pb=..."  # iframe embed URL
  # Kontakt podaci
  telefon:      "+43 732 123456"
  whatsapp:     "+43732123456"         # broj bez razmaka za wa.me link
  email:        "info@bella-linz.at"
  # Radno vrijeme
  radno-vrijeme:
    - "Montag – Freitag: 9:00 – 18:00"
    - "Samstag: 9:00 – 14:00"
    - "Sonntag: geschlossen"
  # Forma
  forma-aktivan: true
  forma-tip:    "web3forms"    # web3forms / formspree / emailjs / mailto
  forma-polja:
    - "Ime / Name"
    - "Email"
    - "Telefon (opciono)"
    - "Poruka / Nachricht"

# ── 15. FOOTER ───────────────────────────────────────────────

footer:
  copyright:  "© 2026 Salon Bella · Alle Rechte vorbehalten"
  linkovi:
    - naziv: "Datenschutz"
      url:   "/datenschutz"
    - naziv: "Impressum"
      url:   "/impressum"

# ── 16. SOCIAL MEDIA ─────────────────────────────────────────

social:
  instagram:  "salon.bella.linz"
  facebook:   "salonbellalinz"
  tiktok:     ""
  youtube:    ""
  linkedin:   ""
  whatsapp:   "+43732123456"     # floating WhatsApp dugme

# ── 17. TEHNIČKI SETUP ───────────────────────────────────────

tehnika:
  ga4-id:           "G-XXXXXXXXXX"      # Google Analytics 4
  web3forms-key:    "xxxx-xxxx-xxxx"    # web3forms.com access key
  formspree-id:     ""                  # alternativa web3forms
  gtm-id:           ""                  # Google Tag Manager (opciono)
  clarity-id:       ""                  # Microsoft Clarity (heatmaps)
  cookie-consent:   true                # GDPR cookie banner
  pwa:              true                # Progressive Web App manifest
  service-worker:   false               # Offline support
  # Booking integracija (opciono)
  booking-tip:      ""                  # calendly / booksy / treatwell / ""
  booking-url:      ""                  # https://calendly.com/bella-linz

# ── 18. LEGAL (posebne stranice) ─────────────────────────────

legal:
  impressum:    true       # Obavezno za .at .de domene
  datenschutz:  true       # Privacy Policy (GDPR)
  agb:          false      # Terms of Service
  cookie-info:  true
  firma-ime:    "Salon Bella GmbH"
  firma-uid:    "ATU12345678"     # UID broj
  firma-adresa: "Landstraße 15, 4020 Linz"
  kontakt-osoba: "Isabella Kern"

# ── 19. POSEBNE FUNKCIONALNOSTI ──────────────────────────────

extras:
  dark-mode:          false    # dark/light toggle
  under-construction: false    # "Coming soon" stranica prije launchaa
  multilingual:       false    # više jezika
  jezici:             []       # ["de", "en"]
  animacije:          true     # scroll animacije, hover efekti
  particle-bg:        false    # čestica animacija u pozadini
  typed-text:         false    # animirani typing efekat u hero
  smooth-scroll:      true
  back-to-top:        true
  preloader:          false    # loading screen
  gdpr-video:         false    # YouTube/Vimeo sa GDPR wrapperom

# ── 20. SLIKE — KOMPLETNA LISTA ──────────────────────────────
# Claude će generisati <picture> elemente s WebP + PNG fallbackom
# za sve slike koje nabrojiš

slike:
  logo:             "images/logo.svg"
  logo-bijeli:      "images/logo-white.svg"
  favicon:          "images/favicon.svg"
  og-image:         "images/og-image.jpg"      # 1200×630px
  apple-touch:      "images/apple-touch-icon.png"  # 180×180px
  hero:             "images/hero.jpg"
  about:            "images/about.jpg"
  galerija:
    - "images/gallery/01.jpg"
    - "images/gallery/02.jpg"
    - "images/gallery/03.jpg"
  tim:
    - "images/team/isabella.jpg"
    - "images/team/markus.jpg"
  pattern:          ""         # background pattern/texture

# ═══════════════════════════════════════════════════════════
# NAPOMENA: Popuni samo sekcije koje trebaš.
# Sve što ostaviš prazno ili false → Claude preskači.
# Minimalan brief: naziv, domena, jezik, hero.naslov, kontakt.
# ═══════════════════════════════════════════════════════════
