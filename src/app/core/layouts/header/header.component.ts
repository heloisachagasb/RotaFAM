import { Component, ElementRef, HostBinding, OnInit, ViewChild } from '@angular/core';

declare var KTDrawer: any;

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

	@HostBinding('class') hostClass = 'header fixed top-0 z-10 left-0 right-0 flex items-stretch shrink-0 bg-[#11285F] dark:bg-[#09090B] border-b border-gray-200 shadow-sm';
	@HostBinding('attr.role') hostRole = 'banner';
	@HostBinding('attr.data-sticky') dataSticky = 'true';
	@HostBinding('attr.data-sticky-name') dataStickyName = 'header';
	@HostBinding('id') hostId = 'header';

	@ViewChild('ktPageTitle', { static: true }) ktPageTitle: ElementRef;
	
	dataHoraAtual: any | null = '';

	ngOnInit() {
		this.dataHoraAtual = new Date();
	}
}