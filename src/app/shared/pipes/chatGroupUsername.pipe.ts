import { ReturnStatement } from '@angular/compiler';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chatGroupUsername'
})
export class chatGroupUsernamePipe implements PipeTransform {
  transform( data : any , id : string , args?: any): any {
    console.log('id and data..........', data , id)
    // return "test"
    let temp ;
    data.users.map((user) => {
        if(user._id == id){
            temp = user.fullName
            return temp
        }
    })
  }
}
