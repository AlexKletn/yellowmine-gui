import {
  Component,
  effect,
  inject,
  input,
  OnInit,
  ɵcompileComponent,
  ViewContainerRef,
  ViewEncapsulation } from '@angular/core';
import { HighlightAuto } from 'ngx-highlightjs';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'ym-textile-view',
  standalone: true,
  imports: [],
  template: '',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './textile-view.component.scss',
})
export class TextileViewComponent implements OnInit {
  content = input('');
  viewRef = inject(ViewContainerRef);

  constructor() {
    effect(() => {
      this.updateContent(this.content());
    });
  }

  ngOnInit() {
    this.updateContent(this.content());
  }

  private updateContent(content: string) {
    this.viewRef.clear();
    const component = getComponentFromTemplate(content);

    this.viewRef.createComponent(component);
  }
}

@Component({
  template: '',
  standalone: true,
  styleUrl: './textile-view.component.scss',
}) class Textile {
}
function getComponentFromTemplate(template: string) {
  const escapedTemplate = template.replace(/([{}])/g, '{{\'$1\'}}');

  ɵcompileComponent(Textile, {
    template: `<div class="textile">${escapedTemplate}</div>`,
    standalone: true,
    imports: [ImageModule, HighlightAuto],
  });

  return Textile;
}
