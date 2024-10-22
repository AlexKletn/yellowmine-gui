import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RouterToolsService {
  private router = inject(Router);

  isActive(url: string, subset: boolean = false) {
    return this.router.isActive(
      url.replace(/\/$/, ''),
      {
        paths: subset ? 'subset' : 'exact',
        matrixParams: subset ? 'subset' : 'exact',
        queryParams: 'ignored',
        fragment: 'ignored',
      },
    );
  }
}
