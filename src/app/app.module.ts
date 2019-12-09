import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { FooterComponent } from './footer/footer.component';
import { UserComponent } from './all-components/user/user.component';
import { CustomerComponent } from './all-components/customer/customer.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from './all-components/search/search.component';
import { LoginComponent } from './all-components/login/login.component';
import { BasicAuthHttpInterceptorService } from './services/interceptors/auth/basic-auth-interceptor.service';
import { ErrorhandlerServiceInterceptor } from './services/interceptors/error-handler/errorhandler.service';


@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    FooterComponent,
    UserComponent,
    CustomerComponent,
    SearchComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers:  [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BasicAuthHttpInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorhandlerServiceInterceptor,
      multi: true
    }
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
