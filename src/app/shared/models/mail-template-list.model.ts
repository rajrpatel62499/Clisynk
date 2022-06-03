
export interface MailTemplateListData {
    _id: string;
    name: string;
}

export interface MailTemplateListResponse {
    statusCode: number;
    message: string;
    data: MailTemplateListData[];
}


