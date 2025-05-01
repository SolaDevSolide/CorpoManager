#!/usr/bin/env node

import { setupSuperAdminLogic } from '../src/cli/setup-super-admin.logic';

setupSuperAdminLogic()
  .then((user) => {
    console.log(`SUPER_ADMIN created: ${user.id}`);
    process.exit(0);
  })
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });