import React, { useState } from 'react'
import { Link } from 'react-router-dom'


const Employee = () => {
  const [employees, setEmployee] = useState([{
    Name: "sams", Email: "sams@gmail.com", Age: 24
  }])

  return (
    <div>
      <div className="flex min-h-screen bg-blue-500 justify-center items-center">
        <div className="w-1/2 bg-white rounded p-3 shadow-lg">
        <Link to='/createEmployee' className='border-blue-200 text-blue-600 hover:border-transparent hover:bg-blue-600 hover:text-white active:bg-blue-700'>Add +</Link>
          <table className='table-auto w-full border-collapse border border-gray-200"'>
             <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Age</th>
                <th>Action</th>
              </tr>
             </thead>
             <tbody>
              {
                employees.map((employee) => {
                  return <tr>
                    <td>{employee.Name}</td>
                    <td>{employee.Email}</td>
                    <td>{employee.Age}</td>
                    <td><button className="px-2 py-1 bg-yellow-500 text-white rounded">
                    <Link to='/updateEmployee' className='border-blue-200 text-blue-600 hover:border-transparent hover:bg-blue-600 hover:text-white active:bg-blue-700'>Edit</Link>
                      </button><button className="px-2 py-1 bg-red-500 text-white rounded">Delete</button></td>
                  </tr>
                })
              }
             </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Employee
