export interface IProfesseur {
  id?: string;
  nom: string;
  prenom: string;
  email: string;
  matiereId: string | null;  // Changé de matiere à matiereId pour correspondre aux données
  statut: string;
}