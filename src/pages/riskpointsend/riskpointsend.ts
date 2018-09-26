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
declare var cordova: any;


@Component({
  selector: 'page-riskpointsend',
  templateUrl: 'riskpointsend.html'
})
export class RiskpointsendPage {

  public data_table: Array<{}>;
  lastImage: string = null;
  loading: Loading;
  public user_id = '';

  constructor(public navCtrl: NavController, public actionSheetCtrl: ActionSheetController, public alertCtrl: AlertController, public platform: Platform, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public centerProvider: CenterProvider, public storage: Storage, public http: HttpClient, public app: App,public transfer: FileTransfer, public file: File,public camera: Camera,public crop: Crop) {
    storage.get('user_data').then((val) => {
      this.user_id = val['user_id'];
    });
  }
  public presentActionSheet() {
    //สร้างเมนูเพื่อเลอกว่า จากกล้อง หรือ จาก คลังภาพ
    let actionSheet = this.actionSheetCtrl.create({
      // title: 'เลือกที่อยูภาพ',
      buttons: [
        {
          text: 'เลือกจากคลังภาพ',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'ถ่ายภาพ',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'ยกเลิก',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  public takePicture(sourceType) {
    console.log('takePicture');
    //คุณสมบัติของภาพ
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: true,
      correctOrientation: true,
      targetWidth: 500
    };

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      // alert('imagePath 1 = ' + imagePath);
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        // FilePath.resolveNativePath(imagePath)
        // .then(filePath => {
        imagePath = 'file://' + imagePath;
        // alert('imagePath ' + imagePath);
        // alert('filePath  ' + filePath);
        this.crop.crop(imagePath, { quality: 100 }).then((path) => {
          // alert('imagePath Crop' + imagePath);
          imagePath = path;
          // let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
          let correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
          // alert('correctPath ' + correctPath);
          let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
          // alert('currentName ' + currentName);
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
        });
        // });

      } else {
        // alert('imagePath ' + imagePath);
        this.crop.crop(imagePath, { quality: 100 }).then((path) => {
          imagePath = path;
          // var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
          let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
          // alert('currentName ' + currentName);
          var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
          // alert('correctPath ' + correctPath);
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());

        });

      }

    }, (err) => {
      // this.presentToast('Error while selecting image.');
    });
  }


  private createFileName() {
    console.log('createFileName');

    var d = new Date();
    var n = d.getTime();
    var newFileName = this.user_id + '_' + n + ".jpg";
    return newFileName;
  }

  private copyFileToLocalDir(namePath, currentName, newFileName) {
    console.log('copyFileToLocalDir');

    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
      this.uploadImage();
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  public uploadImage() {
    // Destination URL
    console.log('uploadImage');

    var url = this.centerProvider.get_web_api() + "Service_riskpoint/uploadImage";
    // var url = this.server.linkServer() + "car_service/uploadImage";

    //แสดงเอฟเฟคการโหลดข้อมูล
    var targetPath = this.pathForImage(this.lastImage);

    // File name only
    var filename = this.lastImage;

    var options = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data"
      // params: { 'fileName': filename }
    };

    const fileTransfer: FileTransferObject = this.transfer.create();

    this.loading = this.loadingCtrl.create({
      // content: 'Uploading...',
    });
    this.loading.present();

    fileTransfer.upload(targetPath, url, options).then(data => {
      this.loading.dismissAll();
      // this.presentToast('Image succesful uploaded.');
      this.userUpdatePhoto();
    }, err => {
      this.loading.dismissAll();
      // this.presentToast('Error while uploading file.');
    });
  }


  public userUpdatePhoto() {
    // console.log('userUpdatePhoto 1');

    let loading_popup = this.loadingCtrl.create({});
    loading_popup.present();
    // console.log('userUpdatePhoto 2');

    var send_data = {
      'user_id': this.user_id,
      'user_photo': this.lastImage
    };

    var link = this.centerProvider.get_web_api() + "user_service/userUpdatePhoto";

    this.http.post(link, send_data)
      .subscribe(response => {
        console.log('userUpdatePhoto 4');

        // this.user_photo = this.lastImage;
        loading_popup.dismiss();
        // this.reload_user();
        // this.navCtrl.pop();
      }, error => {
        console.log("error upload");
        // console.log(error);
      });
      console.log('userUpdatePhoto 5');

  }

  public userPhoto() {
    this.uploadImage();
    this.userUpdatePhoto();

  }

}
