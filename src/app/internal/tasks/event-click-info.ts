import { EventApi } from "@fullcalendar/core";
import { DayGridView } from "@fullcalendar/daygrid";

export interface EventClickInfo {
    el: HTMLElement;
    event: EventApi;
    oldEvent: EventApi;
    jsEvent: MouseEvent;
    view: DayGridView
}