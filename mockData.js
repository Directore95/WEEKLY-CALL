// Mock Data - Completely fictional data for demonstration purposes
const MockData = {
    // Team members for weekly calls
    participants: [
        {
            id: 1,
            name: "Kenji Yamamoto",
            email: "kenji.yamamoto@techforge.io",
            role: "Engineering Lead",
            department: "Platform Development"
        },
        {
            id: 2,
            name: "Priya Sharma",
            email: "priya.sharma@techforge.io",
            role: "Senior Developer",
            department: "Backend Services"
        },
        {
            id: 3,
            name: "Marcus Lindgren",
            email: "marcus.lindgren@techforge.io",
            role: "DevOps Engineer",
            department: "Infrastructure"
        },
        {
            id: 4,
            name: "Sofia Chen",
            email: "sofia.chen@techforge.io",
            role: "Product Manager",
            department: "Product Strategy"
        },
        {
            id: 5,
            name: "Oluwaseun Adeyemi",
            email: "oluwaseun.adeyemi@techforge.io",
            role: "QA Specialist",
            department: "Quality Assurance"
        },
        {
            id: 6,
            name: "Elena Kowalski",
            email: "elena.kowalski@techforge.io",
            role: "Frontend Developer",
            department: "UI Engineering"
        },
        {
            id: 7,
            name: "Rashid Al-Farsi",
            email: "rashid.alfarsi@techforge.io",
            role: "Security Analyst",
            department: "Cybersecurity"
        },
        {
            id: 8,
            name: "Ingrid Johansson",
            email: "ingrid.johansson@techforge.io",
            role: "Scrum Master",
            department: "Agile Operations"
        }
    ],

    // Scheduled and past calls
    calls: [
        {
            id: 101,
            title: "Sprint 47 Planning Session",
            date: "2026-02-06",
            time: "09:00",
            duration: 60,
            participantIds: [1, 2, 4, 6, 8],
            status: "scheduled",
            agenda: "Review backlog priorities, assign sprint tasks, discuss blockers"
        },
        {
            id: 102,
            title: "Infrastructure Review",
            date: "2026-02-07",
            time: "14:30",
            duration: 45,
            participantIds: [1, 3, 7],
            status: "scheduled",
            agenda: "Kubernetes cluster updates, security patches review"
        },
        {
            id: 103,
            title: "Product Roadmap Sync",
            date: "2026-02-10",
            time: "11:00",
            duration: 90,
            participantIds: [1, 4, 5, 8],
            status: "scheduled",
            agenda: "Q2 feature prioritization, customer feedback analysis"
        },
        {
            id: 104,
            title: "Code Review Standards",
            date: "2026-02-12",
            time: "15:00",
            duration: 30,
            participantIds: [1, 2, 6],
            status: "scheduled",
            agenda: "Establish new code review guidelines and tooling"
        },
        {
            id: 105,
            title: "Team Retrospective",
            date: "2026-01-31",
            time: "16:00",
            duration: 60,
            participantIds: [1, 2, 3, 4, 5, 6, 7, 8],
            status: "completed",
            agenda: "Sprint 46 retrospective, process improvements"
        },
        {
            id: 106,
            title: "Security Audit Debrief",
            date: "2026-01-28",
            time: "10:00",
            duration: 75,
            participantIds: [1, 3, 7],
            status: "completed",
            agenda: "Review audit findings, remediation timeline"
        },
        {
            id: 107,
            title: "API Design Workshop",
            date: "2026-01-25",
            time: "13:00",
            duration: 120,
            participantIds: [1, 2, 4, 6],
            status: "completed",
            agenda: "New REST API standards, OpenAPI spec review"
        },
        {
            id: 108,
            title: "Budget Planning Call",
            date: "2026-01-22",
            time: "09:30",
            duration: 45,
            participantIds: [1, 4],
            status: "cancelled",
            agenda: "Q2 resource allocation"
        },
        {
            id: 109,
            title: "Cross-Team Integration",
            date: "2026-02-14",
            time: "10:00",
            duration: 60,
            participantIds: [2, 3, 5, 6],
            status: "scheduled",
            agenda: "Microservices integration testing strategy"
        },
        {
            id: 110,
            title: "Performance Optimization",
            date: "2026-02-18",
            time: "14:00",
            duration: 45,
            participantIds: [1, 2, 3, 6],
            status: "scheduled",
            agenda: "Database query optimization, caching strategies"
        }
    ],

    // Summary statistics
    getStats: function() {
        const now = new Date();
        const upcoming = this.calls.filter(c => c.status === 'scheduled').length;
        const completed = this.calls.filter(c => c.status === 'completed').length;

        return {
            totalParticipants: this.participants.length,
            upcomingCalls: upcoming,
            completedCalls: completed
        };
    },

    // Get participant by ID
    getParticipant: function(id) {
        return this.participants.find(p => p.id === id);
    },

    // Get participants for a call
    getCallParticipants: function(callId) {
        const call = this.calls.find(c => c.id === callId);
        if (!call) return [];
        return call.participantIds.map(id => this.getParticipant(id)).filter(Boolean);
    }
};
