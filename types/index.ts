interface Request {
  id: number;
  form_type: string
  form_name: string
  attachedImage: string
  roleId: string
  branch: string
  teller: string
  position: string
  level: string
  status: string
  data: string
}

export interface RequestForm {
  requests: Request;
  image: string;
}

export interface EditRequestForm extends Request {

}


export interface UserCreate {
  user: string;
  user_detail: Array<{
    id: number;
  }>;
}