interface Request {
  id: number;
  form_type: string;
  form_name: string;
  attachedImage: string;
  roleId: string;
  branch: string;
  teller: string;
  position: string;
  level: string;
  status: string;
  data: string;
}

export interface RequestForm {
  requests: Request;
  image: string;
}

export interface EditRequestForm extends Request {}

export interface UserCreate {
  user: string;
  user_detail: Array<{
    id: number;
  }>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  permissions: string[];
  avatar?: string;
  lastLogin?: string;
  createdAt?: string;
}

export interface BranchCodeItems {
  branchCode: string;
  branchName: string;
}

export interface SubBranchCodeItems {
  branch_code: string;
  sub_branch_code: string;
  branch_name: string;
  branch_local_name: string;
  branch_code_name: string;
}
