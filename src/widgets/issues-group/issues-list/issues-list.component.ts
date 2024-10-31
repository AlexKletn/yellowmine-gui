import { NgClass } from '@angular/common';
import { AfterViewInit, Component, effect, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { Select } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';

import Issue from '@entities/issues/model/types';
import { IssuesService } from '@features/issues/issues.service';
import { RequestFilter } from '@shared/api/redmine-api/RequestFilter';
import { PagePanelComponent } from '@shared/ui/page-panel/page-panel.component';
import { IssuesFilterComponent } from '@widgets/issues-group/issues-filter/issues-filter.component';

import { IssuesListItemComponent } from './issues-list-item/issues-list-item.component';

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
    ButtonModule,
    IssuesListItemComponent,
  ],
  templateUrl: './issues-list.component.html',
  styleUrl: './issues-list.component.scss',
})
export class IssuesListComponent implements OnInit, AfterViewInit {
  @ViewChild('list') list!: ElementRef;
  @ViewChild('listEnd') listEnd!: ElementRef;

  private issuesService = inject(IssuesService);
  protected filter = new RequestFilter(0, 50);
  private issuesAcc: Issue[] = [];

  protected isLoading = signal(true);
  private isEnd = false;

  issues = signal<Issue[]>([]);

  issuesPage = this.issuesService.issues(this.filter, this.isLoading);

  constructor() {
    effect(() => {
      if (!this.filter.offset) {
        this.issues.set(
          [
            ...this.issuesPage()?.issues ?? [],
          ],
        );

        this.issuesAcc = [];
      }
      else {
        this.issues.set(
          [
            ...this.issuesAcc,
            ...this.issuesPage()?.issues ?? [],
          ],
        );
      }

      this.issuesAcc.push(...this.issuesPage()?.issues ?? []);
    }, {
      allowSignalWrites: true,
    });

    effect(() => {
      const totalCount = this.issuesPage()?.total_count ?? 0;

      this.isEnd = this.issues().length >= totalCount;
    });
  }

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
