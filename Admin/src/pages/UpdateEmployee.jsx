import React from 'react'

const UpdateEmployee = () => {
  return (
    <div>
      <div className="">
        <form action="">
            <h2>Update Employee</h2>
            <div>
                <label htmlFor="">Name</label>
                <input type="text" placeholder='Enter name' className='form-control' />
            </div>
            <div>
                <label htmlFor="">Email</label>
                <input type="text" placeholder='Enter name' className='form-control' />
            </div>
            <div>
                <label htmlFor="">Age</label>
                <input type="text" placeholder='Enter name' className='form-control' />
            </div>
            <button>Update Details</button>
        </form>
      </div>
    </div>
  )
}

export default UpdateEmployee
