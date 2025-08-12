// Notifications disabled. Keep minimal stubs to avoid errors if referenced.
export class AdminNotificationsService {
    constructor() {
        this.baseUrl = '/api';
        this.notifications = [];
        this.unreadCount = 0;
    }

    // Load notifications
    async loadNotifications() {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch(`${this.baseUrl}/api/admin/notifications`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.notifications = data.notifications || [];
                this.unreadCount = this.notifications.filter(n => !n.read).length;
                this.updateNotificationBadge();
                this.renderNotificationsList();
                return this.notifications;
            } else {
                throw new Error('Failed to load notifications');
            }
        } catch (error) {
            console.error('Error loading notifications:', error);
            // Load mock notifications for development
            this.loadMockNotifications();
        }
    }

    // Load mock notifications for development
    loadMockNotifications() {
        this.notifications = [
            {
                id: '1',
                title: 'Novo utilizador registado',
                message: 'João Silva criou uma nova conta',
                type: 'user',
                read: false,
                createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 minutes ago
            },
            {
                id: '2',
                title: 'Sistema de backup',
                message: 'Backup automático concluído com sucesso',
                type: 'system',
                read: true,
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
            },
            {
                id: '3',
                title: 'Alerta de utilização',
                message: 'Utilização de disco atingiu 80%',
                type: 'alert',
                read: false,
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString() // 4 hours ago
            },
            {
                id: '4',
                title: 'Relatório mensal',
                message: 'Relatório de utilização de janeiro disponível',
                type: 'report',
                read: true,
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 day ago
            }
        ];
        this.unreadCount = this.notifications.filter(n => !n.read).length;
        this.updateNotificationBadge();
        this.renderNotificationsList();
    }

    // Update notification badge
    updateNotificationBadge() {
        const badge = document.getElementById('notification-badge');
        if (badge) {
            if (this.unreadCount > 0) {
                badge.textContent = this.unreadCount;
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        }
    }

    // Render notifications list
    renderNotificationsList() {
        const list = document.getElementById('notifications-list');
        if (!list) return;

        if (this.notifications.length === 0) {
            list.innerHTML = `
                <div class="p-4 text-center text-gray-500">
                    <p>Nenhuma notificação</p>
                </div>
            `;
            return;
        }

        list.innerHTML = this.notifications.map(notification => `
            <div class="notification-item ${!notification.read ? 'unread' : ''}" data-id="${notification.id}">
                <div class="flex items-start space-x-3">
                    <div class="flex-shrink-0">
                        ${this.getNotificationIcon(notification.type)}
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900">${notification.title}</p>
                        <p class="text-sm text-gray-500">${notification.message}</p>
                        <p class="notification-time">${this.formatNotificationTime(notification.createdAt)}</p>
                    </div>
                    ${!notification.read ? `
                        <button class="mark-read-btn text-xs text-blue-600 hover:text-blue-800" onclick="adminNotifications.markAsRead('${notification.id}')">
                            Marcar como lida
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    // Get notification icon
    getNotificationIcon(type) {
        const icons = {
            user: '<div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"><svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></div>',
            system: '<div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"><svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>',
            alert: '<div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center"><svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path></svg></div>',
            report: '<div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center"><svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg></div>'
        };
        return icons[type] || icons.system;
    }

    // Format notification time
    formatNotificationTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        
        if (diffInMinutes < 1) {
            return 'Agora mesmo';
        } else if (diffInMinutes < 60) {
            return `Há ${diffInMinutes} minutos`;
        } else if (diffInMinutes < 1440) {
            const hours = Math.floor(diffInMinutes / 60);
            return `Há ${hours} hora${hours > 1 ? 's' : ''}`;
        } else {
            const days = Math.floor(diffInMinutes / 1440);
            return `Há ${days} dia${days > 1 ? 's' : ''}`;
        }
    }

    // Mark notification as read
    async markAsRead(notificationId) {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch(`${this.baseUrl}/api/admin/notifications/${notificationId}/read`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                // Update local notification
                const notification = this.notifications.find(n => n.id === notificationId);
                if (notification) {
                    notification.read = true;
                    this.unreadCount = this.notifications.filter(n => !n.read).length;
                    this.updateNotificationBadge();
                    this.renderNotificationsList();
                }
            } else {
                throw new Error('Failed to mark notification as read');
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
            // Update locally anyway for development
            const notification = this.notifications.find(n => n.id === notificationId);
            if (notification) {
                notification.read = true;
                this.unreadCount = this.notifications.filter(n => !n.read).length;
                this.updateNotificationBadge();
                this.renderNotificationsList();
            }
        }
    }

    // Mark all notifications as read
    async markAllAsRead() {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch(`${this.baseUrl}/api/admin/notifications/read-all`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                // Update all local notifications
                this.notifications.forEach(n => n.read = true);
                this.unreadCount = 0;
                this.updateNotificationBadge();
                this.renderNotificationsList();
            } else {
                throw new Error('Failed to mark all notifications as read');
            }
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            // Update locally anyway for development
            this.notifications.forEach(n => n.read = true);
            this.unreadCount = 0;
            this.updateNotificationBadge();
            this.renderNotificationsList();
        }
    }

    // Add notification
    addNotification(notification) {
        this.notifications.unshift(notification);
        if (!notification.read) {
            this.unreadCount++;
            this.updateNotificationBadge();
        }
        this.renderNotificationsList();
    }

    // Get notifications
    getNotifications() {
        return this.notifications;
    }

    // Get unread count
    getUnreadCount() {
        return this.unreadCount;
    }

    // Clear all notifications
    clearAllNotifications() {
        this.notifications = [];
        this.unreadCount = 0;
        this.updateNotificationBadge();
        this.renderNotificationsList();
    }
}

