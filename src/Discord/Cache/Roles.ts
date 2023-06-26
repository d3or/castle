import { Role } from '../../Types/Guild';
import Log from '../../Utils/Logging';

export let Roles: string[] = [];

/*
 * Returns a role id if it exists in the cache
 *
 * @param role_id The role id to check for
 * @returns The role id if it exists, undefined if it doesn't
 */
export const getRole = (role_id: string): string | boolean => {
    return Roles.find(role => role === role_id) || false;
};

/*
 * Adds roles to the cache
 *
 * @param roles The roles to add to the cache
 * @returns void
 */
export const setRoles = (roles: Role[]): void => {
    // flatten array first
    roles = roles.reduce((a: any, b: any) => a.concat(b), []);
    let role_ids = roles.map((role: any) => {
        return role.roles;
    });

    // flatten array again, (lol)
    role_ids = role_ids.reduce((a: any, b: any) => a.concat(b), []);

    Roles = role_ids;

    Log.info(`Added ${Roles.length} roles to cache`);
};
