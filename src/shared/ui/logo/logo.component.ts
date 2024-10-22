import { NgOptimizedImage } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Ripple } from 'primeng/ripple';

@Component({
  selector: 'ym-logo',
  standalone: true,
  imports: [
    NgOptimizedImage,
    Ripple,
  ],
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss',
})
export class LogoComponent {
  @Input() height: string = '2em';
  @Input() width: string = '2em';
}
