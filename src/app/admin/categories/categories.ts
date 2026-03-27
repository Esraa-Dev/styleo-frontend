import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../core/services/category';
import { Category, Subcategory } from '../../core/models';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.html',
  styleUrls: ['./categories.css']
})
export class AdminCategories implements OnInit {
  private categoryService = inject(CategoryService);
  
  categories: Category[] = [];
  isLoading = true;
  
  showCategoryModal = false;
  editingCategory: Category | null = null;
  categoryForm = { name: '', isActive: true };
  
  showSubModal = false;
  editingSub: Subcategory | null = null;
  selectedCategoryId = '';
  subForm = { name: '', isActive: true };
  
  ngOnInit(): void {
    this.loadCategories();
  }
  
  loadCategories(): void {
    this.isLoading = true;
    this.categoryService.getAdminCategories().subscribe({
      next: (res) => {
        this.categories = res.data;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }
  
  openCategoryModal(category?: Category): void {
    if (category) {
      this.editingCategory = category;
      this.categoryForm = { name: category.name, isActive: category.isActive };
    } else {
      this.editingCategory = null;
      this.categoryForm = { name: '', isActive: true };
    }
    this.showCategoryModal = true;
  }
  
  saveCategory(): void {
    if (!this.categoryForm.name.trim()) return;
    
    if (this.editingCategory) {
      this.categoryService.updateCategory(this.editingCategory._id, { name: this.categoryForm.name }).subscribe({
        next: () => {
          this.loadCategories();
          this.showCategoryModal = false;
        },
        error: () => {}
      });
    } else {
      this.categoryService.createCategory(this.categoryForm).subscribe({
        next: () => {
          this.loadCategories();
          this.showCategoryModal = false;
        },
        error: () => {}
      });
    }
  }
  
  deleteCategory(id: string): void {
    if (!confirm('Are you sure? This will also delete all subcategories.')) return;
    
    this.categoryService.deleteCategory(id).subscribe({
      next: () => this.loadCategories(),
      error: () => {}
    });
  }
  
  openSubModal(categoryId: string, sub?: Subcategory): void {
    this.selectedCategoryId = categoryId;
    if (sub) {
      this.editingSub = sub;
      this.subForm = { name: sub.name, isActive: sub.isActive };
    } else {
      this.editingSub = null;
      this.subForm = { name: '', isActive: true };
    }
    this.showSubModal = true;
  }
  
  saveSubcategory(): void {
    if (!this.subForm.name.trim()) return;
    
    if (this.editingSub) {
      this.categoryService.updateSubcategory(this.selectedCategoryId, this.editingSub._id, { name: this.subForm.name }).subscribe({
        next: () => {
          this.loadCategories();
          this.showSubModal = false;
        },
        error: () => {}
      });
    } else {
      this.categoryService.createSubcategory(this.selectedCategoryId, this.subForm).subscribe({
        next: () => {
          this.loadCategories();
          this.showSubModal = false;
        },
        error: () => {}
      });
    }
  }
  
  deleteSubcategory(categoryId: string, subId: string): void {
    if (!confirm('Are you sure?')) return;
    
    this.categoryService.deleteSubcategory(categoryId, subId).subscribe({
      next: () => this.loadCategories(),
      error: () => {}
    });
  }
}