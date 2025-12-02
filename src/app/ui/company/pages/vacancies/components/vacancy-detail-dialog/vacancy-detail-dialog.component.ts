import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { TabViewModule } from 'primeng/tabview';
import { Vacancy } from '../../models/vacancy.interface';

@Component({
  selector: 'app-vacancy-detail-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, ChipModule, TabViewModule],
  templateUrl: './vacancy-detail-dialog.component.html',
  styleUrls: ['./vacancy-detail-dialog.component.scss']
})
export class VacancyDetailDialogComponent {
  @Input() vacancy: Vacancy | null = null;
  @Input() isVisible: boolean = false;
  @Output() onClose = new EventEmitter<void>();

  closeDialog(): void {
    this.onClose.emit();
  }

  getStatusLabel(status?: string): string {
    switch(status) {
      case 'draft': return 'Borrador';
      case 'published': return 'Publicada';
      case 'closed': return 'Cerrada';
      default: return 'Borrador';
    }
  }
}
