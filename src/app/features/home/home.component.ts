import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  template: `

    <!-- Hero Section -->
    <div class="relative bg-green-50">
      <div class="container mx-auto px-4 py-16">
        <!-- Hero Content -->
        <div class="flex flex-col lg:flex-row items-center justify-between">
          <div class="lg:w-1/2 mb-10 lg:mb-0">
            <h1 class="text-4xl lg:text-6xl font-bold text-green-800 mb-6">
              Make Earth Cleaner, One Recycling at a Time
            </h1>
            <p class="text-lg text-gray-600 mb-8">
              Join RecycleHub and become part of the solution. Connect with certified collectors and turn your waste into rewards.
            </p>
            <div class="flex gap-4">
              <button
                (click)="router.navigate(['/auth/register'])"
                class="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 shadow-lg hover:shadow-xl">
                Get Started
              </button>
              <button
                (click)="router.navigate(['/about'])"
                class="px-8 py-4 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition duration-300">
                Learn More
              </button>
            </div>
          </div>
          <div class="lg:w-1/2">
            <img src="assets/icons/recycling-hero.svg" alt="Recycling Illustration" class="w-full">
          </div>
        </div>

        <!-- Stats Section -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
            <div class="text-3xl font-bold text-green-600 mb-2">2,500+</div>
            <div class="text-gray-600">Active Users</div>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
            <div class="text-3xl font-bold text-green-600 mb-2">15,000kg</div>
            <div class="text-gray-600">Waste Recycled</div>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
            <div class="text-3xl font-bold text-green-600 mb-2">200+</div>
            <div class="text-gray-600">Certified Collectors</div>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
            <div class="text-3xl font-bold text-green-600 mb-2">₫50,000+</div>
            <div class="text-gray-600">Rewards Given</div>
          </div>
        </div>
      </div>

      <!-- How It Works Section -->
      <div class="bg-white py-16">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-12">
            How RecycleHub Works
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="text-center p-6">
              <div class="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-2">Request Collection</h3>
              <p class="text-gray-600">Submit your recycling request with details about your waste materials</p>
            </div>
            <div class="text-center p-6">
              <div class="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-2">Get Connected</h3>
              <p class="text-gray-600">Our certified collectors will pick up your recyclables at your convenience</p>
            </div>
            <div class="text-center p-6">
              <div class="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-2">Earn Rewards</h3>
              <p class="text-gray-600">Get points for your recycling efforts and convert them into valuable rewards</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Materials Section -->
      <div class="bg-green-50 py-16">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-12">
            Materials We Recycle
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition duration-300">
              <div class="bg-blue-100 rounded-lg p-4 mb-4">
                <img src="assets/icons/plastic-icon.svg" alt="Plastic" class="w-12 h-12 mx-auto">
              </div>
              <h3 class="text-xl font-semibold mb-2 text-center">Plastic</h3>
              <p class="text-gray-600 text-center">2 points/kg</p>
            </div>
            <div class="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition duration-300">
              <div class="bg-green-100 rounded-lg p-4 mb-4">
                <img src="assets/icons/glass-icon.svg" alt="Glass" class="w-12 h-12 mx-auto">
              </div>
              <h3 class="text-xl font-semibold mb-2 text-center">Glass</h3>
              <p class="text-gray-600 text-center">1 point/kg</p>
            </div>
            <div class="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition duration-300">
              <div class="bg-yellow-100 rounded-lg p-4 mb-4">
                <img src="assets/icons/paper-icon.svg" alt="Paper" class="w-12 h-12 mx-auto">
              </div>
              <h3 class="text-xl font-semibold mb-2 text-center">Paper</h3>
              <p class="text-gray-600 text-center">1 point/kg</p>
            </div>
            <div class="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition duration-300">
              <div class="bg-gray-100 rounded-lg p-4 mb-4">
                <img src="assets/icons/metal-icon.svg" alt="Metal" class="w-12 h-12 mx-auto">
              </div>
              <h3 class="text-xl font-semibold mb-2 text-center">Metal</h3>
              <p class="text-gray-600 text-center">5 points/kg</p>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="bg-green-600 py-16">
        <div class="container mx-auto px-4 text-center">
          <h2 class="text-3xl lg:text-4xl font-bold text-white mb-8">
            Ready to Start Recycling?
          </h2>
          <p class="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
            Join our community of environmentally conscious individuals and make a difference today.
          </p>
          <button
            (click)="router.navigate(['/auth/register'])"
            class="px-8 py-4 bg-white text-green-600 rounded-lg hover:bg-green-50 transition duration-300 shadow-lg hover:shadow-xl">
            Sign Up Now
          </button>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent {
  constructor(public router: Router) {}
}
