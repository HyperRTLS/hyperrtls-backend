type AclType =
  | 'publishClientSend'
  | 'publishClientReceive'
  | 'subscribe'
  | 'unsubscribe';

/* getDefaultACLAccess */
export type GetDefaultAclAccessRequest = Record<string, never>;

type GetDefaultAclAccessResponseAcl = {
  acltype: AclType;
  allow: boolean;
};

export type GetDefaultAclAccessResponse = {
  acls: Array<GetDefaultAclAccessResponseAcl>;
};

/* setDefaultACLAccess */
export type SetDefaultAclAccessRequestAcl = {
  acltype: AclType;
  allow: boolean;
};

export type SetDefaultAclAccessRequest = {
  acls: Array<SetDefaultAclAccessRequestAcl>;
};

export type SetDefaultAclAccessResponse = undefined;
