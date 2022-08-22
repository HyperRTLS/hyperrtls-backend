import { Injectable } from '@nestjs/common';

import { DynamicSecurityController } from './dynsec.controller';

import * as I from './interfaces';

@Injectable()
export class DynamicSecurityService {
  constructor(private readonly dynsecController: DynamicSecurityController) {}

  public isConnected() {
    return this.dynsecController.mqttClient.connected;
  }

  public getDefaultAclAccess(request: I.GetDefaultAclAccessRequest) {
    return this.dynsecController.sendCommand<
      I.GetDefaultAclAccessRequest,
      I.GetDefaultAclAccessResponse
    >('getDefaultACLAccess', request);
  }

  public setDefaultAclAccess(request: I.SetDefaultAclAccessRequest) {
    return this.dynsecController.sendCommand<
      I.SetDefaultAclAccessRequest,
      I.SetDefaultAclAccessResponse
    >('setDefaultACLAccess', request);
  }

  public getAnonymousGroup(request: I.GetAnonymousGroupRequest) {
    return this.dynsecController.sendCommand<
      I.GetAnonymousGroupRequest,
      I.GetAnonymousGroupResponse
    >('getAnonymousGroup', request);
  }

  public setAnonymousGroup(request: I.SetAnonymousGroupRequest) {
    return this.dynsecController.sendCommand<
      I.SetAnonymousGroupRequest,
      I.SetAnonymousGroupResponse
    >('setAnonymousGroup', request);
  }

  public createRole(request: I.CreateRoleRequest) {
    return this.dynsecController.sendCommand<
      I.CreateRoleRequest,
      I.CreateRoleResponse
    >('createRole', request);
  }

  public deleteRole(request: I.DeleteRoleRequest) {
    return this.dynsecController.sendCommand<
      I.DeleteRoleRequest,
      I.DeleteRoleResponse
    >('deleteRole', request);
  }

  public modifyRole(request: I.ModifyRoleRequest) {
    return this.dynsecController.sendCommand<
      I.ModifyRoleRequest,
      I.ModifyRoleResponse
    >('modifyRole', request);
  }

  public addRoleAcl(request: I.AddRoleAclRequest) {
    return this.dynsecController.sendCommand<
      I.AddRoleAclRequest,
      I.AddRoleAclResponse
    >('addRoleACL', request);
  }

  public removeRoleAcl(request: I.RemoveRoleAclRequest) {
    return this.dynsecController.sendCommand<
      I.RemoveRoleAclRequest,
      I.RemoveRoleAclResponse
    >('removeRoleACL', request);
  }

  public getRole(request: I.GetRoleRequest) {
    return this.dynsecController.sendCommand<
      I.GetRoleRequest,
      I.GetRoleResponse
    >('getRole', request);
  }

  public listRoles(request: I.ListRolesRequest) {
    return this.dynsecController.sendCommand<
      I.ListRolesRequest,
      I.ListRolesResponse
    >('listRoles', request);
  }

  public createGroup(request: I.CreateGroupRequest) {
    return this.dynsecController.sendCommand<
      I.CreateGroupRequest,
      I.CreateGroupResponse
    >('createGroup', request);
  }

  public deleteGroup(request: I.DeleteGroupRequest) {
    return this.dynsecController.sendCommand<
      I.DeleteGroupRequest,
      I.DeleteGroupResponse
    >('deleteGroup', request);
  }

  public modifyGroup(request: I.ModifyGroupRequest) {
    return this.dynsecController.sendCommand<
      I.ModifyGroupRequest,
      I.ModifyGroupResponse
    >('modifyGroup', request);
  }

  public addGroupClient(request: I.AddGroupClientRequest) {
    return this.dynsecController.sendCommand<
      I.AddGroupClientRequest,
      I.AddGroupClientResponse
    >('addGroupClient', request);
  }

  public removeGroupClient(request: I.RemoveGroupClientRequest) {
    return this.dynsecController.sendCommand<
      I.RemoveGroupClientRequest,
      I.RemoveGroupClientResponse
    >('removeGroupClient', request);
  }

  public addGroupRole(request: I.AddGroupRoleRequest) {
    return this.dynsecController.sendCommand<
      I.AddGroupRoleRequest,
      I.AddGroupRoleResponse
    >('addGroupRole', request);
  }

  public removeGroupRole(request: I.RemoveGroupRoleRequest) {
    return this.dynsecController.sendCommand<
      I.RemoveGroupRoleRequest,
      I.RemoveGroupRoleResponse
    >('removeGroupRole', request);
  }

  public getGroup(request: I.GetGroupRequest) {
    return this.dynsecController.sendCommand<
      I.GetGroupRequest,
      I.GetGroupResponse
    >('getGroup', request);
  }

  public listGroups(request: I.ListGroupsRequest) {
    return this.dynsecController.sendCommand<
      I.ListGroupsRequest,
      I.ListGroupsResponse
    >('listGroups', request);
  }

  public createClient(request: I.CreateClientRequest) {
    return this.dynsecController.sendCommand<
      I.CreateClientRequest,
      I.CreateClientResponse
    >('createClient', request);
  }

  public deleteClient(request: I.DeleteClientRequest) {
    return this.dynsecController.sendCommand<
      I.DeleteClientRequest,
      I.DeleteClientResponse
    >('deleteClient', request);
  }

  public modifyClient(request: I.ModifyClientRequest) {
    return this.dynsecController.sendCommand<
      I.ModifyClientRequest,
      I.ModifyClientResponse
    >('modifyClient', request);
  }

  public setClientId(request: I.SetClientIdRequest) {
    return this.dynsecController.sendCommand<
      I.SetClientIdRequest,
      I.SetClientIdResponse
    >('setClientId', request);
  }

  public setClientPassword(request: I.SetClientPasswordRequest) {
    return this.dynsecController.sendCommand<
      I.SetClientPasswordRequest,
      I.SetClientPasswordResponse
    >('setClientPassword', request);
  }

  public enableClient(request: I.EnableClientRequest) {
    return this.dynsecController.sendCommand<
      I.EnableClientRequest,
      I.EnableClientResponse
    >('enableClient', request);
  }

  public disableClient(request: I.DisableClientRequest) {
    return this.dynsecController.sendCommand<
      I.DisableClientRequest,
      I.DisableClientResponse
    >('disableClient', request);
  }

  public addClientRole(request: I.AddClientRoleRequest) {
    return this.dynsecController.sendCommand<
      I.AddClientRoleRequest,
      I.AddClientRoleResponse
    >('addClientRole', request);
  }

  public removeClientRole(request: I.RemoveClientRoleRequest) {
    return this.dynsecController.sendCommand<
      I.RemoveClientRoleRequest,
      I.RemoveClientRoleResponse
    >('removeClientRole', request);
  }

  public getClient(request: I.GetClientRequest) {
    return this.dynsecController.sendCommand<
      I.GetClientRequest,
      I.GetClientResponse
    >('getClient', request);
  }

  public listClients(request: I.ListClientsRequest) {
    return this.dynsecController.sendCommand<
      I.ListClientsRequest,
      I.ListClientsResponse
    >('listClients', request);
  }
}
