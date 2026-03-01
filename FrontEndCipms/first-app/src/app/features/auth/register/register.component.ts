import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
        <div>
          <h2 class="mt-2 text-center text-3xl font-extrabold text-blue-900">
            CIPMS
          </h2>
          <h3 class="mt-6 text-center text-xl font-bold text-gray-900">
            Create an account
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
              <label for="fullName" class="sr-only">Full Name</label>
              <input id="fullName" name="fullName" type="text" required
                class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Full Name"
                [ngModel]="fullName()"
                (ngModelChange)="fullName.set($event)">
            </div>
            <div>
              <label for="email" class="sr-only">Email address</label>
              <input id="email" name="email" type="email" autocomplete="email" required
                class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Email address"
                [ngModel]="email()"
                (ngModelChange)="email.set($event)">
            </div>
            <div>
              <label for="password" class="sr-only">Password</label>
              <input id="password" name="password" type="password" autocomplete="new-password" required
                class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Password"
                [ngModel]="password()"
                (ngModelChange)="password.set($event)">
            </div>
            <div>
              <label for="confirmPassword" class="sr-only">Confirm Password</label>
              <input id="confirmPassword" name="confirmPassword" type="password" autocomplete="new-password" required
                class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                [class.border-red-500]="confirmPassword() && !passwordsMatch()"
                placeholder="Confirm Password"
                [ngModel]="confirmPassword()"
                (ngModelChange)="confirmPassword.set($event)">
              <p *ngIf="confirmPassword() && !passwordsMatch()" class="mt-1 text-xs text-red-500">Passwords do not match.</p>
            </div>
          </div>

          <div>
            <button type="submit" [disabled]="loading() || !fullName() || !email() || !password() || !passwordsMatch()"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200">
              <span *ngIf="loading()" class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ loading() ? 'Creating account...' : 'Register' }}
            </button>
          </div>
        </form>

        <div class="text-center mt-4">
          <p class="text-sm text-gray-600">
            Already have an account? 
            <a routerLink="/login" class="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
    private authService = inject(AuthService);
    private router = inject(Router);

    fullName = signal('');
    email = signal('');
    password = signal('');
    confirmPassword = signal('');
    loading = signal(false);
    errorMessage = signal('');

    passwordsMatch = computed(() => this.password() === this.confirmPassword());

    onSubmit(): void {
        if (!this.passwordsMatch() || !this.fullName() || !this.email() || !this.password()) {
            return;
        }

        this.loading.set(true);
        this.errorMessage.set('');

        this.authService.register({
            fullName: this.fullName(),
            email: this.email(),
            password: this.password()
        }).subscribe({
            next: (res) => {
                this.loading.set(false);
                if (res.success) {
                    this.router.navigate(['/customer/dashboard']);
                } else {
                    this.errorMessage.set(res.message || 'Registration failed.');
                }
            },
            error: (err) => {
                this.loading.set(false);
                this.errorMessage.set(err.error?.message || 'An error occurred during registration.');
            }
        });
    }
}
