import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
        <div>
          <h2 class="mt-2 text-center text-3xl font-extrabold text-blue-900">
            CIPMS
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Commercial Insurance Policy Management System
          </p>
          <h3 class="mt-6 text-center text-xl font-bold text-gray-900">
            Sign in to your account
          </h3>
        </div>

        <div *ngIf="errorMessage()" class="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div class="flex">
            <div class="ml-3">
              <p class="text-sm text-red-700">
                {{ errorMessage() }}
              </p>
            </div>
          </div>
        </div>

        <form class="mt-8 space-y-6" (ngSubmit)="onSubmit()">
          <div class="rounded-md shadow-sm space-y-4">
            <div>
              <label for="email" class="sr-only">Email address</label>
              <input id="email" name="email" type="email" autocomplete="email" required
                class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                [ngModel]="email()"
                (ngModelChange)="email.set($event)">
            </div>
            <div class="relative">
              <label for="password" class="sr-only">Password</label>
              <input id="password" name="password" [type]="showPassword() ? 'text' : 'password'" autocomplete="current-password" required
                class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                [ngModel]="password()"
                (ngModelChange)="password.set($event)">
              <button type="button" class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                (click)="showPassword.set(!showPassword())">
                <span class="text-gray-500 hover:text-gray-700 cursor-pointer">{{ showPassword() ? 'Hide' : 'Show' }}</span>
              </button>
            </div>
          </div>

          <div>
            <button type="submit" [disabled]="loading() || !email() || !password()"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200">
              <span *ngIf="loading()" class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ loading() ? 'Signing in...' : 'Sign in' }}
            </button>
          </div>
        </form>

        <div class="text-center mt-4">
          <p class="text-sm text-gray-600">
            Don't have an account? 
            <a routerLink="/register" class="font-medium text-blue-600 hover:text-blue-500">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
    private authService = inject(AuthService);
    private router = inject(Router);

    email = signal('');
    password = signal('');
    showPassword = signal(false);
    loading = signal(false);
    errorMessage = signal('');

    onSubmit(): void {
        if (!this.email() || !this.password()) return;

        this.loading.set(true);
        this.errorMessage.set('');

        this.authService.login({ email: this.email(), password: this.password() }).subscribe({
            next: (res: any) => {
                this.loading.set(false);
                if (res.success && res.data) {
                    const role = res.data.role;
                    if (role === 'Admin') {
                        this.router.navigate(['/admin/dashboard']);
                    } else if (role === 'Agent') {
                        this.router.navigate(['/agent/dashboard']);
                    } else if (role === 'ClaimsOfficer') {
                        this.router.navigate(['/officer/dashboard']);
                    } else {
                        this.router.navigate(['/customer/dashboard']);
                    }
                } else {
                    this.errorMessage.set(res.message || 'Login failed.');
                }
            },
            error: (err: any) => {
                this.loading.set(false);
                this.errorMessage.set(err.error?.message || 'An error occurred during login.');
            }
        });
    }
}
