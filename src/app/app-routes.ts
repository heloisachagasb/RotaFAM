import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { MainLayoutComponent } from './main-layout.component';

export const Routing: Routes = [
	{		
		path: '',
		redirectTo: 'auth/login',
		pathMatch: 'full'
	},
	{
		path: 'auth',
		loadChildren: () =>
			import('./core/auth/auth.module').then(m => m.AuthModule),
	},
	{
		component: MainLayoutComponent,
		path: '',
		children: [	
			{
				path: 'mapa',
				loadChildren: () => import('./features/mapa/mapa.module')
					.then(m => m.MapaModule)
			}
		],
	},
	{
		path: '**',
		redirectTo: '/auth/login',
	},
];

@NgModule({
	imports: [RouterModule.forRoot(Routing)],
	exports: [RouterModule],
})
export class AppRoutingModule { }