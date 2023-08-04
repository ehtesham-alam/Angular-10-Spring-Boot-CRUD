import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8081/api/products';
  private categoryUrl = 'http://localhost:8081/api/product-category';


  constructor(private httpClient: HttpClient) { }

  getProduct1(theProductId: number): Observable<Product> {

    //neend a build url basesd on category id 
    const productUrl = `${this.baseUrl}/${theProductId}`;
    return this.httpClient.get<Product>(productUrl)

  }

  getProductListPaginate(thePage: number,
                        thePageSize: number,
                        theCategoryId: number): Observable<GetResponseProducts> {

    //need a build URL based on category id, page size
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
      + `&page=${thePage}&size=${thePageSize}`;


    return this.httpClient.get<GetResponseProducts>(searchUrl);

  }

  getProductList(theCategoryId: number): Observable<Product[]> {

    //need a build URL based on category id
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;
    return this.getProduct(searchUrl);
  }

  searchProducts(theKeyword: string): Observable<Product[]> {

    //need a build URL based on the keyword
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;
    return this.getProduct(searchUrl);

  }

  searchProductsPaginate(thePage: number,
                          thePageSize: number,
                          theKeyword: string): Observable<GetResponseProducts> {

            //need a build URL based on category keyword, page size
            const searchUrl = `${this.baseUrl}/search/findByNameContaining`

            +`?name=${theKeyword}&page=${thePage}&size=${thePageSize}`
            return this.httpClient.get<GetResponseProducts>(searchUrl);
            }

  private getProduct(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map((response): Product[] => response._embedded.products)
    );
  }


  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }
}


interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    totalElements: number;
    size: number,
    totalPages: number,
    number: number

  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}


