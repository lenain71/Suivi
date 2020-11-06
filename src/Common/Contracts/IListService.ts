export interface IListService {
    getListsFromWeb(webUrl: string): Promise<Array<{url: string, title: string, id: string}>>;
}