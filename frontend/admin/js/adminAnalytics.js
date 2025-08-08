// Admin Analytics Service
export class AdminAnalyticsService {
    constructor() {
        this.baseUrl = 'http://localhost:3000';
        this.charts = {};
    }

    // Load analytics data
    async loadAnalyticsData() {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch(`${this.baseUrl}/api/admin/analytics`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.updateCharts(data);
                return data;
            } else {
                throw new Error('Failed to load analytics data');
            }
        } catch (error) {
            console.error('Error loading analytics data:', error);
            // Load mock data for development
            this.loadMockAnalyticsData();
        }
    }

    // Load mock analytics data for development
    loadMockAnalyticsData() {
        const mockData = {
            bmiDistribution: [
                { range: 'Abaixo do peso', count: 12, percentage: 8 },
                { range: 'Peso normal', count: 89, percentage: 57 },
                { range: 'Excesso de peso', count: 34, percentage: 22 },
                { range: 'Obesidade', count: 21, percentage: 13 }
            ],
            weightEvolution: [
                { user: 'João Silva', data: [75.5, 76.2, 75.8, 75.1, 74.9, 74.5] },
                { user: 'Maria Santos', data: [62.1, 61.8, 61.5, 61.2, 60.9, 60.5] },
                { user: 'Pedro Costa', data: [80.2, 79.8, 79.5, 79.1, 78.8, 78.5] }
            ],
            activityByHour: [
                { hour: '00:00', count: 5 },
                { hour: '06:00', count: 12 },
                { hour: '12:00', count: 28 },
                { hour: '18:00', count: 45 },
                { hour: '24:00', count: 8 }
            ],
            topUsers: [
                { name: 'João Silva', records: 45, avgWeight: 75.2 },
                { name: 'Maria Santos', records: 38, avgWeight: 61.8 },
                { name: 'Pedro Costa', records: 32, avgWeight: 79.5 },
                { name: 'Ana Ferreira', records: 28, avgWeight: 58.3 },
                { name: 'Carlos Lima', records: 25, avgWeight: 82.1 }
            ]
        };

        this.updateCharts(mockData);
    }

    // Initialize analytics charts
    initializeCharts() {
        this.createBMIDistributionChart();
        this.createWeightEvolutionChart();
        this.createActivityChart();
        this.createTopUsersChart();
    }

    // Create BMI distribution chart
    createBMIDistributionChart() {
        const canvas = document.getElementById('bmi-distribution-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        this.charts.bmiDistribution = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [
                        'rgba(239, 68, 68, 0.8)',
                        'rgba(34, 197, 94, 0.8)',
                        'rgba(251, 191, 36, 0.8)',
                        'rgba(239, 68, 68, 0.8)'
                    ],
                    borderColor: [
                        'rgb(239, 68, 68)',
                        'rgb(34, 197, 94)',
                        'rgb(251, 191, 36)',
                        'rgb(239, 68, 68)'
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
                        text: 'Distribuição de IMC'
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Create weight evolution chart
    createWeightEvolutionChart() {
        const canvas = document.getElementById('weight-evolution-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        this.charts.weightEvolution = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                datasets: []
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Evolução de Peso por Utilizador'
                    },
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Peso (kg)'
                        }
                    }
                }
            }
        });
    }

    // Create activity chart
    createActivityChart() {
        const canvas = document.getElementById('activity-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        this.charts.activity = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Registos',
                    data: [],
                    backgroundColor: 'rgba(59, 130, 246, 0.8)',
                    borderColor: 'rgb(59, 130, 246)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Atividade por Hora'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Número de Registos'
                        }
                    }
                }
            }
        });
    }

    // Create top users chart
    createTopUsersChart() {
        const canvas = document.getElementById('top-users-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        this.charts.topUsers = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Registos',
                    data: [],
                    backgroundColor: 'rgba(147, 51, 234, 0.8)',
                    borderColor: 'rgb(147, 51, 234)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Top Utilizadores'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Número de Registos'
                        }
                    }
                }
            }
        });
    }

    // Update charts with data
    updateCharts(data) {
        // Update BMI distribution chart
        if (this.charts.bmiDistribution && data.bmiDistribution) {
            this.charts.bmiDistribution.data.labels = data.bmiDistribution.map(item => item.range);
            this.charts.bmiDistribution.data.datasets[0].data = data.bmiDistribution.map(item => item.count);
            this.charts.bmiDistribution.update();
        }

        // Update weight evolution chart
        if (this.charts.weightEvolution && data.weightEvolution) {
            this.charts.weightEvolution.data.datasets = data.weightEvolution.map((user, index) => ({
                label: user.user,
                data: user.data,
                borderColor: this.getChartColor(index),
                backgroundColor: this.getChartColor(index, 0.1),
                tension: 0.4
            }));
            this.charts.weightEvolution.update();
        }

        // Update activity chart
        if (this.charts.activity && data.activityByHour) {
            this.charts.activity.data.labels = data.activityByHour.map(item => item.hour);
            this.charts.activity.data.datasets[0].data = data.activityByHour.map(item => item.count);
            this.charts.activity.update();
        }

        // Update top users chart
        if (this.charts.topUsers && data.topUsers) {
            this.charts.topUsers.data.labels = data.topUsers.map(item => item.name);
            this.charts.topUsers.data.datasets[0].data = data.topUsers.map(item => item.records);
            this.charts.topUsers.update();
        }
    }

    // Get chart color
    getChartColor(index, alpha = 1) {
        const colors = [
            `rgba(59, 130, 246, ${alpha})`,
            `rgba(147, 51, 234, ${alpha})`,
            `rgba(34, 197, 94, ${alpha})`,
            `rgba(251, 191, 36, ${alpha})`,
            `rgba(239, 68, 68, ${alpha})`
        ];
        return colors[index % colors.length];
    }

    // Refresh analytics
    async refreshAnalytics() {
        await this.loadAnalyticsData();
    }
}

// Admin Analytics Manager
export class AdminAnalyticsManager {
    constructor() {
        this.analyticsService = new AdminAnalyticsService();
        this.setupEventListeners();
    }

    // Initialize analytics
    async initialize() {
        console.log('Initializing admin analytics...');
        
        try {
            this.analyticsService.initializeCharts();
            await this.analyticsService.loadAnalyticsData();
            console.log('Analytics initialized successfully');
        } catch (error) {
            console.error('Error initializing analytics:', error);
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Refresh button (if exists)
        const refreshBtn = document.getElementById('refresh-analytics');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.analyticsService.refreshAnalytics();
            });
        }

        // Auto-refresh every 10 minutes
        setInterval(() => {
            this.analyticsService.refreshAnalytics();
        }, 10 * 60 * 1000);
    }

    // Get analytics service
    getAnalyticsService() {
        return this.analyticsService;
    }
}

// Initialize analytics when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    // Wait for admin authentication to complete
    setTimeout(async () => {
        if (window.adminAuthManager) {
            const analyticsManager = new AdminAnalyticsManager();
            await analyticsManager.initialize();
            
            // Make analytics manager globally available
            window.adminAnalyticsManager = analyticsManager;
            console.log('Admin analytics initialized successfully');
        }
    }, 1000);
}); 