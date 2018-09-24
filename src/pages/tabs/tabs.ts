import { Component } from '@angular/core';

// import { AboutPage } from '../about/about';
// import { ContactPage } from '../contact/contact';
// import { HomePage } from '../home/home';
import { RiskpointPage } from '../riskpoint/riskpoint';
import { ProfilePage } from '../profile/profile';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = RiskpointPage;
  // tab2Root = AboutPage;
  // tab3Root = ContactPage;
  tab4Root = ProfilePage;

  constructor() {

  }
}
