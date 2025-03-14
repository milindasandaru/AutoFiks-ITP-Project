import React from 'react'
import axios from 'axios'

const CreateEmployee = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [age, setAge] = useState();

  const Submit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/createEmployee", {name, email, age})
    .then(result => console.log(result))
    .catch(err => console.log(err))
  } 

  return (
    <div>
      <div className="">
        <form onSubmit={Submit}>
            <h2>Add Employee</h2>
            <div>
                <label htmlFor="">Name</label>
                <input type="text" placeholder='Enter name' className='form-control' 
                onChange={(e) => setName(e.target.value)}/>
            </div>
            <div>
                <label htmlFor="">Email</label>
                <input type="text" placeholder='Enter name' className='form-control'
                onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <div>
                <label htmlFor="">Age</label>
                <input type="text" placeholder='Enter name' className='form-control' 
                onChange={(e) => setAge(e.target.value)}/>
            </div>
            <button>Add Details</button>
        </form>
      </div>
    </div>
  )
}

export default CreateEmployee
