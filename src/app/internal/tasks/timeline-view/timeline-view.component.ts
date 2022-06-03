import { Component, OnInit, ViewChild } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import * as _ from 'lodash'
import Tooltip from 'tooltip.js'; 


import { Calendar, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // for dateClick
import resourceTimeline from "@fullcalendar/resource-timeline";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";

@Component({
  selector: 'app-timeline-view',
  templateUrl: './timeline-view.component.html',
  styleUrls: ['./timeline-view.component.css']
})
export class TimelineViewComponent implements OnInit {

  constructor() {
    const name = Calendar.name; // add this line in your constructor
   }

  ngOnInit() {
  }

  @ViewChild('calendar', { static: false }) calendarComponent: FullCalendarComponent;

  calendarPlugins = [
    dayGridPlugin,
    timeGrigPlugin,
    interactionPlugin,
    resourceTimeline,
    resourceTimeGridPlugin,
  ];
  calendarWeekends = true;

  @ViewChild('calenderEl', { static: true })
  calenderEl: FullCalendarComponent;

  validRange: any = {};
  calendarEvents: EventInput[] = [
      { title: 'My event', start: new Date(), date: new Date() },
      { title: 'My event2', start: new Date(), date: new Date() },
      { title: 'My event3', start: new Date(), date: new Date() }
  ];

  resources = [
    { id: 'a', building: '460 Bryant', title: 'Auditorium A' },
    { id: 'b', building: '460 Bryant', title: 'Auditorium B' },
    { id: 'c', building: '460 Bryant', title: 'Auditorium C' },
    { id: 'd', building: '460 Bryant', title: 'Auditorium D' },
    { id: 'e', building: '460 Bryant', title: 'Auditorium E' },
    { id: 'f', building: '460 Bryant', title: 'Auditorium F' },
    { id: 'g', building: '564 Pacific', title: 'Auditorium G' },
    { id: 'h', building: '564 Pacific', title: 'Auditorium H' },
    { id: 'i', building: '564 Pacific', title: 'Auditorium I' },
    { id: 'j', building: '564 Pacific', title: 'Auditorium J' },
    { id: 'k', building: '564 Pacific', title: 'Auditorium K' },
    { id: 'l', building: '564 Pacific', title: 'Auditorium L' },
    { id: 'm', building: '564 Pacific', title: 'Auditorium M' },
    { id: 'n', building: '564 Pacific', title: 'Auditorium N' },
    { id: 'o', building: '101 Main St', title: 'Auditorium O' },
    { id: 'p', building: '101 Main St', title: 'Auditorium P' },
    { id: 'q', building: '101 Main St', title: 'Auditorium Q' },
    { id: 'r', building: '101 Main St', title: 'Auditorium R' },
    { id: 's', building: '101 Main St', title: 'Auditorium S' },
    { id: 't', building: '101 Main St', title: 'Auditorium T' },
    { id: 'u', building: '101 Main St', title: 'Auditorium U' },
    { id: 'v', building: '101 Main St', title: 'Auditorium V' },
    { id: 'w', building: '101 Main St', title: 'Auditorium W' },
    { id: 'x', building: '101 Main St', title: 'Auditorium X' },
    { id: 'y', building: '101 Main St', title: 'Auditorium Y' },
    { id: 'z', building: '101 Main St', title: 'Auditorium Z' }
  ]

  dateRender($event: any) {
      console.log("dateRender....");
      console.log(this.calenderEl)
      console.log($event);
      $event.el.addEventListener('dblclick', () => {
          // alert('double click!');
          this.calendarEvents.push( { title: 'My event ' + (Math.random() * 10).toFixed(0), start: new Date(), date: new Date() })
          console.log(this.calendarEvents)
      });
  }

  onEventClick(clickedEvent: any) {
      console.log(clickedEvent);
  }

  onEventRender(info: any) {
      console.log('onEventRender', info.el);
      const tooltip = new Tooltip(info.el, {
          title: info.event.title,
          placement: 'top-end',
          trigger: 'hover',
          container: 'body'
      });
  }

  onEventDragStart(event) {
      console.log("start=>",event);
      
  }
  
  onEventDragStop(event) {
      console.log("stop=>",event);

  }
  handleDateClick(arg) {
    // this.calendarEvents = [
    //     { title: '.', start: new Date(arg.dateStr), date: new Date(arg.dateStr) }
    // ];
    console.log(arg);
  }
}
