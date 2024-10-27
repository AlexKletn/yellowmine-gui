import { Component, inject, model, ViewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { ButtonModule } from 'primeng/button';
import { ColorPickerChangeEvent, ColorPickerModule } from 'primeng/colorpicker';
import { Popover, PopoverModule } from 'primeng/popover';
import { Ripple } from 'primeng/ripple';

import { AppConfigState } from '@shared/model/app-config';
import { SetAccentAction } from '@shared/model/app-config/store/actions/setAccent.action';

@Component({
  selector: 'ym-accent-palette',
  standalone: true,
  imports: [
    ButtonModule,
    Ripple,
    PopoverModule,
    ColorPickerModule,
    FormsModule,
  ],
  templateUrl: './accent-palette.component.html',
  styleUrl: './accent-palette.component.scss',
})
export class AccentPaletteComponent {
  @ViewChild('popover') popover!: Popover;

  private store = inject(Store);

  accent = toSignal(
    this.store.select(AppConfigState.accent),
  );

  currentColor = model(this.accent());

  toggle(event: Event) {
    this.popover.toggle(event);
  }

  changeHandler({ value }: ColorPickerChangeEvent) {
    this.store.dispatch(new SetAccentAction(value as `#${string}`));
  }
}
