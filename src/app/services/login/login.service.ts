import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginViewModel } from 'src/app/models/login-view-model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  currentUserName: string = null;
  authString = '';
  tokenStr = '';

  private loginAPIUrl = environment.baseUrl + 'login';

  public loginAuthenticate(loginViewModel: LoginViewModel): Observable<any> {


      // const headers = new HttpHeaders({ Authorization: 'Basic ' + btoa(loginViewModel.email + ':' + loginViewModel.password) });
      return this.http.post<any>(this.loginAPIUrl + '/authenticate', loginViewModel)
      .pipe(map(
          userData => {
          if (userData) {
               this.currentUserName = userData.email;
             // creating string to be sent along with each http request using Basic Auth
             // this.authString = 'Basic ' + btoa(user.email + ':' + user.password);
             // sessionStorage.setItem('basicauth', this.authString);
             // sessionStorage.setItem('username', userData.email);

                // creating string to be sent along with each http request
                // Using JWT Authentication
                sessionStorage.setItem('username', userData.email);
                this.tokenStr = 'Bearer ' + userData.token;
                sessionStorage.setItem('token', this.tokenStr);
          }
          return userData;
       }));
  }

  isUserLoggedIn() {
    const user = sessionStorage.getItem('username');
    // console.log(!(user === null));
    return !(user === null);
  }


  public logOut() {
    this.currentUserName = null;
    sessionStorage.removeItem('username')
  }
}
