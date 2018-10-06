import { Component } from '@angular/core';
import { App, NavController, ActionSheetController, ToastController, Platform, AlertController, LoadingController, Loading } from 'ionic-angular';
import { CenterProvider } from '../../providers/center/center';
// import { Md5 } from 'ts-md5/dist/md5';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FileTransfer,FileTransferObject } from '@ionic-native/file-transfer';
import { Crop } from '@ionic-native/crop';
import { FilePath } from '@ionic-native/file-path';
import { ImagePicker } from '@ionic-native/image-picker';

declare var cordova: any;


@Component({
  selector: 'page-riskpointsend',
  templateUrl: 'riskpointsend.html'
})
export class RiskpointsendPage {

  public data_table: Array<{}>;
  public data_table_user: Array<{}>;
  public data_table_piority: Array<{}>;
  public images = [];
  lastImage: string = null;
  loading: Loading;
  // public user_id = '';
  public riskpoint_name = '';
  public riskpoint_detail = '';
  public riskpoint_piority_id = '';
  public user_from_id = '';
  public user_area = '';


  constructor(public navCtrl: NavController, public actionSheetCtrl: ActionSheetController, public filePath:FilePath, public imagePicker:ImagePicker, public alertCtrl: AlertController, public platform: Platform, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public centerProvider: CenterProvider, public storage: Storage, public http: HttpClient, public app: App,public transfer: FileTransfer, public file: File,public camera: Camera,public crop: Crop) {
    storage.get('user_data').then((val) => {
      this.user_from_id = val['user_id'];
      this.getPiority();
      this.getUserArea();
    });

  }

  getUserArea(){
    var send_data = { 'user_id': this.user_from_id };
    var link = this.centerProvider.get_web_api()+"Service_user/selectUser/format/json";
    this.http.post(link, send_data)
    .subscribe(response => {
      this.data_table_user = JSON.parse(JSON.stringify(response));
      this.user_area = this.data_table_user[0]['user_area'];
    }, error => {
    });
  }

  getPiority(){
    var send_data = { };
    var link = this.centerProvider.get_web_api()+"Service_riskpoint/getPiority/format/json";
    this.http.post(link, send_data)
    .subscribe(response => {
      this.data_table_piority = JSON.parse(JSON.stringify(response));
    }, error => {
    });
  }


  getPictures(){
    this.images = [];
    this.imagePicker.getPictures({
    }).then( results =>{
      console.log(results);
      for(let i=0; i < results.length;i++){
        this.images.push(results[i]);
      };
    });
  }


  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  private createFileName() {
    var d = new Date();
    var n = d.getTime();
    var newFileName = n + ".jpg";
    return newFileName;
  }

  public send_riskpoint() {
    // Destination URL
    console.log('uploadImage');
    if (this.riskpoint_name == "" || this.riskpoint_detail == "" || this.riskpoint_piority_id == "" || this.riskpoint_name == null || this.riskpoint_detail == null || this.riskpoint_piority_id == null) {
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

      var url = this.centerProvider.get_web_api() + "Service_riskpoint/uploadImage";

      var targetPath = '';
      var filename = '';
      // var riskpoint_id;

      var send_data = { 'riskpoint_name': this.riskpoint_name, 'riskpoint_detail': this.riskpoint_detail, 'riskpoint_piority_id': this.riskpoint_piority_id, 'user_from_id': this.user_from_id, 'user_to_id': this.user_area, };
      var link = this.centerProvider.get_web_api()+"Service_riskpoint/insertRiskpoint/format/json";
      this.http.post(link, send_data)
      .subscribe(response => {
        // loading_popup.dismiss();

        this.data_table = JSON.parse(JSON.stringify(response));
        // console.log('response : '+response);
        // console.log('data_table : '+this.data_table);
        if (response > 0) {
          // riskpoint_id = this.data_table;
          for(let i=0; i < this.images.length;i++){
            // this.images.push(results[i]);
            targetPath = this.images[i];
            console.log('targetPath : '+targetPath);
            filename = this.createFileName();

            var options = {
              fileKey: "file",
              fileName: filename,
              chunkedMode: false,
              mimeType: "multipart/form-data",
              params: { 'riskpoint_id': this.data_table }
            };

            const fileTransfer: FileTransferObject = this.transfer.create();
            fileTransfer.upload(targetPath, url, options).then(data => {
              console.log('Image succesful uploaded.');
            }, err => {
              console.log('Error while uploading file.');
            });

          }
          loading_popup.dismiss();
          this.navCtrl.pop();
        } else {
          let alert = this.alertCtrl.create({
            //title: 'แจ้งเตือน',
            subTitle: 'ไม่สามารถแจ้งจุดเสี่ยงในขณะนี้ได้',
            buttons: ['ตกลง']
          });
          alert.present();
          loading_popup.dismiss();
        }
      }, error => {
      });

    }



  }

}
