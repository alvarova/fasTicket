import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TicketItem, TicketState, PaymentMethod } from '../models/data.models';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private state: TicketState = {
    items: [],
    subtotal: 0
  };

  private ticketStateSubject = new BehaviorSubject<TicketState>(this.state);
  public ticketState$ = this.ticketStateSubject.asObservable();

  addItem(amount: number, description: string = 'Varios', paymentMethod: PaymentMethod = 'efectivo'): void {
    const newItem: TicketItem = {
      id: Date.now().toString(),
      amount,
      description,
      paymentMethod,
      timestamp: new Date(),
      selected: false
    };

    this.state = {
      items: [...this.state.items, newItem],
      subtotal: this.state.subtotal + amount
    };

    this.ticketStateSubject.next(this.state);
  }

  toggleItemSelection(id: string): void {
    this.state = {
      ...this.state,
      items: this.state.items.map(item =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    };

    this.ticketStateSubject.next(this.state);
  }

  removeSelectedItems(): void {
    const selectedItems = this.state.items.filter(item => item.selected);
    const totalSelectedAmount = selectedItems.reduce((sum, item) => sum + item.amount, 0);

    this.state = {
      items: this.state.items.filter(item => !item.selected),
      subtotal: this.state.subtotal - totalSelectedAmount
    };

    this.ticketStateSubject.next(this.state);
  }

  hasSelectedItems(): boolean {
    return this.state.items.some(item => item.selected);
  }

  exportToCSV(): void {
    if (this.state.items.length === 0) return;

    const headers = ['Fecha', 'Hora', 'Monto', 'Descripción', 'Método de Pago'];
    const rows = this.state.items.map(item => {
      const date = item.timestamp.toLocaleDateString();
      const time = item.timestamp.toLocaleTimeString();
      return `${date},${time},${item.amount},${item.description},${item.paymentMethod}`;
    });

    const csvContent = [
      headers.join(','),
      ...rows,
      `\nSubtotal,${this.state.subtotal}`
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const filename = `ticket_${new Date().toISOString().replace(/[:.]/g, '-')}.csv`;
    saveAs(blob, filename);

    // Clear the ticket after export
    this.state = {
      items: [],
      subtotal: 0
    };
    this.ticketStateSubject.next(this.state);
  }
}