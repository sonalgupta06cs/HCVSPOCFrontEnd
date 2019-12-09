import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  Roles: string[];

  user: User = new User();
  users: User[];
  successMessage: string;
  showSuccessMessage = false;

  errorBlock = false;
  errorText: string;

  @ViewChild('userForm') userForm: NgForm


  constructor(private router: Router, private userService: UserService) {

  }

  ngOnInit() {

    this.getAllUsers();

    this.Roles = [
      'Utilisation Controller', 'Utilisation Manager'
    ];

  }

  getAllUsers() {

    console.log('getAllUsers is getting called');
    this.userService.getUsers().subscribe((response: User[]) => {
        this.users = response;
      }, error => {
        this.errorBlock = true;
        this.errorText = error.error;
      }
    );

  }

   createUser(event): void {

    if(this.userForm.valid) {

        console.log('userForm ' , this.userForm);

        this.userService.createUser(this.user).subscribe((response) => {
        this.successMessage = 'Customer has been added successfully.';
        this.showSuccessMessage = true;
        this.hideMessage();

        const  u: User = new User();
        u.id = response.id;
        u.fullName = response.fullName;
        u.email = response.email;
        u.password = response.password;
        u.roleType = response.roleType;


        this.users.push(u);

        // Clear New User Form Dialog - TextBoxes
        this.user.id = null;
        this.user.fullName = null;
        this.user.email = null;
        this.user.password = null;
        this.user.roleType = null;

        // refresh the list of customers
        this.getAllUsers();

      }, error => {
        this.errorBlock = true;
        this.errorText = error.error;
      }
      );
   }

  }

  cancelUserForm(event) {

    this.user = new User();

  }

  hideMessage() {
    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 5000);
  }

}
