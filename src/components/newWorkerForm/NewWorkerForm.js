// картинки і стилі
import './newWorkerForm.scss';
import succesImg from '../../imgs/success-image.svg'
// хуки
import { useEffect, useState } from 'react';
import { useHttp } from '../../hooks/http.hooks';
// formik, yup
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
// tooltip
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'

const NewWorkerForm = () => {

    const { request } = useHttp();
    const [token, setToken] = useState('');
    const [positions, setPositions] = useState('');
    const SUPPORTED_FORMATS = ['image/jpeg', 'image/jpg'];

    useEffect(() => {
        request('https://frontend-test-assignment-api.abz.agency/api/v1/positions')
            .then(setPositions)
    }, [])
    useEffect(() => {
        request('https://frontend-test-assignment-api.abz.agency/api/v1/token')
            .then(data => setToken(data))
    }, [])

    const postChanges = (data) => {
        request('https://frontend-test-assignment-api.abz.agency/api/v1/users', 'POST', data, {'Token': `${token.token}`})
    }

    const showSuccessMsg = () => {
        return (
            <div>
                <p className='success-msg'>User successfully registered</p>
                <img className='success-img' src={succesImg} alt="" />
            </div>
        )
    }

    // radio-inputs
    const showRadioInputs = (data, formik) => {
        const radioInputs = data ? data.map(item => {
            return (
                <div className="form-radio"  key={item.id}>
                <label htmlFor={`radio-${item.id}`}>
                    <Field 
                        type="radio"
                        name="position_id"
                        id={`radio-${item.id}`}
                        value={item.id}
                        checked={formik.values.position_id == item.id} 
                    />
                    <span className='fake'></span>
                    <span className='text'>{item.name}</span>
                </label>
                </div>
            )
        }) : null

        return (
            <>
            {radioInputs}
            </>
        )
    }

    return (
        <div className="form-wrapper">
            <h2 className="workers-inner-heading">Working with POST request</h2>
            <Formik
                initialValues={{
                    name: '',
                    email: '',
                    phone: '',
                    position_id: '1',
                    photo: '',
                }}
                validationSchema={Yup.object({
                    name:
                        Yup.string()
                            .required('This field is required')
                            .min(2, 'Must be at least 2 characters')
                            .max(60, 'No more than 60 characters'),
                    email:
                        Yup.string()
                            .required('This field is required')
                            .max(60, 'No more than 30 characters')
                            .email('Email must be a valid email'),
                    phone:
                        Yup.string()
                            .required('This field is required')
                            .matches(/^[\+]{0,1}380([0-9]{9})$/, "Invalid format: should start with +380"),
                    position_id:
                        Yup.string()
                            .required('This field is required'),
                    photo: Yup.mixed()
                        .required('This field is required')
                        .test(
                            'fileSize',
                            'File is too large. No more that 5Mb',
                            value => value && value.size <= 2000000
                        )
                        .test(
                            'fileType',
                            'File must be jpeg or jpg format',
                            value => value && SUPPORTED_FORMATS.includes(value.type)
                        )
                })}
                onSubmit={values => {
                    let formdata = new FormData();
                    formdata.append("name", values.name);
                    formdata.append("email", values.email);
                    formdata.append("phone", values.phone);
                    formdata.append("position_id", values.position_id);
                    formdata.append("photo", values.photo);

                    postChanges(formdata);
                }}
            >
                {formik => {
                    return (
                        <Form className='form'>
                            <div>
                                {formik.submitCount == 1 ?
                                    <>
                                        {showSuccessMsg()}
                                    </>
                                    :
                                    <div>
                                        <div>
                                            <Field
                                                type="text"
                                                name="name"
                                                className={formik.errors.name && formik.touched.name ? "form-input-error" : "form-input"}  
                                                id="name"
                                                placeholder="Your name" />
                                            <ErrorMessage className='error' name='name' component='div' />
                                        </div>

                                        <Tippy content='MaximilianMaximilian@gmail.com'>
                                        <div>
                                            <Field
                                                type="text"
                                                name="email"
                                                className={formik.errors.email && formik.touched.email ? "form-input-error" : "form-input"}  
                                                id="email"
                                                placeholder="Email" />
                                            <ErrorMessage className='error' name='email' component='div' />
                                        </div>
                                        </Tippy>
                        
                                        <Tippy content='+380XXXXXXXXX'>
                                        <div>                                       
                                            <Field
                                                type="tel"
                                                name="phone"
                                                className={formik.errors.phone && formik.touched.phone ? "form-input-error" : "form-input"}  
                                                id="phone"
                                                placeholder="Phone" />
                                            <ErrorMessage className='error' name='phone' component='div' />
                                        </div>
                                        </Tippy>

                                        {positions.positions ?
                                            <>
                                                {formik.errors.position_id ?
                                                    <div style={{ 'color': 'red' }}>{formik.errors.position_id}</div> :
                                                    null}
                                                <div className='form-radio-header'>Select your position</div>
                                                {showRadioInputs(positions.positions, formik)}
                                            </>
                                            : null}

                                        <label 
                                            htmlFor="myfile"  
                                            className={formik.errors.photo && formik.values.photo ? "input-file-error" : "input-file"}  >
                                            <p 
                                            className={formik.errors.photo && formik.values.photo ? "input-file-fistText-error" : "input-file-fistText"} >Upload</p>
                                            <p className='input-file-text' >
                                                {formik.values.photo !== '' ? formik.values.photo.name : 'Upload your photo'}
                                            </p>
                                            <input
                                                type='file'
                                                name='photo'
                                                id="myfile"
                                                style={{ 'display': 'none' }}
                                                onChange={(e) => {
                                                    formik.setFieldValue('photo', e.target.files[0])
                                                }}
                                            >
                                            </input>
                                        </label>
                                        {formik.errors.photo && formik.values.photo ? <div className='error error-file'>{formik.errors.photo}</div> : null}

                                        <div className='btn-inner'>
                                            <button
                                                type="submit"
                                                className="btn btn-submit-form"
                                                disabled={!(formik.dirty && formik.isValid)} >
                                                Sign Up
                                            </button>
                                        </div>
                                    </div>}
                            </div>
                        </Form>
                    )
                }}
            </Formik>
        </div>
    )
}

export default NewWorkerForm;