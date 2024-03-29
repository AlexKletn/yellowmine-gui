import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subject } from 'rxjs';

type MouseCoords = { x: number; y: number };

@Injectable({ providedIn: 'root' })
export default class MouseService {
  private _mouseDownCoords: MouseCoords = { x: 0, y: 0 };
  private mouseCoords: MouseCoords = { x: 0, y: 0 };
  mouseDownCoords: Subject<MouseCoords> = new Subject<MouseCoords>();
  mouseCoords$: Subject<MouseCoords> = new Subject<MouseCoords>();

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.document.addEventListener('pointermove', (e) => {
      this.mouseMoveHandler(e);
    });

    this.document.addEventListener('dragover', (e) => {
      this.mouseMoveHandler(e);
    });

    this.document.addEventListener('mousedown', (e) => {
      this.mouseDownHandler(e);
    });

    this.mouseCoords$.subscribe({
      next: (coords) => {
        this.mouseCoords = coords;
      },
    });

    this.mouseDownCoords.subscribe({
      next: (coords) => {
        this._mouseDownCoords = coords;
      },
    });
  }

  getElementMouseOffset(element: HTMLElement): { x: number; y: number } {
    const elementBoundingRect = element.getBoundingClientRect();

    const x = this._mouseDownCoords.x - elementBoundingRect.left;
    const y = this._mouseDownCoords.y - elementBoundingRect.top;

    return { x, y };
  }

  getMouseElementCoords(element: HTMLElement): MouseCoords {
    const { x, y } = this.getElementMouseOffset(element);

    return {
      x: this.mouseCoords.x - x,
      y: this.mouseCoords.y - y,
    };
  }

  private mouseMoveHandler = (e: MouseEvent) => {
    this.mouseCoords$.next({ x: e.pageX, y: e.pageY });
  };

  private mouseDownHandler = (e: MouseEvent) => {
    this.mouseDownCoords.next({ x: e.clientX, y: e.clientY });
  };
}
