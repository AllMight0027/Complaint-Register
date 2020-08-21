import React, {useState} from 'react'
import Base from '../core/Base'
import { Link } from 'react-router-dom'
import { isAuthenticated, signout } from '../auth/index'
import { updateAdmin } from './helper/adminapicalls'

export default function CustomerDetails() {
    const {user,token}= isAuthenticated()
    const [values, setvalues] = useState({
        name:user.name,
        phone:user.phone,
        error: '',
        success: false
    })

    const {name, phone, error, success} = values

    const handleChange = name => event =>{
        return(
            setvalues({...values, error: false, [name]:event.target.value})
        )
    }

    const onSubmit = event =>{
        event.preventDefault()
        setvalues({...values, error:false})
        if(name.trim()===''){
            setvalues({...values, error: 'Name is required', success: false})
            return
        }
        updateAdmin(user._id,token,{name, phone})
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
                    success: true,
                    error:''
                })
                signout(()=>{})
            }
        })
        .catch(e=>console.log(e))
    }

    const onReset =(event)=>{
        event.preventDefault();
        setvalues({
            ...values,
            name:user.name,
            phone:user.phone,
            error:''
        })
    }

    const onSuccess = () =>{
        return(
        <div className="col-md-6 offset-sm-3 text-left">
            <div className="alert alert-success" style={{display: success ? "" : 'none'}}>
                Account Updated. Please <Link to='/'>Log in</Link> Again
            </div>
        </div>
    )}

    const onError = () =>(
        <div className="col-md-6 offset-sm-3 text-left">
            <div className="alert alert-danger" style={{display: error ? "" : 'none'}}>
                {error}
            </div>
        </div>
    )

    const signupForm =() =>{
        return(
            <div className='row' style={{display: !success ? '' :'none'}}>
                <div className="col-md-6 offset-sm-3 text-left bg-light p-2">
                    <form>
                        <div className='form-group'>
                            <label className='text-dark'>Name</label>
                            <input onChange={handleChange('name')} className='form-control' type="text" value={name}/>
                        </div>
                        <div className='form-group'>
                        <label className='text-dark'>Phone No.</label>
                        <input onChange={handleChange('phone')} className='form-control' type="phone" value={phone}/>
                        <small id="phoneHelp" className="form-text text-muted">We'll never share your phone number with anyone else.</small>
                        </div>
                        
                        <div className="row">
                        <button onClick={onSubmit} className="btn btn-success  col-3 ml-4" type="submit">Submit</button>
                        <button onClick={onReset} className="btn btn-info  col-3 ml-2" type="submit">Reset</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
    return (
        <Base>
        {onError()}
        {onSuccess()}    
        {signupForm()}
        </Base>
    )
}
