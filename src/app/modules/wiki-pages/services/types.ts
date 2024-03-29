import { WikiPage, WikiPageFull } from '../domain/types';

export interface WikiPagesResponse {
  wiki_pages: Array<WikiPage>;
}

export interface WikiPageResponse {
  wiki_page: WikiPageFull;
}
