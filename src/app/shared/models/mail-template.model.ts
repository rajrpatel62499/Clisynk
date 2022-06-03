export class MailTemplateData {
    _id?: string;
    subject: string;
    canDeleted: boolean;
    isDeleted: boolean;
    name: string;
    html: string;
    filename: string;
    slug: string;
    updatedAt: Date;
    deletedBy: string;
}

export interface MailTemplateResponse {
    statusCode: number;
    message: string;
    data: MailTemplateData;
}

