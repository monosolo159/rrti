import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { CenterProvider } from '../../providers/center/center';
import { Md5 } from 'ts-md5/dist/md5';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-forgotpassword',
  templateUrl: 'forgotpassword.html'
})
export class ForgotpasswordPage {

  public data_table: Array<{}>;
  public user_personal_id='';
  public user_password='';
  public user_password_confirm='';
  // public user_id = '';

  constructor(public navCtrl: NavController,public alertCtrl:AlertController, public loadingCtrl:LoadingController,public http: HttpClient,public storage: Storage,public centerProvider:CenterProvider) {

  }

  public change_password() {
    // console.log('call_password');

    if (this.user_password == "" || this.user_password_confirm == "" || this.user_personal_id == "" || this.user_password == null || this.user_password_confirm == null || this.user_personal_id == null) {
      let alert = this.alertCtrl.create({
        // title: 'แจ้งเตือน',
        subTitle: 'กรุณาระบุข้อมูลให้ครบถ้วน',
        buttons: ['ตกลง']
      });
      alert.present();
    } else {

      if(this.user_password != this.user_password_confirm){
        let alert = this.alertCtrl.create({
          // title: 'แจ้งเตือน',
          subTitle: 'รหัสผ่านไม่ตรงกัน',
          buttons: ['ตกลง']
        });
        alert.present();
      }else{
        let loading_popup = this.loadingCtrl.create({
          // content: 'เข้าสู่ระบบ...'
        });
        loading_popup.present();

        var send_data = { 'user_password': Md5.hashStr(this.user_password) ,'user_personal_id':this.user_personal_id};
        var link = this.centerProvider.get_web_api()+"Service_user/updateUser/format/json";
        this.http.post(link, send_data)
        .subscribe(response => {
          loading_popup.dismiss();
          console.log(response);
          // this.data_table = JSON.parse(JSON.stringify(response));
          // console.log(this.data_table);
          if (response > 0) {
            // console.log('success change password');
            this.navCtrl.push(LoginPage, {});

          } else {
            let alert = this.alertCtrl.create({
              //title: 'แจ้งเตือน',
              subTitle: 'ไม่สามารถแก้ไขรหัสผ่านได้',
              buttons: ['ตกลง']
            });
            alert.present();
          }
        }, error => {
        });
      }
    }
  }

}
