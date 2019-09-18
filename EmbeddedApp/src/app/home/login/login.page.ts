import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ConnectionService } from '../connection.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  inputUser: string = "";
  inputPassword: string = "";
  user = 'admin';
  pass = 'admin';

  constructor(
    private alertCtrl: AlertController,
    private router: Router,
    private connectionServices: ConnectionService)
   { }

   onConfirm(){
    console.log('confirm');
    if (this.inputUser !== this.user || this.inputPassword !== this.pass){
      this.alertCtrl.create({
        header: 'Error',
        message: 'Invalid credentials',
        buttons: [{text: 'Ok', role: 'cancel'}]
      }).then(alertEl => {
        alertEl.present();
      });
      return;
    }

    this.connectionServices.setUser(this.inputUser);
    this.connectionServices.setPassword(this.inputPassword);


    this.router.navigate(['/control']);
    console.log('User:', this.connectionServices.getUser(), 'Pass:', this.connectionServices.getPassword());
  }

  onClear() {
    this.inputUser = '';
    this.inputPassword = '';
  }

}
