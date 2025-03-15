import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEmployees, deleteEmployee } from '../services/employeeService';

const Employee = () => {
    const [employees, setEmployees] = useState([{}]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const { data } = await getEmployees();
            setEmployees(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching employees:', error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await deleteEmployee(id);
                fetchEmployees();
            } catch (error) {
                console.error('Error deleting employee:', error);
            }
        }
    };

    return (
        <div className="container mx-auto p-4">
            <Link to='/createEmployee' className='bg-blue-500 text-white px-4 py-2 rounded'>Add +</Link>
            {loading ? <p>Loading employees...</p> : (
                <table className='w-full mt-4 border'>
                    <thead>
                        <tr>
                            <th>Name</th><th>Email</th><th>Phone</th><th>Position</th><th>Salary</th><th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map(emp => ( 
                            <tr key={emp._id}>
                                <td>{emp.name}</td>
                                <td>{emp.email}</td>
                                <td>{emp.phone}</td>
                                <td>{emp.position}</td>
                                <td>{emp.salary}</td>
                                <td>
                                    <Link to={`/updateEmployee/${emp._id}`} className='text-yellow-500 px-2'>Edit</Link>
                                    <button onClick={() => handleDelete(emp._id)} className='text-red-500 px-2'>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Employee;