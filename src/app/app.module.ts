import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { ProfilePage } from '../pages/profile/profile';
import { RiskpointPage } from '../pages/riskpoint/riskpoint';
import { LoginPage } from '../pages/login/login';
import { ForgotpasswordPage } from '../pages/forgotpassword/forgotpassword';
import { RiskpointdetailPage } from '../pages/riskpointdetail/riskpointdetail';
import { RiskpointsendPage } from '../pages/riskpointsend/riskpointsend';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


// import { HTTP } from '@ionic-native/http';
// import { NativeStorage } from '@ionic-native/native-storage';
import { CenterProvider } from '../providers/center/center';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { MomentModule } from 'angular2-moment';
import { Camera } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Crop } from '@ionic-native/crop';


@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    ProfilePage,
    RiskpointPage,
    LoginPage,
    ForgotpasswordPage,
    RiskpointdetailPage,
    RiskpointsendPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    MomentModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    ProfilePage,
    RiskpointPage,
    LoginPage,
    ForgotpasswordPage,
    RiskpointdetailPage,
    RiskpointsendPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    File,
    FileTransfer,
    Crop,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    CenterProvider
  ]
})
export class AppModule {}
