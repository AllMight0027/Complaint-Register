import React, { useState } from 'react'
import Base from '../core/Base'
import { withRouter } from 'react-router-dom'
import { signup, isAuthenticated } from '../auth/index'

const AddTechnician=({history})=> {

    const {user} =isAuthenticated()

    const [values, setvalues] = useState({
        name:'',
        phone:'',
        password: '',
        error: '',
        success: false
    })

    const {name, phone, password, error, success} = values

    const goback =()=>{
        return<button className="btn btn-warning mb-4 offset-sm-2" onClick={()=>{history.push('/admin/technicians')}}>Back</button>
    }

    const handleChange = name => event =>{
        return(
            setvalues({...values, error: false, success:false ,[name]:event.target.value})
        )
    }

    const onSubmit = event =>{
        event.preventDefault()
        setvalues({...values, error:false})
        if(name.trim()===''){
            setvalues({...values, error: 'Name is required', success: false})
            return
        }
        signup({name, role:1, phone, password,lco:user._id})
        .then(data=>{
            if(data.error){
                setvalues({...values, error: data.error, success: false})
            }
            else if(data.message){
                setvalues({...values, error: data.message, success: false})
            }
            else{
                setvalues({
                    ...values,
                    name:'',
                    phone:'',
                    success: true,
                    error:'',
                    password:''
                })
            }
        })
        .catch(e=>console.log(e))
    }

    const onSuccess = () =>(
        <div className="col-md-6 offset-sm-3 text-left">
            <div className="alert alert-success" style={{display: success ? "" : 'none'}}>
                New Technician Created.
            </div>
        </div>
    )

    const onError = () =>(
        <div className="col-md-6 offset-sm-3 text-left">
            <div className="alert alert-danger" style={{display: error ? "" : 'none'}}>
                {error}
            </div>
        </div>
    )

    const signupForm =() =>{
        return(
            <div className='row'>
                <div className="col-md-6 offset-sm-3 text-left bg-light p-2">
                    <form>
                        <div className='form-group'>
                            <label className='text-dark'>Name</label>
                            <input onChange={handleChange('name')} className='form-control' type="text" value={name}/>
                        </div>
                        <div className='form-group'>
                        <label className='text-dark'>Phone No.</label>
                        <input onChange={handleChange('phone')} className='form-control' type="phone" value={phone}/>
                        </div>
                        <div className='form-group'>
                        <label className='text-dark'>Password</label>
                            <input onChange={handleChange('password')} className='form-control' type="password" value={password}/>
                        </div>
                        <button onClick={onSubmit} className="btn btn-success btn-block" type="submit">Submit</button>
                    </form>
                </div>
            </div>
        )
    }


    return(
        <Base>
        {goback()}
        <div className="text-warning text-center">
                <p className="lead">Enter new technician's details</p>
        </div>
        
        {onError()}
        {onSuccess()}    
        {signupForm()}
        </Base>
    )
}

export default withRouter(AddTechnician)