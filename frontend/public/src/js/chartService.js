// Chart service for health data visualization
export class ChartService {
    constructor() {
        this.charts = {};
        this.isInitialized = false;
    }

    // Initialize all charts
    initializeCharts() {
        if (this.isInitialized) return;
        
        // Initialize chart instances
        
        try {
            this.createWeightBmiChart();
            this.createCompositionChart();
            this.createFatDistributionChart();
            this.isInitialized = true;
        } catch (error) {
            console.error('Error initializing charts:', error);
        }
    }

    // Create weight and BMI chart
    createWeightBmiChart() {
        const canvas = document.getElementById('weightBmiChart');
        if (!canvas) {
            console.warn('Weight/BMI chart canvas not found');
            return;
        }

        const ctx = canvas.getContext('2d');
        this.charts.weightBmi = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Peso (kg)',
                        data: [],
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4,
                        yAxisID: 'y'
                    },
                    {
                        label: 'IMC',
                        data: [],
                        borderColor: 'rgb(239, 68, 68)',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        tension: 0.4,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Data'
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Peso (kg)'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'IMC'
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Evolução do Peso e IMC'
                    }
                }
            }
        });
    }

    // Create body composition chart
    createCompositionChart() {
        const canvas = document.getElementById('compositionChart');
        if (!canvas) {
            console.warn('Composition chart canvas not found');
            return;
        }

        const ctx = canvas.getContext('2d');
        this.charts.composition = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Massa Gorda', 'Massa Muscular', 'Água Corporal'],
                datasets: [{
                    data: [0, 0, 0],
                    backgroundColor: [
                        'rgba(239, 68, 68, 0.8)',
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(34, 197, 94, 0.8)'
                    ],
                    borderColor: [
                        'rgb(239, 68, 68)',
                        'rgb(59, 130, 246)',
                        'rgb(34, 197, 94)'
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
                        text: 'Composição Corporal'
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Create fat distribution chart
    createFatDistributionChart() {
        const canvas = document.getElementById('fatDistributionChart');
        if (!canvas) {
            console.warn('Fat distribution chart canvas not found');
            return;
        }

        const ctx = canvas.getContext('2d');
        this.charts.fatDistribution = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Gordura Visceral', 'Gordura Subcutânea', 'Gordura Total'],
                datasets: [{
                    label: 'Distribuição de Gordura',
                    data: [0, 0, 0],
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    borderColor: 'rgb(239, 68, 68)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgb(239, 68, 68)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(239, 68, 68)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Distribuição de Gordura'
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }

    // Calculate BMI
    calculateBMI(weight, height) {
        if (!weight || !height) return 0;
        const heightInMeters = height / 100;
        return (weight / (heightInMeters * heightInMeters)).toFixed(1);
    }

    // Update charts with new data
    updateCharts(healthData) {
        if (!healthData || healthData.length === 0) {
            return;
        }

        // Update charts with fetched data

        // Sort data by date
        const sortedData = healthData.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Update weight and BMI chart
        if (this.charts.weightBmi) {
            this.charts.weightBmi.data.labels = sortedData.map(record => {
                const date = new Date(record.date);
                return date.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit' });
            });
            this.charts.weightBmi.data.datasets[0].data = sortedData.map(record => record.weight);
            this.charts.weightBmi.data.datasets[1].data = sortedData.map(record => {
                // Calculate BMI if not present
                return record.bmi || this.calculateBMI(record.weight, record.height);
            });
            this.charts.weightBmi.update();
        }

        // Update composition chart with latest data
        if (this.charts.composition && sortedData.length > 0) {
            const latest = sortedData[sortedData.length - 1];
            const fatMass = latest.weight * (latest.bodyFatPercentage / 100);
            const muscleMass = latest.muscleMass || 0;
            const waterMass = latest.weight * 0.6; // Approximate water content

            this.charts.composition.data.datasets[0].data = [
                fatMass,
                muscleMass,
                waterMass
            ];
            this.charts.composition.update();
        }

        // Update fat distribution chart with latest data
        if (this.charts.fatDistribution && sortedData.length > 0) {
            const latest = sortedData[sortedData.length - 1];
            this.charts.fatDistribution.data.datasets[0].data = [
                latest.visceralFat || 0,
                (latest.bodyFatPercentage || 0) - (latest.visceralFat || 0),
                latest.bodyFatPercentage || 0
            ];
            this.charts.fatDistribution.update();
        }
    }

    // Destroy all charts
    destroyCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        this.charts = {};
        this.isInitialized = false;
    }

    // Reinitialize charts
    reinitializeCharts() {
        this.destroyCharts();
        this.initializeCharts();
    }
} 