const User = require('../models/UserModel');

async function ensureUser({ name, email, password, role }) {
  const existing = await User.findOne({ email: { $regex: `^${email}$`, $options: 'i' } });
  if (existing) {
    try {
      let ok = false;
      if (typeof existing.matchPassword === 'function') {
        ok = await existing.matchPassword(password);
      } else if (typeof existing.correctPassword === 'function') {
        ok = await existing.correctPassword(password, existing.password);
      }
      if (!ok) {
        existing.password = password; // triggers pre-save to hash
        if (name) existing.name = name;
        if (role) existing.role = role;
        await existing.save();
      }
      return existing;
    } catch (e) {
      existing.password = password;
      await existing.save();
      return existing;
    }
  }
  const user = new User({ name, email, password, role });
  await user.save();
  return user;
}

async function seedDefaultUsers() {
  try {
    await ensureUser({ name: 'System Admin', email: 'FAdmin@gmail.com', password: 'Admin123*', role: 'admin' });
    await ensureUser({ name: 'Saman', email: 'saman@gmail.com', password: 'Saman123*', role: 'farmer' });
    console.log('✅ Default users are ensured');
  } catch (e) {
    console.error('❌ Failed to seed default users:', e.message);
  }
}

module.exports = { seedDefaultUsers };


