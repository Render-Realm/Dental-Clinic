# Dental Clinic Website Template

Pages: `index.html` (Home), `services.html`, `about.html`, `dentists.html`, `contact.html`
Browser mein kholne ke liye bas `index.html` double-click karein. Koi build/install ki zarurat nahi.

## Kya kahan change karna hai
| Cheez | File |
|---|---|
| Fonts: Primary / Secondary / Tertiary | `assets/css/theme.css` |
| Colors: One se Five | `assets/css/theme.css` |
| Clinic naam, email, phone, address, timings, WhatsApp number, map address, social links, form URL | `assets/js/site.config.js` |
| Animations / hover effects | `assets/css/motion.css` + `assets/js/motion.js` (band karne ke liye pages se inka link hata dein) |
| Images | `assets/images/` (same naam se replace karein) |
| Page ka text | us page ki `.html` file |

## Theme guide
Fonts: primary = Manrope (headings/body), secondary = Fraunces (logo), tertiary = Instrument Serif (italic highlight words)
Colors: one = dark text, two = brand, three = soft background, four = deep brand (footer), five = white

## Structure
```
├── index.html  services.html  about.html  dentists.html  contact.html
└── assets/
    ├── css/  theme.css  base.css  motion.css
    ├── js/   site.config.js  site.js  motion.js
    └── images/
```

## Smooth scroll
GSAP ScrollSmoother CDN (jsdelivr, gsap@3.13.0) se load hota hai, to internet chahiye. Na mile to normal scroll chalta hai. Speed badalne ke liye `assets/js/motion.js` mein `smooth: 1.3` (zyada = zyada smooth/slow).

## WhatsApp, Map, Forms
- `whatsapp` (country code ke saath, bina +, jaise 923001234567): floating button, saari "Book" buttons aur contact form isi se chalte hain.
- Contact form: `formEndpoint` khali ho to WhatsApp khulta hai message likha hua. Formspree URL daalein to email par aata hai.
- Map: `mapQuery` mein address, ya Google Maps ka embed src `mapEmbed` mein.
- Social links khali hon to chhup jate hain. Terms/Privacy/Cookies ka text `legal.html` mein badlein.
