// Use dynamic import for bcryptjs
(async () => {
    const bcrypt = await import('bcryptjs');

    // Your password
    const password = 'roboadmina217';

    // Generate hash
    const hash = bcrypt.default.hashSync(password, 10);

    console.log('\n=================================');
    console.log('Password Hash Generated!');
    console.log('=================================');
    console.log('Password:', password);
    console.log('Hash:', hash);
    console.log('=================================\n');

    // Generate SQL
    console.log('Copy this SQL to Supabase:\n');
    console.log(`INSERT INTO users (id, username, password_hash, name, role, is_active, failed_access_attempts)`);
    console.log(`VALUES (`);
    console.log(`    'user-superadmin-001',`);
    console.log(`    'admin',`);
    console.log(`    '${hash}',`);
    console.log(`    'System Administrator',`);
    console.log(`    'superadmin',`);
    console.log(`    true,`);
    console.log(`    0`);
    console.log(`);\n`);
})();

