import React, { Component } from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types' 
import TextFieldGroup from '../common/TextFieldGroup'


import {registerUser} from '../../actions/authActions'
import {withRouter} from 'react-router-dom'



class Register extends Component {
    constructor(){
        super();
        this.state={
            name:'',
            email:'',
            password:'',
            password2:'',
            errors:{}
        };
        this.onChange=this.onChange.bind(this);
        this.onSubmit=this.onSubmit.bind(this)


    }
    componentDidMount(){
      if(this.props.auth.isAuthenticated){
        this.props.history.push('/dashboard')
      }
    }
    componentWillReceiveProps(nextProps){
      if(nextProps.errors){
        this.setState({errors:nextProps.errors})
      }
    }
    onChange(e){
        this.setState({[e.target.name]:e.target.value})
    }
    onSubmit(e){
        e.preventDefault()
        const newUser={
            name:this.state.name,
            email:this.state.email,
            password:this.state.password,
            password2:this.state.password2
        }
        this.props.registerUser(newUser,this.props.history)
        

       
    }


    render() {
        const {errors}= this.state
        

        return (
          
            <div className="register">
          
            <div className="container">
              <div className="row">
                <div className="col-md-8 m-auto">
                  <h1 className="display-4 text-center">Sign Up</h1>
                  <p className="lead text-center">Create your DevConnector account</p>
                  <form onSubmit={this.onSubmit} noValidate>
                    <TextFieldGroup placeholder="Name" name="name" value={this.state.name} onChange={this.onChange} error={errors.name} />
                    <TextFieldGroup placeholder="Email Address" name="email" value={this.state.email} onChange={this.onChange} error={errors.email} type="email" info ="This site uses Gravatar,So if you want a profile picture use a Gravatar mail" />
                    
                    <TextFieldGroup placeholder="Password" name="password" type="password" value={this.state.password} onChange={this.onChange} error={errors.password} />
                    
                    <TextFieldGroup placeholder="Confirm Password" name="password2" value={this.state.password2}  type="password" onChange={this.onChange} error={errors.password2} />
                    
                    <input type="submit" className="btn btn-info btn-block mt-4" />
                  </form>
                </div>
              </div>
            </div>
          </div>
        )
    }
}
Register.prototypes={
  registerUser:PropTypes.func.isRequired,
  auth:PropTypes.object.isRequired
}
const mapSateToProps=(state)=>({
  auth:state.auth,
  errors:state.errors
})

export default connect(mapSateToProps,{registerUser})(withRouter(Register))
