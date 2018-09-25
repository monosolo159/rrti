import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { CenterProvider } from '../../providers/center/center';
import { Md5 } from 'ts-md5/dist/md5';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../tabs/tabs';
import { ForgotpasswordPage } from '../forgotpassword/forgotpassword';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  public data_table: Array<{}>;
  public user_username = '';
  public user_password = '';
  public user_id = '';

  constructor(public navCtrl: NavController,public alertCtrl:AlertController, public loadingCtrl:LoadingController,public http: HttpClient,public storage: Storage,public centerProvider:CenterProvider) {

  }

  public forgotPassword(){
    this.navCtrl.push(ForgotpasswordPage, {});
  }

  public login() {
    if (this.user_username == "" || this.user_password == "" || this.user_username == null || this.user_password == null) {
    let alert = this.alertCtrl.create({
      // title: 'แจ้งเตือน',
      subTitle: 'กรุณาระบุข้อมูลให้ครบถ้วน',
      buttons: ['ตกลง']
    });
    alert.present();
  } else {

    let loading_popup = this.loadingCtrl.create({
      // content: 'เข้าสู่ระบบ...'
    });
    loading_popup.present();

    var send_data = { 'user_username': this.user_username, 'user_password': Md5.hashStr(this.user_password) };
    var link = this.centerProvider.get_web_api()+"Service_user/CheckLogin/format/json";
    this.http.post(link, send_data)
    .subscribe(response => {
      loading_popup.dismiss();
      this.data_table = JSON.parse(JSON.stringify(response));
      if (this.data_table.length > 0) {


        console.log('success login');
        this.storage.set('user_data', {user_id: this.data_table[0]['user_id']}).then((val) => {
          this.navCtrl.push(TabsPage, {});
        });

      } else {
        let alert = this.alertCtrl.create({
          //title: 'แจ้งเตือน',
          subTitle: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
          buttons: ['ตกลง']
        });
        alert.present();
      }
    }, error => {
    });
  }
}

}
