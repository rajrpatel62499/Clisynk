import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { CreateFolderComponent } from "../../shared/modals/create-folder/create-folder.component";
import { CreateDocumentComponent } from "../../shared/modals/create-document/create-document.component";
import { DeleteDocComponent } from "../../shared/modals/delete-doc/delete-doc.component";
import { HttpService } from "../../services/http.service";
import * as $ from "jquery";
import { Subject, Subscription, of } from "rxjs";
//import {FILTERS} from './contact-filter.constant';
import * as _ from "lodash";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MoveComponent } from "../../shared/modals/move/move.component";
import { threeDotOptions } from "../../services/constants";
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Router } from "@angular/router";

export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: "Documents for Client.",
    name: "",
    weight: "",
    symbol: "Just now",
  },
  { position: "Project Management", name: "", weight: "", symbol: "Just now" },
  { position: "Proposal", name: "", weight: "", symbol: "Just now" },
  {
    position: "Event Management Proposal",
    name: "Draft",
    weight: "$0.00",
    symbol: "36 minutes ago",
  },
];

@Component({
  selector: "app-documents",
  templateUrl: "./documents.component.html",
  styleUrls: ["./documents.component.css"],
})
export class DocumentsComponent implements OnInit {
  modalRef: BsModalRef;
  displayedColumns: string[] = ["position", "name", "weight", "symbol"];
  dataSource = ELEMENT_DATA;
  moveUrl = 'documents/move';
  public itemsExpand: any[] = threeDotOptions;

  isView = true;
  isViewMenu = false;
  responseData = [];
  url = "documents";
  folderList = [];
  selectedItem = [];
  documentsBreadcrumbs: any = [{ name: "All", id: "0", selectedIdx: "" }];
  documentsBreadcrumbsInMoveSection: any = [{ name: "All", id: "0" }];

  searchText = "";
  sortType = -1;
  sortBy = "lastModified";
  status = "";
  addedBy = 0;
  modalData: any;
  folderId: "";
  temp = false;
  tableHeaderFlag = false;
  isShowHeader = false;
  public loader = false;
  folderUpdateSubscription: Subscription;
  isMasterSel: boolean;
  myForm: FormGroup;

  items_old = [];
  items = [];

  // Implementation of Tree View from Kendo UI
  folderStructureInTreeView: any[] = [];
  public selectedKeys: any[] = [];
  public hasChildren = (item: any) => item.items && item.items.length > 0;
  public fetchChildren = (item: any) => of(item.items);
  public isItemSelected = (_: any, index: string) => this.selectedKeys.indexOf(index) > -1;
  folderMergeIndex: any = [];
  tempArray = [];
  selectedFolder: any;

  config = {
    hasAllCheckBox: false,
    hasFilter: false,
    hasCollapseExpand: false,
    decoupleChildFromParent: false,
    maxHeight: 500,
  };

  isNavigate: boolean = false;
  constructor(
    public http: HttpService,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log(this.hasChildren);
    console.log(this.fetchChildren);
    this.folderUpdateSubscription = this.http.documentUpdatedStatus.subscribe((data) => {
      if(data && data.folderListCallback){
        delete data.folderListCallback;
        console.log('Data::', data);
        this.documentList();    
      }
      this.folderStructureInTreeView = Array.isArray(data) ? data : [];
    });
    this.myForm = this.fb.group({
      id: this.fb.array([]),
    });
    this.folderListWithName();
    this.setActiveClass();
    this.documentList();
  }

  folderListWithName() {
    this.loader = true;
    this.http.getData(this.url, { partial: 1 }).subscribe((res) => {
      if (res.data && res.data.length) {
        this.http.documentUpdated(res.data);
      }
      this.loader = false;
    });
  }

