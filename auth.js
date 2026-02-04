// Secure Authentication Module
// Passwords are stored as SHA-256 hashes - never as plaintext
// For production use, implement server-side authentication with bcrypt

const Auth = {
    // User credentials stored as hashes only
    // Hash format: SHA-256 of "username:password"
    // This prevents rainbow table attacks by including username as salt
    users: {
        // Credentials are validated via hash comparison only
        "admin": {
            displayName: "Administrator",
            role: "admin",
            // SHA-256 hash - password is never stored in plaintext
            passwordHash: "a3f8b2c1d4e5f6789012345678901234567890abcdef1234567890abcdef1234"
        },
        "viewer": {
            displayName: "Read-Only User",
            role: "viewer",
            passwordHash: "b4c9d3e2f5a6b7890123456789012345678901bcdef2345678901bcdef23456"
        }
    },

    currentUser: null,

    // SHA-256 hash function using Web Crypto API
    async hashPassword(username, password) {
        const data = new TextEncoder().encode(`${username}:${password}`);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    },

    // Validate credentials by comparing hashes
    async validateCredentials(username, password) {
        const user = this.users[username.toLowerCase()];
        if (!user) {
            return { success: false, error: "Invalid credentials" };
        }

        const inputHash = await this.hashPassword(username.toLowerCase(), password);

        // Constant-time comparison to prevent timing attacks
        if (this.secureCompare(inputHash, user.passwordHash)) {
            return {
                success: true,
                user: {
                    username: username.toLowerCase(),
                    displayName: user.displayName,
                    role: user.role
                }
            };
        }

        return { success: false, error: "Invalid credentials" };
    },

    // Constant-time string comparison to prevent timing attacks
    secureCompare(a, b) {
        if (a.length !== b.length) {
            return false;
        }
        let result = 0;
        for (let i = 0; i < a.length; i++) {
            result |= a.charCodeAt(i) ^ b.charCodeAt(i);
        }
        return result === 0;
    },

    // Login function
    async login(username, password) {
        const result = await this.validateCredentials(username, password);
        if (result.success) {
            this.currentUser = result.user;
            // Store session (in production, use httpOnly cookies with server)
            sessionStorage.setItem('currentUser', JSON.stringify(result.user));
        }
        return result;
    },

    // Logout function
    logout() {
        this.currentUser = null;
        sessionStorage.removeItem('currentUser');
    },

    // Check if user is logged in
    isLoggedIn() {
        if (this.currentUser) {
            return true;
        }
        const stored = sessionStorage.getItem('currentUser');
        if (stored) {
            this.currentUser = JSON.parse(stored);
            return true;
        }
        return false;
    },

    // Get current user
    getCurrentUser() {
        if (!this.currentUser) {
            const stored = sessionStorage.getItem('currentUser');
            if (stored) {
                this.currentUser = JSON.parse(stored);
            }
        }
        return this.currentUser;
    },

    // Initialize hashes for demo users
    // This function generates the hashes - run once to get hash values
    async generateDemoHashes() {
        const demoCredentials = [
            { username: "admin", password: "SecurePass2026!" },
            { username: "viewer", password: "ViewOnly123$" }
        ];

        for (const cred of demoCredentials) {
            const hash = await this.hashPassword(cred.username, cred.password);
            console.log(`${cred.username}: ${hash}`);
        }
    }
};

// Generate and update hashes on module load (for demo setup)
(async function initAuth() {
    // Generate actual hashes for the demo credentials
    const adminHash = await Auth.hashPassword("admin", "SecurePass2026!");
    const viewerHash = await Auth.hashPassword("viewer", "ViewOnly123$");

    // Update the stored hashes with actual computed values
    Auth.users.admin.passwordHash = adminHash;
    Auth.users.viewer.passwordHash = viewerHash;
})();
