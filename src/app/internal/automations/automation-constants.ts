export enum EventType {
    WHEN  = 'when',
    WHEN_EDIT_LEAD_FORM  = 'show lead form page',
    WHEN_EDIT_APPOINTMENT_SCHEDULED = 'show appointment listing screen for scheduling',
    WHEN_EDIT_APPOINTMENT_CANCELED = 'show appointment listing screen for cancelation ',
    WHEN_EDIT_TAG_ADDED = 'show tags list',
    WHEN_EDIT_PRODUCT_PURCHASED = 'show products list',
    
    
    THEN  = 'then',

    THEN_TIME_SCHEDULE = 'schedule then time schedule',

    THEN_EDIT_SEND_EMAIL = 'show list of email templates',
    THEN_EDIT_SEND_EMAIL_SELECT = 'open email editor',

    THEN_EDIT_SEND_NOTIFICATION = 'show create notification',

    THEN_EDIT_ADD_TAG = 'open list of tags',
    THEN_EDIT_CREATE_TASK = 'create a task'


}

export const Images = {
    greenCloud: "assets/images/cloud-green.svg",
    blueFlash: "assets/images/blue-flash.svg",
    edit: "assets/images/edit-button-gray.svg",
    delete: "assets/images/delete-gray.svg",
    exportBlueIcon: "assets/images/export-blue-icon.svg"
}