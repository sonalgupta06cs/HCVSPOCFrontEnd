import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  UsersList = [];
  Roles: string[];

  user: User = new User();

  constructor(private router: Router, private userService: UserService) {

  }

  ngOnInit() {

    this.UsersList = [
    {name: 'Alan Jones', email: 'alan.jones@hitachi.com', role: 'Utilisation Controller'},
    {name: 'Trina Forest', email: 'trina.forest@hitachi.com', role: 'Manager'},
    ];

    this.Roles = [
      'Utilisation Controller', 'Utilisation Manager'
    ];

  }

   createUser(event): void {

      alert('created user');

   /*  this.userService.createUser(this.user)
        .subscribe( data => {
          alert("User created successfully.");
        }); */

  }

}
