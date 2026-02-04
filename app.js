// Main Application Logic
const App = {
    init() {
        this.bindEvents();
        this.checkAuth();
    },

    bindEvents() {
        // Login form submission
        document.getElementById('login-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin();
        });

        // Logout button
        document.getElementById('logout-btn').addEventListener('click', () => {
            this.handleLogout();
        });
    },

    async handleLogin() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const errorElement = document.getElementById('login-error');

        errorElement.textContent = '';

        if (!username || !password) {
            errorElement.textContent = 'Please enter both username and password';
            return;
        }

        const result = await Auth.login(username, password);

        if (result.success) {
            this.showDashboard();
        } else {
            errorElement.textContent = result.error;
            document.getElementById('password').value = '';
        }
    },

    handleLogout() {
        Auth.logout();
        this.showLogin();
    },

    checkAuth() {
        if (Auth.isLoggedIn()) {
            this.showDashboard();
        } else {
            this.showLogin();
        }
    },

    showLogin() {
        document.getElementById('login-section').classList.remove('hidden');
        document.getElementById('dashboard-section').classList.add('hidden');
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        document.getElementById('login-error').textContent = '';
    },

    showDashboard() {
        document.getElementById('login-section').classList.add('hidden');
        document.getElementById('dashboard-section').classList.remove('hidden');

        const user = Auth.getCurrentUser();
        document.getElementById('user-display').textContent = `Welcome, ${user.displayName}`;

        this.loadStats();
        this.loadCalls();
        this.loadParticipants();
    },

    loadStats() {
        const stats = MockData.getStats();
        document.getElementById('total-participants').textContent = stats.totalParticipants;
        document.getElementById('upcoming-calls').textContent = stats.upcomingCalls;
        document.getElementById('completed-calls').textContent = stats.completedCalls;
    },

    loadCalls() {
        const tbody = document.getElementById('calls-body');
        tbody.innerHTML = '';

        // Sort calls by date (upcoming first, then completed)
        const sortedCalls = [...MockData.calls].sort((a, b) => {
            if (a.status === 'scheduled' && b.status !== 'scheduled') return -1;
            if (a.status !== 'scheduled' && b.status === 'scheduled') return 1;
            return new Date(b.date) - new Date(a.date);
        });

        sortedCalls.forEach(call => {
            const participants = MockData.getCallParticipants(call.id);
            const participantNames = participants.map(p => p.name.split(' ')[0]).join(', ');

            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${this.escapeHtml(call.title)}</strong></td>
                <td>${this.formatDate(call.date)}</td>
                <td>${call.time}</td>
                <td>${this.escapeHtml(participantNames)}</td>
                <td class="status-${call.status}">${this.capitalizeFirst(call.status)}</td>
            `;
            tbody.appendChild(row);
        });
    },

    loadParticipants() {
        const container = document.getElementById('participants-list');
        container.innerHTML = '';

        MockData.participants.forEach(participant => {
            const initials = participant.name.split(' ').map(n => n[0]).join('');
            const card = document.createElement('div');
            card.className = 'participant-card';
            card.innerHTML = `
                <div class="participant-avatar">${this.escapeHtml(initials)}</div>
                <div class="participant-info">
                    <h4>${this.escapeHtml(participant.name)}</h4>
                    <p>${this.escapeHtml(participant.role)}</p>
                </div>
            `;
            container.appendChild(card);
        });
    },

    // Utility functions
    formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    },

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    // XSS prevention
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
