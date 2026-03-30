import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="bg-slate-50 border-t border-slate-200 mt-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <!-- Brand -->
          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-sm">S</span>
              </div>
              <span class="text-slate-900 font-semibold text-lg">Store</span>
            </div>
            <p class="text-slate-500 text-sm">Premium products at your fingertips.</p>
          </div>

          <!-- Links -->
          <div class="flex flex-wrap gap-6 text-sm text-slate-500">
            <a routerLink="/home" class="hover:text-indigo-600 transition-colors">Home</a>
            <a routerLink="/cart" class="hover:text-indigo-600 transition-colors">Cart</a>
            <a routerLink="/login" class="hover:text-indigo-600 transition-colors">Login</a>
          </div>
        </div>

        <div class="mt-10 pt-8 border-t border-slate-200 text-center text-xs text-slate-400">
          &copy; {{currentYear}} Store. All rights reserved.
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
