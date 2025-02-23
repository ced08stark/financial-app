const whiteList: string[] = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:5500",
    "http://localhost:5000",
    "https://auto-ecole-backend.onrender.com",
    "https://financial-app-flds.onrender.com"
  ];
  
  /**
   * Vérifie si une adresse email contient une sous-chaîne spécifique.
   * @param adresseEmail - L'adresse email à vérifier.
   * @returns Un booléen indiquant si la sous-chaîne est présente.
   */
  function verifierAdresseEmail(adresseEmail: string): boolean {
    const sousChaine = "tcp-front-git-credenza-cabrelelvis187gmailcoms-projects.vercel.app";
    return adresseEmail.includes(sousChaine);
  }
  
  const corsOption = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void): void => {
      if (
        whiteList.includes(origin || "") || // Vérifie si l'origine est dans la liste blanche
        !origin || // Autorise les requêtes sans origine (ex: outils locaux)
        verifierAdresseEmail(origin) // Vérifie l'adresse email avec la sous-chaîne
      ) {
        callback(null, true); // Autorisation CORS accordée
      } else {
        callback(new Error("Not allowed by CORS")); // Refus de l'origine
      }
    },
    optionSuccessStatus: 200, // Statut pour les requêtes pré-échauffées
  };
  
  export default corsOption;
  