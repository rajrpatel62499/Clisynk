export const FILTERS = {
    sortBy: '',
    selectFilters: '',
    selectList: [],
    count: undefined,
    name: '',
    sortByList: [
        {id: 1, name: 'Last name A-Z'},
        {id: 2, name: 'Last name  Z-A'},
        {id: 3, name: 'Date Added Newest'},
        {id: 4, name: 'Date Added Oldest'},
        {id: 5, name: 'Email A-Z'},
        {id: 6, name: 'Email Z-A'}
    ],

    filterTypes1: [
        {id: 1, name: 'After'},
        {id: 2, name: 'Before'},
        {id: 3, name: 'On'},
        {id: 4, name: 'More than (days ago)'},
        {id: 5, name: 'Less than (days ago)'},
        {id: 6, name: 'Exactly (days ago)'},
        {id: 7, name: 'Is empty'},
        {id: 8, name: 'Is filled'}
    ],
    filterTypes2: [
        {id: 9, name: 'Equals'},
        {id: 10, name: 'Not equal'},
        {id: 11, name: 'Contains'},
        {id: 12, name: 'Not contains'},
        {id: 13, name: 'Start with'},
        {id: 14, name: 'End with'}
    ],
    groups: [
        {
            GropupName: 'Events',
            groupList: [
                {key: 'contactAdded', viewValue: 'Contact added', selected: 1},
                {key: 'sentEmails', viewValue: 'Sent these contacts an email', selected: 2}
            ]
        },
        {
            GropupName: 'Contact fields',
            groupList: [
                {key: 'firstName', viewValue: 'First name', selected: 2},
                // {key: 'middleName', viewValue: 'Middle name', selected: 2},
                {key: 'title', viewValue: 'Title', selected: 2},
                {key: 'email', viewValue: 'Email', selected: 2},
                // {key: 'website', viewValue: 'Website', selected: 2},
                // {key: 'linkedIn', viewValue: 'LinkedIn', selected: 2},
                // {key: 'twitter', viewValue: 'Twitter', selected: 2},
                // {key: 'facebook', viewValue: 'Facebook', selected: 2},
                // {key: 'timeZone', viewValue: 'Time zone', selected: 2},
                // {key: 'locale', viewValue: 'Locale', selected: 2},
                {key: 'companyName', viewValue: 'Company name', selected: 2},
                {key: 'contactsType', viewValue: 'Contact type', selected: 2},
                {key: 'jobTitle', viewValue: 'Job title', selected: 2},
                // {key: 'owner', viewValue: 'Owner', selected: 2},
                // {key: 'lastUpdated', viewValue: 'Last updated', selected: 1},
                // {key: 'billingAddressStreet', viewValue: 'Billing address street', selected: 2},
                {key: 'billingAddressCity', viewValue: 'Billing address city', selected: 2},
                {key: 'billingAddressState', viewValue: 'Billing address state', selected: 2},
                // {key: 'billingAddressCountry', viewValue: 'Billing address country', selected: 2},
                {key: 'billingAddressPostalCode', viewValue: 'Billing address postal code', selected: 2},
                // {key: 'shippingAddressStreet', viewValue: 'Shipping address street', selected: 2},
                // {key: 'shippingAddressCity', viewValue: 'Shipping address city', selected: 2},
                // {key: 'shippingAddressState', viewValue: 'Shipping address state', selected: 2},
                // {key: 'shippingAddressCountry', viewValue: 'Shipping address country', selected: 2},
                // {key: 'billingAddressPostalCode', viewValue: 'Shipping address postal code', selected: 2},
                // {key: 'otherAddressStreet', viewValue: 'Other address street', selected: 2},
                // {key: 'otherAddressCity', viewValue: 'Other address city', selected: 2},
                // {key: 'otherAddressState', viewValue: 'Other address state', selected: 2},
                // {key: 'otherAddressCountry', viewValue: 'Other address country', selected: 2},
                // {key: 'otherAddressPostalCode', viewValue: 'Other address postal code', selected: 2},
                {key: 'phone', viewValue: 'Phone', selected: 2},
                {key: 'fax', viewValue: 'Fax', selected: 2}
            ]
        }
    ]
};

