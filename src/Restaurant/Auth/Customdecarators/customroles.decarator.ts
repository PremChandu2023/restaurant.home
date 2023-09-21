import { SetMetadata } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "src/Restaurant/Enums/roles.enums";

export const ROLES_KEY = 'roles'
export const Roles = (...roles :Role[])=> SetMetadata(ROLES_KEY, roles);


/*
SetMetadata: This import is used to define metadata decorators. Metadata decorators are functions that attach metadata to classes, methods, or properties.

Reflector: This import is used to retrieve metadata that was set by decorators.
*/