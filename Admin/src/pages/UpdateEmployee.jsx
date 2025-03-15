import React, { useEffect, useState } from 'react';
import { getEmployeeById, updateEmployee } from '../services/employeeService';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateEmployee = () => {
  
    const { id } = useParams();
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', position: '', salary: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();     

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const { data } = await getEmployeeById(id);
                setFormData(data);
            } catch (error) {
                setError('Error fetching employee details');
            }
        };
        fetchEmployee();
    }, [id]);

    const handleChange = (e) => {
        
        const { name, value} = e.target;
        if(name === "salary" && Number(value) > 0 && Number(value) < 1000 ) {
          setError("Salary must be at least $1000");
        } else {
          setError("");
        }

        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateEmployee(id, formData);
            navigate('/Employee');
        } catch (error) {
            setError('Error updating employee');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className='text-xl'>Update Employee</h2>
            {error && <p className='text-red-500'>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type='text' name='name' value={formData.name} onChange={handleChange} placeholder='Name' required />
                <input type='email' name='email' value={formData.email} onChange={handleChange} placeholder='Email' required />
                <input type='text' name='phone' value={formData.phone} onChange={handleChange} placeholder='Phone' required />
                <input type='text' name='position' value={formData.position} onChange={handleChange} placeholder='Position' required />
                <input type='number' name='salary' value={formData.salary} onChange={handleChange} placeholder='Enter salary (min $1000)' min="0" required />
                <button type='submit' className='bg-blue-500 text-white px-4 py-2'>Update</button>
            </form>
        </div>
    );
};

export default UpdateEmployee;
