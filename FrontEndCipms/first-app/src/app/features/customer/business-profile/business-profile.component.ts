import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BusinessProfileService } from '../../../core/services/business-profile.service';
import { BusinessProfileDto } from '../../../core/models/business-profile.model';
import { AlertComponent } from '../../../shared/components/alert.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner.component';

@Component({
  selector: 'app-business-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, AlertComponent, LoadingSpinnerComponent],
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <h2 class="text-2xl font-bold text-gray-800">Business Profile</h2>
        <button *ngIf="profile() && !editing()" (click)="editProfile()" class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          Edit Profile
        </button>
      </div>

      <app-alert *ngIf="successMessage()" type="success" [message]="successMessage()" [visible]="true" (dismissed)="successMessage.set('')"></app-alert>
      <app-alert *ngIf="errorMessage()" type="error" [message]="errorMessage()" [visible]="true" (dismissed)="errorMessage.set('')"></app-alert>

      <app-loading-spinner *ngIf="loading()"></app-loading-spinner>

      <!-- Read-Only View -->
      <div *ngIf="profile() && !editing() && !loading()" class="bg-white shadow-sm overflow-hidden sm:rounded-lg border border-gray-200">
        <div class="px-4 py-5 sm:px-6 bg-gradient-to-r from-blue-50 to-white">
          <h3 class="text-lg leading-6 font-medium text-gray-900">{{ profile()?.businessName }}</h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">{{ profile()?.industryType }}</p>
        </div>
        <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl class="sm:divide-y sm:divide-gray-200">
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Location</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ profile()?.location }}</dd>
            </div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Years in Operation</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ profile()?.yearsInOperation }}</dd>
            </div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Employee Count</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ profile()?.employeeCount }}</dd>
            </div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Annual Revenue</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">₹{{ profile()?.annualRevenue | number:'1.0-2' }}</dd>
            </div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Safety Certification</dt>
              <dd class="mt-1 text-sm sm:mt-0 sm:col-span-2">
                <span *ngIf="profile()?.hasSafetyCertification" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                  Certified
                </span>
                <span *ngIf="!profile()?.hasSafetyCertification" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  Not Certified
                </span>
                <a *ngIf="profile()?.safetyCertificatePath" [href]="'https://localhost:7207' + profile()?.safetyCertificatePath" target="_blank"
                  class="ml-3 text-sm text-blue-600 hover:text-blue-800 underline">View Certificate</a>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <!-- Edit/Create Form View -->
      <div *ngIf="editing() && !loading()" class="bg-white shadow-sm sm:rounded-lg border border-gray-200 p-6">
        <h3 class="text-lg font-medium leading-6 text-gray-900 mb-6">{{ profile() ? 'Update Your Profile' : 'Set Up Your Business Profile' }}</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700">Business Name</label>
            <input type="text" [ngModel]="businessName()" (ngModelChange)="businessName.set($event)" class="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Industry Type</label>
            <select [ngModel]="industryType()" (ngModelChange)="industryType.set($event)" class="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
              <option value="">Select Industry</option>
              <option *ngFor="let ind of industryOptions" [value]="ind">{{ ind }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Location</label>
            <input type="text" [ngModel]="location()" (ngModelChange)="location.set($event)" class="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Employee Count</label>
            <input type="number" [ngModel]="employeeCount()" (ngModelChange)="employeeCount.set($event)" class="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Years in Operation</label>
            <input type="number" [ngModel]="yearsInOperation()" (ngModelChange)="yearsInOperation.set($event)" class="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Annual Revenue (₹)</label>
            <input type="number" [ngModel]="annualRevenue()" (ngModelChange)="annualRevenue.set($event)" class="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
          </div>

          <div class="md:col-span-2">
            <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <input type="checkbox" id="safetyCert" [ngModel]="hasSafetyCertification()" (ngModelChange)="hasSafetyCertification.set($event)" class="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
              <label for="safetyCert" class="text-sm font-medium text-gray-700">
                We have a valid Safety Certification
              </label>
            </div>
          </div>

          <div *ngIf="hasSafetyCertification()" class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">Upload Safety Certificate</label>
            <div class="flex items-center gap-4">
              <label class="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <svg class="mr-2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                Choose File
                <input type="file" class="hidden" accept=".pdf,.jpg,.jpeg,.png" (change)="onFileSelected($event)">
              </label>
              <span class="text-sm text-gray-500">{{ selectedFileName() || 'No file chosen' }}</span>
              <button *ngIf="selectedFile()" (click)="uploadCertificate()" [disabled]="uploading()"
                class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50">
                {{ uploading() ? 'Uploading...' : 'Upload' }}
              </button>
            </div>
            <p class="mt-1 text-xs text-gray-500">Accepted formats: PDF, JPG, PNG (Max 5MB)</p>
            <div *ngIf="profile()?.safetyCertificatePath" class="mt-2">
              <a [href]="'https://localhost:7207' + profile()?.safetyCertificatePath" target="_blank" class="text-sm text-blue-600 hover:text-blue-800 underline">
                View current certificate
              </a>
            </div>
          </div>
        </div>
        
        <div class="mt-6 flex justify-end gap-3">
          <button *ngIf="profile()" type="button" (click)="cancelEdit()" class="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Cancel
          </button>
          <button type="button" (click)="saveProfile()" [disabled]="saving() || !businessName() || !industryType() || !location()" class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50">
            {{ saving() ? 'Saving...' : 'Save Profile' }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class BusinessProfileComponent implements OnInit {
  private businessProfileService = inject(BusinessProfileService);

  profile = signal<BusinessProfileDto | null>(null);
  editing = signal(false);
  loading = signal(false);
  saving = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  // Form Signals
  businessName = signal('');
  industryType = signal('');
  employeeCount = signal(0);
  annualRevenue = signal(0);
  yearsInOperation = signal(0);
  location = signal('');
  hasSafetyCertification = signal(false);

  // File upload
  selectedFile = signal<File | null>(null);
  selectedFileName = signal('');
  uploading = signal(false);
  uploadedCertPath = signal('');

  industryOptions = [
    'IT', 'Finance', 'Healthcare', 'Construction',
    'Manufacturing', 'Retail', 'Education', 'Transport',
    'Consulting', 'Mining', 'Chemical', 'Food Processing',
    'Oil & Gas', 'Other'
  ];

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.loading.set(true);
    this.businessProfileService.getMyProfile().subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success && res.data) {
          this.profile.set(res.data);
          this.populateForm(res.data);
          this.editing.set(false);
        }
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 404 || !err.error?.success) {
          // Profile doesn't exist
          this.profile.set(null);
          this.editing.set(true);
        } else {
          this.errorMessage.set('Failed to load profile.');
        }
      }
    });
  }

  editProfile() {
    if (this.profile()) {
      this.populateForm(this.profile()!);
    }
    this.editing.set(true);
    this.successMessage.set('');
    this.errorMessage.set('');
  }

  cancelEdit() {
    if (this.profile()) {
      this.editing.set(false);
    }
  }

  populateForm(data: BusinessProfileDto) {
    this.businessName.set(data.businessName);
    this.industryType.set(data.industryType);
    this.employeeCount.set(data.employeeCount);
    this.annualRevenue.set(data.annualRevenue);
    this.yearsInOperation.set(data.yearsInOperation);
    this.location.set(data.location);
    this.hasSafetyCertification.set(data.hasSafetyCertification);
  }

  saveProfile() {
    this.saving.set(true);
    this.successMessage.set('');
    this.errorMessage.set('');

    const dto: any = {
      businessName: this.businessName(),
      industryType: this.industryType(),
      employeeCount: this.employeeCount(),
      annualRevenue: this.annualRevenue(),
      yearsInOperation: this.yearsInOperation(),
      location: this.location(),
      hasSafetyCertification: this.hasSafetyCertification(),
      safetyCertificatePath: this.uploadedCertPath() || undefined
    };

    const req = this.profile()
      ? this.businessProfileService.update(dto)
      : this.businessProfileService.create(dto);

    req.subscribe({
      next: (res: any) => {
        this.saving.set(false);
        if (res.success && res.data) {
          this.profile.set(res.data);
          this.editing.set(false);
          this.selectedFile.set(null);
          this.selectedFileName.set('');
          this.uploadedCertPath.set('');
          this.successMessage.set('Profile saved successfully.');
        } else {
          this.errorMessage.set(res.message || 'Error saving profile.');
        }
      },
      error: (err: any) => {
        this.saving.set(false);
        this.errorMessage.set(err.error?.message || 'A server error occurred.');
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage.set('File size must be less than 5MB.');
        return;
      }
      this.selectedFile.set(file);
      this.selectedFileName.set(file.name);
    }
  }

  uploadCertificate() {
    const file = this.selectedFile();
    if (!file) return;

    this.uploading.set(true);
    this.errorMessage.set('');

    this.businessProfileService.uploadCertificate(file).subscribe({
      next: (res) => {
        this.uploading.set(false);
        if (res.success && res.data) {
          this.uploadedCertPath.set(res.data);
          this.successMessage.set('Certificate uploaded! Click Save Profile to complete.');
        } else {
          this.errorMessage.set(res.message || 'Upload failed.');
        }
      },
      error: (err) => {
        this.uploading.set(false);
        this.errorMessage.set(err.error?.message || 'Upload failed.');
      }
    });
  }
}
