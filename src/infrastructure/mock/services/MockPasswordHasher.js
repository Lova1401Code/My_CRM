// Mock password hasher — NOT secure, mimics bcrypt interface for the demo.
// Real backend will swap this for bcrypt via the IPasswordHasher port.

export class MockPasswordHasher {
  async hash(plain) {
    return `$mock$${plain}`;
  }

  async compare(plain, hashed) {
    if (!hashed) return false;
    if (hashed.startsWith('$mock$')) return hashed === `$mock$${plain}`;
    return false;
  }
}

export const passwordHasher = new MockPasswordHasher();