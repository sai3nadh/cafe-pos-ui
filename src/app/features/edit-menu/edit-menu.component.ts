import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';  // Add this import
import { EditMenuService } from './edit-menu.service';
interface MenuItem {
  menuItemId: number;
  name: string;
  price: number;
  description: string;
  categoryId: number;
}

interface Category {
  categoryId: number;
  name: string;
  menuItems: MenuItem[];
}

@Component({
  selector: 'app-edit-menu',
  templateUrl: './edit-menu.component.html',
  imports: [
    FormsModule, // To enable ngModel for form binding
    RouterModule, // To enable routerLink
    CommonModule, // Add CommonModule here to make ngFor and ngIf work
    // EditMenuComponent
],
  styleUrls: ['./edit-menu.component.css']
})
export class EditMenuComponent implements OnInit {
  categories: Category[] = [];
  selectedCategory: Category | null = null;
  categoryToEdit: Category = { categoryId: 0, name: '', menuItems: [] };
  itemToEdit: MenuItem = { menuItemId: 0, name: '', price: 0, description: '', categoryId: 0 };
  categoryModalVisible: boolean = false;
  itemModalVisible: boolean = false;
  showDeleteCategoryModal: boolean = false;
  showDeleteItemModal: boolean = false;

  constructor(private http: HttpClient,
    private editMenuService : EditMenuService
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.http.get<Category[]>('http://localhost:8083/api/categories').subscribe((response) => {
      this.categories = response;
    });
  }

  selectCategory(category: Category) {
    // Select the category and display its menu items on the right
    this.selectedCategory = category;
    console.log("selected cat --?"+this.selectedCategory.categoryId);
  }

  openCategoryModal() {
    this.categoryToEdit = { categoryId: 0, name: '', menuItems: [] }; // New category
    this.categoryModalVisible = true;
  }

  openCategoryEditModal(category: Category) {
    this.categoryToEdit = { ...category }; // Edit existing category
    this.categoryModalVisible = true;
  }

  // saveCategory() {
  //   if (this.categoryToEdit.categoryId) {
  //     this.http.put(`/api/categories/${this.categoryToEdit.categoryId}`, this.categoryToEdit).subscribe(() => {
  //       this.loadCategories();
  //       this.closeCategoryModal();
  //     });
  //   } else {
  //     this.http.post('/api/categories', this.categoryToEdit).subscribe(() => {
  //       this.loadCategories();
  //       this.closeCategoryModal();
  //     });
  //   }
  // }

  saveCategory() {
    const categoryData = {
      name: this.categoryToEdit.name || "",  // Get name from input, default to an empty string if not set
    };
  
    // Call the createCategory method to send data to the backend
    this.editMenuService.createCategory(categoryData).subscribe(() => {
      this.loadCategories();  // Reload the categories after saving
      this.closeCategoryModal();  // Close the modal after the operation
    });
  }
  

  
  closeCategoryModal() {
    this.categoryModalVisible = false;
  }

  confirmDeleteCategory(category: Category) {
    this.categoryToEdit = category;
    this.showDeleteCategoryModal = true;
  }

  deleteCategory() {
    if (this.categoryToEdit) {
      this.http.delete(`/api/categories/${this.categoryToEdit.categoryId}`).subscribe(() => {
        this.loadCategories();
        this.showDeleteCategoryModal = false;
      });
    }
  }

  cancelDeleteCategory() {
    this.showDeleteCategoryModal = false;
  }

  openItemModal(category: Category) {
    this.itemToEdit = { menuItemId: 0, name: '', price: 0, description: '', categoryId: category.categoryId }; // New menu item
    this.selectedCategory = category;
    this.itemModalVisible = true;
  }

  openItemEditModal(item: MenuItem) {
    this.itemToEdit = { ...item }; // Edit existing menu item
    this.itemModalVisible = true;
  }

  // saveItem() {
  //   if (this.itemToEdit.menuItemId) {
  //     this.http.put(`/api/menuItems/${this.itemToEdit.menuItemId}`, this.itemToEdit).subscribe(() => {
  //       this.loadCategories();
  //       this.closeItemModal();
  //     });
  //   } else {
  //     this.http.post(`/api/categories/${this.selectedCategory?.categoryId}/menuItems`, this.itemToEdit).subscribe(() => {
  //       this.loadCategories();
  //       this.closeItemModal();
  //     });
  //   }
  // }


