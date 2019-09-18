import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../home/connection.service';


@Component({
  selector: 'app-control',
  templateUrl: './control.page.html',
  styleUrls: ['./control.page.scss'],
})
export class ControlPage{
  closedDoor : string = "assets/closed_door.png";
  openedDoor : string = "assets/open_door.png";

  stateDoor1 : string = this.closedDoor;
  stateDoor2 : string = this.closedDoor;
  stateDoor3 : string = this.openedDoor;
  stateDoor4 : string = this.openedDoor;
  constructor( private connectionServices: ConnectionService) { }
  

  toggleDoor(Door: string){

  }

  onLightRoom1(){
    if(this.stateDoor1 === this.closedDoor){
      this.stateDoor1 = this.openedDoor;
    }
    else{
      this.stateDoor1 = this.closedDoor;
    }
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
  onGardenPhoto(){
    window.location.href = "http://" + this.connectionServices.getIP() + ":" + 
    this.connectionServices.getPort() +"/image";
    console.log("Photo");
  }
}
