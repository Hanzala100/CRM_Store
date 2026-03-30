import { Component } from '@angular/core';

@Component({
  selector: 'app-skeleton-card',
  standalone: true,
  template: `
    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
      <div class="bg-slate-200 h-56 w-full"></div>
      <div class="p-4 space-y-3">
        <div class="bg-slate-200 h-4 rounded-lg w-3/4"></div>
        <div class="bg-slate-200 h-4 rounded-lg w-1/2"></div>
        <div class="bg-slate-200 h-10 rounded-xl w-full mt-2"></div>
      </div>
    </div>
  `
})
export class SkeletonCardComponent {}
