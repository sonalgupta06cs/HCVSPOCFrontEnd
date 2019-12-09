import { Component, OnInit } from '@angular/core';
import { LoginViewModel } from 'src/app/models/login-view-model';
import { LoginService } from 'src/app/services/login/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginViewModel: LoginViewModel = new LoginViewModel();
  loginError = '';

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit() {
  }

  onLoginClick(event) {

    this.loginService.loginAuthenticate(this.loginViewModel).subscribe(
       (response) => {
           this.router.navigateByUrl('/customer');
       },
       (error) => {
         console.log(error);
         this.loginError = 'Invalid email or password';
        }
    );

    console.log('onLoginClick() getting called');
  }

}
