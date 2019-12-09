import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';



const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private http: HttpClient) {}

  private userUrl = environment.baseUrl + 'users';

  public getUsers(): Observable<any[]> {
    return this.http.get<User[]>(this.userUrl + '/all');
  }

  public createUser(newUser: User): Observable<User> {
    return this.http.post<User>(this.userUrl + '/create' , newUser, { responseType: 'json' });
  }



  getUserByUserID(userId: number): Observable<User> {
    return this.http.get<User>(this.userUrl + '/getUserByUserId/' + userId, { responseType: 'json' });
  }

  public deleteUser(existingUser: User): Observable<string> {
    return this.http.delete<string>(this.userUrl + '?userId/' + existingUser.id);
  }

   public updateUser(existingUser: User): Observable<User> {
    return this.http.put<User>(this.userUrl , existingUser, { responseType: 'json' });
  }

  public getUsersNames(): Observable<any[]> {
    return this.http.get<User[]>(this.userUrl + '/usersNames');
  }

}
