/* SITE.CONFIG.JS — Brand ki saari info SIRF YAHAN badlein. Har page par khud update hogi. */
window.SITE = {
  name: "Smilora",                          // Clinic ka naam (header, footer, tab title)
  footerText: "Gentle, modern dental care for the whole family.",
  email: "hello@yourclinic.com",
  phone: "+92 300 0000000",
  address: "123 Clinic Street, Karachi",
  hours: "Mon – Sat, 9am – 8pm",

  // WhatsApp: country code ke saath, bina + ya spaces ke (Pakistan: 92 + number bina 0 ke)
  whatsapp: "923000000000",
  whatsappMessage: "Hello! I would like to book an appointment.",

  // Google Map: address likhein, ya Google Maps > Share > Embed a map ka src URL mapEmbed mein paste karein
  mapQuery: "123 Clinic Street, Karachi",
  mapEmbed: "",

  // Social links (khali chhor dein to wo icon/link chhup jata hai)
  social: { instagram: "", facebook: "", linkedin: "", youtube: "" },

  // Contact form: khali = WhatsApp khulta hai message likha hua. Formspree URL daalein to email par aayega.
  formEndpoint: "",

  nav: [
    { label: "Home", href: "index.html" },
    { label: "Services", href: "services.html" },
    { label: "About", href: "about.html" },
    { label: "Dentists", href: "dentists.html" },
    { label: "Contact", href: "contact.html" }
  ]
};
