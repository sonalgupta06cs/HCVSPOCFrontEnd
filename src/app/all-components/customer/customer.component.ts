import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Customer } from 'src/app/models/customer';
import { CustomerService } from 'src/app/services/customer.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  showCustomerForm = false;
  customers: Customer[];
  editIndex: number = null;
  editForm = false;
  showSuccessMessage = false;
  successMessage: string;

  customer: Customer = new Customer();

  public imagePath;
  public message: string;

  @ViewChild('custForm') customerForm: NgForm

  constructor(private customerService: CustomerService, private _sanitizer: DomSanitizer) { }

  ngOnInit() {
    debugger;
    this.getCustomers();
  }

  /* This method gets all the customers */
  private getCustomers() {
    // console.log('getCustomer is getting called');
    this.customerService.getCustomers().subscribe((response: Customer[]) => {
        this.customers = response;
        for (let i = 0; i < this.customers.length; ++i) {
          this.getCustomerLogo(i);
        }
      }
    );
  }

  showCustomerAddForm(event): void {
    this.customer = new Customer();
    this.customer.url = null;
    this.showCustomerForm = true;
    this.editForm = false;
  }

  cancelForm(event) {
    this.customer = new Customer();
    this.showCustomerForm = false;
  }

  cancelEditForm(event) {

      this.customers[this.editIndex].radioSelection = false;
      this.editIndex = null;

    this.customer = new Customer();
    this.showCustomerForm = false;
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
    customerFormData.append('logo', this.customer.logo);
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

        // refresh the list of customers
        this.getCustomers();

      }, (error) => {
        console.log(error);
      });
     }
    }

    /* Method to edit the customer */
    edit(index: number) {
      this.showCustomerForm = true;
      this.editForm = true;

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
        this.customers[this.editIndex] = c;

        this.editIndex = null;

        // refresh customer
        this.getCustomers();
      }, (error) => {
        console.log(error);
      });
     }
    }

    deleteCustomer(index) {
      // console.log('deleteCustomer is getting called');
      const customerId = this.customers[index].id;
      this.customerService.deleteCustomer(customerId).subscribe((response: string) => {
        this.getCustomers();
        this.editIndex = null;
      });

    }

  getCustomerLogo(index) {
    const logoName = this.customers[index].logo;
    this.customerService.getCustomerLogo(logoName).subscribe(response => {

      // Convert Array buffer to base64 string to display images in Angular 7
      let TYPED_ARRAY = new Uint8Array(response);

      const STRING_CHAR = TYPED_ARRAY.reduce((data, byte)=> {
         return data + String.fromCharCode(byte);
      }, '');

      let base64String = btoa(STRING_CHAR);

      this.customers[index].url = this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64, ' + base64String);


      });
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

  hideMessage() {
    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 5000);
  }

}
