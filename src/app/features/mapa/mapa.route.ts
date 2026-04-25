import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MapaPageComponent } from "./pages/mapa-page/mapa-page.component";

const routes: Routes = [
    {
        path: '',
        component: MapaPageComponent,
        data: { breadcrumb: "Mapa" }
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})

export class MapaRoutingModule{}