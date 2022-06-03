import { DeleteComponent } from 'src/app/shared/modals/delete/delete.component';
import { HttpService } from 'src/app/services/http.service';
import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { Task } from 'src/app/models/task';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ApiUrl } from 'src/app/services/apiUrls';

@Component({
  selector: 'task-files',
  templateUrl: './task-files.component.html',
  styleUrls: ['./task-files.component.css']
})
export class TaskFilesComponent implements OnInit {

  @Input() tasks: Task[] = [];

  searchText = '';
  constructor(public http: HttpService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
    console.log(changes);
    if ('tasks' in changes) {
        if (this.tasks) {
           console.log("task-files==>", this.tasks)
        }
    }

  }

  
  deleteFile(task) {
    const obj: any = {
        type: 10,
        key: 'id',
        title: `Really delete?`,
        message: 'Do you really want to delete this file?',
    };

    const modalRef = this.http.showModal(DeleteComponent, 'xs', obj);
    modalRef.content.onClose = new Subject<boolean>();
    modalRef.content.onClose.subscribe((res) => {
        // this.http.openSnackBar('Task has been deleted');
        if (res) {
          this.deleteTaskFile(task);
        }
    });
  }

  deleteTaskFile(task: Task) {
 
    let obj = {
      taskId: task._id,
      image: ''
    }
    this.http.postDataNew(ApiUrl.ADD_TASK, obj).subscribe(() => {
          this.http.hideModal();
          this.http.openSnackBar('File Removed Successfully') 
          this.http.eventSubject.next({eventType: 'addTask'}); /* will refresh the list */
    });

  }


}
