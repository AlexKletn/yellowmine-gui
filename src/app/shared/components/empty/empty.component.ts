import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'rm-empty',
  standalone: true,
  imports: [
    NgOptimizedImage,
  ],
  templateUrl: './empty.component.html',
  styleUrl: './empty.component.scss',
})
export class EmptyComponent {

}
