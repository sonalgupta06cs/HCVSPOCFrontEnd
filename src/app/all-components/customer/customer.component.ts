import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Customer } from 'src/app/models/customer';
import { CustomerService } from 'src/app/services/customer.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  userNames: User[];
  customerNames: any;
  showAutocomplete = false;
  showCustomerForm = false;
  customers: Customer[];
  editIndex: number = null;
  editForm = false;
  showSuccessMessage = false;
  successMessage: string;
  errorBlock = false;
  errorText: string;
  showActiveBtn = false;
  isDisableFields = false;

  customer: Customer = new Customer();

  public imagePath;
  public message: string;

  @ViewChild('custForm') customerForm: NgForm

  constructor(private customerService: CustomerService, private userService: UserService , private _sanitizer: DomSanitizer) { }

  ngOnInit() {
    debugger;
    this.getCustomers();
    this.getUserNames();
  }

  /* This method gets all the customers */
  private getCustomers() {
    // console.log('getCustomer is getting called');
    this.customerService.getCustomers().subscribe((response: Customer[]) => {
        this.customers = response;
        console.log('customerNames', this.customers);
        for (let i = 0; i < this.customers.length; ++i) {
          this.getCustomerLogo(i);
        }
      }, error => {
        this.errorBlock = true;
        this.errorText = error.error;
      }
    );
  }

  private getUserNames() {

    this.userService.getUsersNames().subscribe((response: User[]) => {
        this.userNames = response;
        console.log('userNames', this.userNames);
      }, error => {
        this.errorBlock = true;
        this.errorText = error.error;
      }
    );

  }

  getCustomerLogo(index) {
    const logoName = this.customers[index].logo;
    this.customerService.getCustomerLogo(logoName).subscribe(response => {

      // Convert Array buffer to base64 string to display images in Angular 7
      // convert byte array to unsigned 8 bit integers array
      let TYPED_ARRAY = new Uint8Array(response);

      // method to convert the Unicode values into a string of characters
      const STRING_CHAR = TYPED_ARRAY.reduce((data, byte)=> {
         return data + String.fromCharCode(byte);
      }, '');

      // to obtain the base64 string, pass the string of characters
      // to window.btoa() method which will return a base-64 encoded ASCII string
      let base64String = btoa(STRING_CHAR);

      /*
        The base64 string is then appended to the data URL and since,
        by default Angular sanitizes the values when binding URLs to be safe,
        call bypassSecurityTrustUrl() method available on the DomSanitizer service
        that is injected into the constructor to bypass sanitization.
      */
      this.customers[index].url = this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64, ' + base64String);


      }, error => {
        this.errorBlock = true;
        this.errorText = error.error;
      }
      );
  }

  showCustomerAddForm(event): void {
    this.customer = new Customer();
    this.customer.url = null;
    this.showCustomerForm = true;
    this.editForm = false;
  }

    /* Method to view the file being uploaded */
  preview(files) {
    console.log(files);
    if (files.length === 0) {
      return;
    }

    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = 'Only images are supported.';
      return;
    }

    const reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);

    reader.onload = (_event) => {
      this.customer.url = this._sanitizer.bypassSecurityTrustResourceUrl('' + reader.result);
    };
    this.customer.logo = files[0];
  }

  cancelForm(event) {
    this.customer = new Customer();
    this.showCustomerForm = false;
    this.errorBlock = false;
  }

  private createCustomerFormData(): FormData {
    const customerFormData = new FormData();
    customerFormData.append('customerName', this.customer.customerName);
    customerFormData.append('tier1Name', this.customer.tier1Name);
    if(this.customer.tier2Name) {
      customerFormData.append('tier2Name', this.customer.tier2Name);
    }
    if (this.customer.tier3Name) {
      customerFormData.append('tier3Name', this.customer.tier3Name);
    }
    if(this.customer.tier4Name) {
      customerFormData.append('tier4Name', this.customer.tier4Name);
    }
    if(this.customer.tier5Name) {
      customerFormData.append('tier5Name', this.customer.tier5Name);
    }
    if(this.customer.tier6Name) {
      customerFormData.append('tier6Name', this.customer.tier6Name);
    }
    if(this.customer.postalCode) {
      customerFormData.append('postalCode', '' + this.customer.postalCode);
    }
    customerFormData.append('logo', this.customer.logo);
    console.log('active', this.customer.active);
    if (this.customer.active) {
      customerFormData.append('active', this.customer.active.toString());
    }
    if(this.customer.userId) {
      customerFormData.append('userId', this.customer.userId.toString());
    }
    return customerFormData;
  }

  /* Method to create the new customer */
  createCustomer(event) {
    debugger;
    if(this.customerForm.valid) {
    const customerFormData: FormData = this.createCustomerFormData();

     this.customerService.createCustomer(customerFormData).subscribe((response) => {
        this.successMessage = 'Customer has been added successfully.';
        this.showCustomerForm = false;
        this.showSuccessMessage = true;
        this.hideMessage();

        const c: Customer = new Customer();
        c.id = response.id;
        c.customerName = response.customerName;
        c.tier1Name = response.tier1Name;
        c.tier2Name = response.tier2Name;
        c.tier3Name = response.tier3Name;
        c.tier4Name = response.tier4Name;
        c.tier5Name = response.tier5Name;
        c.tier6Name = response.tier6Name;
        c.logo = response.logo;
        c.postalCode = response.postalCode;
        c.userId = response.userId;

        console.log('customer post creation', c);

        this.customers.push(c);

        // Clear New Customer Form Dialog - TextBoxes
        this.customer.id = null;
        this.customer.customerName = null;
        this.customer.tier1Name = null;
        this.customer.tier2Name = null;
        this.customer.tier3Name = null;
        this.customer.tier4Name = null;
        this.customer.tier5Name = null;
        this.customer.tier6Name = null;
        this.customer.logo = null;
        this.customer.url = null;
        this.customer.postalCode = null;
        this.customer.userId = null;

        // refresh the list of customers
        this.getCustomers();
        this.errorBlock = false;

      }, error => {
        this.errorBlock = true;
        this.errorText = error.error;
      });
     }
    }

    /* Method to edit the customer */
    edit(index: number) {
      this.showCustomerForm = true;
      this.editForm = true;
      this.isDisableFields = true;

      this.customer.id = this.customers[index].id;
      this.customer.customerName = this.customers[index].customerName;
      this.customer.tier1Name = this.customers[index].tier1Name;
      this.customer.tier2Name = this.customers[index].tier2Name;
      this.customer.tier3Name = this.customers[index].tier3Name;
      this.customer.tier4Name = this.customers[index].tier4Name;
      this.customer.tier5Name = this.customers[index].tier5Name;
      this.customer.tier6Name = this.customers[index].tier6Name;
      this.customer.logo = this.customers[index].logo;
      this.customer.url = this.customers[index].url;
      this.customer.postalCode = this.customers[index].postalCode;
      this.customer.active = this.customers[index].active;
      this.customer.userId = this.customers[index].userId;
    }

    cancelEditForm(event) {

        this.customers[this.editIndex].checkBoxSelection = false;
        this.editIndex = null;

        this.customer = new Customer();
        this.showCustomerForm = false;
        this.errorBlock = false;
        this.isDisableFields = false;
    }

    updateCustomer() {

      if(this.customerForm.valid) {

      const customerFormData: FormData = this.createCustomerFormData();
      customerFormData.append('id', '' + this.customer.id);

      this.customerService.updateCustomer(customerFormData).subscribe( (response: Customer) => {
        this.successMessage = 'Changes have been saved.';
        this.showSuccessMessage = true;
        this.hideMessage();

        this.showCustomerForm = false;
        const c: Customer = new Customer();
        c.id = response.id;
        c.customerName = response.customerName;
        c.tier1Name = response.tier1Name;
        c.tier2Name = response.tier2Name;
        c.tier3Name = response.tier3Name;
        c.tier4Name = response.tier4Name;
        c.tier5Name = response.tier5Name;
        c.tier6Name = response.tier6Name;
        c.postalCode = response.postalCode;
        this.customers[this.editIndex] = c;


        this.editIndex = null;
        this.isDisableFields = false;

        // refresh customer
        this.getCustomers();
        this.errorBlock = false;
      }, error => {
        this.errorBlock = true;
        this.errorText = error.error;
      });
     }
    }

    activateCustomer() {
      if (this.customerForm.valid) {
        this.customer.active = true;
        this.updateCustomer();
      }
    }

    selectID(editIndex, event) {
      this.editIndex = editIndex;
      this.customers[this.editIndex].checkBoxSelection = event.target.checked;
      console.log(this.editIndex);
      // this.editIndex = customerId;
      /* console.log(event);
      // const customerId = this.customers.id;
      if(event.target.checked) {
        this.toBeDeletedCusomersSelectID.add(customerId);
      } else {
        this.toBeDeletedCusomersSelectID.delete(customerId);
      }
      console.log('pushed', this.toBeDeletedCusomersSelectID);
      console.log(this.toBeDeletedCusomersSelectID.size);
      if (this.toBeDeletedCusomersSelectID.size === 0) {
        this.editIndex = null;
      } */
    }

    deleteCustomer() {
      const toBeDeletedCusomersSelectID = [];
      for (let i = 0; i < this.customers.length; ++i) {
        if (this.customers[i].checkBoxSelection) {
          toBeDeletedCusomersSelectID.push(this.customers[i].id);
        }
      }
      // let toBeDeletedCusomersSelectID = Array.from(this.toBeDeletedCusomersSelectID);
      console.log('toBeDeletedCusomersSelectID', toBeDeletedCusomersSelectID);
        this.customerService.deleteCustomers(toBeDeletedCusomersSelectID).subscribe((response: string) => {
        this.getCustomers();
        this.editIndex = null;
      }, error => {
        this.errorBlock = true;
        this.errorText = error.error;
      });

    }

  hideMessage() {
    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 5000);
  }

  autocomplete(keyword) {
    this.showActiveBtn = false;
    keyword = encodeURIComponent(keyword);
    this.customerService.getCustomerNames(keyword).subscribe((response) => {
      this.showAutocomplete = true;
      this.customerNames = response;

    }, error => {
        this.errorBlock = true;
        this.errorText = error.error;
    });
  }

  getCustomer(customer) {
    this.customer.customerName =  customer.customerName;
    const id = customer.id;
    this.showAutocomplete = false;
    this.customerService.getCustomerById(id).subscribe((response) => {
      console.log('getCustomerOnAutocomplete ', response);
      this.customer = response;
      this.showActiveBtn = true;
    }, error => {
        this.errorBlock = true;
        this.errorText = error.error;
      });
  }

  public toggleActive(activeStatus) {
    // logic to activate/inactivate customer
  }

 /*  onSelect (value) {
     this.customer.mappedUser = value;
     console.log('this.customer.mappedUser '+this.customer.mappedUser + 'value ' + value);
  } */

}
