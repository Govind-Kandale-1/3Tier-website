// Employee Management System JavaScript

class EmployeeManager {
    constructor() {
        this.employees = [
            {
                id: "EMP001",
                name: "John Smith", 
                email: "john.smith@company.com",
                phone: "(555) 123-4567",
                department: "Engineering",
                position: "Software Developer",
                hireDate: "2023-01-15",
                salary: 75000,
                address: "123 Main St, New York, NY 10001"
            },
            {
                id: "EMP002", 
                name: "Sarah Johnson",
                email: "sarah.johnson@company.com", 
                phone: "(555) 234-5678",
                department: "Marketing",
                position: "Marketing Manager",
                hireDate: "2022-08-10",
                salary: 68000,
                address: "456 Oak Ave, Los Angeles, CA 90210"
            },
            {
                id: "EMP003",
                name: "Michael Brown",
                email: "michael.brown@company.com",
                phone: "(555) 345-6789", 
                department: "HR",
                position: "HR Specialist",
                hireDate: "2023-03-22",
                salary: 55000,
                address: "789 Pine St, Chicago, IL 60601"
            },
            {
                id: "EMP004",
                name: "Emily Davis",
                email: "emily.davis@company.com",
                phone: "(555) 456-7890",
                department: "Sales", 
                position: "Sales Representative",
                hireDate: "2022-11-05",
                salary: 62000,
                address: "321 Elm Dr, Miami, FL 33101"
            },
            {
                id: "EMP005",
                name: "David Wilson",
                email: "david.wilson@company.com",
                phone: "(555) 567-8901",
                department: "Finance",
                position: "Financial Analyst", 
                hireDate: "2023-02-18",
                salary: 70000,
                address: "654 Maple Ln, Seattle, WA 98101"
            },
            {
                id: "EMP006",
                name: "Lisa Anderson",
                email: "lisa.anderson@company.com", 
                phone: "(555) 678-9012",
                department: "Operations",
                position: "Operations Manager",
                hireDate: "2022-12-01", 
                salary: 78000,
                address: "987 Cedar Rd, Boston, MA 02101"
            }
        ];

        this.currentView = 'dashboard';
        this.editingEmployee = null;
        this.sortColumn = null;
        this.sortDirection = 'asc';
        this.employeeToDelete = null;
    }

    init() {
        try {
            this.setupEventListeners();
            this.updateDashboard();
            this.renderEmployeeTable();
            this.generateNextEmployeeId();
        } catch (error) {
            console.error('Error initializing app:', error);
        }
    }