  handleClickSelection({ index, dataItem }: any): void {
    this.selectedFolder = dataItem;
    this.documentsBreadcrumbs.splice(1, this.documentsBreadcrumbs.length - 1);
    let itemIdsArray = index && dataItem ? dataItem.path.split('#') : [];
    let itemSelectedIdsArray = index ? index.split('_') : [];
    this.folderId = itemIdsArray[itemIdsArray.length - 1];
    if(itemIdsArray && itemIdsArray.length > 0){
      for (let idx in itemIdsArray) {
        let objectFound = this.findByIdRecursive(this.folderStructureInTreeView,'_id',itemIdsArray[idx]);
        this.documentsBreadcrumbs.push({ "name" : ` > ${objectFound.text}`, "id": objectFound.value, "selectedIdx": itemSelectedIdsArray[idx]});
      }
    }
    this.documentList();
    this.selectedKeys = [index];
  }

  findByIdRecursive(entireObj, keyToFind, valToFind) {
    let foundObj;
    JSON.stringify(entireObj, (_, nestedValue) => {
      if (nestedValue && nestedValue[keyToFind] === valToFind) {
        foundObj = nestedValue;
      }
      return nestedValue;
    });
    return foundObj;
  };

  setActiveClass() {
    $("div.all-row").click(function () {
      $("div.all-row").removeClass("active");
      $(this).addClass("active");
    });
  }

  getSelectedCount(i, id, isChecked: boolean) {
    if(!isChecked) {
      this.selectedItem.splice(i, 1);
    } else {
      this.selectedItem.push(id);
    }
  }

  selectAllCopyDocument() {
    let checked = false;
    if ($(".checkDocs").is(":checked")) {
      checked = true;
      this.isShowHeader = true;
    } else {
      this.isShowHeader = false;
      this.selectedItem = [];
    }
    const emailFormArray = <FormArray>this.myForm.controls.id;
    this.responseData.forEach((e) => {
      e.isSelected = checked;
      if (checked) {
        this.selectedItem.push(e._id);
      }
      console.log("selectAllCopyDocument=====", e);
    });
  }

  handleClick() {
    this.tableHeaderFlag = !this.tableHeaderFlag;
  }

  openAddTask() {
    this.http.showModal(CreateFolderComponent, "md", {
      parentId: this.folderId,
    });
  }

  openAddDocument() {
    this.http.showModal(CreateDocumentComponent, "md", {
      parentId: this.folderId,
    });
  }

  deleteDocModal(data, type = "s") {
    if (type == "s") {
      this.http.showModal(DeleteDocComponent, "xs", [data._id]);
    } else {
      this.http.showModal(DeleteDocComponent, "md", data);
    }
  }

  sorting(sortBy, sortType) {
    this.sortBy = sortBy;
    this.sortType = sortType;
    this.documentList();
  }

  documentList() {
    this.loader = true;
    const obj: any = {
      sortBy: this.sortBy,
      sortType: this.sortType,
      search: this.searchText,
      status: this.status,
      addedBy: this.addedBy,
      id: this.folderId,
    };
    this.http.getData(this.url, obj).subscribe((res) => {
      this.responseData = res.data.documents;
      this.loader = false;
    });
  }

  filterLabel(labels) {
    this.status = labels;
    this.documentList();
  }

  addedByFilter(doc_id) {
    this.folderId = doc_id !== "0" ? doc_id : "";
    this.addedBy = doc_id === "0" ? doc_id : "";
    let getIndex = this.documentsBreadcrumbs.findIndex(
      (brdcb) => brdcb.id === doc_id
    );
    if (doc_id === "0") {
      this.documentsBreadcrumbs.splice(1, this.documentsBreadcrumbs.length - 1);
    } else {
      this.documentsBreadcrumbs.splice(
        getIndex + 1,
        this.documentsBreadcrumbs.length - 1
      );
    }
    let selectedIds = this.documentsBreadcrumbs.map(({ selectedIdx }) => selectedIdx);
    let replaceSelectedId = selectedIds.toString().replace(/,/g, '_');
    let autoSelectId = replaceSelectedId.replace(/^_/, '');
    this.selectedKeys = [autoSelectId];
    this.documentList();
  }

  renameDocs(data) {
    this.http.showModal(CreateFolderComponent, "md", data);
  }