export class AdminNotificationsManager {
    constructor() {
        this.notificationsService = new AdminNotificationsService();
        this.setupEventListeners();
    }

    // Initialize notifications
    async initialize() {
        console.log('Initializing admin notifications...');
        
        try {
            await this.notificationsService.loadNotifications();
            console.log('Notifications initialized successfully');
        } catch (error) {
            console.error('Error initializing notifications:', error);
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Notifications panel toggle
        const notificationsBtn = document.getElementById('notifications-btn');
        if (notificationsBtn) {
            notificationsBtn.addEventListener('click', () => {
                this.toggleNotificationsPanel();
            });
        }

        // Close notifications panel when clicking outside
        document.addEventListener('click', (e) => {
            const notificationsPanel = document.getElementById('notifications-panel');
            const notificationsBtn = document.getElementById('notifications-btn');
            
            if (notificationsPanel && notificationsBtn && !notificationsPanel.contains(e.target) && !notificationsBtn.contains(e.target)) {
                notificationsPanel.classList.add('hidden');
            }
        });

        // Mark all as read button (if exists)
        const markAllReadBtn = document.getElementById('mark-all-read');
        if (markAllReadBtn) {
            markAllReadBtn.addEventListener('click', () => {
                this.notificationsService.markAllAsRead();
            });
        }

        // Clear all notifications button (if exists)
        const clearAllBtn = document.getElementById('clear-all-notifications');
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => {
                if (confirm('Tem a certeza que deseja limpar todas as notificações?')) {
                    this.notificationsService.clearAllNotifications();
                }
            });
        }
    }

    // Toggle notifications panel
    toggleNotificationsPanel() {
        const panel = document.getElementById('notifications-panel');
        if (panel) {
            panel.classList.toggle('hidden');
        }
    }

    // Mark notification as read (global function)
    markAsRead(notificationId) {
        this.notificationsService.markAsRead(notificationId);
    }

    // Get notifications service
    getNotificationsService() {
        return this.notificationsService;
    }
}

// Initialize notifications when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    // Notifications are disabled; expose empty manager to prevent runtime errors
    window.adminNotifications = new AdminNotificationsManager();
});