  saveItem() {
    if (this.itemToEdit.menuItemId) {
      this.http.put(`/api/menuItems/${this.itemToEdit.menuItemId}`, this.itemToEdit).subscribe(() => {
        this.loadCategories();
        this.closeItemModal();
      });
    } else {
      const categoryData = {
        name: "",       // Do not send the name, or set it as empty
        version: 0,     // Set version
        menuItems: null // Set menuItems as null
      };

      // Call the createCategory method from MenuService
      this.editMenuService.createCategory(categoryData).subscribe(() => {
        this.loadCategories();
        this.closeItemModal();
      });
    }
  }
  closeItemModal() {
    this.itemModalVisible = false;
  }

  confirmDeleteItem(item: MenuItem) {
    this.itemToEdit = item;
    this.showDeleteItemModal = true;
  }

  deleteItem() {
    if (this.itemToEdit) {
      this.http.delete(`/api/menuItems/${this.itemToEdit.menuItemId}`).subscribe(() => {
        this.loadCategories();
        this.showDeleteItemModal = false;
      });
    }
  }

  cancelDeleteItem() {
    this.showDeleteItemModal = false;
  }
}
// export class EditMenuComponent implements OnInit {
//   categories: Category[] = [];
//   selectedCategory: Category | null = null;
//   categoryToEdit: Category = { categoryId: 0, name: '', menuItems: [] };
//   itemToEdit: MenuItem = { menuItemId: 0, name: '', price: 0, description: '', categoryId: 0 };
//   categoryModalVisible: boolean = false;
//   itemModalVisible: boolean = false;
//   showDeleteCategoryModal: boolean = false;
//   showDeleteItemModal: boolean = false;

//   constructor(private http: HttpClient) {}

//   ngOnInit() {
//     this.loadCategories();
//   }

//   loadCategories() {
//     this.http.get<Category[]>('http://localhost:8083/api/categories').subscribe((response) => {
//       this.categories = response;
//     });
//   }

//   openCategoryModal() {
//     this.categoryToEdit = { categoryId: 0, name: '', menuItems: [] }; // New category
//     this.categoryModalVisible = true;
//   }

//   openCategoryEditModal(category: Category) {
//     this.categoryToEdit = { ...category }; // Edit existing category
//     this.categoryModalVisible = true;
//   }

//   saveCategory() {
//     if (this.categoryToEdit.categoryId) {
//       this.http.put(`/api/categories/${this.categoryToEdit.categoryId}`, this.categoryToEdit).subscribe(() => {
//         this.loadCategories();
//         this.closeCategoryModal();
//       });
//     } else {
//       this.http.post('/api/categories', this.categoryToEdit).subscribe(() => {
//         this.loadCategories();
//         this.closeCategoryModal();
//       });
//     }
//   }

//   closeCategoryModal() {
//     this.categoryModalVisible = false;
//   }

//   confirmDeleteCategory(category: Category) {
//     this.categoryToEdit = category;
//     this.showDeleteCategoryModal = true;
//   }

//   deleteCategory() {
//     if (this.categoryToEdit) {
//       this.http.delete(`/api/categories/${this.categoryToEdit.categoryId}`).subscribe(() => {
//         this.loadCategories();
//         this.showDeleteCategoryModal = false;
//       });
//     }
//   }

//   cancelDeleteCategory() {
//     this.showDeleteCategoryModal = false;
//   }

//   openItemModal(category: Category) {
//     this.itemToEdit = { menuItemId: 0, name: '', price: 0, description: '', categoryId: category.categoryId }; // New menu item
//     this.selectedCategory = category;
//     this.itemModalVisible = true;
//   }

//   openItemEditModal(item: MenuItem) {
//     this.itemToEdit = { ...item }; // Edit existing menu item
//     this.itemModalVisible = true;
//   }

//   saveItem() {
//     if (this.itemToEdit.menuItemId) {
//       this.http.put(`/api/menuItems/${this.itemToEdit.menuItemId}`, this.itemToEdit).subscribe(() => {
//         this.loadCategories();
//         this.closeItemModal();
//       });
//     } else {
//       this.http.post(`/api/categories/${this.selectedCategory?.categoryId}/menuItems`, this.itemToEdit).subscribe(() => {
//         this.loadCategories();
//         this.closeItemModal();
//       });
//     }
//   }

//   closeItemModal() {
//     this.itemModalVisible = false;
//   }

//   confirmDeleteItem(item: MenuItem) {
//     this.itemToEdit = item;
//     this.showDeleteItemModal = true;
//   }

//   deleteItem() {
//     if (this.itemToEdit) {
//       this.http.delete(`/api/menuItems/${this.itemToEdit.menuItemId}`).subscribe(() => {
//         this.loadCategories();
//         this.showDeleteItemModal = false;
//       });
//     }
//   }

//   cancelDeleteItem() {
//     this.showDeleteItemModal = false;
//   }
// }
