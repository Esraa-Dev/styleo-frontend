import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CurrencyPipe } from '../../shared/pipes/currency-pipe';
import { ProductService } from '../../core/services/product';
import { CategoryService } from '../../core/services/category';
import { Product, Category } from '../../core/models';
import { PAGINATION } from '../../core/constants/app.constants';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, CurrencyPipe],
  templateUrl: './products.html',
  styleUrls: ['./products.css']
})
export class AdminProducts implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  
  products: Product[] = [];
  categories: Category[] = [];
  isLoading = true;
  isDeleting = false;
  
  currentPage = PAGINATION.DEFAULT_PAGE;
  totalPages = 1;
  totalItems = 0;
  limit = PAGINATION.ADMIN_LIMIT;
  
  filters = {
    category: '',
    search: ''
  };
  
  showModal = false;
  editingProduct: Product | null = null;
  formData = {
    title: '',
    description: '',
    price: 0,
    category: '',
    subcategory: '',
    stock: 0,
    image: null as File | null
  };
  
  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }
  
  loadCategories(): void {
    this.categoryService.getAdminCategories().subscribe({
      next: (res) => this.categories = res.data,
      error: () => {}
    });
  }
  
  loadProducts(): void {
    this.isLoading = true;
    this.productService.getAdminProducts({
      page: this.currentPage,
      limit: this.limit,
      category: this.filters.category || undefined,
      search: this.filters.search || undefined
    }).subscribe({
      next: (res) => {
        this.products = res.products;
        this.totalPages = res.meta.pages;
        this.totalItems = res.meta.total;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }
  
  applyFilters(): void {
    this.currentPage = 1;
    this.loadProducts();
  }
  
  resetFilters(): void {
    this.filters = { category: '', search: '' };
    this.currentPage = 1;
    this.loadProducts();
  }
  
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadProducts();
  }
  
  openCreateModal(): void {
    this.editingProduct = null;
    this.formData = {
      title: '',
      description: '',
      price: 0,
      category: '',
      subcategory: '',
      stock: 0,
      image: null
    };
    this.showModal = true;
  }
  
  openEditModal(product: Product): void {
    this.editingProduct = product;
    this.formData = {
      title: product.name,
      description: product.description,
      price: product.price,
      category: product.category._id,
      subcategory: product.subcategory?._id || '',
      stock: product.stockCount,
      image: null
    };
    this.showModal = true;
  }
  
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.formData.image = input.files[0];
    }
  }
  
  saveProduct(): void {
    const formData = new FormData();
    formData.append('title', this.formData.title);
    formData.append('description', this.formData.description);
    formData.append('price', this.formData.price.toString());
    formData.append('category', this.formData.category);
    if (this.formData.subcategory) formData.append('subcategory', this.formData.subcategory);
    formData.append('stock', this.formData.stock.toString());
    if (this.formData.image) formData.append('image', this.formData.image);
    
    if (this.editingProduct) {
      this.productService.updateProduct(this.editingProduct._id, formData).subscribe({
        next: () => {
          this.showModal = false;
          this.loadProducts();
        },
        error: () => {}
      });
    } else {
      this.productService.createProduct(formData).subscribe({
        next: () => {
          this.showModal = false;
          this.loadProducts();
        },
        error: () => {}
      });
    }
  }
  
  deleteProduct(id: string): void {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    this.isDeleting = true;
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.loadProducts();
        this.isDeleting = false;
      },
      error: () => this.isDeleting = false
    });
  }
  
  getImageUrl(filename: string): string {
    return this.productService.getImageUrl(filename);
  }
  
  getCategorySubcategories(): any[] {
    const category = this.categories.find(c => c._id === this.formData.category);
    return category?.subcategories || [];
  }
}