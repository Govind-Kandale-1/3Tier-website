import React, { useState, useEffect, useCallback } from 'react';
import { employeeAPI } from '../services/api';

const EmployeeForm = ({ employeeId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    hireDate: '',
    salary: '',
    address: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const departments = ['HR', 'Engineering', 'Marketing', 'Sales', 'Finance', 'Operations'];

  // Memoized fetchEmployee function to avoid redeclaration error and satisfy useEffect deps
  const fetchEmployee = useCallback(async () => {
    try {
      setLoading(true);
      const response = await employeeAPI.getById(employeeId);
      if (response.data.success) {
        const employee = response.data.data;
        setFormData({
          ...employee,
          hireDate: employee.hireDate.split('T')[0] // Format date for input[type="date"]
        });
      }
    } catch (error) {
      console.error('Error fetching employee:', error);
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    if (employeeId) {
      fetchEmployee();
    }
  }, [fetchEmployee, employeeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    if (!formData.hireDate) newErrors.hireDate = 'Hire date is required';
    if (!formData.salary) newErrors.salary = 'Salary is required';

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      if (employeeId) {
        await employeeAPI.update(employeeId, formData);
      } else {
        await employeeAPI.create(formData);
      }
      onSuccess('Employee saved successfully!');

      // Reset form if creating new employee
      if (!employeeId) {
        setFormData({
          name: '',
          email: '',
          phone: '',
          department: '',
          position: '',
          hireDate: '',
          salary: '',
          address: ''
        });
      }
    } catch (error) {
      console.error('Error saving employee:', error);
      alert('Error saving employee. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && employeeId) {
    return <p>Loading employee data...</p>;
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>

      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div>
        <label>Phone:</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
        {errors.phone && <span className="error">{errors.phone}</span>}
      </div>

      <div>
        <label>Department:</label>
        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
        >
          <option value="">Select department</option>
          {departments.map(dep => (
            <option key={dep} value={dep}>
              {dep}
            </option>
          ))}
        </select>
        {errors.department && <span className="error">{errors.department}</span>}
      </div>

      <div>
        <label>Position:</label>
        <input
          type="text"
          name="position"
          value={formData.position}
          onChange={handleChange}
        />
        {errors.position && <span className="error">{errors.position}</span>}
      </div>

      <div>
        <label>Hire Date:</label>
        <input
          type="date"
          name="hireDate"
          value={formData.hireDate}
          onChange={handleChange}
        />
        {errors.hireDate && <span className="error">{errors.hireDate}</span>}
      </div>

      <div>
        <label>Salary:</label>
        <input
          type="number"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
        />
        {errors.salary && <span className="error">{errors.salary}</span>}
      </div>

      <div>
        <label>Address:</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
      </div>

      <button type="submit" disabled={loading}>
        {employeeId ? 'Update Employee' : 'Create Employee'}
      </button>

      <button type="button" onClick={onCancel} disabled={loading}>
        Cancel
      </button>
    </form>
  );
};

export default EmployeeForm;
