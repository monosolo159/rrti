// import { HTTP } from '@ionic-native/http';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


/*
  Generated class for the CenterProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CenterProvider {
  public web_api = 'http://192.168.0.101/rrti/';
  constructor(public http: HttpClient) {
    console.log('Hello CenterProvider Provider');
  }

  public get_web_api(){
    return this.web_api;
  }
}
