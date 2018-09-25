import { Component } from '@angular/core';
import { App,NavController,AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../login/login';
import { HttpClient } from '@angular/common/http';
import { CenterProvider } from '../../providers/center/center';
import { ForgotpasswordPage } from '../forgotpassword/forgotpassword';


@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  public data_table: Array<{}>;
  public user_id;
  public user_pic;
  public user_fname;
  public user_lname;
  public user_address;
  public user_subdistrict;
  public user_district;
  public user_province;
  public user_zipcode;
  public user_tel;
  public user_email;
  public user_area;

  constructor(public navCtrl: NavController,public alertCtrl:AlertController, public loadingCtrl:LoadingController,public storage:Storage,public app:App,public http:HttpClient,public centerProvider:CenterProvider) {
    storage.get('user_data').then((val) => {
      if (val != null) {
        this.get_user(val['user_id']);
      }
    });
  }

  public get_user(user_id){
    let loading_popup = this.loadingCtrl.create({
      // content: 'เข้าสู่ระบบ...'
    });
    loading_popup.present();
    var send_data = { 'user_id': user_id};
    var link = this.centerProvider.get_web_api()+"Service_user/selectUser/format/json";
    this.http.post(link, send_data)
    .subscribe(response => {
      this.data_table = JSON.parse(JSON.stringify(response));
      this.user_fname = this.data_table[0]['user_fname'];
      this.user_lname = this.data_table[0]['user_lname'];
      this.user_address = this.data_table[0]['user_address'];
      this.user_subdistrict = this.data_table[0]['new_subdistrict'];
      this.user_district = this.data_table[0]['new_district'];
      this.user_province = this.data_table[0]['new_province'];
      this.user_zipcode = this.data_table[0]['new_zipcode'];
      this.user_tel = this.data_table[0]['user_tel'];
      this.user_email = this.data_table[0]['user_email'];
      this.user_area = this.data_table[0]['new_area'];
      this.user_pic = this.data_table[0]['user_pic'];
      loading_popup.dismiss();
    }, error => {
    });
  }


  public change_password(){
    this.navCtrl.push(ForgotpasswordPage, {});
  }

  public logout() {
    let alert = this.alertCtrl.create({
      title: 'ออกจากระบบ',
      buttons: [
        {
          text: 'ยกเลิก',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'ยืนยัน',
          handler: () => {
            this.storage.remove('user_data').then((val) => {
              let navCtrl = this.app.getRootNav();
              navCtrl.setRoot(LoginPage);
            });
          }
        }

      ]
    });
    alert.present();
  }

}
