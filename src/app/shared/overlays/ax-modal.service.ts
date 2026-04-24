import { ComponentRef, InjectionToken, Injectable, Injector, Type, inject } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Subject, Observable } from 'rxjs';

export type AxModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface AxModalConfig<D = unknown> {
  /** Modal width preset. Default 'md'. */
  size?: AxModalSize;
  /** Arbitrary data passed to the opened component (read via inject(AX_MODAL_DATA)). */
  data?: D;
  /** Disable closing via ESC key. Default false. */
  disableClose?: boolean;
  /** Disable closing via backdrop click. Default false. */
  disableBackdropClose?: boolean;
  /** Additional CSS class applied to the modal panel. */
  panelClass?: string | string[];
  /** Accessible label for the dialog element. */
  ariaLabel?: string;
}

/** DI token used by modal content to read config.data. */
export const AX_MODAL_DATA = new InjectionToken<unknown>('AX_MODAL_DATA');

/**
 * Handle returned by AxModalService.open(). Use it to close the modal
 * programmatically and to listen for its eventual close result.
 */
export class AxModalRef<TComponent = unknown, TResult = unknown> {
  private readonly _afterClosed$ = new Subject<TResult | undefined>();

  constructor(
    private readonly overlayRef: OverlayRef,
    public readonly componentRef: ComponentRef<TComponent>,
  ) {}

  /** Emits once with the close result (if provided) when the modal is closed. */
  afterClosed(): Observable<TResult | undefined> {
    return this._afterClosed$.asObservable();
  }

  /** Close the modal, optionally with a result value returned to the caller. */
  close(result?: TResult): void {
    if (!this.overlayRef.hasAttached()) return;
    this.overlayRef.detach();
    this.overlayRef.dispose();
    this._afterClosed$.next(result);
    this._afterClosed$.complete();
  }
}

/**
 * Opens standalone components as modals.
 *
 * Usage:
 *   const ref = this.modal.open(MyComponent, {
 *     size: 'lg',
 *     data: { orderId: 42 }
 *   });
 *   ref.afterClosed().subscribe(result => ...);
 *
 * Inside MyComponent:
 *   private data = inject(AX_MODAL_DATA) as { orderId: number };
 *   private modalRef = inject(AxModalRef);
 *   close() { this.modalRef.close('confirmed'); }
 */
@Injectable({ providedIn: 'root' })
export class AxModalService {
  private readonly overlay = inject(Overlay);
  private readonly parentInjector = inject(Injector);

  open<T, R = unknown, D = unknown>(
    component: Type<T>,
    config: AxModalConfig<D> = {},
  ): AxModalRef<T, R> {
    const sizeClass = `ax-modal-${config.size ?? 'md'}`;
    const extraClasses = ([] as string[])
      .concat(config.panelClass ?? [])
      .concat('ax-modal', sizeClass);

    const overlayConfig = new OverlayConfig({
      hasBackdrop: true,
      backdropClass: 'ax-backdrop',
      panelClass: extraClasses,
      positionStrategy: this.overlay
        .position()
        .global()
        .centerHorizontally()
        .centerVertically(),
      scrollStrategy: this.overlay.scrollStrategies.block(),
      disposeOnNavigation: true,
    });

    const overlayRef = this.overlay.create(overlayConfig);

    // Placeholder ref so we can inject AxModalRef into the child component;
    // we mutate its fields once the component is attached.
    const modalRefPlaceholder = { ref: undefined as unknown as AxModalRef<T, R> };

    const injector = Injector.create({
      parent: this.parentInjector,
      providers: [
        { provide: AX_MODAL_DATA, useValue: config.data ?? null },
        { provide: AxModalRef, useFactory: () => modalRefPlaceholder.ref },
      ],
    });

    const portal = new ComponentPortal(component, null, injector);
    const componentRef = overlayRef.attach(portal);

    const modalRef = new AxModalRef<T, R>(overlayRef, componentRef);
    modalRefPlaceholder.ref = modalRef;

    // Backdrop click
    if (!config.disableBackdropClose) {
      overlayRef.backdropClick().subscribe(() => modalRef.close());
    }

    // ESC key
    if (!config.disableClose) {
      overlayRef.keydownEvents().subscribe(event => {
        if (event.key === 'Escape') {
          event.preventDefault();
          event.stopPropagation();
          modalRef.close();
        }
      });
    }

    // Accessibility attributes on the modal pane
    const paneEl = overlayRef.overlayElement;
    paneEl.setAttribute('role', 'dialog');
    paneEl.setAttribute('aria-modal', 'true');
    if (config.ariaLabel) {
      paneEl.setAttribute('aria-label', config.ariaLabel);
    }

    return modalRef;
  }
}
