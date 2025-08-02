// Health suggestions service
export class SuggestionsService {
    static generateSuggestions(latestRecord) {
        if (!latestRecord) {
            return [{
                title: 'Adicione seu primeiro registro',
                text: 'Adicione seu primeiro registro para receber sugestões personalizadas.',
                icon: '📝'
            }];
        }

        const suggestions = [];
        const { bodyFatPercentage, muscleMass, visceralFat, waterPercentage, bmi, weight } = latestRecord;

        // Visceral fat suggestions
        if (visceralFat >= 10) {
            suggestions.push({
                title: 'Foco na Gordura Visceral',
                text: `Seu nível de gordura visceral (${visceralFat}) está elevado. Foque em exercícios cardiovasculares e reduza o consumo de açúcares.`,
                icon: '⚠️'
            });
        }

        // Body fat percentage suggestions
        if (bodyFatPercentage > 25) {
            suggestions.push({
                title: 'Reduzir Gordura Corporal',
                text: `Seu percentual de gordura (${bodyFatPercentage}%) está acima do ideal. Combine treinos de força com atividades aeróbicas.`,
                icon: '🔥'
            });
        }

        // Muscle mass suggestions
        if (muscleMass < (weight * 0.3)) {
            suggestions.push({
                title: 'Aumentar Massa Muscular',
                text: `Sua massa muscular (${muscleMass} kg) pode ser otimizada. Priorize treinos de resistência e uma ingestão adequada de proteínas.`,
                icon: '💪'
            });
        }

        // Water percentage suggestions
        if (waterPercentage < 50) {
            suggestions.push({
                title: 'Melhorar Hidratação',
                text: `Seu percentual de água (${waterPercentage}%) está baixo. Tente beber pelo menos 2 litros de água por dia.`,
                icon: '💧'
            });
        }

        // BMI suggestions
        if (bmi > 25) {
            suggestions.push({
                title: 'Atenção ao IMC',
                text: `Seu IMC (${bmi}) indica sobrepeso. Uma dieta balanceada e exercícios regulares são o caminho.`,
                icon: '⚖️'
            });
        }

        // If no issues found, show congratulations
        if (suggestions.length === 0) {
            suggestions.push({
                title: 'Parabéns!',
                text: 'Seus indicadores estão ótimos! Continue com os bons hábitos.',
                icon: '🎉'
            });
        }

        return suggestions;
    }

    static renderSuggestions(suggestions, container) {
        container.innerHTML = '';
        
        suggestions.forEach(sugg => {
            const suggestionEl = document.createElement('div');
            suggestionEl.className = 'bg-white p-4 rounded-lg shadow-sm flex items-start space-x-4';
            suggestionEl.innerHTML = `
                <div class="text-2xl">${sugg.icon}</div>
                <div>
                    <h4 class="font-bold text-gray-800">${sugg.title}</h4>
                    <p class="text-gray-600">${sugg.text}</p>
                </div>
            `;
            container.appendChild(suggestionEl);
        });
    }
} 