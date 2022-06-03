import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {ShoppingItem} from '../ngrx.model';
import {AppState} from '../state.model';
import {AddItemAction, DeleteItemAction} from '../actions';

@Component({
    selector: 'app-todo',
    templateUrl: './todo.component.html',
    styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {

    shoppingItems: Observable<Array<ShoppingItem>>;
    newShoppingItem: ShoppingItem = {id: '', name: ''};

    constructor(private store: Store<AppState>) {
    }

    ngOnInit() {
        this.shoppingItems = this.store.select(store => store.shopping);
    }
    deleteItem(id: string) {
        this.store.dispatch(new DeleteItemAction(id));
    }
    addItem() {
        this.newShoppingItem.id = '1';

        this.store.dispatch(new AddItemAction(this.newShoppingItem));

        this.newShoppingItem = {id: '', name: ''};
    }
}
