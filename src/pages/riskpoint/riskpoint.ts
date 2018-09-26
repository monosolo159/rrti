import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController  } from 'ionic-angular';
// import { ForgotpasswordPage } from '../forgotpassword/forgotpassword';
import { Storage } from '@ionic/storage';
import { CenterProvider } from '../../providers/center/center';
import { HttpClient } from '@angular/common/http';
// import * as moment from 'moment';
import 'moment/locale/th';
import { RiskpointdetailPage } from '../riskpointdetail/riskpointdetail';
import { RiskpointsendPage } from '../riskpointsend/riskpointsend';


@Component({
  selector: 'page-riskpoint',
  templateUrl: 'riskpoint.html'
})
export class RiskpointPage {

  // searchQuery: string = '';
  items: string[];
  max_item = 0;

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
    var link = this.centerProvider.get_web_api()+"Service_riskpoint/selectAllRiskpoint/format/json";
    this.http.post(link, send_data)
    .subscribe(response => {
      loading_popup.dismiss();
      this.items = JSON.parse(JSON.stringify(response));
      this.max_item = this.items.length;
      console.log(this.max_item);
    }, error => {
    });
  }

  public riskpointdetail(riskpoint_id){
    console.log(riskpoint_id);
    this.navCtrl.push(RiskpointdetailPage, {
      riskpoint_id: riskpoint_id
    })
  }

  public send_riskpoint(){
    this.navCtrl.push(RiskpointsendPage, {});
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
