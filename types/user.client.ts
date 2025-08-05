export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone?: string;
  branchCode: string;
  subBranchCode?: string;
  department?: string;
  position?: string;
  password: string;
  status?: string | "PENDING" | "APPROVED" | "REJECTED";
  acceptTerms: boolean;
}

export interface GetUsers {
  page: number;
  size: number;
}

export interface UsersReponse {
  statusType: string;
  status?: string;
  message?: string;
  data: {
    totalItems: number;
    data: [];
    totalPages: number;
    currentPage: number;
  };
  timestamp?: string;
}
