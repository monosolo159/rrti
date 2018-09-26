import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController  } from 'ionic-angular';
// import { ForgotpasswordPage } from '../forgotpassword/forgotpassword';
import { Storage } from '@ionic/storage';
import { CenterProvider } from '../../providers/center/center';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import 'moment/locale/th';

@Component({
  selector: 'page-riskpoint',
  templateUrl: 'riskpoint.html'
})
export class RiskpointPage {

  // searchQuery: string = '';
  items: string[];

  constructor(public navCtrl: NavController,public centerProvider:CenterProvider,public storage:Storage,public alertCtrl:AlertController, public loadingCtrl:LoadingController,public http:HttpClient) {
    storage.get('user_data').then((val) => {
      this.initializeItems(val['user_id']);
    });

  }

  public initializeItems(user_id) {
    let loading_popup = this.loadingCtrl.create({
      // content: 'เข้าสู่ระบบ...'
    });
    loading_popup.present();

    var send_data = { 'user_id': user_id };
    var link = this.centerProvider.get_web_api()+"Service_liskpoint/selectAllRiskpoint/format/json";
    this.http.post(link, send_data)
    .subscribe(response => {
      loading_popup.dismiss();
      this.items = JSON.parse(JSON.stringify(response));
    }, error => {
    });
  }

  public detail(id){
    console.log(id);
    // this.navCtrl.push(DinodetailPage, {
    //   id: id
    // })

  }

  public send_riskpoint(){
    
  }

  // getItems(ev: any) {
  //   // Reset items back to all of the items
  //   this.initializeItems();
  //   // set q to the value of the searchbar
  //   var q = ev.target.value;
  //   // console.log("q = "+q);
  //   // if the value is an empty string don't filter the items
  //   if(q.trim()== ''){
  //     this.initializeItems();
  //     return;
  //   }
  //
  //    this.items = this.items.filter((v) => {
  //     if (v['dino_name'].toLowerCase().indexOf(q.toLowerCase()) > -1) {
  //        return true;
  //       }
  //       return false;
  //     })
  //  }

}
