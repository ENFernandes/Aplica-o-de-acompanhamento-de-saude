// Admin Dashboard Service
export class AdminDashboardService {
    constructor() {
        this.baseUrl = '/api';
        this.charts = {};
    }

    // Load dashboard data
    async loadDashboardData() {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch(`${this.baseUrl}/admin/dashboard`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.updateStatsCards(data.stats);
                this.updateCharts(data);
                return data;
            } else {
                throw new Error('Failed to load dashboard data');
            }
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            // Load mock data for development
            this.loadMockData();
        }
    }

    // Update stats cards
    updateStatsCards(stats) {
        const totalUsers = document.getElementById('total-users');
        const totalRecords = document.getElementById('total-records');
        const activeUsers = document.getElementById('active-users');
        const growthRate = document.getElementById('growth-rate');

        if (totalUsers) totalUsers.textContent = stats.totalUsers || 0;
        if (totalRecords) totalRecords.textContent = stats.totalRecords || 0;
        if (activeUsers) activeUsers.textContent = stats.activeUsers || 0;
        if (growthRate) growthRate.textContent = `${stats.growthRate || 0}%`;
    }

    // Initialize charts
    initializeCharts() {
        this.createRecordsChart();
        this.createUsersChart();
    }

    // Create records chart
    createRecordsChart() {
        const canvas = document.getElementById('records-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        this.charts.records = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Registos',
                    data: [],
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Registos por Mês'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Create users chart
    createUsersChart() {
        const canvas = document.getElementById('users-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        this.charts.users = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Customers', 'Admins'],
                datasets: [{
                    data: [0, 0],
                    backgroundColor: [
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(147, 51, 234, 0.8)'
                    ],
                    borderColor: [
                        'rgb(59, 130, 246)',
                        'rgb(147, 51, 234)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Utilizadores por Tipo'
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Update charts with data
    updateCharts(data) {
        // Update records chart
        if (this.charts.records && data.recordsByMonth) {
            this.charts.records.data.labels = data.recordsByMonth.map(item => item.month);
            this.charts.records.data.datasets[0].data = data.recordsByMonth.map(item => item.count);
            this.charts.records.update();
        }

        // Update users chart
        if (this.charts.users && data.userTypes) {
            this.charts.users.data.datasets[0].data = [
                data.userTypes.customers || 0,
                data.userTypes.admins || 0
            ];
            this.charts.users.update();
        }
    }

    // Load mock data for development
    loadMockData() {
        const mockStats = {
            totalUsers: 156,
            totalRecords: 1247,
            activeUsers: 89,
            growthRate: 12
        };

        const mockData = {
            stats: mockStats,
            recordsByMonth: [
                { month: 'Jan', count: 45 },
                { month: 'Fev', count: 52 },
                { month: 'Mar', count: 48 },
                { month: 'Abr', count: 61 },
                { month: 'Mai', count: 73 },
                { month: 'Jun', count: 89 }
            ],
            userTypes: {
                customers: 142,
                admins: 14
            }
        };

        this.updateStatsCards(mockStats);
        this.updateCharts(mockData);
    }

    // Refresh dashboard
    async refreshDashboard() {
        await this.loadDashboardData();
    }
}

// Admin Dashboard Manager
export class AdminDashboardManager {
    constructor() {
        this.dashboardService = new AdminDashboardService();
        this.setupEventListeners();
    }

    // Initialize dashboard
    async initialize() {
        
        try {
            this.dashboardService.initializeCharts();
            await this.dashboardService.loadDashboardData();
        } catch (error) {
            console.error('Error initializing dashboard:', error);
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Refresh button (if exists)
        const refreshBtn = document.getElementById('refresh-dashboard');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.dashboardService.refreshDashboard();
            });
        }

        // Auto-refresh every 5 minutes
        setInterval(() => {
            this.dashboardService.refreshDashboard();
        }, 5 * 60 * 1000);
    }

    // Get dashboard service
    getDashboardService() {
        return this.dashboardService;
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    // Wait for admin authentication to complete
    setTimeout(async () => {
        if (window.adminAuthManager) {
            const dashboardManager = new AdminDashboardManager();
            await dashboardManager.initialize();
            
            // Make dashboard manager globally available
            window.adminDashboardManager = dashboardManager;
        }
    }, 1000);
}); 