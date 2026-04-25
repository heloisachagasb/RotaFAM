import { Component, HostBinding, ElementRef, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import KTComponents from '../metronic/core/index';
import KTLayout from '../metronic/app/layouts/demo1';

@Component({
  selector: 'app-main-layout',
  template: `
    <ng-container>
        <div class="wrapper flex grow flex-col">
            <app-header></app-header>
            <main class="grow content pt-10" id="content" role="content">
                <div class="container-fixed" id="content_container">
                </div>
                <div class="container-fixed">
                    <router-outlet></router-outlet>
                </div>
            </main>
            <app-footer></app-footer>
        </div>
    </ng-container>
  `,
})
export class MainLayoutComponent implements OnInit, AfterViewInit, OnDestroy {

    title = 'metronic-tailwind-angular';
    @HostBinding('class') hostClass = 'flex grow';
    private resizeObserver: ResizeObserver;

    constructor() {}

    ngAfterViewInit(): void {
        KTComponents.init();
        KTLayout.init();
        this.setupContentSizeObserver();
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        // Disconnect the observer when component is destroyed
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
    }

    private setupContentSizeObserver(): void {
        const contentElement = document.getElementById('content');
        if (!contentElement) {
            console.warn('Content element with ID "content" not found');
            return;
        }

        this.resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                const { width } = entry.contentRect;
                const header = document.querySelector('app-header');
                const footer = document.querySelector('app-footer');
                const headerHeight = header ? header.clientHeight : 0;
                const footerHeight = footer ? footer.clientHeight : 0;
                const screenHeight = window.innerHeight;
                const contentPadding = 20;
                const contentHeight = screenHeight - headerHeight - footerHeight - contentPadding;
;
                document.documentElement.style.setProperty('--content-width', `${width}px`);
                document.documentElement.style.setProperty('--content-height', `${ contentHeight}px`);
            }
        });

        this.resizeObserver.observe(contentElement);
    }

    paginaAtualPrincipal: string;
    paginaAtualSub?: string;

    naPaginaSelecionada(event: { main: string, sub?: string }) {
        this.paginaAtualPrincipal = event.main;
        this.paginaAtualSub = event.sub;
    }
}