import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';

// import { NativeStorage } from '@ionic-native/native-storage';
import { Storage } from '@ionic/storage';

// import { HTTP } from '@ionic-native/http';
// import { NativeStorage } from '@ionic-native/native-storage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  // rootPage:any = LoginPage;
  rootPage:any;


  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,storage: Storage) {

    storage.get('user_data').then((val) => {
      // console.log(val);
      if (val == null) {
        this.rootPage = LoginPage;
        console.log("get success null");
        // console.log(val);
      } else {
        this.rootPage = TabsPage;
        console.log("get success not null");
        // console.log(val);

      }
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
