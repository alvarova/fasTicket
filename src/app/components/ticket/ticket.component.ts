import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { TicketService } from '../../services/ticket.service';
import { PaymentMethod } from '../../models/data.models';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatListModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: `ticket.Component.html`,
  styleUrl: `ticket.component.css`
})
export class TicketComponent {
  ticketState$;
  hasSelectedItems = false;

  newItem = {
    amount: 0,
    description: '',
    paymentMethod: 'efectivo' as PaymentMethod
  };

  constructor(
    private ticketService: TicketService,
    private dialog: MatDialog
  ) {
    this.ticketState$ = this.ticketService.ticketState$;
    this.ticketState$.subscribe(state => {
      this.hasSelectedItems = state.items.some(item => item.selected);
    });
  }

  onAddItem(): void {
    this.ticketService.addItem(
      this.newItem.amount,
      this.newItem.description || 'Varios',
      this.newItem.paymentMethod
    );

    // Reset form
    this.newItem = {
      amount: 0,
      description: '',
      paymentMethod: 'efectivo'
    };
  }

  toggleSelection(id: string): void {
    this.ticketService.toggleItemSelection(id);
  }

  onDelete(): void {
    if (confirm('¿Está seguro que desea eliminar los items seleccionados?')) {
      this.ticketService.removeSelectedItems();
    }
  }

  onClose(): void {
    if (confirm('¿Está seguro que desea cerrar el ticket? Se exportará a CSV y se limpiará la lista.')) {
      this.ticketService.exportToCSV();
    }
  }
}
