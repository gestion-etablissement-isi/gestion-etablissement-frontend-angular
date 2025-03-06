export interface ICours {
  id?: string,
  titre: string,
  volumeHoraire: number,
  coefficient: number,
  anneeAcademique: string,
  matiereId: string,
  professeurId: string,
  classeId: string,
}
