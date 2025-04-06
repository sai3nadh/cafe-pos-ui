import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';  // Add this import
import { EditMenuService } from './edit-menu.service';
import { OrderService } from '../home/order.service';
import { StorageService } from '../services/storage.service';
export interface MenuItem {
  menuItemId: number;
  name: string;
  price: number;
  description: string;
  categoryId: number;
  isKitchenItem: boolean; // New property for checkbox (whether it's a kitchen item)
}

export interface Category {
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
  styleUrls: ['./edit-menu.component.scss']
})
export class EditMenuComponent implements OnInit {
  categories: Category[] = [];
  selectedCategory: Category | null = null;
  categoryToEdit: Category = { categoryId: 0, name: '', menuItems: [] };
  itemToEdit: MenuItem ;
  // // = { menuItemId: 0, name: '', price: 0, description: '', categoryId: 0 };
  // itemToEdit: MenuItem = {
  //   menuItemId: 0,
  //   name: '',
  //   price: 0,
  //   description: '',
  //   categoryId: 0,
  //   isKitchenItem: false // Initialize the checkbox value to false
  // };
  categoryModalVisible: boolean = false;
  itemModalVisible: boolean = false;
  showDeleteCategoryModal: boolean = false;
  showDeleteItemModal: boolean = false;
  selectedImage: File | null = null;
  imagePreviewUrl: string | null = null

  constructor(private http: HttpClient,
    private editMenuService : EditMenuService
   ,private orderService: OrderService
   ,private storageService: StorageService
   ,private router: Router,
  ) {
    this.itemToEdit = this.createEmptyMenuItem();
  }

  ngOnInit() {
    this.orderService.checkLogin();
    this.loadCategories();
  }

  // loadCategories() {
  //   this.http.get<Category[]>('http://localhost:8083/api/categories').subscribe((response) => {
  //     this.categories = response;
  //     if(this.categories.length>0){
  //       this.selectCategory(this.categories[0]);
  //     }
  //   });
  // }

  loadCategories() {
    this.editMenuService.getCategories().subscribe((response) => {
      this.categories = response;
      if (this.categories.length > 0) {
        this.selectCategory(this.categories[0]);
      }
    });
  }
  

    
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
  
    if (input.files && input.files[0]) {
      const file = input.files[0];
  
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
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

  // commented 
  // openCategoryEditModal(category: Category) {
  //   this.categoryToEdit = { ...category }; // Edit existing category
  //   this.categoryModalVisible = true;
  // }

  


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
    // this.itemToEdit = { menuItemId: 0, name: '', price: 0, description: '', categoryId: category.categoryId }; // New menu item
    this.itemToEdit = this.createEmptyMenuItem(); 
    //  {
    //   menuItemId: 0,
    //   name: '',
    //   price: 0,
    //   description: '',
    //   categoryId: 0,
    //   isKitchenItem: false // Initialize the checkbox value to false
    // };
    this.selectedCategory = category;
    this.itemModalVisible = true;
  }

  openItemEditModal(item: MenuItem) {
    this.itemToEdit = { ...item }; // Edit existing menu item
    this.itemModalVisible = true;
  }

  createEmptyMenuItem(): MenuItem {
    return {
      menuItemId: 0,
      name: '',
      price: 0,
      description: '',
      categoryId: 0,
      isKitchenItem: false
    };
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
    if (this.selectedCategory) {  // Check if selectedCategory is not null
      if (this.itemToEdit.menuItemId) {
        // Update existing item
        this.editMenuService.updateMenuItem(this.itemToEdit).subscribe(() => {
          this.loadCategories();
          this.closeItemModal();
        });
      } else {
        // Create new item
        this.editMenuService.createMenuItem(this.selectedCategory.categoryId, this.itemToEdit).subscribe(() => {
          this.loadCategories();
          this.closeItemModal();
        });
      }
    } else {
      console.error('No category selected.');
    }
  }
  

  // saveItem() {
  //   if (this.itemToEdit.menuItemId) {
  //     this.http.put(`/api/menuItems/${this.itemToEdit.menuItemId}`, this.itemToEdit).subscribe(() => {
  //       this.loadCategories();
  //       this.closeItemModal();
  //     });
  //   } else {
  //     const categoryData = {
  //       name: "",       // Do not send the name, or set it as empty
  //       version: 0,     // Set version
  //       menuItems: null // Set menuItems as null
  //     };

  //     // Call the createCategory method from MenuService
  //     // this.editMenuService.createCategory(categoryData).subscribe(() => {
  //     //   this.loadCategories();
  //     //   this.closeItemModal();
  //     // });
  //   }
  // }
  closeItemModal() {
    this.selectedImage = null;
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


  editCategoryModalVisible: boolean = false;
  addCategoryModalVisible: boolean = false;
  updateCategory() {
    if (this.categoryToEdit && this.categoryToEdit.categoryId) {
      
      this.editMenuService.updateCategory(this.categoryToEdit.categoryId, this.categoryToEdit.name).subscribe(() => {
        this.loadCategories();
        this.closeEditCategoryModal();
      });
    }
  }
  
  closeEditCategoryModal(){
   this.editCategoryModalVisible = false;
  }
  
  openCategoryEditModal(category: Category) {
    this.categoryToEdit = { ...category };
    this.editCategoryModalVisible = true;
  }
  
  




  cancelDeleteItem() {
    this.showDeleteItemModal = false;
  }

   dropdownVisible = false;
    showOrdersIcon: boolean = false; 
    // customerForm: FormGroup;
    // selectedImage: File | null = null;
    responseMessage: string = '';
    compressedImage: string | null = null;  // Declare compressedImage property to store base64 string
    compressedBlob: Blob | null = null; // Compressed image as Blob
    goToHome() {
      // this.cart=[];
      // console.log('Going to Drafts...');
      this.router.navigate(['/user']);
      this.closeDropdown();
    }
    closeDropdown() {
      this.dropdownVisible = false;
    }
    usersmenu() {
      this.router.navigate(['/user']);
      console.log('Users page...');
    }
    // Toggle dropdown visibility
    toggleDropdown() {
      this.dropdownVisible = !this.dropdownVisible;
    }
    
  // // // Show Zoom Settings Modal
  openZoomSettings(): void {
    this.zoomModalVisible = true;
  }
  
  // // // Close Zoom Settings Modal
  closeZoomSettings(): void {
    this.zoomModalVisible = false;
  }
   
  
  zoomLevel = 1; // Default zoom level
  
  zoomModalVisible = false; // Control visibility of the zoom modal
  
  adjustZoom(event: any) {
    this.zoomLevel = event.target.value;
    this.applyZoom();
  }
  
  changeZoom(delta: number) {
    this.zoomLevel = Math.min(2, Math.max(0.5, this.zoomLevel + delta));
    // this.applyZoom();
    this.saveAndApplyZoom();
  
  }
  
  
  applyZoom() {
    // Adjust the zoom level in your application as needed
    document.body.style.zoom = `${this.zoomLevel * 100}%`;
  }
  saveAndApplyZoom(): void {
    localStorage.setItem('zoomLevel', this.zoomLevel.toString()); // Save zoom level
    this.applyZoom();
  }
  
  
  logout() {
      
    // Clear all session data from storage
    this.storageService.clearAllLocalVariables();
    this.router.navigate(['/login']);
    console.log('Logging out...');
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
