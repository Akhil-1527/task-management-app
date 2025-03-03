import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http'; // ✅ FIX: Provide HttpClient
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(), // ✅ FIX: Registers HttpClient globally
    provideRouter(routes)
  ]
}).catch(err => console.error("Error bootstrapping Angular app:", err));
