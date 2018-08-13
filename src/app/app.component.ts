import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "lift-elevator";
  lift: any;
  user: any;
  timeout : number;
  travelTime : number;
  doorTime : number;
  upArr : any;
  floorCount : number;
  max : number;
  min : number;
  downArr : any;
  constructor() {
    this.lift = { floor: 0, door: "close", direction: "not moving" };
    this.user = {};
    this.travelTime=1000;
    this.timeout= this.travelTime;
    this.doorTime=3000;
    this.floorCount=10;
    this.upArr={};
    this.downArr={};
    this.max=-1;
    this.min=this.floorCount+1;
  }

  ngOnInit() {
    // this.goUp();
  }
  isEmptyObject(obj) {
    for(var prop in obj) {
       if (obj.hasOwnProperty(prop)) {
          return false;
       }
    }

    return true;
}
closeDoor() : void {
  setTimeout(() => {
    this.lift.door="close";
  },this.doorTime );
}
  goUp(): void {
    setTimeout(() => {
      this.lift.direction="up";
      this.timeout=this.travelTime;
      this.lift.floor++;
      if(this.upArr[this.lift.floor]>0){
        delete this.upArr[this.lift.floor];
        this.lift.door="open";
        this.closeDoor();
        this.timeout=this.travelTime+this.doorTime;
      }
      if(this.lift.floor<this.floorCount && this.lift.floor<this.max)this.goUp();
      else{
        this.max=-1;
        if(this.min<this.floorCount+1)this.goDown();
        else this.lift.direction="not moving";
      }
    }, this.timeout);
  }
  goDown(): void {
    setTimeout(() => {
      this.lift.direction="down";
      this.timeout=this.travelTime;
      this.lift.floor--;
      if(this.downArr[this.lift.floor]>0){
        delete this.downArr[this.lift.floor];
        this.lift.door="open";
        this.closeDoor();
        this.timeout=this.travelTime+this.doorTime;
      }
      if(this.lift.floor>0 && this.lift.floor>this.min)this.goDown();
      else{
        this.min=this.floorCount+1;
        if(this.max>-1)this.goUp();
        else this.lift.direction="not moving";
      }
    }, this.timeout);
  }
  scheduleLift() : void {
    if(this.user.floor!=undefined && this.user.direction!=undefined && this.user.floor!=null && this.user.direction!='' ){
      if(this.user.direction=='up'){
          if(this.upArr[this.user.floor]!=undefined)this.upArr[this.user.floor]++;
          else this.upArr[this.user.floor]=1;
          if(this.user.floor>this.max)this.max=this.user.floor;
          if( this.lift.direction=="not moving"){
            if(this.max>=this.lift.floor)this.goUp();
            else this.goDown();
          }
      }
      else if(this.user.direction=='down'){
        if(this.downArr[this.user.floor]!=undefined)this.downArr[this.user.floor]++;
        else this.downArr[this.user.floor]=1;
        if(this.user.floor<this.min)this.min=this.user.floor;
        if( this.lift.direction=="not moving"){
          if(this.min<=this.lift.floor)this.goDown();
          else this.goUp();
        }
    }
    }

  }
}
