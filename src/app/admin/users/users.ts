import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../../core/services/user';
import { User } from '../../core/models';
import { PAGINATION } from '../../core/constants/app.constants';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './users.html',
  styleUrls: ['./users.css']
})
export class AdminUsers implements OnInit {
  private userService = inject(UserService);
  
  users: User[] = [];
  isLoading = true;
  isToggling = false;
  
  currentPage = PAGINATION.DEFAULT_PAGE;
  totalPages = 1;
  totalItems = 0;
  limit = PAGINATION.ADMIN_LIMIT;
  
  filters = {
    search: '',
    isActive: ''
  };
  
  ngOnInit(): void {
    this.loadUsers();
  }
  
  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers({
      page: this.currentPage,
      limit: this.limit,
      search: this.filters.search || undefined,
      isActive: this.filters.isActive ? this.filters.isActive === 'true' : undefined
    }).subscribe({
      next: (res) => {
        this.users = res.data;
        this.totalPages = res.meta.pages;
        this.totalItems = res.meta.total;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }
  
  applyFilters(): void {
    this.currentPage = 1;
    this.loadUsers();
  }
  
  resetFilters(): void {
    this.filters = { search: '', isActive: '' };
    this.currentPage = 1;
    this.loadUsers();
  }
  
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadUsers();
  }
  
  toggleStatus(user: User): void {
    this.isToggling = true;
    this.userService.toggleUserStatus(user._id).subscribe({
      next: (res) => {
        const index = this.users.findIndex(u => u._id === user._id);
        if (index !== -1) this.users[index] = res.data;
        this.isToggling = false;
      },
      error: () => this.isToggling = false
    });
  }
}