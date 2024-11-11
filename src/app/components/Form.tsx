'use client'
import "./Form.css";
import React, { useState } from "react";
import { z } from 'zod';

const formSchema = z.object({
    idNumber: z.string().length(9, "Id number must contain exactly 9 characters").regex(/^\d+$/, "Id number must contain only digits").nonempty("Id number is required"),
    firstName: z.string().min(2, "First name must contain at least 2 characters").max(20, "First name must contain at most 20 characters").regex(/^[A-Za-z]+$/, "First name must contain only letters").nonempty("First name is required"),
    lastName: z.string().min(2, "Last name must contain at least 2 characters").max(20, "Last name must contain at most 20 characters").regex(/^[A-Za-z]+$/, "Last name must contain only letters").nonempty("Last name is required"),
    birthDate: z.date().max(new Date(), "Date of birth must be in the past"),
    email: z.string().email("Invalid email").nonempty("Email is required"),
})

type FormData = z.infer<typeof formSchema>; // creates new type

const Form = () => {

    const [formData, setFormData] = useState<FormData>({ idNumber: "", firstName: "", lastName: "", birthDate: new Date(), email: "" });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updatedValue = name === "birthDate" ? new Date(value) : value;
        setFormData((prevData) => ({ ...prevData, [name]: updatedValue }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // If there is a problem with the data types, parse will throw an error by zod
            formSchema.parse(formData);
            setErrors({});
            console.log(formData);
            alert('Form submitted successfully!');
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors: { [key: string]: string } = {};
                error.errors.forEach((e) => {
                    if (e.path[0]) {
                        fieldErrors[e.path[0].toString()] = e.message;
                    }
                });
                setErrors(fieldErrors);
            }
            console.log("Unexpected error", error);
        }
    }

    return (
        <div className="px-[5vw] py-[5vh]">
            <form onSubmit={(e) => handleSubmit(e)} className="flex-col">
                <div className="flex justify-between gap-[50px]">
                    <h2 className="text-xl font-semibold mb-6">Personal Details</h2>
                    <div className="flex flex-wrap gap-5">
                        <span className="flex flex-col">
                            <input type="text" placeholder="Id Number" name="idNumber" value={formData.idNumber} onChange={handleChange} className="input-box" />
                            {errors.idNumber && <p className="error-message">{errors.idNumber}</p>}
                        </span>
                        <span className="flex-col">
                            <input type="text" placeholder="First Name" name="firstName" value={formData.firstName} onChange={handleChange} className="input-box" />
                            {errors.firstName && <p className="error-message">{errors.firstName}</p>}
                        </span>
                        <span className="flex flex-col">
                            <input type="text" placeholder="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} className="input-box" />
                            {errors.lastName && <p className="error-message">{errors.lastName}</p>}
                        </span>
                        <span className="flex flex-col">
                            <input type="date" placeholder="Birth Date" name="birthDate" value={formData.birthDate.toISOString().split("T")[0]} onChange={handleChange} className="input-box" />
                            {errors.birthDate && <p className="error-message">{errors.birthDate}</p>}
                        </span>
                    </div>
                </div>
                <div className="flex justify-between">
                    <h2 className="text-xl font-semibold mb-6">Contact Details</h2>
                    <span className="flex flex-col">
                        <input type="email" placeholder="Email" name="email" value={formData.email} onChange={handleChange} className="input-box" />
                        {errors.email && <p className="error-message">{errors.email}</p>}
                    </span>
                </div>
                <input type="submit" value="Save" className="bg-[#3C82F6] text-white px-[30px] py-[9px] rounded-md cursor-pointer" />
            </form>
        </div>
    )
}

export default Form;