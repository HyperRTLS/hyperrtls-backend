/* getAnonymousGroup */
export type GetAnonymousGroupRequest = Record<string, never>;

export type GetAnonymousGroupResponse = {
  group: {
    groupname: string;
  };
};

/* setAnonymousGroup */
export type SetAnonymousGroupRequest = {
  groupname: string;
};

export type SetAnonymousGroupResponse = undefined;
