import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AxModalContainerComponent,
  AxModalRef,
  AX_MODAL_DATA,
} from '../shared/overlays';

/** Example content for the demo modal. Opened by the design-system page. */
@Component({
  selector: 'app-sample-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, AxModalContainerComponent],
  template: `
    <app-ax-modal-container
      [title]="data?.title || 'Edit profile'"
      subtitle="Changes save instantly."
      (closed)="ref.close()"
    >
      <div body>
        <div class="ax-form-field ax-mb-4">
          <label class="ax-label">Display name</label>
          <input type="text" class="ax-input" [(ngModel)]="name" />
        </div>
        <div class="ax-form-field">
          <label class="ax-label">Bio</label>
          <textarea class="ax-textarea" rows="3" [(ngModel)]="bio"></textarea>
          <span class="ax-hint">A short blurb shown on your storefront.</span>
        </div>
      </div>
      <ng-container footer>
        <button class="ax-btn ax-btn-ghost" (click)="ref.close()">Cancel</button>
        <button class="ax-btn ax-btn-primary" (click)="ref.close({ name, bio })">Save changes</button>
      </ng-container>
    </app-ax-modal-container>
  `,
})
export class SampleModalComponent {
  readonly ref = inject(AxModalRef) as AxModalRef<SampleModalComponent, { name: string; bio: string }>;
  readonly data = inject(AX_MODAL_DATA) as { title?: string } | null;

  name = 'Sodiq Owolabi';
  bio = 'CEO, DOST HQ Limited. Building polished products for the Nigerian market.';
}
