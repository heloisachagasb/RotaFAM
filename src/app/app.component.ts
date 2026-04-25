import { AfterViewInit, Component, HostBinding, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import KTComponents from '../metronic/core/index';
import KTLayout from '../metronic/app/layouts/demo1';
import { HttpClientModule } from '@angular/common/http';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit, OnInit {
	title = 'metronic-tailwind-angular';
	@HostBinding('class') hostClass = 'flex grow';

	ngAfterViewInit(): void {
		KTComponents.init();
		KTLayout.init();
	}

	ngOnInit(): void {
	}

	paginaAtualPrincipal: string;
	paginaAtualSub?: string;

	naPaginaSelecionada(event: { main: string, sub?: string }) {
		this.paginaAtualPrincipal = event.main;
		this.paginaAtualSub = event.sub;
	}
}