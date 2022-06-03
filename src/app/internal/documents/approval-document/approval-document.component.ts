import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, ViewEncapsulation, Injectable } from '@angular/core';
import { DisplayGrid, GridsterConfig, GridsterItem, GridType } from 'angular-gridster2';
import * as $ from 'jquery';
import { HttpService } from '../../../services/http.service';
import { AddPageComponent } from '../../../shared/modals/add-page/add-page.component';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { EmailDocumentFormatComponent } from '../../../shared/modals/email-document-format/email-document-format.component';
declare var jQuery: any;
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import { SelectEvent, SuccessEvent } from '@progress/kendo-angular-upload';

@Component({
  selector: 'app-approval-document',
  templateUrl: './approval-document.component.html',
  styleUrls: ['./approval-document.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})

export class ApprovalDocumentComponent implements OnInit, OnDestroy {

  options: GridsterConfig;
  dashboard: Array<GridsterItem>;
  editHeader = false; //Header edit or not
  editWidgetIndex = -1;
  isHtml = false;
  approval = true;
  setting = false;
  comment = false;
  theme = false;
  addRecipients = false;
  isGridShow = true;
  isLoad = true;
  ckeConfig: any;
  hideSidebarFlag = false;
  documentId = '';
  documentDetail: any = { 'title': '' };
  pageColumns = 6;
  pageX = 1;
  firstFooterY = 0;
  lastHeaderY = 0;
  preDefinePage = [
    { cols: this.pageColumns, rows: 1, y: 0, x: this.pageX, isEdit: false, type: 'option', page: 1, index: 0, id: 'option-0', class: 'option-0', layerIndex: 1, value: '', dragEnabled: false, resizeEnabled: false },
    { cols: this.pageColumns, rows: 8, y: 1, x: this.pageX, isEdit: false, type: 'page', page: 1, index: 0, id: 'page-1', class: 'page-1', layerIndex: 1, value: '', dragEnabled: false, resizeEnabled: false },
    { cols: this.pageColumns, rows: 1, y: 1, x: this.pageX, isEdit: false, type: 'header', page: 1, index: 1, id: 'header-1', class: 'header-1', layerIndex: 2, value: '', dragEnabled: false, resizeEnabled: false, hasContent: true },
    { cols: this.pageColumns, rows: 1, y: 8, x: this.pageX, isEdit: false, type: 'footer', page: 1, index: 2, id: 'footer-8', class: 'footer-8', layerIndex: 2, value: '', dragEnabled: false, resizeEnabled: false, hasContent: true },
  ];
  loginData: any;

  allBlocksAndFields = ['TEXT_BLOCK', 'IMAGE_BLOCK', 'VIDEO_BLOCK', 'TABLE_BLOCK', 'PRICING_TABLE', 'TABLE_OF_CONTENTS', 'TEXT_FIELD', 'SIGNATURE', 'INITIALS', 'DATE', 'TERM_CONDITION', 'DROP_DOWN'];
  public currentDate: Date = new Date();
  public listItemsDropDown: Array<string> = ['Workspace-1', 'Workspace-2', 'Workspace-3', 'Workspace-4', 'Workspace-5', 'Workspace-6'];

  selectedWidgetType = "";
  uploadSaveUrl = 'upload-video-url-add'; // should represent an actual API endpoint
  uploadRemoveUrl = 'upload-video-url-remove'; // should represent an actual API endpoint
  insertDefaultTable = `<table><tbody><tr><td><p><br></p></td><td><p><br></p></td></tr><tr><td><p><br></p></td><td><p><br></p></td></tr></tbody></table>`;
  insertDefaultPriceTable = `<table id="customers"><tr><th>Name</th><th>Price</th><th>Quantity</th><th>Total ($)</th></tr><tr><td>Geek</td><td>10.0 $</td><td>1000</td><td>10000.0 $</td></tr></table>`;

  constructor(private router: Router, public http: HttpService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.ckeConfig = {
      allowedContent: false,
      extraPlugins: 'magicline',
      forcePasteAsPlainText: true,
      //line_height:'5px',
      toolbar: [
        {
          name: 'basicstyles', groups: ['basicstyles', 'cleanup'],
          items: [
            'Undo', 'Redo', 'Styles', 'Font',
            'FontSize', 'Bold', 'Italic',
            'Underline', 'Strike', 'TextColor',
            'JustifyLeft', 'JustifyCenter', 'JustifyRight',
            'JustifyBlock', 'NumberedList', 'BulletedList',
            '-', 'Outdent', 'Indent', '-',
            'Link', 'RemoveFormat']
        },]
    };

    this.options = {
      gridType: GridType.Fixed,
      displayGrid: DisplayGrid.None,
      pushItems: false,
      swap: true,
      allowMultiLayer: true,
      defaultLayerIndex: 1,
      baseLayerIndex: 2,
      maxLayerIndex: 2,
      fixedColWidth: 100, // fixed col width for gridType: 'fixed'
      fixedRowHeight: 100,
      swapWhileDragging: false,
      draggable: {
        enabled: false
      },
      resizable: {
        enabled: false
      },

      enableEmptyCellDrop: true,
      enableOccupiedCellDrop: true,
      emptyCellDropCallback: this.emptyCellClick.bind(this),
      emptyCellDragCallback: this.emptyCellClick.bind(this),
    };

    this.documentId = this.route.snapshot.params['id'];
    this.getDocumentDetails(this.documentId);
  }

  ngOnDestroy() {
    console.log('On Ng Destroy');
    this.updateDocumentDetails(this.documentId);
  }

  setHeaderFooterSettingIndex() {
    var firstPageWidget = this.dashboard.filter(obj => { //Getting number of widget of select page
      return obj.page === 1
    })
    let that = this;
    firstPageWidget.forEach(element => {
      if (element.type === 'header' || element.type === 'footer') {
        if (element.type === 'header') {
          if (that.lastHeaderY < element.y) {
            that.lastHeaderY = element.y;
          }
        } else {
          if (that.firstFooterY == 0) {
            that.firstFooterY = element.y;
          }
          if (that.firstFooterY > element.y) {
            that.firstFooterY = element.y;
          }
        }
      }
    });
  }

  getDocumentDetails(documentId) {
    let url = 'documents/' + documentId;
    this.http.getData(url, {}).subscribe(res => {
      if (res.statusCode === 200) {
        this.documentDetail = res.data;
        let pageContent: any;
        if (res.data['content'] && res.data['content']['key1']) {
          if (Array.isArray(res.data['content']['key1']) && res.data['content']['key1'].length) {
            pageContent = res.data['content']['key1'];
          }
        }
        if (pageContent) {
          this.dashboard = pageContent;
          localStorage.setItem("dashboard", JSON.stringify(this.dashboard));
          this.changedOptions();
          //-- Append html once get dashboard value from localstorgae or db --//
          let that = this;
          setTimeout(function () {
            that.firstFooterY = 0;
            that.lastHeaderY = 0;
            that.setHeaderFooterSettingIndex();//to find last header/First footer Y axis and set it
            that.dashboard.forEach(element => {
              console.log('Initiated Element:::', element);
              if (element.type === 'header' || element.type === 'footer' || element.type === 'TEXT_BLOCK') {
                if (element.isEdit) {
                  element.isEdit = false;
                }
                $("#" + element.id).empty();
                if (element.value != '') {
                  $("#" + element.id).append(element.value);
                } else {
                  $("#" + element.id).append(element.class);
                }
              }
            });
          }, 100);
          //-- Append html once get dashboard value from localstorgae or db --//
        } else {
          this.dashboard = this.preDefinePage;
          localStorage.setItem("dashboard", JSON.stringify(this.dashboard));
          this.changedOptions();
          let that = this;
          setTimeout(function () {
            that.dashboard.forEach(element => {
              if (element.type === 'header' || element.type === 'footer') {
                //$("#" + element.id).empty();
                $("#" + element.id).empty();
                if (element.value != '') {
                  $("#" + element.id).append(element.value);
                } else {
                  $("#" + element.id).append(element.class);
                }
              }
            });
          }, 100);
        }
      } else {
        this.router.navigateByUrl('/documents');
      }
    }, () => {
      this.router.navigateByUrl('/documents');
    });
  }

  addWidget(event, widgetType) {
    this.selectedWidgetType = widgetType;
  }

  dragStopHandler(event?){
    console.log('Event Stop Handler:::', event);
  }

  getPageNumberByY(y) {
    let rows = 8;
    let page = Math.ceil(y / rows);
    return page;
  }

  emptyCellClick(event: MouseEvent, item: any) {
    console.log('Event::', event, 'Item::', item);
    console.log('Dashboard Count:::', this.dashboard.length);
    let page = 1;
    let that = this;
    let nextIndex = this.dashboard.length;
    let position = item.y;
    let getSelectedIndex = this.allBlocksAndFields.findIndex((val) => val === this.selectedWidgetType);
    const isWidget = this.dashboard.filter(obj => {
      return obj.y === position;
    });
    if (isWidget.length) {
      this.http.openSnackBar(`You can't add this widget on this place due to another widget already exits in same place`);
    } else {
      that.dashboard.push({
        isEdit: false,
        type: that.selectedWidgetType,
        page: page,
        index: nextIndex,
        id: that.selectedWidgetType + '-' + position,
        class: that.selectedWidgetType + '-' + position,
        cols: this.pageColumns,
        rows: 1,
        y: position,
        x: this.pageX,
        layerIndex: getSelectedIndex + 2,
        value: '',
        dragEnabled: false,
        resizeEnabled: false,
        hasContent: true
      });
      that.saveDocument();
      let className = that.selectedWidgetType + '-' + position;
      setTimeout(function () {
        $("#" + className).append(className);
      }, 100);
    }
  }

  updateDocumentDetails(documentId) {
    console.log('Come Here Update Details');
    let url = 'documents/' + documentId;
    let body = {
      title: this.documentDetail['title'],
      content: {
        key1: this.dashboard
      },
      status: "DRAFT"
    };
    this.http.updateDocument(url, body).subscribe(() => {
    }, () => {
    });
  }

  clickedHeader(item): void {
    if (this.editWidgetIndex != -1) {
      this.resetCurrentEdit(this.editWidgetIndex);
      this.editWidgetIndex = -1;
    }
    let that = this;
    that.editWidgetIndex = that.dashboard.indexOf(item);
    that.dashboard[that.editWidgetIndex]['isEdit'] = true;
    let className = that.dashboard[that.editWidgetIndex]['class'];
    let html = $('.' + className).find('.cke_top').html();
    $("#text-propertires").empty();
    $("#text-propertires").append(html);
    $(".cke_chrome").addClass("header-active")
    $(".header-prop").css("display", "block")
    $(".plus-icon").hover(function () {
      $(this).css("opacity", "0");
    });
  }

  clickedPage() {
    $(".plus-icon").hover(function () {
      $(this).css("opacity", "1");
    }, function () {
      $(this).css("opacity", "0");
    });
    if (this.editWidgetIndex != -1) {
      this.resetCurrentEdit(this.editWidgetIndex);
      this.editWidgetIndex = -1;
    }
  }

  clearLS() {
    this.editWidgetIndex = -1;
    localStorage.removeItem("dashboard");
    this.dashboard = [
      { cols: this.pageColumns, rows: 1, y: 0, x: 1, isEdit: false, type: 'option', page: 1, index: 0, id: 'option-0', class: 'option-0', layerIndex: 1, value: '', dragEnabled: false, resizeEnabled: false },
      { cols: this.pageColumns, rows: 8, y: 1, x: this.pageX, isEdit: false, type: 'page', page: 1, index: 0, id: 'page-1', class: 'page-1', layerIndex: 1, value: '', dragEnabled: false, resizeEnabled: false },
      { cols: this.pageColumns, rows: 1, y: 1, x: this.pageX, isEdit: false, type: 'header', page: 1, index: 1, id: 'header-1', class: 'header-1', layerIndex: 2, value: '', dragEnabled: false, resizeEnabled: false, hasContent: true },
      { cols: this.pageColumns, rows: 1, y: 8, x: this.pageX, isEdit: false, type: 'footer', page: 1, index: 2, id: 'footer-8', class: 'footer-8', layerIndex: 2, value: '', dragEnabled: false, resizeEnabled: false, hasContent: true },
    ];
    this.changedOptions();
    let that = this;
    setTimeout(function () {
      that.dashboard.forEach(element => {
        if (element.type === 'header' || element.type === 'footer') {
          $("#" + element.id).empty();
          if (element.value != '') {
            $("#" + element.id).append(element.value);
          } else {
            let text = element.class;
            $("#" + element.id).append(text);
          }

        }
      });
    }, 100);

  }

  resetCurrentEdit(index) {
    this.dashboard[index]['isEdit'] = false;
    let className = this.dashboard[index]['class'];
    let that = this;
    setTimeout(function () {
      $("#" + className).empty();
      if (that.dashboard[index]['value'] != '') {
        $("#" + className).append(that.dashboard[index]['value']);
      } else {
        $("#" + className).append(className);
      }
    }, 100);
    this.saveDocument();
  }

  saveDocument() {
    localStorage.setItem("dashboard", JSON.stringify(this.dashboard));
    this.updateDocumentDetails(this.documentId);
  }

  changedOptions(): void {
    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
  }

  copyItem(item): void {
    //------ Only for phase-3 check heder or footer able to copy or not  --//
    var typeWidgets = this.dashboard.filter(obj => { //Getting number of header or footer widget of select page
      return obj.page === item.page && obj.type === item.type;
    })
    let isAbleToCopy = true;
    if (typeWidgets.length) {
      let nextPossition = 0;
      if (item['type'] === 'header' || item.type === 'text-block') {
        nextPossition = Math.max.apply(null, typeWidgets.map(function (item) {
          return (item.y + 1);
        }));
      } else {
        nextPossition = Math.min.apply(null, typeWidgets.map(function (item) {
          return (item.y - 1);
        }));
      }
      var isWidgetExists = this.dashboard.filter(obj => { //Getting number of widget of select page
        return obj.y === nextPossition && obj.layerIndex === item.layerIndex;
      })
      if (isWidgetExists.length) {  // if widget already exits on selected y axis
        isAbleToCopy = false;
        alert("You can't add on this place due to another widget already exits in next place");
      }
    }
    //------ Only for phase-3 check heder or footer able to copy or not  --//
    if (isAbleToCopy) {

      var pageWidgets = this.dashboard.filter(obj => { //Getting number of widget of select page
        return obj.page === item.page && obj.layerIndex === item.layerIndex;
      })
      if (pageWidgets.length > 7) {
        alert("You don't have much space in this page");
      } else {
        if (item.type === 'header' || item['type'] === 'footer') {
          let totalRow = 8;
          let pageStartIndex = (item.page * totalRow) - totalRow;
          if (item.page != 1) {
            pageStartIndex += (item.page - 1);
          }
          let diff = item.y - pageStartIndex;

          let i = 1;
          let that = this;
          let nextIndex = this.dashboard.length;
          this.dashboard.forEach(element => {

            let startIndex = (element.page * totalRow) - totalRow;
            if (element.page != 1) {
              startIndex += (element.page - 1);
            }
            //---- Move next Headers --//
            if (element.type === 'header' && (element.y - startIndex) > diff) {
              element['y'] += 1;
              element['class'] = element['type'] + '-' + element['y'];
              element['id'] = element['type'] + '-' + element['y'];
              that.changedOptions();
              setTimeout(function () {
                let className = element['type'] + '-' + element['y'];
                $("#" + className).empty();
                if (element['value']) {
                  $("#" + className).append(element['value']);
                } else {
                  $("#" + className).append(className);
                }
              }, 100);
            }
            //---- Move next Headers --//

            //---- Move next Footers --//
            if (element.type === 'footer' && (element.y - startIndex) < diff) {
              element['y'] -= 1;
              element['class'] = element['type'] + '-' + element['y'];
              element['id'] = element['type'] + '-' + element['y'];
              that.changedOptions();
              setTimeout(function () {
                let className = element['type'] + '-' + element['y'];
                $("#" + className).empty();
                if (element['value']) {
                  $("#" + className).append(element['value']);
                } else {
                  $("#" + className).append(className);
                }
              }, 100);
            }
            //---- Move next Footers --//
            if (i === that.dashboard.length) { //When last value of dashboard array
              //that.changedOptions(); //reflects changes of moving existing header
              //---- Add new header --//
              var pages = that.dashboard.filter(obj => { //Getting number of widget of select page
                return obj.layerIndex === 1 && obj.type === 'page';
              });
              pages.forEach(e => {
                if (1 || e.type === 'page') {
                  let position = e['y'] + diff;
                  // console.log('pages',item,diff,position);
                  if (item['type'] === 'header') {
                    //position += 1;
                  } else if (item['type'] === 'footer') {
                    position -= 2;
                  }
                  that.dashboard.push({
                    isEdit: false,
                    type: item['type'],
                    page: e['page'],
                    index: nextIndex,
                    id: item['type'] + '-' + position,
                    class: item['type'] + '-' + position,
                    cols: item['cols'],
                    rows: item['rows'],
                    y: position,
                    x: item['x'],
                    layerIndex: item['layerIndex'],
                    value: item['value'],
                    dragEnabled: item['dragEnabled'],
                    resizeEnabled: item['resizeEnabled'],
                    hasContent: item['hasContent']
                  });
                  that.saveDocument();

                  //-- Append html content of header --//
                  let className = item['type'] + '-' + position;
                  setTimeout(function () {
                    if (item['value']) {
                      $("#" + className).append(item['value']);
                    } else {
                      $("#" + className).append(className);
                    }
                  }, 100);
                  //-- Append html content of header --//

                  nextIndex++;
                }
              });
              that.firstFooterY = 0;
              that.lastHeaderY = 0;
              that.setHeaderFooterSettingIndex();//to find last header/First footer Y axis and set it
              //---- Add new header --// 
            }
            i++
          });
        } else {
          if (item.type === 'text-block') {
            var pageWidgets = this.dashboard.filter(obj => { //Getting all widgets of selected page
              return obj.page === item.page && item.type === obj.type
            })
            let totalRow = 8;
            let pageStartIndex = (item.page * totalRow) - totalRow;
            if (item.page != 1) {
              pageStartIndex += (item.page - 1);
            }
            let diff = item.y - pageStartIndex;

            let i = 1;
            let that = this;
            let nextIndex = this.dashboard.length;
            pageWidgets.forEach(element => {

              let startIndex = (element.page * totalRow) - totalRow;
              if (element.page != 1) {
                startIndex += (element.page - 1);
              }
              //---- Move next text-block --//
              if ((element.y - startIndex) > diff) {
                element['y'] += 1;
                element['class'] = element['type'] + '-' + element['y'];
                element['id'] = element['type'] + '-' + element['y'];

                that.changedOptions();
                setTimeout(function () {
                  let className = element['type'] + '-' + element['y'];
                  $("#" + className).empty();
                  if (element['value']) {
                    $("#" + className).append(element['value']);
                  } else {
                    $("#" + className).append(className);
                  }
                }, 100);
              }
              //---- Move next text-block --//          

              if (i === pageWidgets.length) { //When last value of dashboard array


                //---- Add new text-block --//
                var pages = that.dashboard.filter(obj => { //Getting number of widget of select page
                  return obj.layerIndex === 1 && obj.type === 'page' && obj.page === item.page;
                });


                pages.forEach(e => {
                  if (1 || e.type === 'page') {
                    let position = e['y'] + diff;
                    that.dashboard.push({
                      isEdit: false,
                      type: item['type'],
                      page: e['page'],
                      index: nextIndex,
                      id: item['type'] + '-' + position,
                      class: item['type'] + '-' + position,
                      cols: item['cols'],
                      rows: item['rows'],
                      y: position,
                      x: item['x'],
                      layerIndex: item['layerIndex'],
                      value: item['value'],
                      dragEnabled: item['dragEnabled'],
                      resizeEnabled: item['resizeEnabled'],
                      hasContent: item['hasContent']
                    });
                    that.saveDocument();
                    //-- Append html content of header --//
                    let className = item['type'] + '-' + position;
                    setTimeout(function () {
                      if (item['value']) {
                        $("#" + className).append(item['value']);
                      } else {
                        $("#" + className).append(className);
                      }
                    }, 100);
                    //-- Append html content of header --//
                    nextIndex++;
                  }
                });
                //---- Add new text-block --// 
              }
              i++
            });
          }
        }
      }
    }
  }

  removeItem($event: MouseEvent | TouchEvent, item: GridsterItem): void {
    console.log('Come Here', item);
    if (item.type === 'header' || item.type === 'footer') {
      var pageWidgets = this.dashboard.filter(obj => { //Getting number of widget of select page
        return obj.page === item.page && obj.type === item.type && obj.layerIndex === item.layerIndex;
      })
      if ((item.type === 'header' || item.type === 'footer') && pageWidgets.length === 1) { //if page has last item(header or footer)
        alert("You can't delete default " + item.type);
      } else {
        if (this.editWidgetIndex != -1) {
          this.editWidgetIndex = -1;
        }
        $event.preventDefault();
        $event.stopPropagation();
        let totalRow = 8;
        let pageStartIndex = (item.page * totalRow) - totalRow;
        if (item.page != 1) {
          pageStartIndex += (item.page - 1);
        }
        let diff = item.y - pageStartIndex;
        let that = this;
        this.dashboard.forEach(element => {
          if (element.type === item.type) {
            let startIndex = (element.page * totalRow) - totalRow;
            if (element.page != 1) {
              startIndex += (element.page - 1);
            }
            if ((element.y - startIndex) === diff) {
              that.dashboard.splice(that.dashboard.indexOf(element), 1);
            }
          }
        });
        //Selected widget Should be remove from all page
        if (item.type === 'header' || item.type === 'footer') {
          let i = 1;
          this.dashboard.forEach(element => {
            let startIndex = (element.page * totalRow) - totalRow;
            if (element.page != 1) {
              startIndex += (element.page - 1);
            }

            //--Move next headers --//
            if (element.type === 'header' && (element.y - startIndex) > diff) {
              element.y -= element['rows'];
              element['class'] = element['type'] + '-' + element['y'];
              element['id'] = element['type'] + '-' + element['y'];
              that.changedOptions();
              setTimeout(function () {
                let className = element['type'] + '-' + element['y'];
                $("#" + className).empty();
                if (element['value']) {
                  $("#" + className).append(element['value']);
                } else {
                  $("#" + className).append(className);
                }
              }, 100);
            }
            //--Move next headers --//
            //--Move next footers --//
            if (element.type === 'footer' && (element.y - startIndex) < diff) {
              element.y += element['rows'];
              element['class'] = element['type'] + '-' + element['y'];
              element['id'] = element['type'] + '-' + element['y'];
              that.changedOptions();
              setTimeout(function () {
                let className = element['type'] + '-' + element['y'];
                $("#" + className).empty();
                if (element['value']) {
                  $("#" + className).append(element['value']);
                } else {
                  $("#" + className).append(className);
                }
              }, 100);
            }
            //--Move next footers --//
            if (i === that.dashboard.length) {
              //that.changedOptions();
              that.saveDocument();
              that.firstFooterY = 0;
              that.lastHeaderY = 0;
              that.setHeaderFooterSettingIndex();//to find last header/First footer Y axis and set it.
            }
            i++;
          }); //--Set auto move next header --//
        }
      }
    } else {
      if (this.allBlocksAndFields.includes(item.type)) {
        console.log('item', item.type);
        if (this.editWidgetIndex != -1) {
          this.editWidgetIndex = -1;
        }
        $event.preventDefault();
        $event.stopPropagation();
        let totalRow = 8;
        let pageStartIndex = (item.page * totalRow) - totalRow;
        if (item.page != 1) {
          pageStartIndex += (item.page - 1);
        }
        let diff = item.y - pageStartIndex;
        let that = this;
        var pageWidgets = this.dashboard.filter(obj => { //Getting number of widget of select page
          return obj.page === item.page
        })
        console.log('pageWidgets::', pageWidgets);
        pageWidgets.forEach(element => {
          if (element.type === item.type) {
            let startIndex = (element.page * totalRow) - totalRow;
            if (element.page != 1) {
              startIndex += (element.page - 1);
            }
            if ((element.y - startIndex) === diff) {
              that.dashboard.splice(that.dashboard.indexOf(element), 1);
            }
          }
        });
        //Selected widget Should be move from all page
        let i = 1;
        pageWidgets.forEach(element => {
          let startIndex = (element.page * totalRow) - totalRow;
          if (element.page != 1) {
            startIndex += (element.page - 1);
          }
          //--Move next text-block --//
          if (element.type === 'text-block' && (element.y - startIndex) > diff) {
            element.y -= element['rows'];
            element['class'] = element['type'] + '-' + element['y'];
            element['id'] = element['type'] + '-' + element['y'];
            that.changedOptions();
            setTimeout(function () {
              let className = element['type'] + '-' + element['y'];
              $("#" + className).empty();
              if (element['value']) {
                $("#" + className).append(element['value']);
              } else {
                $("#" + className).append(className);
              }
            }, 100);
          }
          //--Move next text-block --//
          if (i === pageWidgets.length) {
            //that.changedOptions();
            that.saveDocument();
          }
          i++;
        });
      }
    }
  }

  editorOnChange(event, item) { //when change header of footer
    let totalRow = 8;
    let pageStartIndex = (item.page * totalRow) - totalRow;
    if (item.page != 1) {
      pageStartIndex += (item.page - 1);
    }
    let diff = item.y - pageStartIndex;
    let i = 1;
    let that = this;
    this.dashboard.forEach(element => {
      if (element.type === 'header' || element.type === 'footer') {
        let startIndex = (element.page * totalRow) - totalRow;
        if (element.page != 1) {
          startIndex += (element.page - 1);
        }
        if ((element.y - startIndex) === diff) {
          element.value = event;
          $("#" + element.id).empty();
          $("#" + element.id).append(element.value);
        }
      }
    });
  }

  addPage() { //Add new page
    var pages = this.dashboard.filter(obj => { //Getting number of widget of select page
      return obj.type === 'page';
    });
    let lastPageIndex = pages.length - 1;
    let nextIndex = this.dashboard.length;
    let position = pages[lastPageIndex]['y'] + pages[lastPageIndex]['rows'] + 1;
    //---- Add option layer ---//
    this.dashboard.push({ cols: this.pageColumns, rows: 1, y: (position - 1), x: 1, isEdit: false, type: 'option', page: pages[lastPageIndex]['page'] + 1, index: nextIndex, id: 'option-' + (position - 1), class: 'option-' + (position - 1), layerIndex: 1, value: '', dragEnabled: false, resizeEnabled: false });
    nextIndex = this.dashboard.length;
    //---- Add option layer ---//
    this.dashboard.push({
      cols: pages[lastPageIndex]['cols'],
      rows: pages[lastPageIndex]['rows'],
      y: position, //starting posstion of new page
      x: pages[lastPageIndex]['x'],
      isEdit: false,
      value: pages[lastPageIndex]['value'],
      type: pages[lastPageIndex]['type'],
      page: pages[lastPageIndex]['page'] + 1,
      index: nextIndex,
      id: pages[lastPageIndex]['type'] + '-' + position,
      class: pages[lastPageIndex]['type'] + '-' + position,
      layerIndex: pages[lastPageIndex]['layerIndex'],
      dragEnabled: false,
      resizeEnabled: false
    });
    this.changedOptions();
    nextIndex = this.dashboard.length;
    let that = this;
    this.dashboard.forEach(element => { //Add header and footer
      if (element.page === pages[lastPageIndex]['page'] && element.layerIndex === 2 && (element.type == 'header' || element.type == 'footer')) {
        let position = (element['y'] + pages[lastPageIndex]['rows'] + 1);
        let className = element['type'] + '-' + position;
        that.dashboard.push({
          cols: element['cols'],
          rows: element['rows'],
          y: position, //starting position of new widget
          x: element['x'],
          value: element['value'],
          isEdit: false,
          type: element['type'],
          page: element['page'] + 1,
          index: nextIndex,
          id: className,
          class: className,
          layerIndex: element['layerIndex'],
          dragEnabled: false,
          resizeEnabled: false
        });
        this.changedOptions();
        setTimeout(function () {
          $("#" + className).empty();
          if (element.value != '') {
            $("#" + className).append(element.value);
          } else {
            $("#" + className).append(className);
          }
        }, 1000);
        nextIndex++;
        that.saveDocument();
      }
    })
  }

  deletePage(item) {
    var result = this.dashboard.filter(obj => {
      return obj.page != item.page;
    })
    if (!result.length) {
      alert("You can't delete default page");
    } else {
      this.dashboard = result;
      let that = this;
      let i = 1;
      let rows = 8;
      this.dashboard.forEach(element => {
        if (element.page > item.page) {
          element.page -= 1;
          element.y = element.y - (rows + 1);
          element.id = element.type + '-' + element.y;
          element.class = element.type + '-' + element.y;
          this.changedOptions();
          setTimeout(function () {
            if (element.type === 'header' || element.type === 'footer') {
              //$("#" + element.id).empty();
              $("#" + element.id).empty();
              if (element.value != '') {
                $("#" + element.id).append(element.value);
              } else {
                $("#" + element.id).append(element.class);
              }
            }
          }, 10);
        }
        if (that.dashboard.length === i) {
          that.saveDocument();
        }
        i++;
      })
    }
  }

  backToDoc() {
    // this.route.navigate("")
  }

  plusBtnClick() {
    $(".plus-icon").css("opacity", "1");
  }

  clickApproval() {
    this.approval = true;
    this.setting = false;
    this.comment = false;
    this.theme = false;
    this.addRecipients = false;
    if (this.hideSidebarFlag) {
      this.approval = true;
      this.hideSidebarFlag = false;
    }
  }

  clickSetting() {
    this.approval = false;
    this.setting = true;
    this.comment = false;
    this.theme = false;
    this.addRecipients = false;
    if (this.hideSidebarFlag) {
      this.setting = true;
      this.hideSidebarFlag = false;
    }
  }

  clickTheme() {
    this.approval = false;
    this.setting = false;
    this.comment = false;
    this.theme = true;
    this.addRecipients = false;
    if (this.hideSidebarFlag) {
      this.theme = true;
      this.hideSidebarFlag = false;
    }
  }

  clickComment() {
    this.approval = false;
    this.setting = false;
    this.comment = true;
    this.theme = false;
    this.addRecipients = false;
    if (this.hideSidebarFlag) {
      this.comment = true;
      this.hideSidebarFlag = false;
    }
  }

  clickAddRecipient() {
    this.approval = false;
    this.setting = false;
    this.comment = false;
    this.theme = false;
    this.addRecipients = true;
  }

  closeSidebar() {
    this.hideSidebarFlag = !this.hideSidebarFlag;
    this.approval = false;
    this.setting = false;
    this.comment = false;
    this.theme = false;
  }

  openAddPage() {
    this.http.showModal(AddPageComponent, 'lg');
  }

  sentDocumentViaEmail() {
    this.loginData = JSON.parse(localStorage.getItem('loginData'));
    console.log('Login Data:::', this.loginData);
    const obj: any ={
      subject: `${this.loginData.name} sent you New Document`,
      email: 'mukutprasad.pingdr@gmail.com',
      documentId: this.documentId,
      title: this.documentDetail['title']
    };
    this.http.showModal(EmailDocumentFormatComponent, 'lg', obj);
  }

  successEventHandler(e: SuccessEvent) {
    console.log('The ' + e.operation + ' was successful!');
  }

  imageSelectEventHandler(e: SelectEvent) {
     console.log('File selected::', e);
   }

}







