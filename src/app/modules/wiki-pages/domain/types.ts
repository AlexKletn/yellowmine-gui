export interface WikiPage {
  title: string;
  parent: Pick<WikiPage, 'title'> | null;
  version: string;
}
export interface WikiPageFull extends WikiPage {
  text: string;
}
