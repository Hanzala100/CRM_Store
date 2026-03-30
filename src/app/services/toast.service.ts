import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastData {
    message: string;
    type: 'error' | 'success' | 'warning' | 'info';
    duration: number;
    id: string;
}

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    private toastsSubject = new BehaviorSubject<ToastData[]>([]);
    public toasts$ = this.toastsSubject.asObservable();

    show(message: string, duration: number = 5000, type: 'error' | 'success' | 'warning' | 'info' = 'error') {
        const id = Date.now().toString();
        const toast: ToastData = { message, type, duration, id };
        console.log("toast service show called", toast);

        const currentToasts = this.toastsSubject.value;
        this.toastsSubject.next([...currentToasts, toast]);

        if (duration > 0) {
            setTimeout(() => {
                this.remove(id);
            }, duration);
        }
    }

    remove(id: string) {
        const currentToasts = this.toastsSubject.value;
        const filteredToasts = currentToasts.filter(toast => toast.id !== id);
        this.toastsSubject.next(filteredToasts);
    }

    clear() {
        this.toastsSubject.next([]);
    }
}
