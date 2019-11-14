import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user';
import { Observable } from 'rxjs';



const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private http: HttpClient) {}

  // private userUrl = 'http://localhost:8080/user-portal/user';
  private userUrl = 'http://localhost:8889/api/user';

  public getUsers() {
    return this.http.get<User[]>(this.userUrl);
  }

  getUserByUserID(userId: number): Observable<User> {
    return this.http.get<User>(this.userUrl + '/getUserByUserId/' + userId, { responseType: 'json' });
  }

  public deleteUser(existingUser: User): Observable<string> {
    return this.http.delete<string>(this.userUrl + '?userId/' + existingUser.id);
  }

  public createUser(newUser: User): Observable<User> {
    return this.http.post<User>(this.userUrl , newUser, { responseType: 'json' });
  }

   public updateUser(existingUser: User): Observable<User> {
    return this.http.put<User>(this.userUrl , existingUser, { responseType: 'json' });
  }

}
