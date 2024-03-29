import { inject } from '@angular/core';
import RedmineApiService from '../../../core/services/redmine-api/redmine-api.service';
import ProjectsService from '../../projects/services/projects.service';
import Project from '../../projects/domain/Project';
import { WikiPageResponse, WikiPagesResponse } from './types';
import { WikiPage } from '../domain/types';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import textile from 'textile-js';
import linkifyHtml from 'linkify-html';
import _ from 'lodash';

export default class WikiService {
  private redmineApiService = inject(RedmineApiService);
  private projectsService = inject(ProjectsService);

  private activeProject?: Project;

  constructor() {
    this.projectsService.activeProject.subscribe((project) => {
      this.activeProject = project;
    });
  }

  getWikiPages() {
    return this.redmineApiService.get<WikiPagesResponse>(`/api/projects/${this.activeProject?.identifier}/wiki/index.json`);
  }

  getWikiPage(title: WikiPage['title'] = 'wiki') {
    return this.redmineApiService.get<WikiPageResponse>(`/api/projects/${this.activeProject?.identifier}/wiki/${title}.json`);
  }

  transformPageText(text: string) {
    const wikiLinks = text
      .replace(/\[\[(.+?)\|(.+?)]]/g, (match, url, label) => {
        const urlBrackets = encodeURIComponent((url).replace(/"/g, '%22').replace(/\s/g, '_'));

        return `<a href="/wiki/${urlBrackets}">${label}</a>`;
      }) /// )
      .replace(/\[\[(.+?)]]/g, (m, urlLabel) => {
        const urlBrackets = encodeURIComponent((urlLabel).replace(/"/g, '%22').replace(/\s/g, '_'));

        return `<a href="/wiki/${urlBrackets}">${urlLabel}</a>`;
      }); /// );

    console.log('wikiLinks', wikiLinks);

    return linkifyHtml(
      textile(wikiLinks, {
        parse: () => {
          console.log('fdsa');
        },
      }), {
        attributes: {
          target: '_blank',
        },
        validate: {
          url: value => /^https?:\/\//.test(value),
        },
        format: {
          url: (value) => {
            try {
              const url = new URL(value);

              const host = url.hostname.replace('www.', '');

              if (host === 'figma') {
                return 'Макет в Figma';
              }
              if (/gitlab/.test(host)) {
                return 'Gitlab/' + url.pathname.replace(/^.+?\/([\w-]+)($|(\/-))/i, '$1');
              }
              if (/swagger/.test(url.pathname)) {
                return host + '/Swagger';
              }

              return _.capitalize(host);
            }
            catch (e) {
              return value;
            }
          },
          target: '_blank',
        },
      });
  }
}
