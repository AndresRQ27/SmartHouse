import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../home/connection.service';
import {HttpClient, HttpParams} from '@angular/common/http';


@Component({
  selector: 'app-control',
  templateUrl: './control.page.html',
  styleUrls: ['./control.page.scss'],
})
export class ControlPage{

  closedDoor : string = 'assets/closed_door.png';
  openedDoor : string = 'assets/open_door.png';
  lightOn : string = 'warning';
  lightOff : string = 'medium';

  stateDoor1 : string = this.closedDoor;
  stateDoor2 : string = this.closedDoor;
  stateDoor3 : string = this.openedDoor;
  stateDoor4 : string = this.openedDoor;

  stateRoom1 : string = this.lightOn;
  stateRoom2 : string = this.lightOn;
  stateKitchen : string = this.lightOn;
  stateDiner : string = this.lightOn;
  stateLivingRoom : string = this.lightOff;

  dataObject : any[];
  id : any;

  constructor( private connectionServices: ConnectionService, public http: HttpClient) {
    this.id = setInterval(() => {
      console.log('Holi');

      const params = new HttpParams().set('update', '');
      this.http.get('http://' + this.connectionServices.getIP() + ':' + 
      this.connectionServices.getPort() + '/', {params}).subscribe((data:any) => {
        console.log(data);
        this.dataObject = data;

        this.stateRoom1 = this.dataObject['bed1'] ? this.lightOn : this.lightOff;
        this.stateRoom2 = this.dataObject['bed2'] ? this.lightOn : this.lightOff;
        this.stateKitchen = this.dataObject['kitchen'] ? this.lightOn : this.lightOff;
        this.stateLivingRoom = this.dataObject['living'] ? this.lightOn : this.lightOff;
        this.stateDiner = this.dataObject['dining'] ? this.lightOn : this.lightOff;

        this.stateDoor1 = this.dataObject['door1'] ? this.openedDoor : this.closedDoor;
        this.stateDoor2 = this.dataObject['door2'] ? this.openedDoor : this.closedDoor;
        this.stateDoor3 = this.dataObject['door3'] ? this.openedDoor : this.closedDoor;
        this.stateDoor4 = this.dataObject['door4'] ? this.openedDoor : this.closedDoor;
    });

  }, 100);//every second
    //update all status
  }

  onLightRoom1(){
    clearInterval(this.id);
    console.log('Light room 1');
    this.requestGet('bed1');
  }
  onLightRoom2(){
    console.log('Light room 2');
    this.requestGet('bed2');
  }
  onLightKitchen(){
    console.log('Light kitchen');
    this.requestGet('kitchen');
  }
  onLightLivingRoom(){
    console.log('Light living room');
    this.requestGet('living');
  }
  onLightDiner(){
    console.log('Light diner');
    this.requestGet('dining');
  }
  onGardenPhoto() {
    window.location.href = 'http://' + this.connectionServices.getIP() + ':' + 
    this.connectionServices.getPort() + '/image';
    console.log('Photo');
  }

  requestGet(value: string){
    const params = new HttpParams().set('led', value);
    this.http.get('http://' + this.connectionServices.getIP() + ':' + 
    this.connectionServices.getPort() + '/', {params}).subscribe((data:any) => {
      console.log(data);
      this.dataObject = data;
      console.log(this.dataObject['foo']);
    });
  }
}
