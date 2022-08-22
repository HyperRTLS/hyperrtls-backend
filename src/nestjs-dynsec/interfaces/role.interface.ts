type AclType =
  | 'publishClientSend'
  | 'publishClientReceive'
  | 'subscribeLiteral'
  | 'subscribePattern'
  | 'unsubscribeLiteral'
  | 'unsubscribePattern';

type Acl = {
  acltype: AclType;
  topic: string;
  allow: boolean;
  priority?: number;
};

/* createRole */
export type CreateRoleRequest = {
  rolename: string;
  textname?: string;
  textdescription?: string;
  acls?: Array<Acl>;
};

export type CreateRoleResponse = undefined;

/* deleteRole */
export type DeleteRoleRequest = {
  rolename: string;
};

export type DeleteRoleResponse = undefined;

/* modifyRole */
export type ModifyRoleRequest = {
  rolename: string;
  textname?: string;
  textdescription?: string;
  acls?: Array<Acl>;
};

export type ModifyRoleResponse = undefined;

/* addRoleACL */
export type AddRoleAclRequest = {
  rolename: string;
  acltype: AclType;
  topic: string;
  allow: boolean;
  priority?: number;
};

export type AddRoleAclResponse = undefined;

/* removeRoleACL */
export type RemoveRoleAclRequest = {
  rolename: string;
  acltype: AclType;
  topic: string;
};

export type RemoveRoleAclResponse = undefined;

/* getRole */
export type GetRoleRequest = {
  rolename: string;
};

export type GetRoleResponse = {
  role: {
    rolename: string;
    textname?: string;
    textdescription?: string;
    acls: Array<Acl>;
  };
};

/* listRoles */
export type ListRolesRequest = {
  verbose?: boolean;
  count?: number;
  offset?: number;
};

type ListRolesResponseRole =
  | string
  | {
      rolename: string;
      textname?: string;
      textdescription?: string;
      acls: Array<Acl>;
    };

export type ListRolesResponse = {
  totalCount: number;
  roles: Array<ListRolesResponseRole>;
};
