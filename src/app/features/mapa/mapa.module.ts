import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "../../shared/shared.module";
import { MapaPageComponent } from "./pages/mapa-page/mapa-page.component";
import { MapaRoutingModule } from "./mapa.route";

@NgModule({
    declarations: [
        MapaPageComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MapaRoutingModule,
        SharedModule,
    ],
    providers: [
    ]
})

export class MapaModule { }