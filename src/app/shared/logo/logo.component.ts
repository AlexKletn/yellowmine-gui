import { Component, Input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'rm-logo',
  standalone: true,
  imports: [
    NgOptimizedImage,
  ],
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss',
})
export class LogoComponent {
  @Input() height: string = '2em';
  @Input() width: string = '2em';
}
