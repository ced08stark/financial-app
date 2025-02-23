import bcrypt from "bcrypt";

/**
 * Hache des données avec un nombre spécifique de "salt rounds".
 * @param data - Les données à hacher.
 * @param saltRounds - Le nombre de rounds pour le salage (par défaut 10).
 * @returns Une promesse contenant les données hachées.
 */
export const hashData = async (data: string, saltRounds: number = 10): Promise<string> => {
  try {
    const hashedData = await bcrypt.hash(data, saltRounds);
    return hashedData;
  } catch (error) {
    throw new Error(`Erreur lors du hachage des données : ${(error as Error).message}`);
  }
};

/**
 * Vérifie si des données non hachées correspondent à un hachage.
 * @param unhashed - Les données non hachées.
 * @param hashed - Le hachage à vérifier.
 * @returns Une promesse contenant un booléen indiquant si les données correspondent.
 */
export const verifyHashedData = async (unhashed: string, hashed: string): Promise<boolean> => {
  try {
    const match = await bcrypt.compare(unhashed, hashed);
    return match;
  } catch (error) {
    throw new Error(`Erreur lors de la vérification du hachage : ${(error as Error).message}`);
  }
};
