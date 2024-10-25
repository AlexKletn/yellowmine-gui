import { NgClass } from '@angular/common';
import { AfterViewInit, Component, effect, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Ripple } from 'primeng/ripple';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { Select } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';

import Issue from '@entities/issues/model/types';
import { IssuesService } from '@features/issues/issues.service';
import { RequestFilter } from '@shared/api/redmine-api/RequestFilter';
import { RouterToolsService } from '@shared/model/router-tools/router-tools.service';
import { PagePanelComponent } from '@shared/ui/page-panel/page-panel.component';
import { IssuesFilterComponent } from '@widgets/issues-group/issues-filter/issues-filter.component';

@Component({
  selector: 'ym-issues-list',
  standalone: true,
  imports: [
    PagePanelComponent,
    ScrollPanelModule,
    Ripple,
    RouterLink,
    NgClass,
    Select,
    IssuesFilterComponent,
    SkeletonModule,
  ],
  templateUrl: './issues-list.component.html',
  styleUrl: './issues-list.component.scss',
})
export class IssuesListComponent implements OnInit, AfterViewInit {
  @ViewChild('list') list!: ElementRef;
  @ViewChild('listEnd') listEnd!: ElementRef;

  private routerTools = inject(RouterToolsService);
  private issuesService = inject(IssuesService);
  protected filter = new RequestFilter(0, 50);
  private issuesAcc: Issue[] = [];

  protected isLoading = signal(true);
  private isEnd = false;

  issues = signal<Issue[]>([]);

  issuesPage = this.issuesService.issues(this.filter, this.isLoading);

  constructor() {
    effect(() => {
      this.issues.set(
        [
          ...this.issuesAcc,
          ...this.issuesPage()?.issues ?? [],
        ],
      );

      this.issuesAcc.push(...this.issuesPage()?.issues ?? []);
    }, {
      allowSignalWrites: true,
    });

    effect(() => {
      const totalCount = this.issuesPage()?.total_count ?? 0;

      this.isEnd = this.issues().length >= totalCount;
    });
  }

  isActive(url: string, s?: boolean) {
    return this.routerTools.isActive(url, s);
  };

  ngOnInit() {
    this.filter.make();
  }

  ngAfterViewInit() {
    this.registerIntersection();
  }

  private registerIntersection() {
    const observer = new IntersectionObserver(
      ([scrollEndIntersect]) => {
        if (scrollEndIntersect.isIntersecting && !this.isEnd) {
          this.filter.increment(25);
        }
      }, {
        root: this.list.nativeElement,
      },
    );

    observer.observe(this.listEnd.nativeElement);
  };
}
