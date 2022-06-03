import {ShoppingItem} from './ngrx.model';

export interface AppState {
    readonly shopping: Array<ShoppingItem>
}
