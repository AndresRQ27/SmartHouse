import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-control',
  templateUrl: './control.page.html',
  styleUrls: ['./control.page.scss'],
})
export class ControlPage{

  constructor() { }

  onLightRoom1(){
    console.log("Light room 1");
  }
  onLightRoom2(){
    console.log("Light room 2");
  }
  onLightKitchen(){
    console.log("Light kitchen");
  }
  onLightLivingRoom(){
    console.log("Light living room");
  }
  onLightDiner(){
    console.log("Light diner");
  }
}
