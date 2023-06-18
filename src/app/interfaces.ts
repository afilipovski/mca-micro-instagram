export interface IPhoto {
    albumId: number;
    id: number;
    title: string;
    url: string;
    thumbnailUrl: string;
    bookmarked: boolean;
}
export interface IAlbum {
    userId: number;
    id: number;
    title: string;
}
export interface IUser {
    id: number;
    username: string;
}