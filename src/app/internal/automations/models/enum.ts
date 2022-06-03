export enum THEN_INTERNAL_EVENTS {
    on_then_event_selected = 'SHOW_ADD_THEN_EVENT_BTN',
    on_add_then_event_clicked = 'SHOW_SUGGESIONS'
}

export enum FormType {
    LEAD_FORM  = 'lead-form',
    SMART_FORM  = 'smart-form'
}
export const EventNames = {
    WHEN : {
        LEAD_FORM : 'leadForm',
        APPOINTMENT_SCHEDULED : 'appointmentScheduled',
        APPOINTMENT_CANCELED : 'appointmentCancelled',
        TAG_ADDED : 'tagAdded',
        PRODUCT_PURCHASED : 'productPurcased'
    },
    THEN : {
        SEND_EMAIL : 'sendEmail',
        SEND_NOTIFICATION : 'sendNotification',
        ADD_TAG : 'addTag',
        CREATE_TASK : 'createTask',
        REMOVE_TAG : 'removeTag'
    }
}

export const DELAY_TYPES = {
    WAIT: 'wait',
    WAIT_UNTIL: 'waitUntil'
  }

export const TIME_TYPES = {
    atTime: 'atTime',
    betweenTime: 'betweenTime'
  }
