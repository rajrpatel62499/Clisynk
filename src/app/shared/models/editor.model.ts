export const EditorContent = {
    allowedContent: false,
    extraPlugins: 'divarea,uploadimage',
    forcePasteAsPlainText: false,
    height:'20rem',
    toolbar: [
        {name: 'editing', items: ['Scayt', 'Replace', 'SelectAll', 'Image']},
        {name: 'clipboard', items: ['Cut', 'Copy', 'Paste', '-', 'Undo', 'Redo']},
        {name: 'links', items: ['Link', 'Unlink']},
        {name: 'tools', items: ['Maximize', 'ShowBlocks', 'Print', 'Templates']},
        {name: 'document', items: ['Source']},
        {name: 'insert', items: ['Table', 'SpecialChar', 'Iframe']},
        '/',
        {
            name: 'basicstyles',
            items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat']
        },
        {
            name: 'paragraph',
            items: ['NumberedList', '-', '-', 'Blockquote']
        },
        {name: 'justify', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock']},
        {name: 'styles', items: ['Styles', 'Format', 'FontSize', '-', 'TextColor', 'BGColor']}
    ]
};