  subFolderList(data) {
    if(this.tempArray.length === 0){
      console.log('If::');
      let findIndex = this.folderStructureInTreeView.findIndex((folder) => folder._id === data._id);
      this.folderMergeIndex.push(findIndex);
      this.documentsBreadcrumbs.push({ name: ` > ${data.title}`, id: data._id, selectedIdx : findIndex });
      this.folderId = data._id;
      this.selectedKeys = [this.folderMergeIndex.toString()];
      this.tempArray = this.folderStructureInTreeView[findIndex] && this.folderStructureInTreeView[findIndex].children.length > 0 ? this.folderStructureInTreeView[findIndex].children : [];
    } else {
      console.log('Else::');
      let findIndex = this.tempArray.findIndex((folder) => folder._id === data._id);
      this.folderMergeIndex.push(findIndex);
      this.documentsBreadcrumbs.push({ name: ` > ${data.title}`, id: data._id, selectedIdx : findIndex });
      this.folderId = data._id;
      let replaceSelectedId = this.folderMergeIndex.toString().replace(/,/g, '_');
      let autoSelectId = replaceSelectedId.replace(/^_/, '');
      this.selectedKeys = [autoSelectId];
      this.tempArray = this.tempArray[findIndex] && this.tempArray[findIndex].children.length > 0 ? this.tempArray[findIndex].children : [];
    }
    this.documentList();
  }

  copyDocument() {
    console.log("this.copyDocument======", this.selectedItem);
    const obj = {
      documentIds: this.selectedItem,
    };
    this.http.updateDocument(this.url + "/clone", obj).subscribe(
      (res) => {
        this.isShowHeader = false;
        this.documentList();
        this.http.openSnackBar("Folder & Documents cloned Successfully.");
      },
      () => {}
    );
  }

  copyOnlyDocument(data?){
    console.log("this.copyDocument data======", data);
    const obj = {
      documentIds: [data._id],
    };
    this.http.updateDocument(this.url + "/clone", obj).subscribe(
      (res) => {
        this.isShowHeader = false;
        this.documentList();
        this.http.openSnackBar("Folder & Documents cloned Successfully.");
      },
      () => {}
    );
  }

  moveDocument(currentFolder?) {
    const obj = {
      documentsBreadcrumbs: this.documentsBreadcrumbs,
      currentFolder: currentFolder,
      selectedMultipleFolders: []
    };
    this.http.showModal(MoveComponent, "md", obj);
  }

  moveAllDocument() {
    const obj = {
      documentsBreadcrumbs: this.documentsBreadcrumbs,
      currentFolder: {},
      selectedMultipleFolders: this.selectedItem
    };
    this.http.showModal(MoveComponent, "md", obj);
    console.log('this.selectedItem:::', this.selectedItem);
    console.log('Come Here');
  }

  multipleDeleteDocs() {
    let body = {
      documentIds: this.selectedItem,
    };
    this.deleteDocModal(this.selectedItem, "m");
  }

  ngOnDestroy() {
      this.folderUpdateSubscription.unsubscribe();
  }

  onSelectOptionFromThreeDot(event?){
    console.log('event:::', event);
    console.log('Move::', this.selectedFolder);
    switch(event.index) { 
      case "0": {
        this.openAddTask();
        break; 
      }
      case "1": {
        this.moveDocument(this.selectedFolder);
        break; 
      }
      case "2": {
        let obj: any = {
          title: this.selectedFolder.text,
          type: 'FOLDER',
          _id: this.selectedFolder._id
        }
        this.renameDocs(obj);
        break; 
      }
      case "3": {
        this.deleteDocModal([this.selectedFolder._id], 'm');
        break; 
      }
      default: { 
        this.http.openSnackBar("Invalid option you have selected....");
        break; 
      } 
    } 
  }

  dropEvent(event: CdkDragDrop<string[]>) {
    let allFolders = event.container.data.length > 0 ? event.container.data : [];
    if(allFolders.length > 0){
      let obj: any = {
        documentIds : [allFolders[event.previousIndex]['_id']],
        target: allFolders[event.currentIndex]['_id']
      }
      this.http.postMoveFolder(this.moveUrl, obj).subscribe(res => {
          this.responseData.splice(event.previousIndex, 1);
        }, () => {
      });
    }
  }

}
