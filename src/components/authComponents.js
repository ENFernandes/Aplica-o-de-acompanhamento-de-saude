// Authentication UI components
export class AuthComponents {
    static createLoginForm(onSubmit, onSwitchToRegister, onSwitchToPasswordRecovery) {
        return `
            <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div class="max-w-md w-full space-y-8">
                    <div>
                        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Entrar na sua conta
                        </h2>
                        <p class="mt-2 text-center text-sm text-gray-600">
                            Aceda ao seu acompanhamento de saúde
                        </p>
                    </div>
                    <form class="mt-8 space-y-6" id="login-form">
                        <div class="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label for="login-email" class="sr-only">Email</label>
                                <input id="login-email" name="email" type="email" required 
                                    class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" 
                                    placeholder="Email">
                            </div>
                            <div>
                                <label for="login-password" class="sr-only">Password</label>
                                <input id="login-password" name="password" type="password" required 
                                    class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" 
                                    placeholder="Password">
                            </div>
                        </div>

                        <div class="flex items-center justify-between">
                            <div class="text-sm">
                                <button type="button" id="forgot-password-btn" 
                                    class="font-medium text-blue-600 hover:text-blue-500">
                                    Esqueceu a password?
                                </button>
                            </div>
                        </div>

                        <div>
                            <button type="submit" 
                                class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                                    <svg class="h-5 w-5 text-blue-500 group-hover:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                                    </svg>
                                </span>
                                Entrar
                            </button>
                        </div>

                        <div class="text-center">
                            <button type="button" id="switch-to-register-btn" 
                                class="font-medium text-blue-600 hover:text-blue-500">
                                Não tem uma conta? Registe-se
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    static createRegisterForm(onSubmit, onSwitchToLogin) {
        return `
            <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div class="max-w-md w-full space-y-8">
                    <div>
                        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Criar nova conta
                        </h2>
                        <p class="mt-2 text-center text-sm text-gray-600">
                            Comece o seu acompanhamento de saúde
                        </p>
                        <p class="mt-1 text-center text-xs text-gray-500">
                            Após o registo, será redirecionado para a página de login
                        </p>
                    </div>
                    <form class="mt-8 space-y-6" id="register-form">
                        <div class="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label for="register-name" class="sr-only">Nome</label>
                                <input id="register-name" name="name" type="text" required 
                                    class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" 
                                    placeholder="Nome completo">
                            </div>
                            <div>
                                <label for="register-email" class="sr-only">Email</label>
                                <input id="register-email" name="email" type="email" required 
                                    class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" 
                                    placeholder="Email">
                            </div>
                            <div>
                                <label for="register-password" class="sr-only">Password</label>
                                <input id="register-password" name="password" type="password" required 
                                    class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" 
                                    placeholder="Password">
                            </div>
                            <div>
                                <label for="register-confirm-password" class="sr-only">Confirmar Password</label>
                                <input id="register-confirm-password" name="confirmPassword" type="password" required 
                                    class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" 
                                    placeholder="Confirmar Password">
                            </div>
                        </div>

                        <div>
                            <button type="submit" 
                                class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                                    <svg class="h-5 w-5 text-blue-500 group-hover:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                                    </svg>
                                </span>
                                Registar
                            </button>
                        </div>

                        <div class="text-center">
                            <button type="button" id="switch-to-login-btn" 
                                class="font-medium text-blue-600 hover:text-blue-500">
                                Já tem uma conta? Entre aqui
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    static createPasswordRecoveryForm(onSubmit, onSwitchToLogin) {
        return `
            <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div class="max-w-md w-full space-y-8">
                    <div>
                        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Recuperar Password
                        </h2>
                        <p class="mt-2 text-center text-sm text-gray-600">
                            Introduza o seu email para receber instruções de recuperação
                        </p>
                    </div>
                    <form class="mt-8 space-y-6" id="password-recovery-form">
                        <div>
                            <label for="recovery-email" class="sr-only">Email</label>
                            <input id="recovery-email" name="email" type="email" required 
                                class="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" 
                                placeholder="Email">
                        </div>

                        <div>
                            <button type="submit" 
                                class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                                    <svg class="h-5 w-5 text-blue-500 group-hover:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                </span>
                                Enviar Email de Recuperação
                            </button>
                        </div>

                        <div class="text-center">
                            <button type="button" id="back-to-login-btn" 
                                class="font-medium text-blue-600 hover:text-blue-500">
                                Voltar ao Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    static createUserProfile(user, onLogout, onUpdateProfile) {
        return `
            <div class="absolute top-4 right-4">
                <div class="relative">
                    <button id="user-menu-btn" class="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <span class="text-white text-sm font-medium">${user.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <span>${user.name}</span>
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </button>
                    
                    <div id="user-menu-dropdown" class="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                        <div class="py-1">
                            <button id="edit-profile-menu-btn" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                <div class="flex items-center">
                                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                    </svg>
                                    Editar Perfil
                                </div>
                            </button>
                            <hr class="my-1">
                            <button id="logout-menu-btn" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                <div class="flex items-center">
                                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                                    </svg>
                                    Sair
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    static createProfileEditForm(user, onSave, onCancel) {
        return `
            <div class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                    <div class="px-6 py-4 border-b border-gray-200">
                        <h3 class="text-lg font-medium text-gray-900">Editar Perfil</h3>
                    </div>
                    
                    <form id="profile-edit-form" class="px-6 py-4 space-y-4">
                        <div>
                            <label for="edit-name" class="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
                            <input type="text" id="edit-name" name="name" value="${user.name || ''}" required 
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        
                        <div>
                            <label for="edit-email" class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                            <input type="email" id="edit-email" name="email" value="${user.email || ''}" required 
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        
                        <div>
                            <label for="edit-phone" class="block text-sm font-medium text-gray-700 mb-1">Número de Telemóvel</label>
                            <input type="tel" id="edit-phone" name="phone" value="${user.phone || ''}" 
                                placeholder="+351 912 345 678"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        
                        <div>
                            <label for="edit-address" class="block text-sm font-medium text-gray-700 mb-1">Morada</label>
                            <textarea id="edit-address" name="address" rows="3" 
                                placeholder="Rua, número, código postal, cidade"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">${user.address || ''}</textarea>
                        </div>
                        
                        <div>
                            <label for="edit-taxId" class="block text-sm font-medium text-gray-700 mb-1">Número de Identificação Fiscal</label>
                            <input type="text" id="edit-taxId" name="taxId" value="${user.taxId || ''}" 
                                placeholder="123456789"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        
                        <div>
                            <label for="edit-height" class="block text-sm font-medium text-gray-700 mb-1">Altura (cm)</label>
                            <input type="number" id="edit-height" name="height" value="${user.height || ''}" 
                                placeholder="175"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                            <p class="text-xs text-gray-500 mt-1">Esta altura será usada automaticamente no formulário principal</p>
                        </div>
                        
                        <div>
                            <label for="edit-birthday" class="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
                            <input type="date" id="edit-birthday" name="birthday" value="${user.birthday || ''}" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                            <p class="text-xs text-gray-500 mt-1">A idade será calculada automaticamente no formulário principal</p>
                        </div>
                        
                        <div class="flex justify-end space-x-3 pt-4">
                            <button type="button" id="cancel-edit-btn" 
                                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                Cancelar
                            </button>
                            <button type="submit" 
                                class="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                Guardar Alterações
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }
} 