import { IDescription } from "./description.interface";

export interface ICreneau {
    id: string,
    coursId: string,
    descriptions: IDescription[],
}