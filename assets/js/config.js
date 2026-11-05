/* =============================================================
   GLOBAL MARKET INVESTMENT — CONFIGURATION DU SITE
   -------------------------------------------------------------
   Tout ce qui doit être confirmé par l'entreprise se règle ICI.
   Aucune autre modification de code n'est nécessaire.
   ============================================================= */
window.GMI_CONFIG = {

  /* --- Téléphone -----------------------------------------------
     ⚠ Numéro reçu : "+221 78 422 23 2" — il semble incomplet
     (un numéro sénégalais compte 9 chiffres après +221).
     Remplacez-le par le numéro complet puis passez
     phoneConfirmed à true pour retirer la mention "à confirmer". */
  phone: "+221 78 422 23 2",
  phoneConfirmed: false,

  /* --- WhatsApp (optionnel) ------------------------------------
     Chiffres uniquement, avec indicatif, ex : "221784222320".
     Laissez vide pour masquer tous les boutons WhatsApp. */
  whatsapp: "",

  /* --- Telegram (confirmé) ------------------------------------ */
  telegramChannel: "https://t.me/+8cWmCWZB1ItlN2U0",
  telegramSupport: "globalmarketinternational",

  /* --- Coordonnées optionnelles (vide = masqué) --------------- */
  email: "",
  address: { fr: "", en: "" },
  hours:   { fr: "", en: "" },

  /* --- Réseaux sociaux (vide = masqué) ------------------------ */
  social: {
    facebook: "",
    instagram: "",
    tiktok: "",
    youtube: "",
    linkedin: "",
    x: ""
  },

  /* --- Envoi des formulaires -----------------------------------
     URL d'un service de formulaires (Formspree, Getform, Basin,
     Web3Forms, votre propre API…). Le site envoie une requête
     POST en JSON. Laissé vide : la demande est mise en forme et
     le visiteur l'envoie lui-même au support Telegram
     (copie automatique + ouverture de Telegram). */
  formEndpoint: "",

  /* --- Programmes de formation ---------------------------------
     Durées et prix NON communiqués : laissez vide pour afficher
     "À confirmer". Exemple : duration: { fr: "6 semaines", en: "6 weeks" },
     price: { fr: "150 000 FCFA", en: "150,000 FCFA" } */
  programs: {
    fondamentaux:  { duration: { fr: "", en: "" }, price: { fr: "", en: "" } },
    technique:     { duration: { fr: "", en: "" }, price: { fr: "", en: "" } },
    risque:        { duration: { fr: "", en: "" }, price: { fr: "", en: "" } },
    propfirm:      { duration: { fr: "", en: "" }, price: { fr: "", en: "" } },
    psychologie:   { duration: { fr: "", en: "" }, price: { fr: "", en: "" } },
    mentorat:      { duration: { fr: "", en: "" }, price: { fr: "", en: "" } }
  }
};
