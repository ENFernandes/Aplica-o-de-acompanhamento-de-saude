// Profile Populator Service - Handles auto-population of height and age from user profile
export class ProfilePopulatorService {
    constructor() {
        this.initialize();
    }

    initialize() {
        // Auto-populate when page loads
        document.addEventListener('DOMContentLoaded', () => {
            // Initial population after a short delay
            setTimeout(() => this.populateHeightAndAgeFromProfile(), 1000);
            
            // Also populate when the form becomes visible
            this.setupVisibilityObserver();
        });

        // Also populate after form submission
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'health-form') {
                // Repopulate after form submission
                setTimeout(() => this.populateHeightAndAgeFromProfile(), 500);
            }
        });
    }

    setupVisibilityObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const appArea = document.getElementById('app-area');
                    if (appArea && !appArea.classList.contains('hidden')) {
                        this.populateHeightAndAgeFromProfile();
                    }
                }
            });
        });
        
        const appArea = document.getElementById('app-area');
        if (appArea) {
            observer.observe(appArea, { attributes: true });
        }
    }

    async populateHeightAndAgeFromProfile() {
        // Auto-populate height and age from profile
        
        // Show loading status
        const heightStatus = document.getElementById('height-status');
        if (heightStatus) {
            heightStatus.classList.remove('hidden');
            heightStatus.textContent = '🔄 Carregando...';
        }
        
        try {
            const token = localStorage.getItem('auth-token');
            if (!token) {
                if (heightStatus) heightStatus.classList.add('hidden');
                return;
            }

            // Check if we have a UserActive set
            const userActive = localStorage.getItem('userActive');
            let endpoint = 'http://localhost:3000/api/users/profile';
            
            if (userActive) {
                // Use the specific user endpoint if we have a UserActive
                endpoint = `http://localhost:3000/api/users/${userActive}/profile`;
            }

            // Fetch user profile
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                const user = data.user;
                
                // profile loaded
                
                // Populate height field
                this.populateHeightField(user, heightStatus);
                
                // Populate age field
                this.populateAgeField(user);
                
                // Update profile banner
                this.updateProfileBanner(user);
                
            } else {
                // failed to fetch
                if (heightStatus) heightStatus.classList.add('hidden');
            }
        } catch (error) {
            console.error('Error auto-populating height/age:', error);
            if (heightStatus) heightStatus.classList.add('hidden');
        }
    }

    populateHeightField(user, heightStatus) {
        const heightInput = document.getElementById('height');
        if (heightInput && user && user.height) {
            heightInput.value = user.height;
            heightInput.readOnly = true;
            heightInput.classList.add('bg-gray-100', 'cursor-not-allowed');
            // height populated
            
            // Update status
            if (heightStatus) {
                heightStatus.textContent = '✅ Preenchido';
                heightStatus.classList.add('text-green-600');
            }
        } else if (heightInput) {
            heightInput.placeholder = 'Defina a sua altura no perfil';
            if (heightStatus) heightStatus.classList.add('hidden');
        }
    }

    populateAgeField(user) {
        const ageInput = document.getElementById('age');
        if (ageInput && user && user.birthday) {
            const age = this.calculateAgeFromBirthday(user.birthday);
            if (age !== null) {
                ageInput.value = age;
                ageInput.readOnly = true;
                ageInput.classList.add('bg-gray-100', 'cursor-not-allowed');
                // age calculated
            }
        } else if (ageInput) {
            ageInput.placeholder = 'Defina a sua data de nascimento no perfil';
        }
    }

    calculateAgeFromBirthday(birthday) {
        if (!birthday) return null;
        
        const today = new Date();
        const birthDate = new Date(birthday);
        
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age;
    }

    updateProfileBanner(user) {
        const banner = document.getElementById('profile-info-banner');
        const heightInfo = document.getElementById('profile-height-info');
        const ageInfo = document.getElementById('profile-age-info');
        const heightValue = document.getElementById('profile-height-value');
        const ageValue = document.getElementById('profile-age-value');
        
        if (banner && user) {
            let hasInfo = false;
            
            // Show height info
            if (user.height) {
                heightInfo.classList.remove('hidden');
                heightValue.textContent = user.height;
                hasInfo = true;
            }
            
            // Show age info
            if (user.birthday) {
                const age = this.calculateAgeFromBirthday(user.birthday);
                if (age !== null) {
                    ageInfo.classList.remove('hidden');
                    ageValue.textContent = age;
                    hasInfo = true;
                }
            }
            
            // Show banner if we have any info
            if (hasInfo) {
                banner.classList.remove('hidden');
            }
        }
    }
}

// Global function for backward compatibility
window.populateHeightAndAgeFromProfile = function() {
    const populator = new ProfilePopulatorService();
    return populator.populateHeightAndAgeFromProfile();
};