    setupEventListeners() {
        // Navigation with more robust event handling
        const navTabs = document.querySelectorAll('.nav__tab');
        navTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const view = e.target.getAttribute('data-view');
                if (view) {
                    this.switchView(view);
                }
            });
        });

        // Employee form
        const form = document.getElementById('employee-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        const cancelBtn = document.getElementById('cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.cancelForm();
            });
        }

        // Search and filter
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }

        const departmentFilter = document.getElementById('department-filter');
        if (departmentFilter) {
            departmentFilter.addEventListener('change', (e) => this.handleFilter(e.target.value));
        }

        // Table sorting
        document.querySelectorAll('.sortable').forEach(header => {
            header.addEventListener('click', (e) => {
                const column = e.target.getAttribute('data-column');
                if (column) {
                    this.handleSort(column);
                }
            });
        });

        // Modal events
        const modalBackdrop = document.getElementById('modal-backdrop');
        if (modalBackdrop) {
            modalBackdrop.addEventListener('click', () => this.closeModal());
        }

        const cancelDelete = document.getElementById('cancel-delete');
        if (cancelDelete) {
            cancelDelete.addEventListener('click', () => this.closeModal());
        }

        const confirmDelete = document.getElementById('confirm-delete');
        if (confirmDelete) {
            confirmDelete.addEventListener('click', () => this.confirmDelete());
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    }

    switchView(view) {
        try {
            // Update navigation
            document.querySelectorAll('.nav__tab').forEach(tab => {
                tab.classList.remove('nav__tab--active');
            });
            
            const activeTab = document.querySelector(`[data-view="${view}"]`);
            if (activeTab) {
                activeTab.classList.add('nav__tab--active');
            }

            // Update views
            document.querySelectorAll('.view').forEach(viewEl => {
                viewEl.classList.remove('view--active');
            });
            
            const targetView = document.getElementById(`${view}-view`);
            if (targetView) {
                targetView.classList.add('view--active');
            }

            this.currentView = view;

            // Update content based on view
            if (view === 'dashboard') {
                this.updateDashboard();
            } else if (view === 'view-employees') {
                this.renderEmployeeTable();
            } else if (view === 'add-employee') {
                this.resetForm();
            }
        } catch (error) {
            console.error('Error switching view:', error);
        }
    }

    updateDashboard() {
        try {
            // Total employees
            const totalEl = document.getElementById('total-employees');
            if (totalEl) {
                totalEl.textContent = this.employees.length;
            }

            // Unique departments
            const departments = [...new Set(this.employees.map(emp => emp.department))];
            const deptCountEl = document.getElementById('departments-count');
            if (deptCountEl) {
                deptCountEl.textContent = departments.length;
            }

            // Recent hires (last 30 days)
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const recentHires = this.employees.filter(emp => new Date(emp.hireDate) >= thirtyDaysAgo);
            const recentEl = document.getElementById('recent-hires');
            if (recentEl) {
                recentEl.textContent = recentHires.length;
            }

            // Department distribution
            this.renderDepartmentStats(departments);

            // Recent employees
            this.renderRecentEmployees();
        } catch (error) {
            console.error('Error updating dashboard:', error);
        }
    }

    renderDepartmentStats(departments) {
        const container = document.getElementById('department-stats');
        if (!container) return;

        container.innerHTML = '';

        departments.forEach(dept => {
            const count = this.employees.filter(emp => emp.department === dept).length;
            const statEl = document.createElement('div');
            statEl.className = 'department-stat';
            statEl.innerHTML = `
                <div class="department-stat__name">${dept}</div>
                <div class="department-stat__count">${count}</div>
            `;
            container.appendChild(statEl);
        });
    }

    renderRecentEmployees() {
        const container = document.getElementById('recent-employees');
        if (!container) return;

        const sortedEmployees = [...this.employees]
            .sort((a, b) => new Date(b.hireDate) - new Date(a.hireDate))
            .slice(0, 5);

        if (sortedEmployees.length === 0) {
            container.innerHTML = '<div class="empty-state"><h3>No employees found</h3></div>';
            return;
        }

        container.innerHTML = '';
        sortedEmployees.forEach(emp => {
            const empEl = document.createElement('div');
            empEl.className = 'recent-employee';
            empEl.innerHTML = `
                <div class="recent-employee__info">
                    <h4>${emp.name}</h4>
                    <p>${emp.position} - ${emp.department}</p>
                </div>
                <div class="recent-employee__date">${this.formatDate(emp.hireDate)}</div>
            `;
            container.appendChild(empEl);
        });
    }

    renderEmployeeTable() {
        const tbody = document.getElementById('employees-table-body');
        if (!tbody) return;

        const searchInput = document.getElementById('search-input');
        const departmentFilter = document.getElementById('department-filter');
        
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const departmentFilterValue = departmentFilter ? departmentFilter.value : '';

        let filteredEmployees = this.employees.filter(emp => {
            const matchesSearch = emp.name.toLowerCase().includes(searchTerm) || 
                                emp.department.toLowerCase().includes(searchTerm);
            const matchesDepartment = !departmentFilterValue || emp.department === departmentFilterValue;
            return matchesSearch && matchesDepartment;
        });

        // Sort employees
        if (this.sortColumn) {
            filteredEmployees.sort((a, b) => {
                let aValue = a[this.sortColumn];
                let bValue = b[this.sortColumn];

                if (this.sortColumn === 'salary') {
                    aValue = parseFloat(aValue);
                    bValue = parseFloat(bValue);
                } else if (this.sortColumn === 'hireDate') {
                    aValue = new Date(aValue);
                    bValue = new Date(bValue);
                } else {
                    aValue = aValue.toString().toLowerCase();
                    bValue = bValue.toString().toLowerCase();
                }

                if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
                if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }

        // Update employee count
        const countEl = document.getElementById('employees-count');
        if (countEl) {
            countEl.textContent = `${filteredEmployees.length} employee${filteredEmployees.length !== 1 ? 's' : ''}`;
        }

        if (filteredEmployees.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="empty-state"><h3>No employees found</h3></td></tr>';
            return;
        }

        tbody.innerHTML = '';
        filteredEmployees.forEach(emp => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${emp.id}</td>
                <td>${emp.name}</td>
                <td>${emp.email}</td>
                <td>${emp.department}</td>
                <td>${emp.position}</td>
                <td>${this.formatDate(emp.hireDate)}</td>
                <td>$${emp.salary.toLocaleString()}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn--sm btn--edit" onclick="window.employeeManager.editEmployee('${emp.id}')">
                            Edit
                        </button>
                        <button class="btn btn--sm btn--delete" onclick="window.employeeManager.deleteEmployee('${emp.id}')">
                            Delete
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    handleSearch(searchTerm) {
        this.renderEmployeeTable();
    }

    handleFilter(department) {
        this.renderEmployeeTable();
    }

    handleSort(column) {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }

        // Update sort indicators
        document.querySelectorAll('.sortable').forEach(header => {
            header.classList.remove('sorted-asc', 'sorted-desc');
        });
        
        const sortedHeader = document.querySelector(`[data-column="${column}"]`);
        if (sortedHeader) {
            sortedHeader.classList.add(`sorted-${this.sortDirection}`);
        }

        this.renderEmployeeTable();
    }

    generateNextEmployeeId() {
        const maxId = Math.max(...this.employees.map(emp => parseInt(emp.id.replace('EMP', ''))));
        const nextId = (maxId + 1).toString().padStart(3, '0');
        const empIdInput = document.getElementById('employee-id');
        if (empIdInput) {
            empIdInput.value = `EMP${nextId}`;
        }
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const employeeData = Object.fromEntries(formData.entries());

        if (!this.validateForm(employeeData)) {
            return;
        }

        // Convert salary to number
        employeeData.salary = parseFloat(employeeData.salary);

        if (this.editingEmployee) {
            this.updateEmployee(employeeData);
        } else {
            this.addEmployee(employeeData);
        }
    }

    validateForm(data) {
        let isValid = true;

        // Clear previous errors
        document.querySelectorAll('.form-error').forEach(error => {
            error.style.display = 'none';
        });
        document.querySelectorAll('.form-control').forEach(input => {
            input.classList.remove('error', 'success');
        });

        // Validate required fields
        const requiredFields = ['name', 'email', 'phone', 'department', 'position', 'hireDate', 'salary'];
        requiredFields.forEach(field => {
            if (!data[field] || data[field].trim() === '') {
                this.showFieldError(field, 'This field is required');
                isValid = false;
            } else {
                const input = document.getElementById(`employee-${field}`);
                if (input) {
                    input.classList.add('success');
                }
            }
        });

        // Validate email format
        if (data.email && !this.isValidEmail(data.email)) {
            this.showFieldError('email', 'Please enter a valid email address');
            isValid = false;
        }

        // Validate phone format
        if (data.phone && !this.isValidPhone(data.phone)) {
            this.showFieldError('phone', 'Please enter a valid phone number');
            isValid = false;
        }

        // Check for duplicate email (excluding current employee if editing)
        if (data.email) {
            const existingEmployee = this.employees.find(emp => 
                emp.email === data.email && emp.id !== data.id
            );
            if (existingEmployee) {
                this.showFieldError('email', 'This email address is already in use');
                isValid = false;
            }
        }

        // Validate salary
        if (data.salary && (isNaN(data.salary) || parseFloat(data.salary) < 0)) {
            this.showFieldError('salary', 'Please enter a valid salary amount');
            isValid = false;
        }

        // Validate hire date
        if (data.hireDate && new Date(data.hireDate) > new Date()) {
            this.showFieldError('hire-date', 'Hire date cannot be in the future');
            isValid = false;
        }

        return isValid;
    }

    showFieldError(field, message) {
        const fieldName = field === 'hire-date' ? 'hireDate' : field;
        const input = document.getElementById(`employee-${fieldName}`);
        const errorId = field.replace('Date', '-date');
        const error = document.getElementById(`${errorId}-error`);
        
        if (input) {
            input.classList.add('error');
            input.classList.remove('success');
        }
        
        if (error) {
            error.textContent = message;
            error.style.display = 'block';
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^\(\d{3}\)\s\d{3}-\d{4}$|^\d{3}-\d{3}-\d{4}$|^\d{10}$/;
        return phoneRegex.test(phone);
    }

    addEmployee(employeeData) {
        this.setButtonLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            this.employees.push(employeeData);
            this.setButtonLoading(false);
            this.showToast('Employee added successfully!', 'success');
            this.resetForm();
            this.switchView('view-employees');
            this.updateDashboard();
        }, 500);
    }

    updateEmployee(employeeData) {
        this.setButtonLoading(true);

        setTimeout(() => {
            const index = this.employees.findIndex(emp => emp.id === employeeData.id);
            if (index !== -1) {
                this.employees[index] = employeeData;
                this.setButtonLoading(false);
                this.showToast('Employee updated successfully!', 'success');
                this.resetForm();
                this.switchView('view-employees');
                this.updateDashboard();
            }
        }, 500);
    }

    editEmployee(id) {
        const employee = this.employees.find(emp => emp.id === id);
        if (!employee) return;

        this.editingEmployee = employee;
        
        // Populate form
        Object.keys(employee).forEach(key => {
            const input = document.getElementById(`employee-${key}`);
            if (input) {
                input.value = employee[key];
            }
        });

        // Update form title and button
        const formTitle = document.getElementById('form-title');
        const submitText = document.getElementById('submit-text');
        
        if (formTitle) formTitle.textContent = 'Edit Employee';
        if (submitText) submitText.textContent = 'Update Employee';

        // Switch to form view
        this.switchView('add-employee');
    }

    deleteEmployee(id) {
        const employee = this.employees.find(emp => emp.id === id);
        if (!employee) return;

        const deleteNameEl = document.getElementById('delete-employee-name');
        const deleteModal = document.getElementById('delete-modal');
        
        if (deleteNameEl) {
            deleteNameEl.textContent = employee.name;
        }
        
        if (deleteModal) {
            deleteModal.classList.remove('hidden');
        }
        
        this.employeeToDelete = id;
    }

    confirmDelete() {
        const index = this.employees.findIndex(emp => emp.id === this.employeeToDelete);
        if (index !== -1) {
            this.employees.splice(index, 1);
            this.showToast('Employee deleted successfully!', 'success');
            this.renderEmployeeTable();
            this.updateDashboard();
        }
        this.closeModal();
    }

    closeModal() {
        const deleteModal = document.getElementById('delete-modal');
        if (deleteModal) {
            deleteModal.classList.add('hidden');
        }
        this.employeeToDelete = null;
    }

    resetForm() {
        const form = document.getElementById('employee-form');
        if (form) {
            form.reset();
        }

        document.querySelectorAll('.form-error').forEach(error => {
            error.style.display = 'none';
        });
        document.querySelectorAll('.form-control').forEach(input => {
            input.classList.remove('error', 'success');
        });

        this.editingEmployee = null;
        
        const formTitle = document.getElementById('form-title');
        const submitText = document.getElementById('submit-text');
        
        if (formTitle) formTitle.textContent = 'Add New Employee';
        if (submitText) submitText.textContent = 'Add Employee';
        
        this.generateNextEmployeeId();
    }

    cancelForm() {
        this.resetForm();
        this.switchView('dashboard');
    }

    setButtonLoading(loading) {
        const submitBtn = document.getElementById('submit-btn');
        if (submitBtn) {
            if (loading) {
                submitBtn.classList.add('btn--loading');
                submitBtn.disabled = true;
            } else {
                submitBtn.classList.remove('btn--loading');
                submitBtn.disabled = false;
            }
        }
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const messageEl = document.getElementById('toast-message');
        
        if (!toast || !messageEl) return;
        
        messageEl.textContent = message;
        toast.className = `toast ${type === 'error' ? 'toast--error' : ''}`;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    handleKeyboardShortcuts(e) {
        // Esc to close modal or cancel form
        if (e.key === 'Escape') {
            const deleteModal = document.getElementById('delete-modal');
            if (deleteModal && !deleteModal.classList.contains('hidden')) {
                this.closeModal();
            } else if (this.currentView === 'add-employee') {
                this.cancelForm();
            }
        }

        // Ctrl/Cmd + Enter to submit form
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            if (this.currentView === 'add-employee') {
                const form = document.getElementById('employee-form');
                if (form) {
                    form.dispatchEvent(new Event('submit'));
                }
            }
        }
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    try {
        window.employeeManager = new EmployeeManager();
        window.employeeManager.init();
    } catch (error) {
        console.error('Failed to initialize Employee Management System:', error);
    }
});

// Fallback initialization in case DOMContentLoaded already fired
if (document.readyState === 'loading') {
    // DOM is still loading
    document.addEventListener('DOMContentLoaded', function() {
        if (!window.employeeManager) {
            window.employeeManager = new EmployeeManager();
            window.employeeManager.init();
        }
    });
} else {
    // DOM is already loaded
    if (!window.employeeManager) {
        window.employeeManager = new EmployeeManager();
        window.employeeManager.init();
    }
}
