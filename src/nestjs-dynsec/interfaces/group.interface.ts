type Role = {
  rolename: string;
  priority?: number;
};

type Client = {
  username: string;
  priority?: number;
};

/* createGroup */
export type CreateGroupRequest = {
  groupname: string;
  roles: Array<Role>;
};

export type CreateGroupResponse = undefined;

/* deleteGroup */
export type DeleteGroupRequest = {
  groupname: string;
};

export type DeleteGroupResponse = undefined;

/* modifyGroup */
export type ModifyGroupRequest = {
  groupname: string;
  textname?: string;
  textdescription?: string;
  roles?: Array<Role>;
  clients?: Array<Client>;
};

export type ModifyGroupResponse = undefined;

/* addGroupClient */
export type AddGroupClientRequest = {
  groupname: string;
  username: string;
  priority?: number;
};

export type AddGroupClientResponse = undefined;

/* removeGroupClient */
export type RemoveGroupClientRequest = {
  groupname: string;
  username: string;
};

export type RemoveGroupClientResponse = undefined;

/* addGroupRole */
export type AddGroupRoleRequest = {
  groupname: string;
  rolename: string;
  priority?: number;
};

export type AddGroupRoleResponse = undefined;

/* removeGroupRole */
export type RemoveGroupRoleRequest = {
  groupname: string;
  rolename: string;
};

export type RemoveGroupRoleResponse = undefined;

/* getGroup */
export type GetGroupRequest = {
  groupname: string;
};

export type GetGroupResponse = {
  group: {
    groupname: string;
    textname?: string;
    textdescription?: string;
    roles: Array<Role>;
    clients: Array<Client>;
  };
};

/* listGroups */
export type ListGroupsRequest = {
  verbose?: boolean;
  count?: number;
  offset?: number;
};

type ListGroupsResponseGroup =
  | string
  | {
      groupname: string;
      textname?: string;
      textdescription?: string;
      roles: Array<Role>;
      clients: Array<Client>;
    };

export type ListGroupsResponse = {
  totalCount: number;
  groups: Array<ListGroupsResponseGroup>;
};
