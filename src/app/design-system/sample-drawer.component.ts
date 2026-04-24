import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AxDrawerContainerComponent,
  AxDrawerRef,
  AX_DRAWER_DATA,
} from '../shared/overlays';

/** Example content for the demo drawer — a read-only "order details" pane. */
@Component({
  selector: 'app-sample-drawer',
  standalone: true,
  imports: [CommonModule, AxDrawerContainerComponent],
  template: `
    <app-ax-drawer-container
      title="Order {{ data?.orderRef || 'ABY-240098' }}"
      subtitle="Placed 22 Apr 2026 · AED 1,240"
      (closed)="ref.close()"
    >
      <div body>
        <section class="ax-mb-5">
          <h3 class="ax-eyebrow ax-mb-2">Customer</h3>
          <p class="ax-m-0">Amal Al-Maktoum</p>
          <p class="ax-m-0 ax-text-sm ax-text-secondary">amal&#64;example.ae · +971 50 123 4567</p>
        </section>

        <section class="ax-mb-5">
          <h3 class="ax-eyebrow ax-mb-2">Items</h3>
          <ul class="ax-m-0 ax-p-0" style="list-style: none;">
            <li class="ax-flex ax-justify-between ax-py-2 ax-border-b ax-border-subtle">
              <span>Silk kaftan, size M</span>
              <span class="ax-font-semibold">AED 780</span>
            </li>
            <li class="ax-flex ax-justify-between ax-py-2 ax-border-b ax-border-subtle">
              <span>Gold bangle</span>
              <span class="ax-font-semibold">AED 420</span>
            </li>
            <li class="ax-flex ax-justify-between ax-py-2">
              <span>Delivery</span>
              <span class="ax-text-secondary">AED 40</span>
            </li>
          </ul>
        </section>

        <section>
          <h3 class="ax-eyebrow ax-mb-2">Status</h3>
          <span class="ax-badge ax-badge-success">Delivered</span>
        </section>
      </div>

      <ng-container footer>
        <button class="ax-btn ax-btn-ghost" (click)="ref.close()">Close</button>
        <button class="ax-btn ax-btn-primary">View full invoice</button>
      </ng-container>
    </app-ax-drawer-container>
  `,
})
export class SampleDrawerComponent {
  readonly ref = inject(AxDrawerRef);
  readonly data = inject(AX_DRAWER_DATA) as { orderRef?: string } | null;
}
