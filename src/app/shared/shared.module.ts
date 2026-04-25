import { LOCALE_ID, NgModule } from "@angular/core";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { FormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { CommonModule, CurrencyPipe, DatePipe } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgxFileDropModule } from "ngx-file-drop";
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { CurrencyMaskConfig, CurrencyMaskModule, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask';


export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
    align: "left",
    allowNegative: true,
    decimal: ",",
    precision: 2,
    prefix: "R$ ",
    suffix: "",
    thousands: "."
};

@NgModule({
    declarations: [
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        FormsModule,
        NgSelectModule,
        CurrencyPipe,
        DatePipe,
        NgxFileDropModule,
        NgxMaskDirective,
        CurrencyMaskModule,
    ],
    providers: [
        { provide: LOCALE_ID, useValue: 'pt-BR' }, // Define o locale como 'pt-BR'
        { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig },
        provideNgxMask(),
    ],
    exports: [
        CommonModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        FormsModule,
        NgSelectModule,
        CurrencyPipe,
        DatePipe,
        NgxMaskDirective,
        CurrencyMaskModule,
    ]
})
export class SharedModule { }