import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../shared/modules/shared.module';
import {DocumentsComponent} from './documents.component';
import {RouterModule, Routes} from '@angular/router';
import {ApprovalDocumentComponent} from './approval-document/approval-document.component';
import {AuthGuardService as AuthGuard} from '../../services/authguard.service';
import {GridsterModule} from 'angular-gridster2';
import { CKEditorModule } from 'ng2-ckeditor';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { MenusModule } from '@progress/kendo-angular-menu';
import { UploadsModule } from '@progress/kendo-angular-upload';
import { EditorModule } from '@progress/kendo-angular-editor';
import { LabelModule } from '@progress/kendo-angular-label';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

const routes: Routes = [
    {
        path: '', children: [
            {
                path: '',
                component: DocumentsComponent,
                data: {title: 'Documents'},
                canActivate: [AuthGuard]
            },
             {
                path: 'approve-doc/:id',
                component: ApprovalDocumentComponent,
                data: {title: 'Documents'},
                canActivate: [AuthGuard]
            }, 
        ]
    }
];

@NgModule({
    imports: [
        GridsterModule,
        CKEditorModule,
        SharedModule,
        TreeViewModule,
        MenusModule,
        UploadsModule,
        EditorModule,
        LabelModule,
        InputsModule,
        LayoutModule,
        DateInputsModule,
        DropDownsModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
      DocumentsComponent,
      ApprovalDocumentComponent      
    ]
})
export class DocumentsModule {
}

