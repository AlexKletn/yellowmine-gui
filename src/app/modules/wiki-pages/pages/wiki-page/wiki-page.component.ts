import { Component, inject } from '@angular/core';
import WikiService from '../../services/wiki.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'rm-wiki-page',
  standalone: true,
  imports: [],
  providers: [WikiService],
  templateUrl: './wiki-page.component.html',
  styleUrl: './wiki-page.component.scss',
})
export class WikiPageComponent {
  private wikiPagesService = inject(WikiService);
  private route = inject(ActivatedRoute);

  text?: string;
  page?: string;

  constructor() {
    this.route.params.subscribe(({ page }) => {
      this.page = page;
    });
  }

  ngOnInit() {
    this.wikiPagesService.getWikiPage(this.page).subscribe(({ wiki_page }) => {
      console.log(wiki_page);

      this.text = this.wikiPagesService.transformPageText(wiki_page.text);

      // console.log(this.text);
    });
  }
}
