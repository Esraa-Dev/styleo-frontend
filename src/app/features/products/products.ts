import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductCard } from '../../shared/components/product-card/product-card';
import { ProductService } from '../../core/services/product';
import { CategoryService } from '../../core/services/category';
import { Product, Category } from '../../core/models';
import { SORT_OPTIONS, PAGINATION } from '../../core/constants/app.constants';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ProductCard],
  templateUrl: './products.html',
  styleUrls: ['./products.css']
})
export class Products implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  products: Product[] = [];
  categories: Category[] = [];
  isLoading = true;
  
  currentPage = PAGINATION.DEFAULT_PAGE;
  totalPages = 1;
  totalItems = 0;
  limit = PAGINATION.DEFAULT_LIMIT;
  
  filters = {
    category: '',
    subcategory: '',
    search: '',
    sort: 'newest'
  };
  
  sortOptions = SORT_OPTIONS;
  
  ngOnInit(): void {
    this.loadCategories();
    this.route.queryParams.subscribe(params => {
      this.filters.category = params['category'] || '';
      this.filters.subcategory = params['subcategory'] || '';
      this.filters.search = params['search'] || '';
      this.filters.sort = params['sort'] || 'newest';
      this.currentPage = Number(params['page']) || PAGINATION.DEFAULT_PAGE;
      this.loadProducts();
    });
  }
  
  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (res) => this.categories = res.data,
      error: () => {}
    });
  }
  
  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts({
      page: this.currentPage,
      limit: this.limit,
      category: this.filters.category || undefined,
      subcategory: this.filters.subcategory || undefined,
      search: this.filters.search || undefined,
      sort: this.filters.sort
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
    const params: any = {};
    if (this.filters.category) params.category = this.filters.category;
    if (this.filters.subcategory) params.subcategory = this.filters.subcategory;
    if (this.filters.search) params.search = this.filters.search;
    if (this.filters.sort !== 'newest') params.sort = this.filters.sort;
    params.page = 1;
    this.router.navigate(['/products'], { queryParams: params });
  }
  
  resetFilters(): void {
    this.filters = {
      category: '',
      subcategory: '',
      search: '',
      sort: 'newest'
    };
    this.router.navigate(['/products']);
  }
  
  onPageChange(page: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page },
      queryParamsHandling: 'merge'
    });
  }
  
  getSelectedCategorySubcategories(): any[] {
    const category = this.categories.find(c => c._id === this.filters.category);
    return category?.subcategories || [];
  }
}