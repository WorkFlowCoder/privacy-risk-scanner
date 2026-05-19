export const cleanPageContent = (text: string): string => {
  return (
    text

      // UTF-8 normalization
      .normalize("NFKC")

      // remove zero-width chars
      .replace(/[\u200B-\u200D\uFEFF]/g, "")

      // normalize quotes
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'")

      // normalize spaces
      .replace(/\u00A0/g, " ")
      .replace(/\t/g, " ")

      // remove duplicated spaces
      .replace(/[ ]{2,}/g, " ")

      // remove huge line breaks
      .replace(/\n{3,}/g, "\n\n")

      // remove keyboard shortcuts
      .replace(/shift\s*\+\s*alt\s*\+\s*[A-Z]/gi, "")

      // remove isolated UI words
      .replace(/\b(Panier|Accueil|Commandes|Rechercher|Prime|Bonjour)\b/gi, "")

      // remove nav garbage
      .replace(
        /(Toutes nos catégories|Ventes Flash|Historique de navigation|Acheter à nouveau)/gi,
        ""
      )

      // remove footer garbage
      .replace(
        /(Retour en haut|Conditions générales de vente|Cookies|Amazon Music|Amazon Web Services)/gi,
        ""
      )

      // remove repeated blank lines again
      .replace(/\n{2,}/g, "\n")

      // trim
      .trim()
  )
}