import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Customer } from '../models/customer';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) {}

  private customerUrl = environment.baseUrl + 'customers';


  public getCustomers(): Observable<any[]> {
    return this.http.get<Customer[]>(this.customerUrl + '/all');
  }

  getCustomerByCustomerID(customerId: number): Observable<Customer> {
    return this.http.get<Customer>(this.customerUrl + '?id=' + customerId, { responseType: 'json' });
  }

  public deleteCustomers(customerIds: any[]) {
    return this.http.post(this.customerUrl, customerIds, { responseType: 'text' });
  }

  public createCustomer(customerFormData: FormData): Observable<any> {
    return this.http.post<any>(this.customerUrl + '/create' , customerFormData, { responseType: 'json' });
  }

  public updateCustomer(existingCustomer: FormData): Observable<Customer> {
    return this.http.put<Customer>(this.customerUrl , existingCustomer, { responseType: 'json' });
  }

  public getCustomerLogo(logoName): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'image/jpeg');

    return this.http.get(this.customerUrl + '/logo/' + logoName, {
      headers: headers,
      responseType: 'arraybuffer'
    });
  }

  public searchByProperty(searchBy: string, searchText: string): Observable<Customer[]> {
      return this.http.get<Customer[]>(this.customerUrl + '/search/' + searchBy + '/' + searchText);
  }

  public getCustomerNames(keyword): Observable<Customer> {
    return this.http.get<Customer>(this.customerUrl + '?keyword=' + keyword);
  }

  public getCustomerById(id): Observable<Customer> {
    return this.http.get<Customer>(this.customerUrl + '/' + id);
  }
}
