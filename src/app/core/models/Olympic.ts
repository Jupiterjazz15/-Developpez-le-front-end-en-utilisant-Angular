import { Participation } from './Participation';
// Importation de l'interface Participation.

export interface Olympic {
// Définition d'une interface TypeScript appelée Olympic.
// Les interfaces définissent la structure d'un objet notamment ses propriétés et leurs types.
// mot-clé "export" pour rendre l'interface accessible depuis d'autres fichiers.
  id: number;
  country: string;
  participations: Participation[];
  // Il peut y avoir 0 ou plusieurs instances de Participation dans ce tableau
}
