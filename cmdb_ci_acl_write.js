/**
 * ServiceNow ACL Script – CMDB CI Write Protection
 *
 * Table  : cmdb_ci (applies to all CI classes via inheritance)
 * Operation: write
 *
 * Behaviour
 * ---------
 * Users who hold the custom 'IT Owners' role (which itself contains the
 * 'sn_cmdb_editor' role) are allowed to edit ONLY Business Application CIs
 * (cmdb_ci_business_app).  Write access to every other CI class is denied
 * for those users.
 *
 * Users who do NOT hold the 'IT Owners' role are not affected by this ACL;
 * their access is governed by whatever other ACLs are in place.
 *
 * Return value convention (ServiceNow ACL scripts):
 *   true  → grant access
 *   false → deny access
 */

(function executeACL(/*GlideRecord*/ current, /*GlideRecord*/ operation) {

    var IT_OWNERS_ROLE        = 'IT Owners';          // custom role name
    var BUSINESS_APP_CLASS    = 'cmdb_ci_business_app'; // sys_class_name for Business Applications

    // Only apply this restriction to users who have the 'IT Owners' role.
    // gs.hasRole() checks the session's effective roles (direct + inherited).
    if (!gs.hasRole(IT_OWNERS_ROLE)) {
        // User is not an IT Owner – this ACL does not restrict them.
        return true;
    }

    // The user IS an IT Owner.  Allow writes only on Business Application CIs.
    var isBusinessApp = (current.sys_class_name.toString() === BUSINESS_APP_CLASS);

    if (isBusinessApp) {
        // IT Owner editing a Business Application – allow.
        return true;
    }

    // IT Owner attempting to edit any other CMDB CI class – deny.
    gs.addErrorMessage(
        'You do not have permission to edit this Configuration Item. ' +
        'IT Owners may only edit Business Application records.'
    );
    return false;

})(current, operation);
