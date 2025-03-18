import React, { useState } from 'react';
import { createEmployee } from '/Milinda/coding/git/AutoFiks-ITP-Project/Admin/src/services/employeeService.js';
import { useNavigate } from 'react-router-dom';

const CreateEmployee = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', dob: '', gender: '', nic: '', position: ''
    });
    const [generatedId, setGeneratedId] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

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

        // Ensure all fields are filled
        if (!formData.name || !formData.email || !formData.phone || !formData.dob || 
            !formData.gender || !formData.nic || !formData.position || !formData.salary) {
            setError('All fields are required');
            return;
        }
        try {
            const { data } = await createEmployee(formData);
            setGeneratedId(data.employeeId); 
            setTimeout(() => navigate('/Employee'), 2000);
        } catch (error) {
            console.error("Error response:", error.response);
            setError(error.response?.data?.message || 'Error creating employee');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className='text-xl'>Create Employee</h2>
            {error && <p className='text-red-500'>{error}</p>}
            {generatedId && <p className="text-green-500">Generated Employee ID: {generatedId}</p>}
            <form onSubmit={handleSubmit} >
                <input type='text' name='name' value={formData.name} onChange={handleChange} placeholder='Name' required />
                <input type='email' name='email' value={formData.email} onChange={handleChange} placeholder='Email' required />
                <input type='text' name='phone' value={formData.phone} onChange={handleChange} placeholder='Phone' required />
                <input type='date' name='dob' value={formData.dob} onChange={handleChange} required />
                <select name="gender" value={formData.gender} onChange={handleChange} required>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
                <input type='text' name='nic' value={formData.nic} onChange={handleChange} placeholder='NIC' required />
                <input type='text' name='position' value={formData.position} onChange={handleChange} placeholder='Position' required />
                <input type='number' name='salary' value={formData.salary} onChange={handleChange} placeholder='Enter salary (min $1000)' min="0" required />
                <button type='submit' className='bg-blue-500 text-white px-4 py-2'>Submit</button>
            </form>
        </div>
    );
};

export default CreateEmployee;
