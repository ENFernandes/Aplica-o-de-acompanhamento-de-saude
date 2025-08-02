// Chart service for rendering and managing charts
export class ChartService {
    constructor() {
        this.charts = {};
    }

    renderLineChart(canvasId, labels, datasets, title) {
        const ctx = document.getElementById(canvasId)?.getContext('2d');
        if (!ctx) return;
        
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }
        
        this.charts[canvasId] = new Chart(ctx, {
            type: 'line',
            data: { labels, datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: title,
                        font: { size: 16 }
                    },
                    legend: { position: 'top' }
                },
                scales: {
                    y: { beginAtZero: false }
                }
            }
        });
    }

    renderRadarChart(canvasId, labels, dataset, title) {
        const ctx = document.getElementById(canvasId)?.getContext('2d');
        if (!ctx) return;
        
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }
        
        this.charts[canvasId] = new Chart(ctx, {
            type: 'radar',
            data: { labels, datasets: [dataset] },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: title,
                        font: { size: 16 }
                    },
                    legend: { display: false }
                },
                elements: {
                    line: { borderWidth: 3 }
                }
            }
        });
    }

    updateCharts(records) {
        if (!records || records.length === 0) return;
        
        const chronologicalRecords = [...records].reverse();
        const labels = chronologicalRecords.map(r => 
            new Date(r.date + 'T00:00:00').toLocaleDateString('pt-BR')
        );
        
        // Weight and BMI chart
        const weightData = chronologicalRecords.map(r => r.weight);
        const bmiData = chronologicalRecords.map(r => r.bmi);
        this.renderLineChart('weightBmiChart', labels, [
            { 
                label: 'Peso (kg)', 
                data: weightData, 
                borderColor: 'rgb(59, 130, 246)', 
                backgroundColor: 'rgba(59, 130, 246, 0.5)' 
            }, 
            { 
                label: 'IMC', 
                data: bmiData, 
                borderColor: 'rgb(239, 68, 68)', 
                backgroundColor: 'rgba(239, 68, 68, 0.5)' 
            }
        ], 'Evolução do Peso e IMC');
        
        // Body composition chart
        const bodyFatData = chronologicalRecords.map(r => r.bodyFatPercentage);
        const muscleMassData = chronologicalRecords.map(r => r.muscleMass);
        this.renderLineChart('compositionChart', labels, [
            { 
                label: '% Gordura Corporal', 
                data: bodyFatData, 
                borderColor: 'rgb(249, 115, 22)', 
                backgroundColor: 'rgba(249, 115, 22, 0.5)' 
            }, 
            { 
                label: 'Massa Muscular (kg)', 
                data: muscleMassData, 
                borderColor: 'rgb(22, 163, 74)', 
                backgroundColor: 'rgba(22, 163, 74, 0.5)' 
            }
        ], 'Composição Corporal');
        
        // Fat distribution radar chart
        const latestRecord = records[0];
        const fatDistributionData = [
            latestRecord.fatRightArm, 
            latestRecord.fatLeftArm, 
            latestRecord.fatRightLeg, 
            latestRecord.fatLeftLeg, 
            latestRecord.fatTrunk
        ].map(v => v || 0);
        
        this.renderRadarChart('fatDistributionChart', 
            ['Braço Direito', 'Braço Esquerdo', 'Perna Direita', 'Perna Esquerda', 'Tronco'], 
            { 
                label: '% Gordura', 
                data: fatDistributionData, 
                borderColor: 'rgb(168, 85, 247)', 
                backgroundColor: 'rgba(168, 85, 247, 0.2)' 
            }, 
            'Distribuição de Gordura Corporal (%)'
        );
    }

    destroyAllCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart) chart.destroy();
        });
        this.charts = {};
    }
} 