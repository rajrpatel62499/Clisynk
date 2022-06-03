import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';
import { CreateFolderComponent } from '../create-folder/create-folder.component';

@Component({
  selector: 'app-move',
  templateUrl: './move.component.html',
  styleUrls: ['./move.component.css']
})
export class MoveComponent implements OnInit {

  folderUpdateSubscription: Subscription;
  url = 'documents';
  moveUrl = 'documents/move';
  modalData: any;
  documentsBreadcrumbs: any = [];
  targetFolders: any;
  selectedMultipleFolders: any;
  currentFolder: any;
  targetFolderSelected: any;
 
  constructor(public http:HttpService, private router: Router) { }
  

  ngOnInit() {
    console.log("Modal Data:::", this.modalData);
    this.getAllFoldersAfterMoved();
    this.currentFolder = this.modalData.currentFolder;
    this.selectedMultipleFolders = this.modalData.selectedMultipleFolders.length > 0 ? this.modalData.selectedMultipleFolders : [];
    this.folderUpdateSubscription = this.http.documentUpdatedStatus.subscribe((data) => {
      this.getTargetFolders(data);
    });
    this.documentsBreadcrumbs = this.modalData.documentsBreadcrumbs;
  }

  addFolder() {
    this.http.showModal(CreateFolderComponent, 'md', {});
  }

  getTargetFolders(data?){
    if(this.selectedMultipleFolders.length > 0){
      this.targetFolders =   data.filter(d => !this.selectedMultipleFolders.includes(d._id));
    } else {
      this.targetFolders = data.filter((folder) => folder._id !== this.currentFolder._id);
    }
  }

  getTargetFolder(folder?) {
    this.targetFolderSelected = folder;
  }

  moveToAnotherFolder(targetFolder?, currentFolder?) {
    if(!targetFolder) return this.http.openSnackBar("Please select atleast one destination folder.");
    let obj: any = {
      documentIds : this.selectedMultipleFolders.length > 0 ? this.selectedMultipleFolders : [currentFolder._id],
      target: targetFolder._id
    }
    this.http.postMoveFolder(this.moveUrl, obj).subscribe(res => {
        this.http.openSnackBar(`${currentFolder.title} to ${targetFolder.title} moved successfully.`);
        this.http.hideModal();
        this.getAllFoldersAfterMoved();
        this.router.navigateByUrl('/home', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/documents']);
        });
      }, () => {
    });
    console.log('Obj:::', obj);
  }

  getAllFoldersAfterMoved(){
    this.http.getData(this.url, { partial: 1 }).subscribe((res) => {
      if (res.data && res.data.length) {
        this.http.documentUpdated(res.data);
      }
    });
  }

  ngOnDestroy() {
    this.folderUpdateSubscription.unsubscribe();
  }

}
