import { HttpService } from './../../../services/http.service';
import { Component, Input, OnInit, SimpleChange, ViewChild } from '@angular/core';
import { Calendar, EventApi, EventInput } from '@fullcalendar/core';
import { FullCalendarComponent } from '@fullcalendar/angular';

import dayGridPlugin, { DayGridView } from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import * as _ from 'lodash'
import Tooltip from 'tooltip.js';
import { EventClickInfo } from '../event-click-info';
import { Task } from 'src/app/models/task';
import { AddTaskComponent } from 'src/app/shared/modals/add-task/add-task.component';
import { NewEditTaskComponent } from 'src/app/shared/modals/new-edit-task/new-edit-task.component';
import { ApiUrl } from 'src/app/services/apiUrls';

@Component({
    selector: 'app-calender-view',
    templateUrl: './calender-view.component.html',
    styleUrls: ['./calender-view.component.css']
})
export class CalenderViewComponent implements OnInit {

    @Input() tasks: Task[];
    // set t(value) {
    //     if (value) {
    //         this.tasks = value;
    //         this.convertTasksToEvents();
    //     }
    // }

    @ViewChild('calendar', { static: false }) calendarComponent: FullCalendarComponent;

    calendarPlugins = [dayGridPlugin, timeGridPlugin, interactionPlugin];
    calendarWeekends = true;

    @ViewChild('calenderEl', { static: true })
    calenderEl: FullCalendarComponent;

    validRange: any = {};
    calendarEvents: EventInput[] = [
        { title: 'My event', start: new Date(), date: new Date(), color: 'green' },
        { title: 'My event2', start: new Date(), date: new Date() },
        { title: 'My event3', start: new Date(), date: new Date() }
    ];

    ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
        console.log(changes);
        if ('tasks' in changes) {
            if (this.tasks) {
                this.convertTasksToEvents();
            }
        }

    }
    constructor(public http: HttpService) { }

    ngOnInit() {
    }

    convertTasksToEvents() {
        console.log("convert tasks to events");
        let events: EventInput[] = [];
        this.tasks.forEach(x => {
            events.push({
                title: x.title, 
                start: new Date(x.startDateTime),
                date: new Date(x.createdAt), 
                end: new Date(x.dueDateTime), 
                color: 'green',
                data: x,
                allDay: true
            });
        })
        this.calendarEvents = events;
    }



    onEventClick(clickedEvent: EventClickInfo) {
        console.log(clickedEvent);
        const task = clickedEvent.event.extendedProps.data;
        
        this.openEditNewTask(task);
    }

    
    handleDateClick(arg) {
        console.log(arg);
        this.openAddTask();
    }
    onEventResize(event) {
        console.log(event);
    }

    openAddTask(data?) {
        this.http.showModal(AddTaskComponent, 'md');
    }

    openEditNewTask(data?) {
        this.http.showModal(NewEditTaskComponent, 'md', data);
    }

    // onEventRender(info: EventClickInfo) {
    //     //   console.log('onEventRender', info.el);
    //     const tooltip = new Tooltip(info.el, {
    //         title: info.event.title,
    //         placement: 'top-end',
    //         trigger: 'hover',
    //         container: 'body'
    //     });

    //     info.el.onclick = (event) => {
    //         console.log("onEventClick", info.event);
    //         // open task in edit mode from sidebar.
    //     }
    //     // info.el.oncontextmenu = (event) => {
    //     //     console.log("onEventRightClick", info.event.title);
    //     // }
    //     // info.el.ondblclick = (event) => {
    //     //     console.log("onEventDoubleClick", info.event.title);
    //     // }

    // }

    // dateRender(info: EventClickInfo) {
    //     console.log("dateRender....");
    //     console.log(this.calenderEl)
    //     console.log(info);
    //     // info.el.oncontextmenu = (event) => {
    //     //     console.log("onDateRightClick", info.event.title);
    //     // }
    //     // info.el.onclick = (event) => {
    //     //     console.log("onDateClick", info.event.title);
    //     // }
    //     info.el.ondblclick = (event) => {
    //         console.log("onDateDoubleClick", info.event.title);
    //         // open side bar then add new task (evnet); 
    //     }


    // }



    onEventDragStart(event:EventClickInfo) {
        console.log("start=>", event.event._instance.range);
    }

    onEventDragStop(event:EventClickInfo) {
        console.log("stop=>", event.event._instance.range);
    }
    
    onEventDrop(event:EventClickInfo) {
        console.log("drop=>", event.event._instance.range);

        const start = _.clone(event.event._instance.range.start) ;
        const end = _.clone(event.event._instance.range.end);
        const task: Task = _.clone(event.event.extendedProps.data);
        task.startDateTime = start.setHours(start.getHours());
        task.dueDateTime = end.setHours(end.getHours());

        let obj = {
            taskId: task._id,
            startDateTime: task.startDateTime,
            dueDateTime: task.dueDateTime
        }
        
        this.updateTask(obj);
    }

    updateTask(obj: any) {
 
        this.http.postDataNew(ApiUrl.ADD_TASK, obj).subscribe((res) => {
              this.http.openSnackBar('Task Updated Successfully') 
              this.http.eventSubject.next({eventType: 'addTask'}); /* will refresh the list */
        });
    
    }

    
}
