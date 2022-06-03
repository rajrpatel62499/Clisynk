export interface SmartForm {
    _id: string;
    description: string;
    tags: any[];
    status: string;
    isDeleted: boolean;
    submittedCount: number;
    name: string;
    formJson: FormJson;
    businessName: string;
    addedBy: AddedBy;
    workspaceId: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  
  interface AddedBy {
    _id: string;
    email: string;
    fullName: string;
    firstName: string;
    lastName: string;
  }
  
  interface FormJson {
    components: Component[];
  }
  
  interface Component {
    label: string;
    placeholder?: string;
    tableView: boolean;
    validateOn?: string;
    validate?: Validate;
    key: string;
    type: string;
    input: boolean;
    unique?: boolean;
    kickbox?: Kickbox;
    errorLabel?: string;
    labelWidth?: number;
    widget?: string;
    data?: Data;
    dataType?: string;
    selectThreshold?: number;
    autoExpand?: boolean;
    disableOnInvalid?: boolean;
  }
  
  interface Data {
    values: Value[];
  }
  
  interface Value {
    label: string;
    value: string;
  }
  
  interface Kickbox {
    enabled: boolean;
  }
  
  interface Validate {
    required: boolean;
  }