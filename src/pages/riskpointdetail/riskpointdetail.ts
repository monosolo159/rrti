import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, NavParams } from 'ionic-angular';
import { CenterProvider } from '../../providers/center/center';
// import { Md5 } from 'ts-md5/dist/md5';
import { HttpClient } from '@angular/common/http';
import 'moment/locale/th';


@Component({
  selector: 'page-riskpointdetail',
  templateUrl: 'riskpointdetail.html'
})
export class RiskpointdetailPage {

  public data_table: Array<{}>;
  public data_table_pic: Array<{}>;
  public riskpoint_name = '';
  public riskpoint_detail = '';
  public riskpoint_status_name = '';
  public riskpoint_piority_name = '';
  public riskpoint_date = '';
  public web_url = '';

  constructor(public navCtrl: NavController,public alertCtrl:AlertController, public navParams:NavParams, public loadingCtrl:LoadingController,public http: HttpClient,public centerProvider:CenterProvider) {
    this.get_data(this.navParams.get('riskpoint_id'));
    this.web_url = centerProvider.get_web_api()+'assets/img/riskpoint/';
  }

  public get_data(riskpoint_id) {

    let loading_popup = this.loadingCtrl.create({
      // content: 'เข้าสู่ระบบ...'
    });
    loading_popup.present();

    var send_data = { 'riskpoint_id': riskpoint_id };
    var link = this.centerProvider.get_web_api()+"Service_riskpoint/selectRiskpoint/format/json";
    this.http.post(link, send_data)
    .subscribe(response => {
      this.data_table = JSON.parse(JSON.stringify(response));
      this.riskpoint_name = this.data_table[0]['riskpoint_name'];
      this.riskpoint_detail = this.data_table[0]['riskpoint_detail'];
      this.riskpoint_status_name = this.data_table[0]['riskpoint_status_name'];
      this.riskpoint_piority_name = this.data_table[0]['riskpoint_piority_name'];
      this.riskpoint_date = this.data_table[0]['riskpoint_date'];
    }, error => {
    });

    send_data = { 'riskpoint_id': riskpoint_id };
    link = this.centerProvider.get_web_api()+"Service_riskpoint/selectRiskpointPic/format/json";
    this.http.post(link, send_data)
    .subscribe(response => {
      loading_popup.dismiss();
      this.data_table_pic = JSON.parse(JSON.stringify(response));
    }, error => {
    });
  }

}
