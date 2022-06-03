import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/modules/shared.module';
import {AppointmentsComponent} from './appointments.component';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService as AuthGuard} from '../../services/authguard.service';

import {FullCalendarModule} from '@fullcalendar/angular'; // for FullCalendar!
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction';
import {BookingComponent} from './booking/booking.component';

// FullCalendarModule.registerPlugins([ // register FullCalendar plugins
//     dayGridPlugin,
//     interactionPlugin
// ]);

const routes: Routes = [
    {
        path: '', children: [
            {
                path: '',
                component: AppointmentsComponent,
                data: {title: 'Appointments'},
                canActivate: [AuthGuard]
            }
        ]
    }
];

@NgModule({
    imports: [
        SharedModule, FullCalendarModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        AppointmentsComponent,

    ]
})
export class AppointmentsModule {
}
