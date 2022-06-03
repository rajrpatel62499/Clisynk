export const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
export const URL_REGEX = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
export const USER_PLACEHOLDER = '/assets/images/avatar.jpg';
export const placeholder = '/assets/images/placeholder.jpg';
export const dateFormat = 'EEE, MMM dd yyyy';
export const phoneTypes = ['work', 'home', 'mobile', 'other'];

export const NOTIFICATION_TYPES = {
    VIEW_QUOTE: 1,
    ACCEPT_QUOTE: 2,
    VIEW_INVOICE: 3,
    PAID_INVOICE: 4,
    TASK_DUE: 5,
    BROADCAST_SCHEDULE_SENT: 6,
    APPOINTMENT_BOOK: 7,
    APPOINTMENT_RESCHEDULE: 8,
    BROADCAST_SENT: 9
};

export const dealActivity = {
    DEAL_CREATED: 1,
    NOTE_CREATED: 2,
    EMAIL_SENT: 3,
    MOVED_FROM: 4,
    DELETED: 5
};

export const sideBarAdmin = [
    {path: '/home', icon: 'fas fa-home', title: 'Home', file: 'home.svg'},
    {path: '/contacts', title: 'Contacts', icon: 'fas fa-user', children: [], file: 'user.svg'},
    {path: '/tasks', title: 'Tasks', icon: 'fas fa-file-alt', children: [], file: 'tasks.svg'},
    {path: '/appointments', title: 'Appointments', icon: 'fas fa-calendar', children: [], file: 'calendar.svg'},
    {path: '/money', title: 'Money', icon: 'fas fa-hand-holding-usd', children: [], file: 'money.svg'},
    {path: '/broadcast', title: 'Broadcast', icon: 'fas fa-volume-down', children: [], file: 'broadcast.svg'},
    {path: '/pipeline', title: 'Pipeline', icon: 'fas fa-user', children: [], file: 'pipeline.svg'},
    {path: '/chat', title: 'Chats' , icon: 'fas fa-user',children: [],file:'chats.svg'},
    {path: '/automation', title: 'Automations' , icon: 'fas fa-user',children: [],file:'brain.svg'},
    {path: '/documents', title: 'Documents', icon: 'fas fa-user', children: [], file: 'document.svg'}
];

export const remainderTypes = [
    {key: 'AT_THE_TIME_DUE', id: 1, name: 'at the time it\'s due'},
    {key: 'FIVE_MINUTE_BEFORE', id: 2, name: '5 min before'},
    {key: 'FIFTEEN_MINUTE_BEFORE', id: 3, name: '15 min before'},
    {key: 'THIRTY_MINUTE_BEFORE', id: 4, name: '30 min before'},
    {key: 'ONE_HOUR_BEFORE', id: 5, name: '1 hr before'},
    {key: 'ONE_DAY_BEFORE', id: 6, name: '1 day before'}
];

export const taskStatus = [
    {key: 'IN_PROGRESS', id: 1, name: 'In progress'},
    {key: 'COMPLETED', id: 2, name: 'Completed'},
    {key: 'INCOMPLETE', id: 3, name: 'Incomplted'},
    {key: 'DELETED', id: 4, name: 'Deleted'}
];

export const tagFilters = [
    {name: 'Filter by category', dropdownType: 'main', goTo: 'filterBy'},
    {name: 'Sort by', dropdownType: 'main', goTo: 'sortBy'},
    {name: 'Filter by category', dropdownType: 'filterBy', isHeading: true, goTo: 'main'},
    {name: 'Sort by', dropdownType: 'sortBy', isHeading: true, goTo: 'main'},
    {name: 'Show all', dropdownType: 'filterBy', _id: ''},
    {name: 'Uncategorized', dropdownType: 'filterBy', _id: 'false'},
    {name: 'Name', dropdownType: 'sortBy', val: 1},
    {name: 'Category', dropdownType: 'sortBy', val: 2}
];

export const addPaymentOptions = [
    {name: 'Select a product', dropdownType: 'main', goTo: 'filterBy'},
    {name: 'Select an invoice', dropdownType: 'main', goTo: 'sortBy'},
    {name: 'Select a product', dropdownType: 'filterBy', isHeading: true, goTo: 'main'},
    {name: 'Select an invoice', dropdownType: 'sortBy', isHeading: true, goTo: 'main'}
];

export const TimeZones = ['(GMT +02:00) Cairo', '(GMT +02:00) Johannesburg', '(GMT +01:00) West Central Africa', '(GMT +02:00) Windhoek',
    '(GMT -09:00) Adak', '(GMT -08:00) Anchorage', '(GMT -03:00) Buenos Aires', '(GMT +12:00) Kamchatka', '(GMT +05:00) Karachi',
    '(GMT +05:45) Kathmandu', '(GMT +05:30) Kolkata', '(GMT +07:00) Krasnoyarsk', '(GMT +06:00) Omsk', '(GMT +06:30) Rangoon'
];

export const detailsOptions: any = [
    {name: 'Middle Name', id: 'middleName'}, {name: 'Title', id: 'title'},
    {name: 'Suffix', id: 'suffix'}
];
export const emailOptions: any = [
    {name: 'Work email', id: 'email'}, {name: 'Personal email', id: 'personalEmail'},
    {name: 'Other email', id: 'otherEmail'}
];
export const titles = ['Ms', 'Mr', 'Mrs', 'Dr'];

export const appointMentList: any = [{
    name: 'Use my online meeting link', radioSelected: 1, type: 1, isInput: true,
    placeholder: 'Zoom, Webex, Skype, etc...', input : ''
},
    // {name: 'Ask attendees to use their online meeting link', radioSelected: 2, type: 1},
    {name: 'I will call the lead or client', radioSelected: 3, type: 2},
    {name: 'Ask to invitee to call me', radioSelected: 4, type: 2, isInput: true, placeholder: 'Your phone number'},
    {
        name: 'I will choose the location', radioSelected: 5, type: 3, isLocation: true,
        placeholder: 'Select an address or location'
    },
    {name: 'Let the invitee choose the location', radioSelected: 6, type: 3}
];

export const availabilityList = [
    {day: 'Mon', timings: [], active: true},
    {day: 'Tue', timings: []},
    {day: 'Wed', timings: []},
    {day: 'Thu', timings: []},
    {day: 'Fri', timings: []},
    {day: 'Sat', timings: []},
    {day: 'Sun', timings: []}
];

export const threeDotOptions = [
    {text: 'New Folder'},
    {text: 'Move'},
    {text: 'Rename'},
    {text: 'Delete'}
];


export const HEIGHT = 1200;
export const WIDTH = 800;
export const KB = 1024;
export const MB = KB * 1024;
export const GB = MB * 1024;
export const FileType = {
    JPG: 'image/jpg',
    JPEG: 'image/jpeg',
    PNG: 'image/png',
    PDF: 'application/pdf',
    MP4: 'video/mp4',

    CSV: 'application/vnd.ms-excel'
}

export const FileExt = {
    JPG: 'jpg',
    JPEG: 'jpeg',
    PNG: 'png',
    PDF: 'pdf',
    MP4: 'mp4',
    CSV: 'csv',
    XLS: 'xls',
    DOC: 'doc'
}