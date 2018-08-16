import { Component } from "@angular/core";
import { userInput } from "./userInput";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "lift-elevator";
  timeOutId: any;
  lift: any;
  user: any;
  timeout: number;
  travelTime: number;
  doorTime: number;
  userArr: userInput[] = [];
  floorCount: number;
  maxFloor: number;
  max: number;
  min: number;
  errMsg: string;
  showErr: boolean;
  constructor() {
    this.lift = { floor: 0, door: "close", direction: "not moving" };
    this.user = {};
    this.travelTime = 2000;
    this.timeout = this.travelTime;
    this.doorTime = 8000;
    this.floorCount = 10;
    this.maxFloor = 10;
    this.max = -1;
    this.min = this.floorCount + 1;
    this.errMsg = "";
    this.showErr = false;
  }

  ngOnInit() {
    for (let i = 0; i <= this.floorCount; i++) {
      this.userArr[i] = { up: 0, down: 0 };
    }
  }
  reset(): void {
    clearTimeout(this.timeOutId);
    this.lift = { floor: 0, door: "close", direction: "not moving" };
    this.user = {};
    this.travelTime = 2000;
    this.timeout = this.travelTime;
    this.doorTime = 8000;
    this.floorCount = this.maxFloor;
    this.max = -1;
    this.min = this.floorCount + 1;
    this.errMsg = "";
    this.showErr = false;
    for (let i = 0; i <= this.floorCount; i++) {
      this.userArr[i] = { up: 0, down: 0 };
    }
  }
  setMinMax(): void {
    for (let i = 0; i <= this.floorCount; i++) {
      if (this.userArr[i].up > 0 || this.userArr[i].down > 0) {
        if (i < this.min) this.min = i;
        if (i > this.max) this.max = i;
      }
    }
  }
  isEmptyObject(obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }

    return true;
  }
  closeDoor(): void {
    setTimeout(() => {
      this.lift.door = "close";
    }, this.doorTime);
  }
  goUp(): void {
    if (this.lift.floor < this.floorCount) {
      if (
        this.lift.direction == "not moving" &&
        this.userArr[this.lift.floor].up > 0
      ) {
        this.userArr[this.lift.floor].up = 0;
        this.lift.door = "open";
        this.closeDoor();
        this.timeout = this.travelTime + this.doorTime;
      }
      this.lift.direction = "up";
      this.timeOutId = setTimeout(() => {
        this.lift.floor++;
        this.timeout = this.travelTime;
        if (this.userArr[this.lift.floor].up > 0) {
          this.userArr[this.lift.floor].up = 0;
          this.lift.door = "open";
          // this.lift.direction = "not moving";
          this.closeDoor();
          this.timeout = this.travelTime + this.doorTime;
        }
        if (this.lift.floor < this.floorCount && this.lift.floor < this.max)
          this.goUp();
        else {
          this.max = -1;
          this.min = this.floorCount + 1;
          this.setMinMax();
          if (this.min < this.lift.floor) this.goDown();
          else this.lift.direction = "not moving";
        }
      }, this.timeout);
    }
  }
  goDown(): void {
    if (this.lift.floor > 0) {
      if (
        this.lift.direction == "not moving" &&
        this.userArr[this.lift.floor].down > 0
      ) {
        this.userArr[this.lift.floor].down = 0;
        this.lift.door = "open";
        this.closeDoor();
        this.timeout = this.travelTime + this.doorTime;
      }
      this.lift.direction = "down";
      this.timeOutId = setTimeout(() => {
        this.timeout = this.travelTime;
        this.lift.floor--;
        if (this.userArr[this.lift.floor].down > 0) {
          this.userArr[this.lift.floor].down = 0;
          this.lift.door = "open";
          // this.lift.direction = "not moving";
          this.closeDoor();
          this.timeout = this.travelTime + this.doorTime;
        }
        if (this.lift.floor > 0 && this.lift.floor > this.min) this.goDown();
        else {
          this.max = -1;
          this.min = this.floorCount + 1;
          this.setMinMax();
          if (this.max > this.lift.floor) this.goUp();
          else this.lift.direction = "not moving";
        }
      }, this.timeout);
    }
  }
  scheduleLift(): void {
    if (
      this.user.floor != undefined &&
      this.user.direction != undefined &&
      this.user.floor != null &&
      this.user.direction != "" &&
      this.user.floor <= this.floorCount &&
      this.user.floor >= 0
    ) {
      this.showErr = false;
      if (this.user.direction == "up") {
        if (this.userArr[this.user.floor].up != undefined)
          this.userArr[this.user.floor].up++;
        else this.userArr[this.user.floor].up = 1;
        if (this.user.floor > this.max) this.max = this.user.floor;
        if (this.user.floor < this.min) this.min = this.user.floor;
        if (this.lift.direction == "not moving") {
          if (this.max >= this.lift.floor) this.goUp();
          else this.goDown();
        }
      } else if (this.user.direction == "down") {
        this.userArr[this.user.floor].up++;
        if (this.user.floor < this.min) this.min = this.user.floor;
        if (this.user.floor > this.max) this.max = this.user.floor;
        if (this.lift.direction == "not moving") {
          if (this.min <= this.lift.floor) this.goDown();
          else this.goUp();
        }
      }
      this.user.direction = undefined;
      this.user.floor = undefined;
    } else {
      this.errMsg =
        "both floor number and direction is required and value of floor should be less than max floor and greater than 0.";
      this.showErr = true;
      this.user.direction = undefined;
      this.user.floor = undefined;
    }
  }
}
