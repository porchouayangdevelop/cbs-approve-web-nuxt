export interface RejectForm {
  form_id: number;
  user: string;
  comment: string;
}

export interface ApproveForm {
  form_id: number;
  user: string;
  comment?: string;
}

export interface RequestCredentital {
  id: number;
  form_type: string;
  form_name: string;
  role: string;
  branch: string;
  teller: string;
  name: string;
  position: string;
  level: string;
  status: string;
  data: string;
}
