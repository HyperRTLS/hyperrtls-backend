type Group = {
  groupname: string;
  priority?: number;
};

type Role = {
  rolename: string;
  priority?: number;
};

/* createClient */
export type CreateClientRequest = {
  username: string;
  password?: string;
  clientid?: string;
  textname?: string;
  textdescription?: string;
  groups?: Array<Group>;
  roles?: Array<Role>;
};

export type CreateClientResponse = undefined;

/* deleteClient */
export type DeleteClientRequest = {
  username: string;
};

export type DeleteClientResponse = undefined;

/* modifyClient */
export type ModifyClientRequest = {
  username: string;
  clientid?: string;
  password?: string;
  textname?: string;
  textdescription?: string;
  groups?: Array<Group>;
  roles?: Array<Role>;
};

export type ModifyClientResponse = undefined;

/* setClientId */
export type SetClientIdRequest = {
  username: string;
  clientid?: string;
};

export type SetClientIdResponse = undefined;

/* setClientPassword */
export type SetClientPasswordRequest = {
  username: string;
  password?: string;
};

export type SetClientPasswordResponse = undefined;

/* enableClient */
export type EnableClientRequest = {
  username: string;
};

export type EnableClientResponse = undefined;

/* disableClient */
export type DisableClientRequest = {
  username: string;
};

export type DisableClientResponse = undefined;

/* addClientRole */
export type AddClientRoleRequest = {
  username: string;
  rolename: string;
  priority?: number;
};

export type AddClientRoleResponse = undefined;

/* removeClientRole */
export type RemoveClientRoleRequest = {
  username: string;
  rolename: string;
};

export type RemoveClientRoleResponse = undefined;

/* getClient */
export type GetClientRequest = {
  username: string;
};

export type GetClientResponse = {
  client: {
    username: string;
    clientid?: string;
    textname?: string;
    textdescription?: string;
    groups: Array<Group>;
    roles: Array<Role>;
  };
};

/* listClients */
export type ListClientsRequest = {
  verbose?: boolean;
  count?: number;
  offset?: number;
};

type ListClientsResponseClient =
  | string
  | {
      username: string;
      clientid?: string;
      textname?: string;
      textdescription?: string;
      groups: Array<Group>;
      roles: Array<Role>;
    };

export type ListClientsResponse = {
  totalCount: number;
  clients: Array<ListClientsResponseClient>;
};
