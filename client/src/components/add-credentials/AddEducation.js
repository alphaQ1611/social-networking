
import {Link,withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import TextFieldGroup from '../common/TextFieldGroup'
import PropTypes from 'prop-types'

import React, { Component } from 'react'
import TextAreaFieldGroup from '../common/TextAreaFieldGroup'
import {addEducation} from '../../actions/profileActions'
class AddEducation extends Component {
    constructor(props){
        super(props)
        this.state={
            school:'',
            degree:'',
            fieldofstudy:'',
            from:'',
            to:'',
            current:false,
            description:'',
            errors:{},
            disabled:false
        }
        this.onChange=this.onChange.bind(this)
        this.onSubmit=this.onSubmit.bind(this)
        this.onCheck=this.onCheck.bind(this)


    }
    onSubmit(e){
        e.preventDefault()
        const eduData={
            school:this.state.school,
            degree:this.state.degree,
            fieldofstudy:this.state.fieldofstudy,
            from:this.state.from,
            to:this.state.to,
            current:this.state.current,
            description:this.state.description
        }
        this.props.addEducation(eduData,this.props.history)
    }
    onChange(e){
        this.setState({[e.target.name]:e.target.value})

    }
    onCheck(e){
        this.setState({
            disabled:!this.state.disabled,
            current:!this.state.current 
        })
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.errors){
            this.setState({errors:nextProps.errors})
        }
    }

    render() {
        const {errors}=this.state
        return (
            <div className='add-education'>
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <Link to= '/dashboard' className='btn btn-light'>
                                Go Back
                            </Link>
                            <h1 className="display-4 text-center">Add Education</h1>
                            <p className="lead text-center">Add your Education details</p>
                            <small className="d-block pb-3">*= required fields</small>
                            <form onSubmit={this.onSubmit}>
                                <TextFieldGroup
                                placeholder='* School'
                                name='school'
                                onChange={this.onChange}
                                value={this.state.school}
                                error={errors.school}
                                />
                                <TextFieldGroup
                                placeholder='* Degree'
                                name='degree'
                                value={this.state.degree}
                                onChange={this.onChange}
                                error={errors.degree}
                                />
                                <TextFieldGroup
                                placeholder='* Field Of Study'
                                name='fieldofstudy'
                                onChange={this.onChange}
                                value={this.state.fieldofstudy}
                                error={errors.fieldofstudy}
                                /> 
                                <h6>From Date</h6>
                                <TextFieldGroup
                                
                                name='from'
                                type='date'
                                value={this.state.from}

                                onChange={this.onChange}
                                error={errors.from}
                                /> 
                                <h6>to Date</h6>
                                <TextFieldGroup
                                
                                name='to'
                                type='date'
                                value={this.state.to}

                                onChange={this.onChange}
                                error={errors.to}
                                disabled={this.state.disabled ? 'disabled':''}

                                /> 
                                <div className="form-check mb-4">
                                    <input type="checkbox" className="form-check-input" name='current' value={this.state.current} checked={this.state.current} onChange={this.onCheck} id='current'/>
                                    <label htmlFor='current' className='form-check-label'>
                                        Currently working
                                    </label>
                                </div>
                                <TextAreaFieldGroup
                                placeholder='Programme Description'
                                name='description'
                                value={this.state.description}
                                onChange={this.onChange}
                                error={errors.description}
                                info='Tell us about your experience'
                                />
                                <input type='submit' value='Submit' className='btn btn-info btn-block mt-4'/>

                            </form>
                        </div>
                    </div>
                </div>
                
            </div>
        )
    }
}
AddEducation.propTypes={
    profile:PropTypes.object.isRequired,
    errors:PropTypes.object.isRequired,
    addEducation:PropTypes.func.isRequired
}
const mapStateToProps=state=>({
    profile:state.profile,
    errors:state.errors
})

export default connect(mapStateToProps,{addEducation})(withRouter(AddEducation));
