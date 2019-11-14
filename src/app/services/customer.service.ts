import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Customer } from '../models/customer';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) {}

  private customerUrl = 'http://localhost:8889/api/customers';


  public getCustomers(): Observable<any[]> {
    return this.http.get<Customer[]>(this.customerUrl + '/all');
  }

  getCustomerByCustomerID(customerId: number): Observable<Customer> {
    return this.http.get<Customer>(this.customerUrl + '?id=' + customerId, { responseType: 'json' });
  }

  public deleteCustomer(customerId: number) {
    return this.http.delete(this.customerUrl + '/' + customerId);
  }

  public createCustomer(customerFormData: FormData): Observable<any> {
    return this.http.post<any>(this.customerUrl + '/create' , customerFormData, { responseType: 'json' });
  }

  public updateCustomer(existingCustomer: FormData): Observable<Customer> {
    return this.http.put<Customer>(this.customerUrl , existingCustomer, { responseType: 'json' });
  }

  public getCustomerLogo(customerId): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'image/jpeg');

    return this.http.get(this.customerUrl + '/logo/' + customerId, {
      headers: headers,
      responseType: 'arraybuffer'
    });
  }

}
