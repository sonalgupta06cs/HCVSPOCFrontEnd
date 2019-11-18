import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'src/app/services/customer.service';
import { Customer } from 'src/app/models/customer';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchBy: string;
  searchText: string;

  customers: Customer[];


  constructor(private customerService: CustomerService, private _sanitizer: DomSanitizer) { }

  ngOnInit() {
  }

  onSearchClick() {

  console.log('onSearchClick getting called');

   this.customerService.searchByProperty(this.searchBy, this.searchText).subscribe(
     (response: Customer[]) => {
                                   this.customers = response;
                                  for (let i = 0; i < this.customers.length; ++i) {
                                         this.getCustomerLogo(i);
                                  }
                               },
     (error) => { console.log(error); }
     );

     console.log('onSearchClick finished calling');

  }

    getCustomerLogo(index) {
    const logoName = this.customers[index].logo;
    this.customerService.getCustomerLogo(logoName).subscribe(response => {

      // Convert Array buffer to base64 string to display images in Angular 7
      const TYPED_ARRAY = new Uint8Array(response);

      const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
         return data + String.fromCharCode(byte);
      }, '');

      const base64String = btoa(STRING_CHAR);

      this.customers[index].url = this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64, ' + base64String);


      });
  }

}
