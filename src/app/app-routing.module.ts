import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { CustomerComponent } from './all-components/customer/customer.component';
import { UserComponent } from './all-components/user/user.component';
import { SearchComponent } from './all-components/search/search.component';
import { LoginComponent } from './all-components/login/login.component';
import { AuthGuardService } from './services/auth/auth-guard.service';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full', canActivate: [AuthGuardService] },
  { path: 'login', component: LoginComponent },
  { path: 'customer', component: CustomerComponent, canActivate: [AuthGuardService] },
  { path: 'user', component: UserComponent, canActivate: [AuthGuardService] },
  { path: 'search', component: SearchComponent, canActivate: [AuthGuardService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
